"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Calendar, Users, CreditCard, Clock } from "lucide-react";
import { useCurrencyStore } from "@/stores/currency-store";
import { formatCurrency } from "@/lib/utils";
import { getSlotAvailability, shouldShowSlot } from "@/lib/utils/slot-utils";

interface BookingCalendarProps {
  mountain: TMountainType;
}

export function BookingCalendar({ mountain: product }: BookingCalendarProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [participants, setParticipants] = useState("1 person");
  const [isLoading, setIsLoading] = useState(false);
  const { loadCurrency, formatedValue, getCurrencyValue, currency } =
    useCurrencyStore();

  const getMaxParticipants = (): string[] => {
    // Flatten all slots across all dates
    const allSlots = product.availableDates.flatMap((date) => date.slots);

    // Find the slot by ID
    const slot = allSlots.find((s) => s.id === selectedDate) || null;

    // Calculate remaining spots
    const remaining = slot
      ? slot.maxParticipants - slot.bookedParticipants
      : 10;

    // Return array of strings
    return Array.from(
      { length: remaining },
      (_, i) => `${i + 1} ${i + 1 === 1 ? "person" : "people"}`
    );
  };
  const handleBooking = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const maxP = getMaxParticipants().length;
      router.push(
        `/booking/checkout?id=${product.id}&type=${
          product.type
        }&slot_id=${selectedDate}&participants=${
          participants.split(" ")[0]
        }&max=${maxP}`
      );
    }, 100);
  };
  const participantCount = Number(participants.split(" ")[0]);
  const totalParticipantPrice = getCurrencyValue()! * participantCount;
  // Note: Base price already includes all fees (GST, taxes, processing charges)
  // No additional service fee calculation needed
  const totalPrice = totalParticipantPrice;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Calendar className="h-5 w-5 mr-2" /> Select Date
        </h3>
        <div className="space-y-2">
          {product.availableDates.map((slot) => {
            // Check if date is in the past
            const isPastDate = new Date(slot.date) < new Date();

            return (
              <div
                key={slot.date}
                className={`w-full p-2 text-left rounded-lg border transition-colors ${
                  isPastDate
                    ? "border-gray-200 bg-gray-100 opacity-60"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`font-medium flex items-center gap-2 ${isPastDate ? "text-gray-400" : ""}`}>
                  {new Date(slot.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {isPastDate && (
                    <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded">(Past Date)</span>
                  )}
                </div>
              {slot.slots.map((timeSlot) => {
                // Get availability status for this slot
                const availability = getSlotAvailability(
                  timeSlot.bookedParticipants,
                  timeSlot.maxParticipants
                );

                // Don't show fully booked slots
                if (!shouldShowSlot(timeSlot.bookedParticipants, timeSlot.maxParticipants)) {
                  return null;
                }

                // Disable slot if date is in the past or slot is full
                const isSlotDisabled = isPastDate || availability.status === "full";

                return (
                  <div key={timeSlot.id} className="my-1">
                    <button
                      onClick={() => !isPastDate && setSelectedDate(timeSlot.id)}
                      disabled={isSlotDisabled}
                      className={`w-full p-3 text-left rounded-lg border transition-colors ${
                        selectedDate === timeSlot.id && !isPastDate
                          ? "border-teal-600 bg-teal-50"
                          : "border-gray-200 hover:border-gray-300"
                      } ${isSlotDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex w-full justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <div className="font-medium text-gray-900">
                            {timeSlot.time}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Availability Badge */}
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${availability.bgColor} ${availability.textColor}`}>
                            <span className={`h-2 w-2 rounded-full bg-${availability.color}-500 mr-1`}></span>
                            {availability.label}
                          </div>

                          {selectedDate === timeSlot.id && (
                            <div className="text-teal-600">✓</div>
                          )}
                        </div>
                      </div>

                      {/* Spots info and progress bar */}
                      <div className="mt-2 text-xs text-gray-600">
                        <div className="flex justify-between mb-1">
                          <span>{availability.available} spots left</span>
                          <span>{availability.booked} already booked</span>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              availability.status === "available" ? "bg-green-500" :
                              availability.status === "limited" ? "bg-yellow-500" :
                              availability.status === "nearly-full" ? "bg-orange-500" :
                              "bg-red-500"
                            }`}
                            style={{ width: `${(availability.booked / availability.max) * 100}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Users className="h-5 w-5 mr-2" /> Participants
        </h3>
        <select
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {getMaxParticipants().map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Base price × {participantCount}</span>
          <span>{formatCurrency(totalParticipantPrice, currency)}</span>
        </div>

        {/* Currency-specific tax/fee clarification note */}
        {currency === "INR" && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2 mb-2">
            <p className="text-xs text-blue-800">
              <span className="font-semibold">Note:</span> Base price already includes all applicable fees, GST (18%), and payment processing charges.
            </p>
          </div>
        )}

        {currency === "USD" && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2 mb-2">
            <p className="text-xs text-blue-800">
              <span className="font-semibold">Note:</span> Base price already includes all fees, taxes, and payment processing charges.
            </p>
          </div>
        )}

        {/* Service fee line temporarily hidden per requirements
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Service fee</span>
          <span>{formatCurrency(serviceFee, currency)}</span>
        </div>
        */}

        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between items-center font-semibold text-lg">
            <span>Total</span>
            <span>{formatCurrency(totalPrice, currency)}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={handleBooking}
        disabled={!selectedDate || isLoading}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 text-lg"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <CreditCard className="h-5 w-5 mr-2" /> Book Now
          </div>
        )}
      </Button>
      <p className="text-xs text-gray-500 text-center">
        You won't be charged until your booking is confirmed
      </p>
    </div>
  );
}
