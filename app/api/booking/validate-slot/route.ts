import { NextRequest, NextResponse } from "next/server";
import { validateSlotAvailability } from "@/lib/slot-validation";

export async function POST(req: NextRequest) {
  try {
    const { productId, productType, slotId, date, participants } = await req.json();

    const result = await validateSlotAvailability({
      productId,
      productType,
      slotId,
      date,
      participants,
    });

    if (!result.available) {
      return NextResponse.json(
        {
          available: false,
          availableSpots: result.availableSpots,
          message: result.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      available: true,
      availableSpots: result.availableSpots,
      slot: result.slot,
    });
  } catch (error) {
    console.error("❌ [SLOT VALIDATION] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Validation failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
