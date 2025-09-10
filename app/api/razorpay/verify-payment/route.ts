import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db, isFirebaseConfigured } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingDetails } = body

    if (!razorpayKeySecret) {
      // Demo mode - accept without verification
      const bookingId = bookingDetails?.bookingId || `BK${Date.now()}`

      if (isFirebaseConfigured && db) {
        await addDoc(collection(db, "bookings"), {
          bookingId,
          mountainId: bookingDetails?.mountainId,
          mountainName: bookingDetails?.mountainName,
          date: bookingDetails?.date,
          participants: bookingDetails?.participants,
          customerInfo: bookingDetails?.customerInfo,
          amount: bookingDetails?.amount / 100, // Convert back from paise
          currency: bookingDetails?.currency,
          status: "confirmed",
          paymentMethod: "razorpay_demo",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          createdAt: serverTimestamp(),
        })
      }

      return NextResponse.json({
        success: true,
        bookingId,
        demo: true,
      })
    }

    // Verify signature
    const body_string = razorpay_order_id + "|" + razorpay_payment_id
    const expected_signature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(body_string.toString())
      .digest("hex")

    if (expected_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    // Payment verified successfully
    const bookingId = bookingDetails?.bookingId || `BK${Date.now()}`

    if (isFirebaseConfigured && db) {
      await addDoc(collection(db, "bookings"), {
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
      })
    }

    return NextResponse.json({
      success: true,
      bookingId,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}
