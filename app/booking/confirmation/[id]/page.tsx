"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // adjust path
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Download,
  Mail,
  Calendar,
  Mountain,
  User,
  MapPin,
} from "lucide-react";

export default function BookingConfirmationPage() {
  const params = useParams();
  const [booking, setBooking] = useState<TBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!params.id || !db) return;
        if (!searchParams.get("type")) return;
        const type = searchParams.get("type");
        const docRef = doc(db, "bookings", params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBooking({ id: docSnap.id, ...docSnap.data() } as TBooking);
        } else {
          setBooking(null);
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking confirmation...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Booking Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The booking confirmation you're looking for doesn't exist.
          </p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: booking.currency,
    }).format(n);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Your expedition booking has been successfully confirmed.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Booking Details
            </h2>
            <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mountain className="h-5 w-5 text-teal-600 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Expedition
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {booking.mountainName}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-teal-600 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Expedition Date
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {booking.slotDetails?.date}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-teal-600 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Participants
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {booking.participants} person(s)
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-teal-600 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Booking ID
                  </p>
                  <p className="text-lg font-semibold text-gray-900 font-mono">
                    {booking.bookingId}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-teal-600 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {booking.customerInfo.organizer.name}
                  </p>
                  <p className="text-sm text-gray-600">{booking.userEmail}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Total Amount Paid
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {fmt(booking.amount)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="flex items-center">
            <Download className="h-5 w-5 mr-2" /> Download Receipt
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex items-center bg-transparent"
          >
            <Mail className="h-5 w-5 mr-2" /> Contact Support
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              View My Bookings
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-2">
            Questions about your booking? We're here to help!
          </p>
          <p className="text-gray-900 font-semibold">
            Email: support@summitquest.com | Phone: +1 (555) 123-4567
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
