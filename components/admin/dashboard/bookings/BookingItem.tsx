import {
  Calendar,
  Users,
  Clock,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { BookingTypeBadge } from "./BookingTypeBadge";

interface BookingItemProps {
  booking: any;
  type: "trekking" | "tour";
  category?: "domestic" | "international";
}

export function BookingItem({ booking, type }: BookingItemProps) {
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          color: "bg-green-100 text-green-700 border-green-200",
          icon: CheckCircle,
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-700 border-yellow-200",
          icon: AlertCircle,
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-700 border-red-200",
          icon: XCircle,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: AlertCircle,
        };
    }
  };

  const statusDetails = getStatusDetails(booking.status);
  const StatusIcon = statusDetails.icon;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
      <div className="flex-1 min-w-0">
        {/* Header with Badge and Status */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <BookingTypeBadge type={type} />
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusDetails.color}`}
          >
            <StatusIcon className="h-3 w-3 mr-1" />
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* Customer Info */}
          <div className="space-y-1">
            <p className="font-medium text-gray-900 truncate">
              {booking.customerInfo?.organizer?.name || "Unknown Customer"}
            </p>
            <p className="text-xs text-gray-500 flex items-center truncate">
              <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
              {booking.customerInfo?.organizer?.email || booking.userEmail}
            </p>
            {booking.customerInfo?.organizer?.phone && (
              <p className="text-xs text-gray-500 flex items-center">
                <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                {booking.customerInfo.organizer.phone}
              </p>
            )}
          </div>

          {/* Booking Info */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {booking.mountainName || booking.tourName}
            </p>
            {booking.slotDetails && (
              <>
                <p className="text-xs text-gray-600 flex items-center">
                  <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                  {booking.slotDetails.date}
                </p>
                <p className="text-xs text-gray-600 flex items-center">
                  <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                  {booking.slotDetails.time}
                </p>
              </>
            )}
            <p className="text-xs text-gray-600 flex items-center">
              <Users className="h-3 w-3 mr-1 flex-shrink-0" />
              {booking.participants} participant
              {booking.participants !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Location & Amount */}
          <div className="space-y-1">
            {booking.customerInfo?.organizer?.country && (
              <p className="text-xs text-gray-600 flex items-center">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                {booking.customerInfo.organizer.country}
              </p>
            )}
            <p className="text-sm font-semibold text-green-600">
              ${booking.amount?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-gray-500">{booking.currency}</p>
            <p className="text-xs text-gray-400 font-mono">
              {booking.bookingId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
