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
const isRazorpayConfigured = process.env.IS_RAZORPAY_LIVE === "false";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      type,
      bookingDetails,
    } = body;

    // ============================================
    // DEMO MODE - No Razorpay configured
    // ============================================
    if (isRazorpayConfigured) {
      console.log("📝 Demo mode - Processing booking without Razorpay");

      const bookingId = bookingDetails?.bookingId || `BK${Date.now()}`;

      if (!isFirebaseConfigured || !db) {
        return NextResponse.json(
          { error: "Firebase init failed" },
          { status: 400 }
        );
      }

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

      // 2. Create booking object
      const booking: TBooking = {
        id: "",
        bookingId,
        booking: { id: bookingDetails?.mountainId, type: type },
        userEmail: bookingDetails?.userEmail,
        mountainName: bookingDetails?.mountainName,
        slotDetails: bookingDetails?.slotDetails,
        participants: bookingDetails?.participants,
        customerInfo: bookingDetails?.customerInfo,
        amount: bookingDetails?.amount / 100, // Convert back from paise
        currency: bookingDetails?.currency,
        status: "confirmed",
        paymentMethod: "razorpay_demo",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        createdAt: String(serverTimestamp()),
        pdfUrl: "", // Will be updated after upload
        pdfPath: "", // Will be updated after upload
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

      // 6. Send confirmation email with PDF attachment
      try {
        console.log("📧 Sending confirmation email");
        await sendBookingConfirmationEmail({
          booking: { ...booking, id: docRef.id },
          pdfBuffer,
          customerEmail: bookingDetails?.organizerEmail,
          customerName: bookingDetails?.customerInfo?.organizer?.name,
        });
        console.log("✅ Confirmation email sent successfully");
      } catch (error) {
        console.error("Error sending email:", error);
        // Don't fail booking if email fails
      }

      return NextResponse.json({
        success: true,
        bookingId,
        id: docRef.id,
        demo: true,
        pdfUrl,
      });
    }

    // ============================================
    // LIVE MODE - Razorpay configured
    // ============================================
    console.log("💳 Live mode - Processing Razorpay payment");

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

    // Payment verified successfully
    const bookingId = bookingDetails?.bookingId || `BK${Date.now()}`;

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

    // 2. Create booking object
    const booking: TBooking = {
      id: "",
      bookingId,
      booking: { id: bookingDetails?.mountainId, type: type },
      userEmail: bookingDetails?.userEmail,
      mountainName: bookingDetails?.mountainName,
      slotDetails: bookingDetails?.slotDetails,
      participants: bookingDetails?.participants,
      customerInfo: bookingDetails?.customerInfo,
      amount: bookingDetails?.amount / 100, // Convert back from paise
      currency: bookingDetails?.currency,
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

    // 6. Send confirmation email with PDF attachment
    try {
      console.log("📧 Sending confirmation email");
      await sendBookingConfirmationEmail({
        booking: { ...booking, id: docRef.id },
        pdfBuffer,
        customerEmail: bookingDetails?.userEmail,
        customerName: bookingDetails?.customerInfo?.organizer?.name,
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
