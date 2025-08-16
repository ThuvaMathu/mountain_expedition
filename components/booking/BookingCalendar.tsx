"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Calendar, Users, CreditCard } from "lucide-react"

interface Mountain {
  id: string
  name: string
  price: number
  availableSlots: number
}
interface BookingCalendarProps {
  mountain: Mountain
}

export function BookingCalendar({ mountain }: BookingCalendarProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [participants, setParticipants] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const availableDates = [
    { date: "2025-09-01", slots: 8 },
    { date: "2025-09-15", slots: 12 },
    { date: "2025-10-01", slots: 6 },
    { date: "2025-10-15", slots: 10 },
  ]

  const handleBooking = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    if (!selectedDate) {
      alert("Please select a date")
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      router.push(`/booking/checkout?mountain=${mountain.id}&date=${selectedDate}&participants=${participants}`)
    }, 500)
  }

  const totalPrice = mountain.price * participants

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Calendar className="h-5 w-5 mr-2" /> Select Date
        </h3>
        <div className="space-y-2">
          {availableDates.map((slot) => (
            <button
              key={slot.date}
              onClick={() => setSelectedDate(slot.date)}
              className={`w-full p-3 text-left rounded-lg border transition-colors ${
                selectedDate === slot.date ? "border-teal-600 bg-teal-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {new Date(slot.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-sm text-gray-600">{slot.slots} slots available</div>
                </div>
                {selectedDate === slot.date && <div className="text-teal-600">✓</div>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Users className="h-5 w-5 mr-2" /> Participants
        </h3>
        <select
          value={participants}
          onChange={(e) => setParticipants(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? "person" : "people"}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Base price × {participants}</span>
          <span>${(mountain.price * participants).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Service fee</span>
          <span>${Math.round(totalPrice * 0.05).toLocaleString()}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between items-center font-semibold text-lg">
            <span>Total</span>
            <span>${Math.round(totalPrice * 1.05).toLocaleString()}</span>
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
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>Processing...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <CreditCard className="h-5 w-5 mr-2" /> Book Now
          </div>
        )}
      </Button>
      <p className="text-xs text-gray-500 text-center">You won't be charged until your booking is confirmed</p>
    </div>
  )
}
