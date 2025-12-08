"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, Shield, User, Calendar, Mountain } from "lucide-react";
import { loadRazorpay, createRazorpayOrder } from "@/lib/razorpay";
import { db, isFirebaseConfigured, auth } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import ParticipantGroupForm from "@/components/booking/pertisipants-fields";
import { v4 as uuidv4 } from "uuid";
import { useCurrencyStore } from "@/stores/currency-store";
import { serviceFeeCal } from "@/lib/service-fee-cal";
import { formatCurrency } from "@/lib/utils";
import { toast } from "react-toastify";
import { TermsCheckbox } from "@/components/booking/TermsCheckbox";
import { CurrencyButton } from "@/components/booking/CurrencyButton";
import {
  CHECKOUT_CONFIG,
  CHECKOUT_MESSAGES,
  TERMS_CONDITIONS,
} from "@/lib/constants/checkout-constants";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { currency, setCurrency, getCurrencyValue, formatedValue } =
    useCurrencyStore();
  const [mountain, setMountain] = useState<TMountainType | null>(null);
  const [termsCon, setTermsCon] = useState({
    tcs1: false,
    tcs2: false,
    tcs3: false,
  });

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

  const [customerInfo, setCustomerInfo] = useState<TParticipantGroup>({
    organizer: {
      name: user?.displayName || "",
      email: user?.email || "",
      country: "India",
      passport: "",
      phone: "",
      emergencyContact: "",
      medicalInfo: "",
    },
    members: [],
  });
  const [isFieldsFilled, setIsFieldsFilled] = useState(false);

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
        const q = query(
          collection(db, dbName),
          where("id", "==", temp.productId)
        );
        const snap = await getDocs(q);
        const list: TMountainType[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setMountain(list[0] || null);
        if (list[0]?.category === "domestic") {
          setCurrency("INR");
          setCustomerInfo((prev) => ({
            ...prev,
            organizer: {
              ...prev.organizer,
              country: "India",
            },
          }));
        }
      } catch (error) {
        console.error("Error loading mountains:", error);
      }
    };

    setBookingDetails(temp);
    load().catch(console.error);
  }, []);

  function getSlotDetails(): TSlotDetails {
    const availableDates = mountain?.availableDates;
    if (availableDates)
      for (const dateObj of availableDates) {
        const slot = dateObj.slots.find((s) => s.id === bookingDetails.slotId);
        if (slot) {
          // Format date to "5 Aug 2025"
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
            ...slot,
          };
        }
      }
    return null; // not found
  }

  // Validation helper for checkout readiness
  const validateCheckoutReadiness = () => {
    if (!user)
      return { isValid: false, error: CHECKOUT_MESSAGES.LOGIN_REQUIRED };
    if (!isFieldsFilled)
      return { isValid: false, error: CHECKOUT_MESSAGES.FORM_INCOMPLETE };
    if (!mountain)
      return { isValid: false, error: CHECKOUT_MESSAGES.MOUNTAIN_LOAD_ERROR };
    if (!Object.values(termsCon).every(Boolean)) {
      return { isValid: false, error: CHECKOUT_MESSAGES.TERMS_NOT_ACCEPTED };
    }
    return { isValid: true };
  };

  // Build order payload
  const buildOrderPayload = () => ({
    amount: totalAmount,
    currency,
    mountainId: mountain!.id,
    mountainName: mountain!.name,
    date: bookingDetails.slotId,
    participants: bookingDetails.participants,
    participantsInfo: customerInfo,
    type: bookingDetails.type,
    slotDetails: getSlotDetails(),
    userEmail: user!.email,
  });

  // Handle payment success
  const handlePaymentSuccess = async (response: any) => {
    try {
      const verifyResponse = await fetch("/api/razorpay/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          firestoreOrderId: response.firestoreOrderId,
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
  };

  // Build Razorpay options
  const buildRazorpayOptions = (orderData: any) => ({
    key: orderData.key,
    amount: orderData.amount,
    currency: orderData.currency,
    name: CHECKOUT_CONFIG.COMPANY_NAME,
    description: `${mountain!.name} Expedition`,
    order_id: orderData.orderId,
    handler: async (response: any) => {
      await handlePaymentSuccess({
        ...response,
        firestoreOrderId: orderData.firestoreOrderId,
      });
    },
    prefill: {
      name: customerInfo.organizer.name,
      email: customerInfo.organizer.email,
      contact: customerInfo.organizer.phone,
    },
    theme: { color: CHECKOUT_CONFIG.RAZORPAY_THEME_COLOR },
    modal: { ondismiss: () => setIsLoading(false) },
  });

  const handlePayment = async () => {
    const validation = validateCheckoutReadiness();
    if (!validation.isValid) {
      if (validation.error === CHECKOUT_MESSAGES.LOGIN_REQUIRED) {
        router.push("/auth/login");
      } else {
        toast.error(validation.error);
      }
      return;
    }
    setIsLoading(true);

    try {
      // Get Firebase auth token for API authentication
      let authToken: string | undefined;
      if (auth?.currentUser) {
        authToken = await auth.currentUser.getIdToken();
      }

      // Create Razorpay order
      const orderData = await createRazorpayOrder(
        buildOrderPayload(),
        authToken
      );

      // Load Razorpay SDK
      if (!(await loadRazorpay())) {
        throw new Error(CHECKOUT_MESSAGES.RAZORPAY_LOAD_ERROR);
      }

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(buildRazorpayOptions(orderData));
      razorpay.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error?.message || CHECKOUT_MESSAGES.PAYMENT_FAILED);
      setIsLoading(false);
    }
  };

  const currentCount = customerInfo.members.length + 1;
  const unitPrice = getCurrencyValue();
  const basePrice = unitPrice! * currentCount;
  const serviceFee = serviceFeeCal(currency, basePrice);
  const totalAmount = basePrice + serviceFee;
  //console.log("booking:", bookingDetails);
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Complete Your Booking
        </h1>
        <p className="text-gray-600">
          Secure your spot on this incredible expedition
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          <ParticipantGroupForm
            productType={mountain?.category!}
            participantCount={bookingDetails.participants}
            onChange={(participant, isFilled) => {
              setCustomerInfo(participant);
              setIsFieldsFilled(isFilled);
              console.log("🔄 Checkout Page: isFieldsFilled =", isFilled);
              const temp = {
                ...bookingDetails,
                participant: participant.members.length + 1,
              };
              //console.log("max:", temp);
              setBookingDetails(temp);
            }}
            maxParticipants={bookingDetails.maxParticipants - 1}
          />

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Terms & Conditions
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              {TERMS_CONDITIONS.map((term) => (
                <TermsCheckbox
                  key={term.id}
                  id={term.id}
                  label={term.label}
                  checked={termsCon[term.id as keyof typeof termsCon]}
                  onChange={(checked) =>
                    setTermsCon((prev) => ({ ...prev, [term.id]: checked }))
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Booking Summary
              </h2>

              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={mountain?.imageUrl[0] || "/placeholder.svg"}
                  alt={mountain?.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {mountain?.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mountain className="h-4 w-4 mr-1" />
                    <span>Expedition</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Date</span>
                  </div>
                  <span className="font-medium">{getSlotDetails()?.date}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-1" />
                    <span>Participants</span>
                  </div>
                  <span className="font-medium">{currentCount}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2  text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Base price × {currentCount}
                  </span>
                  <span>
                    {unitPrice && formatCurrency(basePrice, currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span>{formatCurrency(serviceFee, currency)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(totalAmount, currency)}</span>
                  </div>
                </div>
              </div>

              {/* Currency Selector */}
              <div className="border-t pt-4 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <div className="flex gap-2">
                  {CHECKOUT_CONFIG.CURRENCIES.map((curr) => (
                    <CurrencyButton
                      key={curr}
                      value={curr}
                      isActive={currency === curr}
                      onClick={() => setCurrency(curr)}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={
                  isLoading ||
                  !isFieldsFilled ||
                  !Object.values(termsCon).every(Boolean)
                }
                className={`w-full mt-6 ${
                  !isFieldsFilled || !Object.values(termsCon).every(Boolean)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700"
                } text-white py-3 text-lg`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay Now
                  </div>
                )}
              </Button>
              {!isFieldsFilled && (
                <p className="text-sm text-amber-600 mt-2 text-center">
                  Please fill in all required fields with valid information
                </p>
              )}
              {isFieldsFilled && !Object.values(termsCon).every(Boolean) && (
                <p className="text-sm text-amber-600 mt-2 text-center">
                  Please accept all terms and conditions to proceed
                </p>
              )}

              <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  <span>Secure Payment</span>
                </div>
                <span>•</span>
                <span>Powered by Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
