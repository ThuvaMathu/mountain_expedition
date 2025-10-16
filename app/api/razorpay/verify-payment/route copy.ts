import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

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

    if (isRazorpayConfigured) {
      console.log("demo");
      const bookingId = bookingDetails?.bookingId || `BK${Date.now()}`;

      if (!isFirebaseConfigured || !db) {
        return NextResponse.json(
          { error: "Firebase init failed" },
          { status: 400 }
        );
      }
      const booking: TBooking = {
        id: "",
        bookingId,
        booking: { id: bookingDetails?.mountainId, type: type },
        userEmail: bookingDetails?.userEmail,
        //mountainId: bookingDetails?.mountainId,
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
      };
      const docRef = await addDoc(collection(db!, "bookings"), booking);
      console.log("✅ Created document with ID:", docRef.id);

      await updateDoc(docRef, { id: docRef.id });
      return NextResponse.json({
        success: true,
        bookingId,
        id: docRef.id,
        demo: true,
      });
    }

    if (!razorpayKeySecret || !isFirebaseConfigured || !db) {
      const bookingId = bookingDetails?.bookingId || `BK${Date.now()}`;

      return NextResponse.json(
        { error: "Firebase init failed" },
        { status: 400 }
      );
    }

    // Verify signature
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

    // Payment verified successfully
    const bookingId = bookingDetails?.bookingId || `BK${Date.now()}`;

    if (isFirebaseConfigured && db) {
      const booking = {
        bookingId,
        mountainId: bookingDetails?.mountainId,
        mountainName: bookingDetails?.mountainName,
        date: bookingDetails?.date,
        participants: bookingDetails?.participants,
        customerInfo: bookingDetails?.customerInfo,
        amount: bookingDetails?.amount / 100, // Convert back from paise
        currency: bookingDetails?.currency,
        status: "confirmed",
        paymentMethod: "razorpay",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db!, "bookings"), booking);
      console.log("✅ Created document with ID:", docRef.id);

      await updateDoc(docRef, { id: docRef.id });
      return NextResponse.json({
        success: true,
        id: docRef.id,
        bookingId,
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
