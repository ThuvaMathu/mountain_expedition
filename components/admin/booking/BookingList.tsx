"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import {
  Calendar,
  Users,
  Mountain,
  Edit3,
  Trash2,
  Mail,
  Phone,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  XCircle,
  MapPin,
  CreditCard,
  User,
  ChevronLeft,
  ChevronRight,
  Tag,
} from "lucide-react";

interface BookingListProps {
  bookings: TBooking[];
  filteredBookings: TBooking[];
  mountains: Map<string, any>;
  onBookingUpdate: (updatedBookings: TBooking[]) => void;
}

const ITEMS_PER_PAGE = 10;

export function BookingList({
  bookings,
  filteredBookings,
  mountains,
  onBookingUpdate,
}: BookingListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBooking, setEditingBooking] = useState<TBooking | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Get unique destinations from filtered bookings for display
  const filteredMountains = Array.from(
    new Map(
      filteredBookings.map((booking) => [
        booking.booking.id,
        {
          id: booking.booking.id,
          name: booking.mountainName,
        },
      ])
    ).values()
  );

  // Pagination logic - use filteredBookings for display
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  // Update booking status
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      if (isFirebaseConfigured && db) {
        await updateDoc(doc(db, "bookings", bookingId), {
          status: newStatus,
        });
      }

      // Update local state - use spread operator to create new array reference
      const updatedBookings = [...bookings].map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      );
      onBookingUpdate(updatedBookings);
      alert("Successfully updated status");
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status");
    }
  };

  // Delete booking
  const deleteBooking = async (bookingId: string, bookingRecordId: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      if (isFirebaseConfigured && db) {
        await deleteDoc(doc(db, "bookings", bookingRecordId));
      }

      // Update local state - create new array
      const updatedBookings = bookings.filter(
        (booking) => booking.id !== bookingRecordId
      );
      onBookingUpdate(updatedBookings);
      alert("Booking deleted successfully");
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    }
  };

  // Edit booking
  const editBooking = (booking: TBooking) => {
    setEditingBooking({ ...booking });
    setShowEditModal(true);
  };

  // Save edited booking
  const saveEditedBooking = async () => {
    if (!editingBooking) return;

    try {
      if (isFirebaseConfigured && db) {
        const { id, ...updateData } = editingBooking;
        await updateDoc(doc(db, "bookings", editingBooking.id!), updateData);
      }

      // Update local state - create new array
      const updatedBookings = [...bookings].map((booking) =>
        booking.id === editingBooking.id ? { ...editingBooking } : booking
      );
      onBookingUpdate(updatedBookings);

      setShowEditModal(false);
      setEditingBooking(null);
      alert("Booking updated successfully");
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking");
    }
  };

  // Get status color and icon
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          color: "bg-green-100 text-green-700 border-green-200",
          icon: CheckCircle,
          textColor: "text-green-600",
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-700 border-yellow-200",
          icon: AlertCircle,
          textColor: "text-yellow-600",
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-700 border-red-200",
          icon: XCircle,
          textColor: "text-red-600",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: AlertCircle,
          textColor: "text-gray-600",
        };
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    return type === "trekking"
      ? "bg-purple-100 text-purple-700 border-purple-200"
      : "bg-orange-100 text-orange-700 border-orange-200";
  };

  // Pagination component
  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to{" "}
          {Math.min(endIndex, filteredBookings.length)} of{" "}
          {filteredBookings.length} bookings
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {startPage > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                className="bg-transparent"
              >
                1
              </Button>
              {startPage > 2 && <span className="text-gray-500">...</span>}
            </>
          )}

          {pageNumbers.map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={
                page === currentPage
                  ? "bg-teal-600 hover:bg-teal-700"
                  : "bg-transparent"
              }
            >
              {page}
            </Button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="text-gray-500">...</span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                className="bg-transparent"
              >
                {totalPages}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
        <p className="text-gray-600 text-sm mt-1">
          Manage individual bookings, update status, and edit details
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="p-8 text-center">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-600">
            Bookings will appear here once customers start making reservations.
          </p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="p-8 text-center">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No bookings match your filters
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters to see more results.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mountain & Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBookings.map((booking) => {
                  const statusDetails = getStatusDetails(booking.status);
                  const StatusIcon = statusDetails.icon;

                  return (
                    <tr key={booking.bookingId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">
                            {booking.bookingId}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(
                                booking.booking.type
                              )}`}
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {booking.booking.type.charAt(0).toUpperCase() +
                                booking.booking.type.slice(1)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Users className="h-3 w-3 mr-1" />
                            {booking.participants} participants
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {booking.slotDetails?.time || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <CreditCard className="h-3 w-3 mr-1" />
                            {booking.paymentMethod}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900 flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {booking.customerInfo.organizer.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {booking.customerInfo.organizer.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {booking.customerInfo.organizer.phone}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {booking.customerInfo.organizer.country}
                          </div>
                          {booking.customerInfo.members.length > 0 && (
                            <div className="text-xs text-blue-600 mt-1">
                              +{booking.customerInfo.members.length} member(s)
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900 flex items-center">
                            <Mountain className="h-3 w-3 mr-1" />
                            {booking.mountainName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {booking.slotDetails?.date || "N/A"}
                          </div>
                          {booking.slotDetails && (
                            <div className="text-xs text-gray-500">
                              {booking.slotDetails.bookedParticipants}/
                              {booking.slotDetails.maxParticipants} booked
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusDetails.color}`}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          ${booking.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.currency}
                        </div>
                        {booking.razorpayPaymentId && (
                          <div className="text-xs text-green-600">Paid</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {/* Status Change Buttons */}
                          {booking.status !== "confirmed" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                updateBookingStatus(booking.id!, "confirmed")
                              }
                              className="bg-green-600 hover:bg-green-700 text-xs"
                            >
                              Confirm
                            </Button>
                          )}
                          {booking.status !== "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateBookingStatus(booking.id!, "pending")
                              }
                              className="text-yellow-600 border-yellow-600 hover:bg-yellow-50 text-xs"
                            >
                              Pending
                            </Button>
                          )}
                          {booking.status !== "cancelled" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateBookingStatus(booking.id!, "cancelled")
                              }
                              className="text-red-600 border-red-600 hover:bg-red-50 text-xs"
                            >
                              Cancel
                            </Button>
                          )}

                          {/* Edit and Delete */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editBooking(booking)}
                            className="bg-transparent text-xs"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              deleteBooking(booking.bookingId!, booking.id!)
                            }
                            className="text-xs"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination />
        </>
      )}

      {/* Edit Modal */}
      {showEditModal && editingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Edit Booking: {editingBooking.bookingId}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Organizer Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Organizer Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <Input
                      value={editingBooking.customerInfo.organizer.name}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          customerInfo: {
                            ...editingBooking.customerInfo,
                            organizer: {
                              ...editingBooking.customerInfo.organizer,
                              name: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={editingBooking.customerInfo.organizer.email}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          customerInfo: {
                            ...editingBooking.customerInfo,
                            organizer: {
                              ...editingBooking.customerInfo.organizer,
                              email: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <Input
                      value={editingBooking.customerInfo.organizer.phone}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          customerInfo: {
                            ...editingBooking.customerInfo,
                            organizer: {
                              ...editingBooking.customerInfo.organizer,
                              phone: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <Input
                      value={editingBooking.customerInfo.organizer.country}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          customerInfo: {
                            ...editingBooking.customerInfo,
                            organizer: {
                              ...editingBooking.customerInfo.organizer,
                              country: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Passport
                    </label>
                    <Input
                      value={editingBooking.customerInfo.organizer.passport}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          customerInfo: {
                            ...editingBooking.customerInfo,
                            organizer: {
                              ...editingBooking.customerInfo.organizer,
                              passport: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact
                    </label>
                    <Input
                      value={
                        editingBooking.customerInfo.organizer.emergencyContact
                      }
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          customerInfo: {
                            ...editingBooking.customerInfo,
                            organizer: {
                              ...editingBooking.customerInfo.organizer,
                              emergencyContact: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medical Information
                    </label>
                    <textarea
                      value={editingBooking.customerInfo.organizer.medicalInfo}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          customerInfo: {
                            ...editingBooking.customerInfo,
                            organizer: {
                              ...editingBooking.customerInfo.organizer,
                              medicalInfo: e.target.value,
                            },
                          },
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Right Column - Booking Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Booking Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={editingBooking.booking.type}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          booking: {
                            ...editingBooking.booking,
                            type: e.target.value as "trekking" | "tour",
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="trekking">Trekking</option>
                      <option value="tour">Tour</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Participants
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={editingBooking.participants}
                        onChange={(e) =>
                          setEditingBooking({
                            ...editingBooking,
                            participants: parseInt(e.target.value) || 1,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <Input
                        type="number"
                        value={editingBooking.amount}
                        onChange={(e) =>
                          setEditingBooking({
                            ...editingBooking,
                            amount: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={editingBooking.status}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Slot Details */}
                  {editingBooking.slotDetails && (
                    <>
                      <h4 className="text-md font-semibold text-gray-900 border-b pb-2 mt-6">
                        Slot Details
                      </h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <Input
                          value={editingBooking.slotDetails.date}
                          onChange={(e) =>
                            setEditingBooking({
                              ...editingBooking,
                              slotDetails: editingBooking.slotDetails
                                ? {
                                    ...editingBooking.slotDetails,
                                    date: e.target.value,
                                  }
                                : null,
                            })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time
                          </label>
                          <Input
                            value={editingBooking.slotDetails.time}
                            onChange={(e) =>
                              setEditingBooking({
                                ...editingBooking,
                                slotDetails: editingBooking.slotDetails
                                  ? {
                                      ...editingBooking.slotDetails,
                                      time: e.target.value,
                                    }
                                  : null,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Participants
                          </label>
                          <Input
                            type="number"
                            value={editingBooking.slotDetails.maxParticipants}
                            onChange={(e) =>
                              setEditingBooking({
                                ...editingBooking,
                                slotDetails: editingBooking.slotDetails
                                  ? {
                                      ...editingBooking.slotDetails,
                                      maxParticipants:
                                        parseInt(e.target.value) || 1,
                                    }
                                  : null,
                              })
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Members List */}
                  {editingBooking.customerInfo.members.length > 0 && (
                    <>
                      <h4 className="text-md font-semibold text-gray-900 border-b pb-2 mt-6">
                        Group Members (
                        {editingBooking.customerInfo.members.length})
                      </h4>

                      <div className="space-y-3 max-h-40 overflow-y-auto">
                        {editingBooking.customerInfo.members.map(
                          (member, index) => (
                            <div
                              key={index}
                              className="p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="font-medium text-gray-900">
                                {member.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {member.email}
                              </div>
                              <div className="text-sm text-gray-600">
                                {member.country}
                              </div>
                              {member.medicalInfo && (
                                <div className="text-xs text-red-600 mt-1">
                                  Medical: {member.medicalInfo}
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </>
                  )}

                  {/* Payment Information */}
                  <h4 className="text-md font-semibold text-gray-900 border-b pb-2 mt-6">
                    Payment Information
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method
                      </label>
                      <Input
                        value={editingBooking.paymentMethod}
                        onChange={(e) =>
                          setEditingBooking({
                            ...editingBooking,
                            paymentMethod: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <Input
                        value={editingBooking.currency}
                        onChange={(e) =>
                          setEditingBooking({
                            ...editingBooking,
                            currency: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Razorpay Order ID
                    </label>
                    <Input
                      value={editingBooking.razorpayOrderId}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          razorpayOrderId: e.target.value,
                        })
                      }
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Razorpay Payment ID
                    </label>
                    <Input
                      value={editingBooking.razorpayPaymentId}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          razorpayPaymentId: e.target.value,
                        })
                      }
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingBooking(null);
                  }}
                  className="bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveEditedBooking}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
