"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";
import {
  Calendar,
  Users,
  Mountain,
  Search,
  Filter,
  Edit3,
  Trash2,
  Mail,
  Phone,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  MapPin,
  CreditCard,
  User,
} from "lucide-react";

export function BookingManagement() {
  const [bookings, setBookings] = useState<TBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<TBooking[]>([]);
  const [mountains, setMountains] = useState<Map<string, any>>(new Map());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [mountainFilter, setMountainFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<TBooking | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load bookings and mountains from Firebase
  const loadData = async () => {
    try {
      if (isFirebaseConfigured && db) {
        // Load bookings
        const bookingsQuery = query(
          collection(db, "bookings"),
          orderBy("createdAt", "desc")
        );
        const bookingsSnap = await getDocs(bookingsQuery);
        const bookingsList: TBooking[] = bookingsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as any;

        // Load mountains
        const mountainsSnap = await getDocs(collection(db, "mountains"));
        const mountainsMap = new Map();
        mountainsSnap.docs.forEach((doc) => {
          const mountain = doc.data();
          mountainsMap.set(doc.id, {
            id: doc.id,
            name: mountain.name,
            imageUrl: mountain.imageUrl,
          });
        });

        setBookings(bookingsList);
        setMountains(mountainsMap);
      } else {
        console.error("Error loading bookings from firebase database");
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter bookings based on search and filters
  useEffect(() => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.customerInfo.organizer.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.customerInfo.organizer.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.mountainName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.customerInfo.organizer.country
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Mountain filter
    if (mountainFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.mountainId === mountainFilter
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();

      filtered = filtered.filter((booking) => {
        if (!booking.slotDetails?.date) return false;

        // Parse the date from "15 May 2024" format
        const bookingDate = new Date(booking.slotDetails.date);

        switch (dateFilter) {
          case "today":
            return bookingDate.toDateString() === now.toDateString();
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return bookingDate >= weekAgo;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return bookingDate >= monthAgo;
          case "upcoming":
            return bookingDate >= now;
          case "past":
            return bookingDate < now;
          default:
            return true;
        }
      });
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, mountainFilter, dateFilter]);

  // Update booking status
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    console.log("Update Booking status");
    try {
      if (isFirebaseConfigured && db) {
        await updateDoc(doc(db, "bookings", bookingId), {
          status: newStatus,
        });
        alert("successfully status updated");
      }

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status");
    }
  };

  // Delete booking
  const deleteBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      if (isFirebaseConfigured && db) {
        await deleteDoc(doc(db, "bookings", bookingId));
      }

      // Update local state
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
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
        const { bookingId, ...updateData } = editingBooking;
        await updateDoc(
          doc(db, "bookings", editingBooking.bookingId!),
          updateData
        );
      }

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.bookingId === editingBooking.bookingId
            ? editingBooking
            : booking
        )
      );

      setShowEditModal(false);
      setEditingBooking(null);
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking");
    }
  };

  // Export bookings
  const exportBookings = () => {
    const csvContent = [
      "Booking ID,Mountain,Organizer,Email,Country,Phone,Participants,Date,Time,Amount,Status,Created",
      ...filteredBookings.map((booking) =>
        [
          booking.bookingId,
          booking.mountainName,
          booking.customerInfo.organizer.name,
          booking.customerInfo.organizer.email,
          booking.customerInfo.organizer.country,
          booking.customerInfo.organizer.phone,
          booking.participants,
          booking.slotDetails?.date || "N/A",
          booking.slotDetails?.time || "N/A",
          booking.amount,
          booking.status,
          new Date(booking.createdAt).toLocaleDateString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Booking Management
          </h1>
          <p className="text-gray-600">
            Manage all expedition bookings, update status, and handle customer
            requests.
          </p>
        </div>
        <Button
          onClick={exportBookings}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Bookings
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Bookings
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {bookings.length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">
                {bookings.filter((b) => b.status === "confirmed").length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {bookings.filter((b) => b.status === "pending").length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-teal-600">
                $
                {bookings
                  .filter((b) => b.status === "confirmed")
                  .reduce((sum, b) => sum + b.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-teal-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-teal-600" />
            Filter Bookings
          </h2>
          <div className="text-sm text-gray-600">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Mountain Filter */}
          <select
            value={mountainFilter}
            onChange={(e) => setMountainFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="all">All Mountains</option>
            {Array.from(mountains.values()).map((mountain) => (
              <option key={mountain.id} value={mountain.id}>
                {mountain.name}
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>

          {/* Clear Filters */}
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setMountainFilter("all");
              setDateFilter("all");
            }}
            className="bg-transparent"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Booking Details
          </h2>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600">
              {searchTerm ||
              statusFilter !== "all" ||
              mountainFilter !== "all" ||
              dateFilter !== "all"
                ? "Try adjusting your filters to see more results."
                : "Bookings will appear here once customers start making reservations."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Details
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
                {filteredBookings.map((booking) => {
                  const statusDetails = getStatusDetails(booking.status);
                  const StatusIcon = statusDetails.icon;

                  return (
                    <tr key={booking.bookingId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">
                            {booking.bookingId}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
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
                            onClick={() => deleteBooking(booking.bookingId!)}
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
        )}
      </div>

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
