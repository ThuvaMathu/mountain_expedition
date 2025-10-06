"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Calendar, Users, CreditCard, Clock } from "lucide-react";
import { useCurrencyStore } from "@/stores/currency-store";
import { serviceFeeCal } from "@/lib/service-fee-cal";
import { formatCurrency } from "@/lib/utils";

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
        `/booking/checkout?mountain=${
          product.id
        }&slot_id=${selectedDate}&participants=${
          participants.split(" ")[0]
        }&max=${maxP}`
      );
    }, 100);
  };
  const participantCount = Number(participants.split(" ")[0]);
  const totalParticipantPrice = getCurrencyValue()! * participantCount;
  const serviceFee = serviceFeeCal(currency, totalParticipantPrice);
  const totalPrice = getCurrencyValue()! * participantCount + serviceFee;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Calendar className="h-5 w-5 mr-2" /> Select Date
        </h3>
        <div className="space-y-2">
          {product.availableDates.map((slot) => (
            <div
              key={slot.date}
              className={`w-full p-2 text-left rounded-lg border transition-colors 
                      border-gray-200 hover:border-gray-300
                    `}
            >
              <div className="font-medium">
                {new Date(slot.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {slot.slots.map((timeSlot) => (
                <div key={timeSlot.id} className="my-1">
                  <button
                    key={slot.date}
                    onClick={() => setSelectedDate(timeSlot.id)}
                    className={`w-full flex justify-between items-center p-3 text-left rounded-lg border transition-colors ${
                      selectedDate === timeSlot.id
                        ? "border-teal-600 bg-teal-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex w-full justify-between items-center">
                      <div>
                        <div className="text-sm w-full flex justify-between items-center text-gray-600">
                          <Clock className="h-4 w-4  text-gray-600" />
                          <div className="font-medium ml-2 text-gray-900">
                            {" "}
                            {timeSlot.time}
                          </div>
                        </div>
                      </div>
                      <div>|</div>
                      <div>
                        <div className="text-sm text-gray-600">
                          {timeSlot.maxParticipants -
                            timeSlot.bookedParticipants}{" "}
                          spots available
                        </div>
                      </div>
                    </div>
                    <div className=" w-8 flex justify-end items-center">
                      {" "}
                      {selectedDate === timeSlot.id && (
                        <div className="text-teal-600">✓</div>
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          ))}
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
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Service fee</span>
          <span>{formatCurrency(serviceFee, currency)}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between items-center font-semibold text-lg">
            <span>Total</span>
            <span>{formatCurrency(totalPrice)}</span>
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
