import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { productId, productType, slotId, date, participants } = await req.json();

    console.log("🔍 [SLOT VALIDATION] Checking availability:", {
      productId,
      slotId,
      date,
      participants,
      timestamp: new Date().toISOString()
    });

    const collection = productType === "trekking" ? "mountains" : "tourist-packages";
    const docRef = adminDb.collection(collection).doc(productId);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.error("❌ [SLOT VALIDATION] Product not found:", productId);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const data = doc.data();
    const dateObj = data?.availableDates?.find((d: any) => d.date === date);

    if (!dateObj) {
      console.error("❌ [SLOT VALIDATION] Date not found:", date);
      return NextResponse.json({ error: "Date not found" }, { status: 404 });
    }

    const slot = dateObj.slots.find((s: any) => s.id === slotId);

    if (!slot) {
      console.error("❌ [SLOT VALIDATION] Slot not found:", slotId);
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    const availableSpots = slot.maxParticipants - slot.bookedParticipants;

    if (availableSpots < participants) {
      console.warn("⚠️ [SLOT VALIDATION] Insufficient capacity:", {
        requested: participants,
        available: availableSpots,
        max: slot.maxParticipants,
        booked: slot.bookedParticipants
      });

      return NextResponse.json({
        available: false,
        availableSpots,
        message: `Only ${availableSpots} spot(s) remaining. You requested ${participants}.`
      }, { status: 400 });
    }

    console.log("✅ [SLOT VALIDATION] Validation passed:", {
      availableSpots,
      requested: participants
    });

    return NextResponse.json({
      available: true,
      availableSpots,
      slot
    });

  } catch (error) {
    console.error("❌ [SLOT VALIDATION] Error:", error);
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
