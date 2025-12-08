import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

/**
 * Phone number validation using libphonenumber-js
 * Accepts international phone numbers with country code
 */
const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .refine(
    (phone) => {
      try {
        // libphonenumber-js validates international formats
        return isValidPhoneNumber(phone);
      } catch {
        return false;
      }
    },
    {
      message:
        "Please enter a valid phone number with country code (e.g., +91 98765 43210, +1 234 567 8900)",
    }
  );

/**
 * Email validation with proper format checking
 */
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

/**
 * Base participant information schema
 */
const participantInfoSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: emailSchema,
  country: z.string().min(1, "Country is required"),
  passport: z.string().optional(),
  phone: phoneSchema,
  emergencyContact: phoneSchema,
  medicalInfo: z.string().optional(),
});

/**
 * Domestic participant schema (India - no passport required)
 */
const domesticParticipantSchema = participantInfoSchema.extend({
  country: z.literal("India"),
  passport: z.string().optional(),
});

/**
 * International participant schema (passport required)
 */
const internationalParticipantSchema = participantInfoSchema.extend({
  passport: z.string().min(1, "Passport number is required for international travel"),
});

/**
 * Participant group schema based on product type
 * @param productType - "domestic" or "international"
 */
export const participantGroupSchema = (productType: "domestic" | "international") =>
  z.object({
    organizer:
      productType === "domestic"
        ? domesticParticipantSchema
        : internationalParticipantSchema,
    members: z.array(
      productType === "domestic"
        ? domesticParticipantSchema
        : internationalParticipantSchema
    ),
  });

/**
 * Type inference for participant group
 */
export type ParticipantGroupSchema = z.infer<
  ReturnType<typeof participantGroupSchema>
>;
