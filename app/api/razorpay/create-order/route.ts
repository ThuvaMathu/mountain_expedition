import { generateBookingId } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

// Initialize Razorpay instance
const razorpay = razorpayKeyId && razorpayKeySecret
  ? new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      currency,
      mountainId,
      mountainName,
      date,
      participants,
      participantsInfo,
    } = body;

    // Check if Razorpay is configured
    if (!razorpay) {
      return NextResponse.json(
        { error: "Razorpay is not configured. Please add API keys to environment variables." },
        { status: 500 }
      );
    }

    const bookingId = generateBookingId();
    const cusInfo: TParticipantGroup = participantsInfo;

    // Convert amount to smallest currency unit (paise for INR, cents for USD)
    const amountInSmallestUnit = Math.round(amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInSmallestUnit,
      currency: currency.toUpperCase(),
      receipt: bookingId,
      notes: {
        mountainId,
        mountainName,
        date,
        participants: participants.toString(),
        name: cusInfo.organizer.name,
        email: cusInfo.organizer.email,
        phone: cusInfo.organizer.phone,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      bookingId,
      amount: order.amount,
      currency: order.currency,
      key: razorpayKeyId,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
