"use client";

import { useState, useEffect } from "react";
import { getContactDetailsClient } from "@/services/client-service/get-contact";
import { fallbackContactDetails } from "@/services/default-values";

export function useContactDetails() {
  const [contact, setContact] = useState<TContactDetails>(fallbackContactDetails);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContact() {
      try {
        const data = await getContactDetailsClient();
        setContact(data);
      } catch (error) {
        console.error("Error loading contact details:", error);
        setContact(fallbackContactDetails);
      } finally {
        setLoading(false);
      }
    }

    fetchContact();
  }, []);

  return { contact, loading };
}
