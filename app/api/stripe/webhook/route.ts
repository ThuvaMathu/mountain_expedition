import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { db, isFirebaseConfigured } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : null
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  if (!stripe || !webhookSecret) {
    // Demo mode: accept without verifying
    return NextResponse.json({ received: true })
  }

  const sig = req.headers.get("stripe-signature") as string
  const rawBody = await req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const metadata = session.metadata || {}
      const bookingId = metadata.bookingId || `BK${Date.now()}`
      const amountTotal = session.amount_total ? session.amount_total / 100 : 0
      const currency = (session.currency || "usd").toUpperCase()

      if (isFirebaseConfigured && db) {
        await addDoc(collection(db, "bookings"), {
          bookingId,
          mountainId: metadata.mountainId,
          date: metadata.date,
          participants: Number.parseInt(metadata.participants || "1", 10),
          customerInfo: { name: metadata.customerName, email: session.customer_email },
          amount: amountTotal,
          currency,
          status: "confirmed",
          createdAt: serverTimestamp(),
          stripeSessionId: session.id,
          paymentStatus: session.payment_status,
        })
      }
    }
  } catch (error) {
    console.error("Webhook handling error:", error)
    return NextResponse.json({ received: false }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
