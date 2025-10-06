import { Calendar } from "lucide-react";
import { BookingItem } from "./BookingItem";

interface Booking {
  id: string;
  booking: {
    id: string;
    type: "trekking" | "tour";
  };
  amount: number;
  bookingId: string;
  createdAt: string;
  currency: string;
  customerInfo: any;
  slotDetails: any;
  mountainName: string;
  participants: number;
  paymentMethod: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  status: "confirmed" | "pending" | "cancelled";
  userEmail: string;
  category?: "domestic" | "international";
}

interface RecentBookingsListProps {
  bookings: TBooking[];
  loading: boolean;
}

export function RecentBookingsList({
  bookings,
  loading,
}: RecentBookingsListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-teal-600" />
          Recent Bookings
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-teal-600" />
          Recent Bookings
        </h2>
        <span className="text-sm text-gray-600">
          Last {Math.min(bookings.length, 10)} bookings
        </span>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-3">
          {bookings.slice(0, 10).map((booking) => (
            <BookingItem
              key={booking.id}
              booking={booking}
              type={booking.booking?.type || "trekking"}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No bookings found</p>
          <p className="text-sm">
            Bookings will appear here once customers start making reservations.
          </p>
        </div>
      )}
    </div>
  );
}
