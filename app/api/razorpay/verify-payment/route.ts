import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  generateInvoicePDF,
  validateTemplateType,
} from "@/lib/pdf-templates/pdf-generator";
import { uploadPDFToStorage } from "@/lib/storage";
import { sendBookingConfirmationEmail } from "@/lib/email-templates/email-sender";
import type { TemplateType } from "@/lib/pdf-templates/pdf-generator";

const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      firestoreOrderId, // Get the Firestore order ID from client
    } = body;

    console.log("💳 Processing Razorpay payment verification");
    console.log("📋 Firestore Order ID:", firestoreOrderId);

    // Check configuration
    if (!razorpayKeySecret || !isFirebaseConfigured || !db) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Verify Razorpay signature
    const body_string = razorpay_order_id + "|" + razorpay_payment_id;
    const expected_signature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(body_string.toString())
      .digest("hex");

    if (expected_signature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    console.log("✅ Razorpay signature verified");

    // Fetch order from Firestore to get the trusted data
    // This prevents client-side data manipulation
    const orderDocRef = doc(db, "orders", firestoreOrderId);
    const orderDoc = await getDoc(orderDocRef);

    if (!orderDoc.exists()) {
      console.error("❌ Order not found in Firestore:", firestoreOrderId);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const orderData = orderDoc.data();
    console.log("✅ Order fetched from Firestore");

    // Verify that the Razorpay order ID matches
    if (orderData.razorpayOrderId !== razorpay_order_id) {
      console.error("❌ Razorpay order ID mismatch");
      return NextResponse.json(
        { error: "Order verification failed" },
        { status: 400 }
      );
    }

    // Payment verified successfully - use data from Firestore order
    const bookingId = orderData.bookingId;
    const type = orderData.booking.type;

    // 1. Fetch invoice template type from Firebase settings
    let templateType: TemplateType = "modern"; // default

    try {
      const settingsDocRef = doc(db, "settings", "invoiceTemplate");
      const settingsDoc = await getDoc(settingsDocRef);

      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        templateType = validateTemplateType(data?.type);
        console.log(`✅ Fetched template type: ${templateType}`);
      } else {
        console.log("⚠️ No template settings found, using default: modern");
      }
    } catch (error) {
      console.error("Error fetching template type:", error);
      console.log("⚠️ Using default template: modern");
    }

    // 2. Create booking object using data from Firestore order (trusted source)
    const booking: TBooking = {
      id: "",
      bookingId,
      booking: orderData.booking,
      userEmail: orderData.userEmail,
      mountainName: orderData.mountainName,
      slotDetails: orderData.slotDetails,
      participants: orderData.participants,
      customerInfo: orderData.customerInfo,
      amount: orderData.amount, // Already in correct unit from order
      currency: orderData.currency,
      status: "confirmed",
      paymentMethod: "razorpay",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      createdAt: String(serverTimestamp()),
      pdfUrl: "",
      pdfPath: "",
    };

    // 3. Generate PDF invoice
    let pdfBuffer: Buffer;
    try {
      console.log(`📄 Generating PDF with template: ${templateType}`);
      pdfBuffer = await generateInvoicePDF({
        booking,
        templateType,
      });
      console.log("✅ PDF generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      return NextResponse.json(
        { error: "Failed to generate invoice PDF" },
        { status: 500 }
      );
    }

    // 4. Upload PDF to Firebase Storage
    let pdfUrl = "";
    let pdfPath = "";
    try {
      console.log("☁️ Uploading PDF to Firebase Storage");
      const uploadResult = await uploadPDFToStorage(pdfBuffer, bookingId);
      pdfUrl = uploadResult.url;
      pdfPath = uploadResult.path;
      console.log("✅ PDF uploaded successfully:", pdfUrl);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      // Continue without PDF URL - don't fail the booking
    }

    // 5. Save booking to Firestore with PDF URL
    booking.pdfUrl = pdfUrl;
    booking.pdfPath = pdfPath;

    const docRef = await addDoc(collection(db!, "bookings"), booking);
    console.log("✅ Created booking document with ID:", docRef.id);

    await updateDoc(docRef, { id: docRef.id });

    // 5.5: CRITICAL - Reduce slot capacity after successful booking
    console.log("🔄 [SLOT REDUCTION] Starting slot update:", {
      productId: orderData.booking.id,
      slotId: orderData.slotDetails?.id,
      date: orderData.slotDetails?.date,
      participants: orderData.participants,
      timestamp: new Date().toISOString()
    });

    try {
      // Import Firebase Admin SDK for transaction
      const { adminDb } = await import("@/lib/firebase-admin");

      const collection = orderData.booking.type === "trekking" ? "mountains" : "tourist-packages";
      const docRef = adminDb.collection(collection).doc(orderData.booking.id);

      await adminDb.runTransaction(async (transaction) => {
        const doc = await transaction.get(docRef);

        if (!doc.exists) {
          throw new Error("Product document not found");
        }

        const data = doc.data();
        const availableDates = data?.availableDates || [];

        // Find the date and slot
        const searchDate = orderData.slotDetails?.originalDate || orderData.slotDetails?.date;
        const dateIndex = availableDates.findIndex((d: any) => d.date === searchDate);

        if (dateIndex === -1) {
          throw new Error(`Date ${searchDate} not found`);
        }

        const slotIndex = availableDates[dateIndex].slots.findIndex(
          (s: any) => s.id === orderData.slotDetails?.id
        );

        if (slotIndex === -1) {
          throw new Error(`Slot ${orderData.slotDetails?.id} not found`);
        }

        // Get current slot data
        const slot = availableDates[dateIndex].slots[slotIndex];
        const newBookedCount = slot.bookedParticipants + orderData.participants;

        // Double-check capacity (safety check)
        if (newBookedCount > slot.maxParticipants) {
          console.error("❌ [SLOT REDUCTION] Overbooking detected!", {
            current: slot.bookedParticipants,
            adding: orderData.participants,
            max: slot.maxParticipants,
            would_be: newBookedCount
          });
          throw new Error("Overbooking prevented - slot is now full");
        }

        // Update the bookedParticipants
        availableDates[dateIndex].slots[slotIndex].bookedParticipants = newBookedCount;

        // Update the document
        transaction.update(docRef, {
          availableDates,
          lastUpdated: new Date().toISOString()
        });

        console.log("✅ [SLOT REDUCTION] Slot updated successfully:", {
          previousBooked: slot.bookedParticipants,
          newBooked: newBookedCount,
          remaining: slot.maxParticipants - newBookedCount,
          bookingId: bookingId
        });
      });

    } catch (slotError: any) {
      // Log error but don't fail the payment
      // Booking is already created, slot update failed
      console.error("❌ [SLOT REDUCTION] Failed to update slot:", {
        error: slotError.message,
        bookingId: bookingId,
        productId: orderData.booking.id,
        slotId: orderData.slotDetails?.id
      });

      // Log to a failure collection for manual review
      try {
        const { adminDb } = await import("@/lib/firebase-admin");
        await adminDb.collection("slot-update-failures").add({
          bookingId: bookingId,
          productId: orderData.booking.id,
          productType: orderData.booking.type,
          slotId: orderData.slotDetails?.id,
          date: orderData.slotDetails?.date,
          participants: orderData.participants,
          error: slotError.message,
          timestamp: new Date().toISOString()
        });
      } catch (logError) {
        console.error("Failed to log slot update failure:", logError);
      }
    }

    // 6. Update order status to confirmed
    await updateDoc(orderDocRef, {
      status: "confirmed",
      razorpayPaymentId: razorpay_payment_id,
      updatedAt: serverTimestamp(),
      bookingDocId: docRef.id, // Link to the booking document
    });
    console.log("✅ Order status updated to confirmed");

    // 7. Send confirmation email with PDF attachment
    try {
      console.log("📧 Sending confirmation email");
      await sendBookingConfirmationEmail({
        booking: { ...booking, id: docRef.id },
        pdfBuffer,
        customerEmail: orderData.userEmail,
        customerName: orderData.customerInfo?.organizer?.name,
      });
      console.log("✅ Confirmation email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      // Don't fail booking if email fails
    }

    return NextResponse.json({
      success: true,
      id: docRef.id,
      bookingId,
      pdfUrl,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
