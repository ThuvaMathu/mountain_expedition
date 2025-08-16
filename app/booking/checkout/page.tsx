"use client"

import { useState, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { CreditCard, Shield, User, Calendar, Mountain } from "lucide-react"
import { getStripe } from "@/lib/stripe-client"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [currency, setCurrency] = useState<"USD" | "INR">("USD")
  const [bookingDetails] = useState({
    mountainId: searchParams.get("mountain") || "",
    date: searchParams.get("date") || "",
    participants: Number.parseInt(searchParams.get("participants") || "1"),
  })

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    emergencyContact: "",
    medicalInfo: "",
  })

  const isStripeConfigured = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

  // Mock mountain data - in real app, fetch from Firebase
  const mountain = useMemo(
    () => ({
      id: bookingDetails.mountainId || "1",
      name: "Mount Everest",
      priceUSD: 65000,
      priceINR: 65000 * 83, // naive conversion example
      image: "/placeholder.svg?height=200&width=300",
    }),
    [bookingDetails.mountainId],
  )

  const unitPrice = currency === "USD" ? mountain.priceUSD : mountain.priceINR
  const basePrice = unitPrice * bookingDetails.participants
  const serviceFee = Math.round(basePrice * 0.05)
  const totalAmount = basePrice + serviceFee

  const format = (amt: number) => new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amt)

  const handlePayment = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.emergencyContact) {
      alert("Please fill in all required fields")
      return
    }
    setIsLoading(true)

    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          currency,
          mountainId: mountain.id,
          mountainName: mountain.name,
          date: bookingDetails.date,
          participants: bookingDetails.participants,
          customerInfo,
        }),
      })
      const data = await res.json()

      // Demo fallback if Stripe not configured
      if (!isStripeConfigured || data.demo) {
        router.push(`/booking/confirmation/${data.bookingId}`)
        return
      }

      const stripe = await getStripe()
      if (!stripe) {
        alert("Stripe is not available. Please try again later.")
        return
      }
      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId })
      if (error) alert(error.message || "Payment failed. Please try again.")
    } catch (e) {
      console.error(e)
      alert("Payment failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">Secure your spot on this incredible expedition</p>
          {!isStripeConfigured && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Demo Mode:</strong> Payment gateway is not configured. This will simulate a successful booking.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" /> Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <Input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <Input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <Input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact *</label>
                  <Input
                    type="tel"
                    value={customerInfo.emergencyContact}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, emergencyContact: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Information (Optional)</label>
                <textarea
                  value={customerInfo.medicalInfo}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, medicalInfo: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Any medical conditions, allergies, or special requirements..."
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Currency</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-4 py-2 rounded-md border ${currency === "USD" ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                >
                  USD
                </button>
                <button
                  onClick={() => setCurrency("INR")}
                  className={`px-4 py-2 rounded-md border ${currency === "INR" ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                >
                  INR
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Terms & Conditions</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3" required />
                  <span>I agree to the expedition terms and conditions, including cancellation policy</span>
                </label>
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3" required />
                  <span>I understand the risks involved in mountaineering and have appropriate insurance</span>
                </label>
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3" required />
                  <span>I consent to receive booking confirmations and expedition updates via email</span>
                </label>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>

                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={mountain.image || "/placeholder.svg"}
                    alt={mountain.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{mountain.name}</h3>
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
                      {bookingDetails.date ? new Date(bookingDetails.date).toLocaleDateString() : "Not selected"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <User className="h-4 w-4 mr-1" />
                      <span>Participants</span>
                    </div>
                    <span className="font-medium">{bookingDetails.participants}</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base price × {bookingDetails.participants}</span>
                    <span>{format(unitPrice * bookingDetails.participants)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service fee</span>
                    <span>{format(serviceFee)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{format(totalAmount)}</span>
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
                  <span>{isStripeConfigured ? "Powered by Stripe" : "Demo Mode"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
