import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { fallbackContactDetails } from "../default-values";

// Client-side function (uses Client SDK)
export async function getContactDetailsClient(): Promise<TContactDetails> {
  if (!db) {
    console.warn("Firebase not configured, using demo data");
    return fallbackContactDetails;
  }

  try {
    const contactRef = doc(db, "settings", "contact");
    const contactDoc = await getDoc(contactRef);

    if (contactDoc.exists()) {
      const data = contactDoc.data() as Partial<TContactDetails>;
      return {
        email: data.email || fallbackContactDetails.email,
        phone: data.phone || fallbackContactDetails.phone,
        address: data.address || fallbackContactDetails.address,
        emergencyPhone:
          data.emergencyPhone || fallbackContactDetails.emergencyPhone,
        officeHours: data.officeHours || fallbackContactDetails.officeHours,
        faqs: data.faqs || fallbackContactDetails.faqs,
      };
    }
  } catch (error) {
    console.error("Error fetching contact details:", error);
  }

  return fallbackContactDetails;
}
