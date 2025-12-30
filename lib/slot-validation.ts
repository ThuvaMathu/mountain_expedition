import { adminDb } from "./firebase-admin";

export interface SlotValidationParams {
  productId: string;
  productType: "trekking" | "tourist-packages" | "tours";
  slotId: string;
  date: string;
  participants: number;
}

export interface SlotValidationResult {
  available: boolean;
  availableSpots: number;
  message?: string;
  slot?: any;
}

/**
 * Validate slot availability before booking
 * This is a shared utility used by both API routes and internal functions
 */
export async function validateSlotAvailability(
  params: SlotValidationParams
): Promise<SlotValidationResult> {
  const { productId, productType, slotId, date, participants } = params;

  console.log("🔍 [SLOT VALIDATION] Checking availability:", {
    productId,
    productType,
    slotId,
    date,
    participants,
    timestamp: new Date().toISOString(),
  });

  // Map productType to actual Firebase collection name
  // 'trekking' -> 'mountains' collection
  // 'tours' or 'tourist-packages' -> 'tourist-packages' collection
  const collection = productType === "trekking" 
    ? "mountains" 
    : "tourist-packages";
  
  console.log("📂 [SLOT VALIDATION] Using collection:", collection, "for productType:", productType);
  
  const docRef = adminDb.collection(collection).doc(productId);
  
  let doc;
  try {
    doc = await docRef.get();
  } catch (error: any) {
    console.error("❌ [SLOT VALIDATION] Firebase error:", {
      collection,
      productId,
      error: error.message,
      code: error.code
    });
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  if (!doc.exists) {
    console.error("❌ [SLOT VALIDATION] Product not found:", {
      collection,
      productId,
      productType
    });
    throw new Error(`Product not found in ${collection} collection`);
  }

  const data = doc.data();
  
  // ✅ FIX: Search for slot by ID across all dates
  // The 'date' parameter is actually the slotId, not a date string
  console.log(`🔍 [SLOT VALIDATION] Searching for slot ${slotId} across all dates...`);
  
  let foundSlot: any = null;
  let foundDateObj: any = null;
  
  if (data?.availableDates && Array.isArray(data.availableDates)) {
    for (const dateObj of data.availableDates) {
      const slot = dateObj.slots?.find((s: any) => s.id === slotId);
      if (slot) {
        foundSlot = slot;
        foundDateObj = dateObj;
        console.log(`✅ [SLOT VALIDATION] Found slot in date: ${dateObj.date}`);
        break;
      }
    }
  }

  if (!foundSlot || !foundDateObj) {
    console.error("❌ [SLOT VALIDATION] Slot not found:", slotId);
    console.log("Available dates:", JSON.stringify(data?.availableDates?.map((d: any) => ({
      date: d.date,
      slotIds: d.slots?.map((s: any) => s.id)
    })), null, 2));
    throw new Error(`Slot ${slotId} not found in any date`);
  }

  const availableSpots = foundSlot.maxParticipants - foundSlot.bookedParticipants;

  if (availableSpots < participants) {
    console.warn("⚠️ [SLOT VALIDATION] Insufficient capacity:", {
      requested: participants,
      available: availableSpots,
      max: foundSlot.maxParticipants,
      booked: foundSlot.bookedParticipants,
    });

    return {
      available: false,
      availableSpots,
      message: `Only ${availableSpots} spot(s) remaining. You requested ${participants}.`,
    };
  }

  console.log("✅ [SLOT VALIDATION] Validation passed:", {
    availableSpots,
    requested: participants,
  });

  return {
    available: true,
    availableSpots,
    slot: foundSlot,
  };
}