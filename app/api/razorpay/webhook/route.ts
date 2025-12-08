import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  generateInvoicePDF,
  validateTemplateType,
} from "@/lib/pdf-templates/pdf-generator";
import { uploadPDFToStorage } from "@/lib/storage";
import { sendBookingConfirmationEmail } from "@/lib/email-templates/email-sender";
import type { TemplateType } from "@/lib/pdf-templates/pdf-generator";
import { getDoc } from "firebase/firestore";

const razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

/**
 * Razorpay Webhook Handler
 * This endpoint handles payment notifications from Razorpay
 * It's called when payment status changes (captured, failed, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    console.log("🔔 Received Razorpay webhook");

    // Check configuration
    if (!razorpayWebhookSecret || !isFirebaseConfigured || !db) {
      console.error("❌ Server configuration error");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Get the raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      console.error("❌ No signature in webhook request");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", razorpayWebhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("❌ Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    console.log("✅ Webhook signature verified");

    // Parse the webhook payload
    const payload = JSON.parse(body);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;

    console.log("📋 Webhook event:", event);

    // Handle different event types
    switch (event) {
      case "payment.captured":
        await handlePaymentCaptured(paymentEntity);
        break;

      case "payment.failed":
        await handlePaymentFailed(paymentEntity);
        break;

      case "order.paid":
        // Order fully paid - additional confirmation
        console.log("✅ Order fully paid:", orderEntity?.id);
        break;

      default:
        console.log("ℹ️ Unhandled webhook event:", event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment capture
 * This is called when Razorpay confirms the payment was successful
 */
async function handlePaymentCaptured(paymentEntity: any) {
  try {
    console.log("💳 Processing payment.captured event");
    console.log("Payment ID:", paymentEntity?.id);
    console.log("Order ID:", paymentEntity?.order_id);

    const razorpayOrderId = paymentEntity?.order_id;
    const razorpayPaymentId = paymentEntity?.id;

    if (!razorpayOrderId || !razorpayPaymentId) {
      console.error("❌ Missing order or payment ID");
      return;
    }

    // Find the order in Firestore by Razorpay order ID
    const ordersRef = collection(db!, "orders");
    const q = query(ordersRef, where("razorpayOrderId", "==", razorpayOrderId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("❌ Order not found for Razorpay order ID:", razorpayOrderId);
      return;
    }

    const orderDoc = querySnapshot.docs[0];
    const orderData = orderDoc.data();

    // Check if booking already exists (idempotency)
    const bookingsRef = collection(db!, "bookings");
    const bookingQuery = query(
      bookingsRef,
      where("razorpayOrderId", "==", razorpayOrderId)
    );
    const bookingSnapshot = await getDocs(bookingQuery);

    if (!bookingSnapshot.empty) {
      console.log("ℹ️ Booking already exists for this payment");
      return;
    }

    console.log("✅ Order found, creating booking...");

    // Fetch invoice template type
    let templateType: TemplateType = "modern";
    try {
      const settingsDocRef = doc(db!, "settings", "invoiceTemplate");
      const settingsDoc = await getDoc(settingsDocRef);
      if (settingsDoc.exists()) {
        templateType = validateTemplateType(settingsDoc.data()?.type);
      }
    } catch (error) {
      console.error("Error fetching template:", error);
    }

    // Create booking object
    const booking: TBooking = {
      id: "",
      bookingId: orderData.bookingId,
      booking: orderData.booking,
      userEmail: orderData.userEmail,
      mountainName: orderData.mountainName,
      slotDetails: orderData.slotDetails,
      participants: orderData.participants,
      customerInfo: orderData.customerInfo,
      amount: orderData.amount,
      currency: orderData.currency,
      status: "confirmed",
      paymentMethod: "razorpay",
      razorpayOrderId,
      razorpayPaymentId,
      createdAt: String(serverTimestamp()),
      pdfUrl: "",
      pdfPath: "",
    };

    // Generate PDF
    let pdfBuffer: Buffer;
    let pdfUrl = "";
    let pdfPath = "";

    try {
      console.log("📄 Generating PDF invoice");
      pdfBuffer = await generateInvoicePDF({ booking, templateType });

      // Upload PDF
      const uploadResult = await uploadPDFToStorage(
        pdfBuffer,
        orderData.bookingId
      );
      pdfUrl = uploadResult.url;
      pdfPath = uploadResult.path;
      console.log("✅ PDF uploaded:", pdfUrl);
    } catch (error) {
      console.error("Error generating/uploading PDF:", error);
      // Continue without PDF
      pdfBuffer = Buffer.from("");
    }

    // Save booking
    booking.pdfUrl = pdfUrl;
    booking.pdfPath = pdfPath;

    const bookingDocRef = await addDoc(collection(db!, "bookings"), booking);
    await updateDoc(bookingDocRef, { id: bookingDocRef.id });
    console.log("✅ Booking created:", bookingDocRef.id);

    // Update order status
    await updateDoc(doc(db!, "orders", orderDoc.id), {
      status: "confirmed",
      razorpayPaymentId,
      updatedAt: serverTimestamp(),
      bookingDocId: bookingDocRef.id,
    });

    // Send confirmation email
    try {
      console.log("📧 Sending confirmation email");
      await sendBookingConfirmationEmail({
        booking: { ...booking, id: bookingDocRef.id },
        pdfBuffer,
        customerEmail: orderData.userEmail,
        customerName: orderData.customerInfo?.organizer?.name,
      });
      console.log("✅ Email sent");
    } catch (error) {
      console.error("Error sending email:", error);
    }

    console.log("✅ Payment captured and processed successfully");
  } catch (error) {
    console.error("Error handling payment.captured:", error);
  }
}

/**
 * Handle failed payment
 * This is called when a payment fails
 */
async function handlePaymentFailed(paymentEntity: any) {
  try {
    console.log("❌ Processing payment.failed event");
    console.log("Payment ID:", paymentEntity?.id);
    console.log("Order ID:", paymentEntity?.order_id);
    console.log("Error:", paymentEntity?.error_description);

    const razorpayOrderId = paymentEntity?.order_id;

    if (!razorpayOrderId) {
      console.error("❌ Missing order ID");
      return;
    }

    // Find and update the order
    const ordersRef = collection(db!, "orders");
    const q = query(ordersRef, where("razorpayOrderId", "==", razorpayOrderId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("❌ Order not found");
      return;
    }

    const orderDoc = querySnapshot.docs[0];

    // Update order status to failed
    await updateDoc(doc(db!, "orders", orderDoc.id), {
      status: "failed",
      razorpayPaymentId: paymentEntity?.id,
      failureReason: paymentEntity?.error_description || "Payment failed",
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Order marked as failed");
  } catch (error) {
    console.error("Error handling payment.failed:", error);
  }
}
