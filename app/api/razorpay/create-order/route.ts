import { type NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpayKeyId = process.env.RAZORPAY_KEY_ID
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET
const isRazorpayConfigured = Boolean(razorpayKeyId && razorpayKeySecret)

const razorpay = isRazorpayConfigured
  ? new Razorpay({
      key_id: razorpayKeyId!,
      key_secret: razorpayKeySecret!,
    })
  : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, mountainId, mountainName, date, participants, customerInfo } = body

    const bookingId = `BK${Date.now()}`

    if (!isRazorpayConfigured || !razorpay) {
      // Demo mode
      return NextResponse.json({
        demo: true,
        orderId: `order_${Date.now()}`,
        bookingId,
        amount: amount * 100, // Convert to paise for demo
        currency: currency.toUpperCase(),
        key: "demo_key",
      })
    }

    // Convert amount to smallest currency unit (paise for INR, cents for USD)
    const amountInSmallestUnit = Math.round(amount * 100)

    const order = await razorpay.orders.create({
      amount: amountInSmallestUnit,
      currency: currency.toUpperCase(),
      receipt: bookingId,
      notes: {
        mountainId,
        mountainName,
        date,
        participants: participants.toString(),
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
      },
    })

    return NextResponse.json({
      orderId: order.id,
      bookingId,
      amount: order.amount,
      currency: order.currency,
      key: razorpayKeyId,
    })
  } catch (error) {
    console.error("Razorpay order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
