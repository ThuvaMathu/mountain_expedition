export type SlotStatus = "available" | "limited" | "nearly-full" | "full";

export interface SlotAvailability {
  status: SlotStatus;
  available: number;
  booked: number;
  max: number;
  percentage: number;
  color: string;
  bgColor: string;
  textColor: string;
  label: string;
}

/**
 * Calculate slot availability status based on booked and max participants
 * @param bookedParticipants - Number of participants already booked
 * @param maxParticipants - Maximum number of participants allowed
 * @returns SlotAvailability object with status, colors, and labels
 */
export function getSlotAvailability(
  bookedParticipants: number,
  maxParticipants: number
): SlotAvailability {
  const available = maxParticipants - bookedParticipants;
  const percentage = (available / maxParticipants) * 100;

  let status: SlotStatus;
  let color: string;
  let bgColor: string;
  let textColor: string;
  let label: string;

  if (percentage >= 50) {
    status = "available";
    color = "green";
    bgColor = "bg-green-100";
    textColor = "text-green-800";
    label = "Available";
  } else if (percentage >= 25) {
    status = "limited";
    color = "yellow";
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-800";
    label = "Limited Spots";
  } else if (percentage > 0) {
    status = "nearly-full";
    color = "orange";
    bgColor = "bg-orange-100";
    textColor = "text-orange-800";
    label = "Nearly Full";
  } else {
    status = "full";
    color = "red";
    bgColor = "bg-red-100";
    textColor = "text-red-800";
    label = "Full";
  }

  return {
    status,
    available,
    booked: bookedParticipants,
    max: maxParticipants,
    percentage,
    color,
    bgColor,
    textColor,
    label
  };
}

/**
 * Get progress bar color class based on availability percentage
 * @param percentage - Percentage of available spots remaining
 * @returns Tailwind CSS class for progress bar color
 */
export function getProgressBarColor(percentage: number): string {
  if (percentage >= 50) return "bg-green-500";
  if (percentage >= 25) return "bg-yellow-500";
  if (percentage > 0) return "bg-orange-500";
  return "bg-red-500";
}

/**
 * Check if a slot should be shown to users (not full)
 * @param bookedParticipants - Number of participants already booked
 * @param maxParticipants - Maximum number of participants allowed
 * @returns true if slot should be shown, false if full
 */
export function shouldShowSlot(
  bookedParticipants: number,
  maxParticipants: number
): boolean {
  return bookedParticipants < maxParticipants;
}
