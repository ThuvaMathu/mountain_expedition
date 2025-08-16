"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Calendar, Mountain, DollarSign, User } from "lucide-react"
import { db, isFirebaseConfigured } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"

interface Booking {
  id: string
  bookingId?: string
  mountainId: string
  date: string
  participants: number
  amount: number
  currency?: string
  status: string
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!user) return
      try {
        if (isFirebaseConfigured && db) {
          const q = query(collection(db, "bookings"), where("customerInfo.email", "==", user.email))
          const snap = await getDocs(q)
          const list: Booking[] = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as any)
          setBookings(list)
        } else {
          // Demo data
          setBookings([])
        }
      } catch (e) {
        console.error(e)
        setBookings([])
      } finally {
        setIsLoading(false)
      }
    }
    if (!loading) load()
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-16 w-16 rounded-full border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Please sign in to view your dashboard</h1>
          <Link href="/auth/login">
            <Button className="bg-teal-600 hover:bg-teal-700">Sign in</Button>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const hasBookings = bookings.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.displayName || "Explorer"}</h1>
          <p className="text-gray-600">Manage your expeditions and profile.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-teal-600"></div>
          </div>
        ) : hasBookings ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Bookings</h2>
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-teal-100">
                      <Mountain className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{b.bookingId || b.id}</div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" /> {new Date(b.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mt-3 md:mt-0">
                    <div className="text-sm text-gray-700 flex items-center">
                      <User className="h-4 w-4 mr-1" /> {b.participants}
                    </div>
                    <div className="text-sm text-gray-700 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />{" "}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: (b.currency || "USD") as any,
                      }).format(b.amount)}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${b.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {b.status}
                    </span>
                    <Link href={`/booking/confirmation/${b.bookingId || b.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
                    {user.displayName || "Not set"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">{user.email}</div>
                </div>
              </div>
              <p className="text-gray-600 mt-6">
                You don’t have any bookings yet. Start your adventure by exploring our expeditions.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to climb?</h3>
                <p className="text-gray-600">Discover world-class expeditions tailored to your experience level.</p>
              </div>
              <Link href="/mountains" className="mt-6">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">Explore Mountains</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
