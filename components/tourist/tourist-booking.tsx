"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCurrencyStore } from "@/stores/currency-store";

interface TouristBookingProps {
  tourist: TMountainType; // Reusing TMountainType for tourist packages
  category: "domestic" | "international";
}

export function TouristBooking({ tourist, category }: TouristBookingProps) {
  const { currency } = useCurrencyStore();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [participants, setParticipants] = useState<number>(1);
  const [bookingStep, setBookingStep] = useState<
    "calendar" | "details" | "payment"
  >("calendar");

  // Booking form data
  const [bookingData, setBookingData] = useState({
    leadName: "",
    email: "",
    phone: "",
    nationality: category === "domestic" ? "Indian" : "",
    specialRequests: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const selectedDateData = tourist.availableDates?.find(
    (d) => d.date === selectedDate
  );
  const selectedSlotData = selectedDateData?.slots.find(
    (s) => s.id === selectedSlot
  );
  const availableSpots = selectedSlotData
    ? selectedSlotData.maxParticipants - selectedSlotData.bookedParticipants
    : 0;

  const totalPrice =
    participants * (currency === "USD" ? tourist.priceUSD : tourist.priceINR);

  const handleInputChange = (field: string, value: string) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingSubmit = async () => {
    // Here you would integrate with your booking system
    console.log("Booking submitted:", {
      tourist: tourist.id,
      date: selectedDate,
      slot: selectedSlot,
      participants,
      bookingData,
      totalPrice,
    });

    // Show success message or redirect
    alert("Booking request submitted successfully! We'll contact you shortly.");
  };

  if (bookingStep === "calendar") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Select Date & Time
          </h3>
          <p className="text-gray-600">
            Choose your preferred date and time slot
          </p>
        </div>

        {/* Available Dates */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Available Dates
          </label>
          <div className="grid gap-2 max-h-60 overflow-y-auto">
            {tourist.availableDates?.map((dateOption) => (
              <button
                key={dateOption.date}
                onClick={() => {
                  setSelectedDate(dateOption.date);
                  setSelectedSlot("");
                }}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  selectedDate === dateOption.date
                    ? "border-teal-600 bg-teal-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-teal-600" />
                    <span className="font-medium">
                      {new Date(dateOption.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {dateOption.slots.length} time slots
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots for Selected Date */}
        {selectedDate && selectedDateData && (
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">
              Available Time Slots
            </label>
            <div className="grid gap-2">
              {selectedDateData.slots.map((slot) => {
                const available =
                  slot.maxParticipants - slot.bookedParticipants;
                const isAvailable = available > 0;

                return (
                  <button
                    key={slot.id}
                    onClick={() => isAvailable && setSelectedSlot(slot.id)}
                    disabled={!isAvailable}
                    className={`p-3 text-left border rounded-lg transition-colors ${
                      selectedSlot === slot.id
                        ? "border-teal-600 bg-teal-50"
                        : isAvailable
                        ? "border-gray-200 hover:border-gray-300"
                        : "border-gray-200 bg-gray-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-teal-600" />
                        <span className="font-medium">{slot.time}</span>
                      </div>
                      <div className="text-sm">
                        {isAvailable ? (
                          <span className="text-green-600">
                            {available} spots available
                          </span>
                        ) : (
                          <span className="text-red-600">Fully booked</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Participants */}
        {selectedSlot && (
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">
              Number of Participants
            </label>
            <div className="flex items-center space-x-4">
              <Users className="h-5 w-5 text-teal-600" />
              <Input
                type="number"
                min="1"
                max={Math.min(availableSpots, 10)}
                value={participants}
                onChange={(e) => setParticipants(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-600">
                (Max {availableSpots} available)
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Price:</span>
                <span className="text-xl font-bold text-teal-600">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        )}

        {selectedSlot && (
          <Button
            onClick={() => setBookingStep("details")}
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            Continue to Details
          </Button>
        )}
      </div>
    );
  }

  if (bookingStep === "details") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Booking Details
          </h3>
          <p className="text-gray-600">Please provide your information</p>
        </div>

        {/* Booking Summary */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-teal-600" />
            <span className="text-sm">
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-teal-600" />
            <span className="text-sm">{selectedSlotData?.time}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-teal-600" />
            <span className="text-sm">{participants} participants</span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="leadName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lead Traveler Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="leadName"
                  value={bookingData.leadName}
                  onChange={(e) =>
                    handleInputChange("leadName", e.target.value)
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="phone"
                  value={bookingData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="nationality"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nationality
              </label>
              <Input
                id="nationality"
                value={bookingData.nationality}
                onChange={(e) =>
                  handleInputChange("nationality", e.target.value)
                }
                placeholder={
                  category === "domestic" ? "Indian" : "Your nationality"
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="emergencyContact"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Emergency Contact Name
              </label>
              <Input
                id="emergencyContact"
                value={bookingData.emergencyContact}
                onChange={(e) =>
                  handleInputChange("emergencyContact", e.target.value)
                }
              />
            </div>

            <div>
              <label
                htmlFor="emergencyPhone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Emergency Contact Phone
              </label>
              <Input
                id="emergencyPhone"
                value={bookingData.emergencyPhone}
                onChange={(e) =>
                  handleInputChange("emergencyPhone", e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="specialRequests"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Special Requests
            </label>
            <Textarea
              id="specialRequests"
              value={bookingData.specialRequests}
              onChange={(e) =>
                handleInputChange("specialRequests", e.target.value)
              }
              placeholder="Any dietary restrictions, accessibility needs, or special requests..."
              rows={3}
            />
          </div>
        </div>

        {/* Total */}
        <div className="bg-teal-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total Amount:</span>
            <span className="text-2xl font-bold text-teal-600">
              {formatCurrency(totalPrice)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => setBookingStep("calendar")}
            className="flex-1"
          >
            Back to Calendar
          </Button>
          <Button
            onClick={handleBookingSubmit}
            className="flex-1 bg-teal-600 hover:bg-teal-700"
            disabled={
              !bookingData.leadName || !bookingData.email || !bookingData.phone
            }
          >
            Confirm Booking
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
