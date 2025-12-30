/**
 * Input validation utilities for API endpoints
 */

import { isValidPhoneNumber } from "libphonenumber-js";

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (international)
 * Uses libphonenumber-js for accurate validation
 */
export function isValidPhone(phone: string): boolean {
  try {
    return isValidPhoneNumber(phone);
  } catch {
    // Fallback to regex if library fails
    const phoneRegex = /^\+?[1-9]\d{7,14}$/;
    return phoneRegex.test(phone.replace(/[\s-()]/g, ""));
  }
}

/**
 * Validate currency code
 */
export function isValidCurrency(currency: string): boolean {
  const validCurrencies = ["USD", "INR"];
  return validCurrencies.includes(currency.toUpperCase());
}

/**
 * Validate positive number
 */
export function isPositiveNumber(value: unknown): boolean {
  return typeof value === "number" && value > 0 && !isNaN(value);
}

/**
 * Validate integer
 */
export function isPositiveInteger(value: unknown): boolean {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value > 0 &&
    value < Number.MAX_SAFE_INTEGER
  );
}

/**
 * Validate string is not empty
 */
export function isNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Validate participant info
 */
export function validateParticipantInfo(
  participantsInfo: unknown
): { isValid: boolean; error?: string } {
  if (!participantsInfo || typeof participantsInfo !== "object") {
    return { isValid: false, error: "Invalid participants info" };
  }

  const { organizer, members } = participantsInfo as any;

  // Validate organizer
  if (!organizer || typeof organizer !== "object") {
    return { isValid: false, error: "Invalid organizer info" };
  }

  if (!isNonEmptyString(organizer.name)) {
    return { isValid: false, error: "Organizer name is required" };
  }

  if (!isValidEmail(organizer.email)) {
    return { isValid: false, error: "Invalid organizer email" };
  }

  if (!isValidPhone(organizer.phone)) {
    return { isValid: false, error: "Invalid organizer phone number" };
  }

  // Validate members if present
  if (members && Array.isArray(members)) {
    for (let i = 0; i < members.length; i++) {
      const member = members[i];

      if (!isNonEmptyString(member.name)) {
        return {
          isValid: false,
          error: `Member ${i + 1}: Name is required`,
        };
      }

      if (member.email && !isValidEmail(member.email)) {
        return {
          isValid: false,
          error: `Member ${i + 1}: Invalid email`,
        };
      }

      if (member.phone && !isValidPhone(member.phone)) {
        return {
          isValid: false,
          error: `Member ${i + 1}: Invalid phone number`,
        };
      }
    }
  }

  return { isValid: true };
}

/**
 * Validate order creation request
 */
export function validateOrderRequest(body: unknown): {
  isValid: boolean;
  error?: string;
} {
  if (!body || typeof body !== "object") {
    return { isValid: false, error: "Invalid request body" };
  }

  const data = body as Record<string, unknown>;
  // Required fields
  if (!isPositiveNumber(data.amount)) {
    return { isValid: false, error: "Invalid amount" };
  }

  if (!isValidCurrency(data.currency as string)) {
    return { isValid: false, error: "Invalid currency" };
  }

  if (!isNonEmptyString(data.mountainId)) {
    return { isValid: false, error: "Mountain ID is required" };
  }

  if (!isNonEmptyString(data.mountainName)) {
    return { isValid: false, error: "Mountain name is required" };
  }

  if (!isNonEmptyString(data.date)) {
    return { isValid: false, error: "Date is required" };
  }

  if (!isPositiveInteger(data.participants)) {
    return { isValid: false, error: "Invalid number of participants" };
  }

  // Reasonable limits
  if ((data.participants as number) > 50) {
    return {
      isValid: false,
      error: "Too many participants (max 50 per booking)",
    };
  }

  if ((data.amount as number) > 10000000) {
    // 10M limit
    return {
      isValid: false,
      error: "Amount exceeds maximum allowed",
    };
  }

  // Validate participants info
  const participantValidation = validateParticipantInfo(data.participantsInfo);
  if (!participantValidation.isValid) {
    return participantValidation;
  }

  return { isValid: true };
}
