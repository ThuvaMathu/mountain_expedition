"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, Shield, User, Calendar, Mountain } from "lucide-react";
import { loadRazorpay, createRazorpayOrder } from "@/lib/razorpay";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import ParticipantGroupForm from "@/components/booking/pertisipants-fields";
import { v4 as uuidv4 } from "uuid";
import { useCurrencyStore } from "@/stores/currency-store";
import { serviceFeeCal } from "@/lib/service-fee-cal";
import { formatCurrency } from "@/lib/utils";
import { toast } from "react-toastify";

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
  const [isRazorpayConfigured, setIsRazorpayConfigured] = useState<
    boolean | null
  >(null);

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
    const checkRazorpayConfig = async () => {
      try {
        const response = await fetch("/api/razorpay/config");
        const data = await response.json();
        setIsRazorpayConfigured(data.configured);
      } catch (error) {
        console.error("Error checking Razorpay config:", error);
        setIsRazorpayConfigured(false);
      }
    };
    checkRazorpayConfig();
  }, []);

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
  const handlePayment = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (!isFieldsFilled) {
      //alert("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      return;
    }
    if (!mountain) {
      //alert("Error Load mountain Details");
      toast.error("Error Load mountain Details");

      return;
    }
    if (!termsCon.tcs1 || !termsCon.tcs2 || !termsCon.tcs3) {
      toast.error(
        "Please acknowledge that you have read and agree to our Terms and Conditions."
      );
      return;
    }
    setIsLoading(true);

    try {
      // Create Razorpay order
      const orderData = await createRazorpayOrder({
        amount: totalAmount,
        currency,
        mountainId: mountain.id,
        mountainName: mountain.name,
        date: bookingDetails.slotId,
        participants: bookingDetails.participants,
        participantsInfo: customerInfo,
      });

      if (orderData.demo) {
        console.log("demo executed");
        // Demo mode - redirect directly to confirmation
        try {
          const verifyResponse = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: `razorpay_order_id_${uuidv4()}`,
              razorpay_payment_id: `razorpay_payment_id_${uuidv4()}`,
              razorpay_signature: `razorpay_signature_${uuidv4()}`,
              type: bookingDetails.type,
              bookingDetails: {
                userEmail: user.email,
                bookingId: orderData.bookingId,
                mountainId: mountain.id,
                mountainName: mountain.name,
                slotDetails: getSlotDetails(),
                participants: currentCount,
                customerInfo,
                amount: orderData.amount,
                currency: orderData.currency,
              },
            }),
          });

          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            if (verifyData.id) {
              router.push(
                `/booking/confirmation/${verifyData?.id}?type=${bookingDetails.type}`
              );
            }
            return;
          } else {
            toast("Payment verification failed. Please contact support.");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          alert("Payment verification failed. Please contact support.");
        }
        return;
      }

      // Load Razorpay script
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        alert("Razorpay SDK failed to load. Please try again.");
        return;
      }

      // Configure Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Summit Quest Expeditions",
        description: `${mountain.name} Expedition`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingDetails: {
                  bookingId: orderData.bookingId,
                  mountainId: mountain.id,
                  mountainName: mountain.name,
                  slotDetails: getSlotDetails(),
                  participants: bookingDetails.participants,
                  customerInfo,
                  amount: orderData.amount,
                  currency: orderData.currency,
                },
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              router.push(`/booking/confirmation/${verifyData.bookingId}`);
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: customerInfo.organizer.name,
          email: customerInfo.organizer.email,
          contact: customerInfo.organizer.phone,
        },
        theme: {
          color: "#0d9488", // Teal color
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600">
            Secure your spot on this incredible expedition
          </p>
          {isRazorpayConfigured === false && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Demo Mode:</strong> Payment gateway is not configured.
                This will simulate a successful booking.
              </p>
            </div>
          )}
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
                Currency
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-4 py-2 rounded-md border ${
                    currency === "USD"
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  USD
                </button>
                <button
                  onClick={() => setCurrency("INR")}
                  className={`px-4 py-2 rounded-md border ${
                    currency === "INR"
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  INR
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Terms & Conditions
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-1 mr-3 accent-teal-600"
                    required
                    onChange={(e) =>
                      setTermsCon((prev) => ({
                        ...prev,
                        tcs1: e.target.checked,
                      }))
                    }
                  />
                  <span>
                    I agree to the expedition terms and conditions, including
                    cancellation policy
                  </span>
                </label>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-1 mr-3 accent-teal-600"
                    required
                    onChange={(e) =>
                      setTermsCon((prev) => ({
                        ...prev,
                        tcs2: e.target.checked,
                      }))
                    }
                  />{" "}
                  <span>
                    I understand the risks involved in mountaineering and have
                    appropriate insurance
                  </span>
                </label>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-1 mr-3 accent-teal-600"
                    required
                    onChange={(e) =>
                      setTermsCon((prev) => ({
                        ...prev,
                        tcs3: e.target.checked,
                      }))
                    }
                  />{" "}
                  <span>
                    I consent to receive booking confirmations and expedition
                    updates via email
                  </span>
                </label>
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
                    <span className="font-medium">
                      {getSlotDetails()?.date}
                    </span>
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

                <Button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-3 text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CreditCard className="h-5 w-5 mr-2" /> Pay Now
                    </div>
                  )}
                </Button>

                <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    <span>Secure Payment</span>
                  </div>
                  <span>•</span>
                  <span>
                    {isRazorpayConfigured ? "Powered by Razorpay" : "Demo Mode"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
