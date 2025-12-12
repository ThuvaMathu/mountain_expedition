import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { serviceFeeCal } from "@/lib/service-fee-cal";

/**
 * Error response factory for price validation
 */
type PriceValidationError = {
  isValid: false;
  expectedAmount: 0;
  breakdown: { basePrice: 0; total: 0 };
  error: string;
};

const createErrorResponse = (error: string): PriceValidationError => ({
  isValid: false,
  expectedAmount: 0,
  breakdown: { basePrice: 0, total: 0 },
  error,
});

/**
 * Fetch mountain/package details from Firestore
 */
async function getMountainDetails(
  mountainId: string,
  type: string
): Promise<TMountainType | null> {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase not configured");
  }

  const dbName = type === "trekking" ? "mountains" : "tourist-packages";
  const q = query(collection(db, dbName), where("id", "==", mountainId));
  const snap = await getDocs(q);

  if (snap.empty) {
    return null;
  }

  return {
    id: snap.docs[0].id,
    ...(snap.docs[0].data() as any),
  };
}

/**
 * Get slot details from mountain data
 */
function getSlotDetails(
  mountain: TMountainType,
  slotId: string
): TSlotDetails | null {
  const availableDates = mountain?.availableDates;
  if (!availableDates) return null;

  for (const dateObj of availableDates) {
    const slot = dateObj.slots.find((s) => s.id === slotId);
    if (slot) {
      const formattedDate = new Date(dateObj.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      return {
        date: formattedDate,
        ...slot,
      };
    }
  }

  return null;
}

/**
 * Calculate the expected total amount server-side
 * This prevents client-side price manipulation
 */
export async function calculateExpectedAmount(params: {
  mountainId: string;
  type: string;
  slotId: string;
  participants: number;
  currency: string;
}): Promise<{
  isValid: boolean;
  expectedAmount: number;
  breakdown: {
    basePrice: number;
    total: number;
  };
  error?: string;
}> {
  try {
    // Fetch mountain details from database
    const mountain = await getMountainDetails(params.mountainId, params.type);

    if (!mountain) {
      return createErrorResponse("Mountain/package not found");
    }

    // Get slot details
    const slot = getSlotDetails(mountain, params.slotId);

    if (!slot) {
      return createErrorResponse("Slot not found");
    }

    // Check slot availability
    const spotsLeft = slot.maxParticipants - slot.bookedParticipants;
    if (spotsLeft < params.participants) {
      return createErrorResponse(
        `Only ${spotsLeft} spots left, cannot book ${params.participants} participants`
      );
    }

    // Get the correct price based on currency from package level
    // Packages store pricing at the top level (priceUSD, priceINR)
    // Slots only have priceMultiplier for variant pricing
    let packagePrice: number;
    if (params.currency === "USD") {
      packagePrice = mountain.priceUSD || 0;
    } else if (params.currency === "INR") {
      packagePrice = mountain.priceINR || 0;
    } else {
      return createErrorResponse("Invalid currency");
    }

    if (!packagePrice || packagePrice <= 0) {
      return createErrorResponse(`Price not available for ${params.currency}`);
    }

    // Apply slot price multiplier (default to 1.0 if not specified)
    const unitPrice = packagePrice * (slot.priceMultiplier || 1.0);

    // Calculate amounts
    const basePrice = unitPrice * params.participants;
    //const serviceFee = serviceFeeCal(params.currency, basePrice);
    const total = basePrice; // + serviceFee;

    return {
      isValid: true,
      expectedAmount: total,
      breakdown: {
        basePrice,
        total,
      },
    };
  } catch (error) {
    console.error("Error calculating expected amount:", error);
    return createErrorResponse("Failed to calculate amount");
  }
}

/**
 * Validate that the client-provided amount matches server calculation
 */
export async function validatePaymentAmount(params: {
  mountainId: string;
  type: string;
  slotId: string;
  participants: number;
  currency: string;
  clientAmount: number;
}): Promise<{ isValid: boolean; error?: string; expectedAmount?: number }> {
  const calculation = await calculateExpectedAmount({
    mountainId: params.mountainId,
    type: params.type,
    slotId: params.slotId,
    participants: params.participants,
    currency: params.currency,
  });

  if (!calculation.isValid) {
    return {
      isValid: false,
      error: calculation.error,
    };
  }

  // Allow small rounding differences (up to 0.01)
  const difference = Math.abs(calculation.expectedAmount - params.clientAmount);
  if (difference > 0.01) {
    return {
      isValid: false,
      error: `Amount mismatch. Expected ${calculation.expectedAmount}, got ${params.clientAmount}`,
      expectedAmount: calculation.expectedAmount,
    };
  }

  return {
    isValid: true,
    expectedAmount: calculation.expectedAmount,
  };
}
