import { adminDb } from "@/lib/firebase-admin";
import { fallbackContactDetails } from "./default-values";

// Server-side function (uses Admin SDK)
export async function getContactDetails(): Promise<TContactDetails> {
  if (!adminDb) {
    console.warn("Firebase Admin not configured, using demo data");
    return fallbackContactDetails;
  }

  try {
    const contactDoc = await adminDb
      .collection("settings")
      .doc("contact")
      .get();

    if (contactDoc.exists) {
      const data = contactDoc.data() as Partial<TContactDetails>;
      return {
        email: data.email || fallbackContactDetails.email,
        phone: data.phone || fallbackContactDetails.phone,
        address: data.address || fallbackContactDetails.address,
        emergencyPhone:
          data.emergencyPhone || fallbackContactDetails.emergencyPhone,
        officeHours: data.officeHours || fallbackContactDetails.officeHours,
        faqs: data.faqs || fallbackContactDetails.faqs,
        socialMedia: data.socialMedia || fallbackContactDetails.socialMedia,
      };
    }
  } catch (error: any) {
    // Only log unexpected errors, NOT_FOUND is expected when document doesn't exist
    if (error?.code !== 5 && error?.message !== "5 NOT_FOUND:") {
      console.error("Error fetching contact details:", error);
    }
  }

  return fallbackContactDetails;
}
