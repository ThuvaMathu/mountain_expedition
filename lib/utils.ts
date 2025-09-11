import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function generateBookingId() {
  return "BK" + Date.now().toString(36).toUpperCase();
}

export function capitalizeName(name: string | null | undefined): string {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/) // split on one or more spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const getAvailableSlots = (mountain: TMountainType) => {
  return (
    mountain.availableDates?.reduce((total, date) => {
      return (
        total +
        date.slots.reduce((dateTotal, slot) => {
          return (
            dateTotal +
            Math.max(0, slot.maxParticipants - slot.bookedParticipants)
          );
        }, 0)
      );
    }, 0) || 0
  );
};
