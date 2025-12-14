import { generateBookingId } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  getUserIdFromRequest,
  createRequestMetadata,
  getClientIp,
} from "@/lib/auth-utils";
import { validatePaymentAmount } from "@/lib/pricing-utils";
import { validateOrderRequest } from "@/lib/validation-utils";
import {
  checkOrderCreationRateLimit,
  checkIpRateLimit,
} from "@/lib/rate-limit";

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
    // STEP 1: Check IP-based rate limit (prevent DDoS)
    const clientIp = getClientIp(request);
    const ipRateLimit = checkIpRateLimit(clientIp);
    if (!ipRateLimit.allowed) {
      console.warn("⚠️ IP rate limit exceeded:", clientIp);
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: Math.ceil((ipRateLimit.resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    // STEP 2: Verify authentication
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }
    console.log("✅ User authenticated:", userId);

    // STEP 3: Check user-based rate limit (prevent abuse)
    const userRateLimit = checkOrderCreationRateLimit(userId);
    if (!userRateLimit.allowed) {
      console.warn("⚠️ User rate limit exceeded:", userId);
      return NextResponse.json(
        {
          error: "You're creating orders too quickly. Please wait a moment.",
          retryAfter: Math.ceil((userRateLimit.resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }
    console.log(
      `✅ Rate limit check passed (${userRateLimit.remaining} remaining)`
    );

    const body = await request.json();

    // STEP 4: Validate input data
    const inputValidation = validateOrderRequest(body);
    if (!inputValidation.isValid) {
      console.error("❌ Input validation failed:", inputValidation.error);
      return NextResponse.json(
        { error: inputValidation.error },
        { status: 400 }
      );
    }
    console.log("✅ Input validation passed");
    const {
      amount,
      currency,
      mountainId,
      mountainName,
      date,
      participants,
      participantsInfo,
      type,
      slotDetails,
      userEmail,
    } = body;

    // Check if Razorpay is configured
    if (!razorpay) {
      return NextResponse.json(
        { error: "Razorpay is not configured. Please add API keys to environment variables." },
        { status: 500 }
      );
    }

    // Check if Firebase is configured
    if (!isFirebaseConfigured || !db) {
      return NextResponse.json(
        { error: "Firebase is not configured." },
        { status: 500 }
      );
    }

    const bookingId = generateBookingId();
    const cusInfo: TParticipantGroup = participantsInfo;

    // STEP 5: Validate payment amount server-side
    // This prevents client-side price manipulation
    console.log("🔍 Validating payment amount...");
    const validation = await validatePaymentAmount({
      mountainId,
      type: type || "trekking",
      slotId: date,
      participants,
      currency,
      clientAmount: amount,
    });

    if (!validation.isValid) {
      console.error("❌ Amount validation failed:", validation.error);
      return NextResponse.json(
        {
          error: validation.error || "Invalid payment amount",
          expectedAmount: validation.expectedAmount,
        },
        { status: 400 }
      );
    }
    console.log("✅ Amount validated:", amount);

    // STEP 5.5: Validate slot availability before payment
    console.log("🔍 Validating slot availability...");
    try {
      const { validateSlotAvailability } = await import("@/lib/slot-validation");
      const validation = await validateSlotAvailability({
        productId: mountainId,
        productType: type || "trekking",
        slotId: slotDetails?.id,
        date: slotDetails?.originalDate || slotDetails?.date || date,
        participants
      });

      if (!validation.available) {
        console.error("❌ [CREATE ORDER] Slot validation failed:", validation.message);
        return NextResponse.json({
          error: "SLOT_UNAVAILABLE",
          message: validation.message || "This slot is no longer available",
          availableSpots: validation.availableSpots
        }, { status: 400 });
      }

      console.log("✅ [CREATE ORDER] Slot validated, proceeding with order creation");
    } catch (slotError) {
      console.error("❌ [CREATE ORDER] Slot validation error:", slotError);
      return NextResponse.json({
        error: "Failed to validate slot availability. Please try again."
      }, { status: 500 });
    }

    // Convert amount to smallest currency unit (paise for INR, cents for USD)
    const amountInSmallestUnit = Math.round(amount * 100);

    // STEP 6: Capture request metadata for security and audit
    const metadata = createRequestMetadata(request);
    console.log("📊 Request metadata:", metadata);

    // STEP 7: Save order to Firestore BEFORE creating Razorpay order
    // This ensures we have a record even if payment fails or user closes browser
    const orderData = {
      bookingId,
      userId, // Store authenticated user ID
      booking: { id: mountainId, type: type || "trekking" },
      userEmail,
      mountainName,
      slotDetails: slotDetails || { date },
      participants,
      customerInfo: cusInfo,
      amount,
      currency: currency.toUpperCase(),
      status: "pending", // pending → processing → confirmed/failed
      paymentMethod: "razorpay",
      razorpayOrderId: "", // Will be updated after Razorpay order creation
      razorpayPaymentId: "",
      metadata, // Store IP, user agent, timestamp
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log("💾 Saving order to Firestore before payment...");
    const orderDocRef = await addDoc(collection(db, "orders"), orderData);
    console.log("✅ Order saved with ID:", orderDocRef.id);

    // STEP 8: Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInSmallestUnit,
      currency: currency.toUpperCase(),
      receipt: bookingId,
      notes: {
        orderId: orderDocRef.id, // Store Firestore order ID
        mountainId,
        mountainName,
        date,
        participants: participants.toString(),
        name: cusInfo.organizer.name,
        email: cusInfo.organizer.email,
        phone: cusInfo.organizer.phone,
      },
    });

    // STEP 9: Update order with Razorpay order ID
    const { updateDoc, doc } = await import("firebase/firestore");
    await updateDoc(doc(db, "orders", orderDocRef.id), {
      razorpayOrderId: order.id,
      status: "processing", // Order created, waiting for payment
      updatedAt: serverTimestamp(),
    });
    console.log("✅ Order updated with Razorpay order ID:", order.id);

    return NextResponse.json({
      orderId: order.id,
      bookingId,
      firestoreOrderId: orderDocRef.id, // Return Firestore order ID to client
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
