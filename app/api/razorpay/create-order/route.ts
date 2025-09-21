import { generateBookingId, generateUniqueId } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
const isRazorpayConfigured = process.env.IS_RAZORPAY_LIVE === "false";
console.log(
  "isRazorpayConfigured",
  isRazorpayConfigured,
  process.env.IS_RAZORPAY_LIVE
);

const razorpay = isRazorpayConfigured
  ? new Razorpay({
      key_id: razorpayKeyId!,
      key_secret: razorpayKeySecret!,
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
      customerInfo,
    } = body;

    const bookingId = generateBookingId();
    const cusInfo: TOrderData = customerInfo;
    if (isRazorpayConfigured) {
      // Demo mode
      return NextResponse.json({
        demo: true,
        orderId: generateUniqueId({}),
        bookingId,
        amount: amount * 100, // Convert to paise for demo
        currency: currency.toUpperCase(),
        key: "demo_key",
      });
    }
    if (!razorpay) {
      return NextResponse.json(
        { error: "Razorpay is not configured" },
        { status: 500 }
      );
    }
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
        name: cusInfo.participantsInfo.organizer.name,
        email: cusInfo.participantsInfo.organizer.email,
        phone: cusInfo.participantsInfo.organizer.phone,
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
