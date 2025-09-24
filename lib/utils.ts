import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import { Timestamp } from "firebase/firestore";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function formatCurrency(amount: number, currency: string = "USD") {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency,
//   }).format(amount);
// }
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  formatShort: boolean = false,
  fractionDigits: number = 1
): string {
  if (formatShort) {
    const absAmount = Math.abs(amount);
    let formatted = amount;
    let suffix = "";

    if (absAmount >= 1_000_000_000_000) {
      formatted = amount / 1_000_000_000_000;
      suffix = "T";
    } else if (absAmount >= 1_000_000_000) {
      formatted = amount / 1_000_000_000;
      suffix = "B";
    } else if (absAmount >= 1_000_000) {
      formatted = amount / 1_000_000;
      suffix = "M";
    } else if (absAmount >= 1_000) {
      formatted = amount / 1_000;
      suffix = "K";
    }

    return `${new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: fractionDigits,
    }).format(formatted)}${suffix}`;
  }

  // Default full format
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

export function formatDate(input: any) {
  const date = new Date(input);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date input: ${input}`);
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}

export function formatFirestoreDate(
  input: Timestamp | Date | string | number
): string {
  let date: Date;

  if (input instanceof Timestamp) {
    date = input.toDate();
  } else if (input instanceof Date) {
    date = input;
  } else {
    date = new Date(input); // string or number
  }

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date input: ${input}`);
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}

export function generateBookingId() {
  return "bk-" + Date.now().toString(36).toUpperCase();
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

export const generateUniqueId = ({ prefix = "" }: { prefix?: string | null }) =>
  `${prefix ? prefix + "-" : ""}${uuidv4().replace(/-/g, "")}`;
