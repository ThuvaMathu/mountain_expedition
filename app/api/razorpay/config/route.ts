import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if Razorpay is configured by checking server-side environment variables
    const isConfigured = Boolean(
      process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    );

    return NextResponse.json({
      configured: isConfigured,
    });
  } catch (error) {
    console.error("Error checking Razorpay configuration:", error);
    return NextResponse.json({
      configured: false,
    });
  }
}
