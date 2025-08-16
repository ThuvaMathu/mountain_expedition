import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripeSecret = process.env.STRIPE_SECRET_KEY
const isStripeConfigured = Boolean(stripeSecret)
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2024-06-20" }) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, mountainId, mountainName, date, participants, customerInfo } = body as {
      amount: number
      currency: "USD" | "INR"
      mountainId: string
      mountainName: string
      date: string
      participants: number
      customerInfo: { name: string; email: string; phone?: string }
    }

    const origin = request.headers.get("origin") || "http://localhost:3000"
    const bookingId = `BK${Date.now()}`

    if (!isStripeConfigured || !stripe) {
      // Demo: return mock session
      return NextResponse.json({
        demo: true,
        sessionId: `sess_${Date.now()}`,
        bookingId,
        successUrl: `${origin}/booking/confirmation/${bookingId}`,
      })
    }

    const amountMinor = Math.round(amount * 100) // cents or paise based on currency

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "upi"],
      customer_email: customerInfo.email,
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            unit_amount: amountMinor,
            product_data: {
              name: `${mountainName} Expedition`,
              metadata: { mountainId },
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/booking/confirmation/${bookingId}`,
      cancel_url: `${origin}/booking/checkout?mountain=${mountainId}&date=${encodeURIComponent(date)}&participants=${participants}`,
      metadata: {
        bookingId,
        mountainId,
        date,
        participants: String(participants),
        customerName: customerInfo.name,
        currency,
      },
    })

    return NextResponse.json({ sessionId: session.id, bookingId })
  } catch (error) {
    console.error("Stripe session error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
