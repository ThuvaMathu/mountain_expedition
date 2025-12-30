"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { loadRazorpay, createRazorpayOrder } from "@/lib/razorpay";
import { db, isFirebaseConfigured, auth } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import ParticipantGroupForm from "@/components/booking/pertisipants-fields";
import { useCurrencyStore } from "@/stores/currency-store";
import { useBookingFormStore } from "@/stores/booking-form-store";
import { toast } from "react-toastify";
import {
  CHECKOUT_CONFIG,
  CHECKOUT_MESSAGES,
} from "@/lib/constants/checkout-constants";
import BookingHeader from "@/components/booking/checkout/BookingHeader";
import TermsSection from "@/components/booking/checkout/TermsSection";
import BookingSummary from "@/components/booking/checkout/BookingSummary";
import SupportCTA from "@/components/booking/checkout/SupportCTA";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { currency, setCurrency } = useCurrencyStore();

  // Minimal Zustand subscriptions - only for initialization
  const initializeWithUserData = useBookingFormStore((state) => state.initializeWithUserData);
  const setProductType = useBookingFormStore((state) => state.setProductType);
  const validateForm = useBookingFormStore((state) => state.validateForm);

  const [mountain, setMountain] = useState<TMountainType | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [bookingDetails, setBookingDetails] = useState<{
    productId: string;
    type: string;
    slotId: string;
    participants: number;
    maxParticipants: number;
  }>({
    productId: "",
    type: "international",
    slotId: "",
    participants: 1,
    maxParticipants: 1,
  });

  useEffect(() => {
    const temp = {
      productId: searchParams.get("id") || "",
      type: searchParams.get("type") || "trekking",
      slotId: searchParams.get("slot_id") || "",
      participants: Number.parseInt(searchParams.get("participants") || "1"),
      maxParticipants: Number.parseInt(searchParams.get("max") || "1"),
    };
    const load = async () => {
      if (!isFirebaseConfigured || !db) {
        setMountain(null);
        return;
      }
      try {
        const dbName =
          temp.type === "trekking" ? "mountains" : "tourist-packages";

        // Fetch document directly by ID instead of querying
        const docRef = doc(db, dbName, temp.productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const mountainData = {
            id: docSnap.id,
            ...(docSnap.data() as any),
          } as TMountainType;

          setMountain(mountainData);

          if (mountainData.category) {
            setProductType(mountainData.category);
          }
          if (mountainData.category === "domestic") {
            setCurrency("INR");
          }
        } else {
          console.error("Mountain not found:", temp.productId);
          setMountain(null);
        }
      } catch (error) {
        console.error("Error loading mountain:", error);
        setMountain(null);
      }
    };

    setBookingDetails(temp);
    load().catch(console.error);
  }, [setProductType, setCurrency]);

  // Initialize form with user data when user is available
  useEffect(() => {
    if (user) {
      initializeWithUserData({
        name: user.displayName || "",
        email: user.email || "",
      });
    }
  }, [user, initializeWithUserData]);

  function getSlotDetails(): TSlotDetails {
    const availableDates = mountain?.availableDates;
    if (availableDates)
      for (const dateObj of availableDates) {
        const slot = dateObj.slots.find((s) => s.id === bookingDetails.slotId);
        if (slot) {
          const formattedDate = new Date(dateObj.date).toLocaleDateString(
            "en-GB",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          );

          return {
            date: formattedDate,
            originalDate: dateObj.date,
            ...slot,
          };
        }
      }
    return null;
  }

  const handlePayment = useCallback(async () => {
    // Validate form one final time before payment
    validateForm();

    // Get current state
    const isFieldsFilled = useBookingFormStore.getState().isFieldsFilled;

    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (!isFieldsFilled) {
      toast.error(CHECKOUT_MESSAGES.FORM_INCOMPLETE);
      return;
    }
    if (!mountain) {
      toast.error(CHECKOUT_MESSAGES.MOUNTAIN_LOAD_ERROR);
      return;
    }
    if (!termsAccepted) {
      toast.error(CHECKOUT_MESSAGES.TERMS_NOT_ACCEPTED);
      return;
    }

    setIsLoading(true);

    try {
      // Get Firebase auth token
      let authToken: string | undefined;
      if (auth?.currentUser) {
        authToken = await auth.currentUser.getIdToken();
      }

      // Get participant data from store
      const participantGroup = useBookingFormStore.getState().participantGroup;
      const currentCurrency = useCurrencyStore.getState().currency;

      // ✅ SECURITY FIX: Calculate actual participant count from store data
      // This prevents URL manipulation where user could pay for 1 but book 5
      const actualParticipants = participantGroup.members.length + 1;
      const totalAmount = useCurrencyStore.getState().getCurrencyValue()! * actualParticipants;

      // Create Razorpay order
      const orderData = await createRazorpayOrder(
        {
          amount: totalAmount,
          currency: currentCurrency,
          mountainId: mountain.id,
          mountainName: mountain.name,
          date: bookingDetails.slotId,
          participants: actualParticipants,  // ✅ Use actual count, not URL param
          participantsInfo: participantGroup,
          type: bookingDetails.type,  // ✅ Add type (trekking/tour) for correct collection lookup
        },
        authToken
      );

      // Load Razorpay SDK
      if (!(await loadRazorpay())) {
        throw new Error(CHECKOUT_MESSAGES.RAZORPAY_LOAD_ERROR);
      }

      // Open Razorpay checkout
      const razorpay = new window.Razorpay({
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: CHECKOUT_CONFIG.COMPANY_NAME,
        description: `${mountain.name} Expedition`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                firestoreOrderId: orderData.firestoreOrderId,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              router.push(
                `/booking/confirmation/${verifyData.id}?type=${bookingDetails.type}`
              );
            } else {
              toast.error(CHECKOUT_MESSAGES.PAYMENT_VERIFICATION_FAILED);
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error(CHECKOUT_MESSAGES.PAYMENT_VERIFICATION_FAILED);
          }
        },
        prefill: {
          name: participantGroup.organizer.name,
          email: participantGroup.organizer.email,
          contact: participantGroup.organizer.phone,
        },
        theme: { color: CHECKOUT_CONFIG.RAZORPAY_THEME_COLOR },
        modal: { ondismiss: () => setIsLoading(false) },
      });
      razorpay.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error?.message || CHECKOUT_MESSAGES.PAYMENT_FAILED);
      setIsLoading(false);
    }
  }, [user, mountain, termsAccepted, bookingDetails, router, validateForm]);

  const handleTermsChange = useCallback((allAccepted: boolean) => {
    setTermsAccepted(allAccepted);
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BookingHeader />
      {isLoading && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-xs z-50 rounded-xl flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <div className="flex flex-col">
              <span className="text-gray-900 font-medium">Processing your payment</span>
              <span className="text-gray-900 font-medium">Please wait...</span>
            </div>
          </div>
        </div>
      )
      }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}

        <div className="lg:col-span-2 space-y-6 relative">
          {/* Processing Overlay */}
          {/* {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 rounded-xl flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-xl p-6 flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <span className="text-gray-900 font-medium">Processing your payment...</span>
              </div>
            </div>
          )} */}

          <ParticipantGroupForm
            productType={mountain?.category!}
            participantCount={bookingDetails.participants}
            maxParticipants={bookingDetails.maxParticipants - 1}
          />

          <TermsSection onTermsChange={handleTermsChange} />

          {/* Support CTA - Hidden on mobile, shown after terms on desktop */}
          <div className="hidden lg:block">
            <SupportCTA />
          </div>
        </div>

        {/* Booking Summary */}
        <BookingSummary
          mountain={mountain}
          slotDate={getSlotDetails()?.date}
          isLoading={isLoading}
          termsAccepted={termsAccepted}
          onPayment={handlePayment}
        />
      </div>

      {/* Support CTA - Shown at bottom on mobile only */}
      <div className="lg:hidden mt-8">
        <SupportCTA />
      </div>
    </main >
  );
}
