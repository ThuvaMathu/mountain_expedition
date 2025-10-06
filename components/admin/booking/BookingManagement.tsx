"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import {
  Calendar,
  Users,
  Search,
  Filter,
  DollarSign,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileDown,
  List,
  Mountain,
  MapPin,
} from "lucide-react";
import { BookingExport } from "./BookingExport";
import { BookingList } from "./BookingList";

export function BookingManagement() {
  const [bookings, setBookings] = useState<TBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<TBooking[]>([]);
  const [mountains, setMountains] = useState<Map<string, any>>(new Map());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [mountainFilter, setMountainFilter] = useState<string>("all");
  const [productType, setProductType] = useState<"trekking" | "tour">(
    "trekking"
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"list" | "export">("list");

  const loadData = async () => {
    try {
      if (isFirebaseConfigured && db) {
        const bookingsQuery = query(
          collection(db, "bookings"),
          orderBy("createdAt", "desc")
        );
        const bookingsSnap = await getDocs(bookingsQuery);
        const bookingsList: TBooking[] = bookingsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as any;

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

  useEffect(() => {
    let filtered = bookings;

    // Product type filter
    filtered = filtered.filter(
      (booking) => booking.booking.type === productType
    );

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

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    if (mountainFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.booking.id === mountainFilter
      );
    }

    if (dateFilter !== "all") {
      const now = new Date();

      filtered = filtered.filter((booking) => {
        if (!booking.slotDetails?.date) return false;

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
  }, [
    bookings,
    searchTerm,
    statusFilter,
    mountainFilter,
    dateFilter,
    productType,
  ]);

  const handleBookingUpdate = (updatedBookings: TBooking[]) => {
    setBookings(updatedBookings);
  };

  // Calculate stats based on product type
  const currentTypeBookings = bookings.filter(
    (b) => b.booking.type === productType
  );
  const totalBookings = currentTypeBookings.length;
  const trekkingCount = bookings.filter(
    (b) => b.booking.type === "trekking"
  ).length;
  const tourCount = bookings.filter((b) => b.booking.type === "tour").length;

  const confirmedBookings = currentTypeBookings.filter(
    (b) => b.status === "confirmed"
  );
  const totalRevenueUSD = confirmedBookings.reduce(
    (sum, b) => sum + b.amount,
    0
  );
  const totalRevenueINR = totalRevenueUSD * 83; // Approximate conversion rate

  const confirmedCount = confirmedBookings.length;
  const pendingCount = currentTypeBookings.filter(
    (b) => b.status === "pending"
  ).length;
  const cancelledCount = currentTypeBookings.filter(
    (b) => b.status === "cancelled"
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Product Type Tabs */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Booking Management
            </h1>
            <p className="text-gray-600">
              Manage all expedition bookings, update status, export data, and
              handle customer requests.
            </p>
          </div>

          {/* List/Export Tab */}
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
            <Button
              onClick={() => setActiveTab("list")}
              className={`${
                activeTab === "list"
                  ? "bg-white shadow-sm text-teal-600"
                  : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
              size="sm"
            >
              <List className="h-4 w-4 mr-2" />
              Booking List
            </Button>
            <Button
              onClick={() => setActiveTab("export")}
              className={`${
                activeTab === "export"
                  ? "bg-white shadow-sm text-teal-600"
                  : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
              size="sm"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Product Type Tabs */}
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg w-fit">
          <Button
            onClick={() => setProductType("trekking")}
            className={`${
              productType === "trekking"
                ? "bg-white shadow-sm text-purple-600"
                : "bg-transparent text-gray-600 hover:text-gray-900"
            }`}
            size="sm"
          >
            <Mountain className="h-4 w-4 mr-2" />
            Mountains
          </Button>
          <Button
            onClick={() => setProductType("tour")}
            className={`${
              productType === "tour"
                ? "bg-white shadow-sm text-orange-600"
                : "bg-transparent text-gray-600 hover:text-gray-900"
            }`}
            size="sm"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Tours & Travels
          </Button>
        </div>
      </div>

      {/* Stats Cards - 2 Rows */}
      <div className="space-y-4">
        {/* Row 1: Revenue & Bookings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalBookings}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Mountains: {trekkingCount} | Tours: {tourCount}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Revenue (USD)
                </p>
                <p className="text-2xl font-bold text-teal-600">
                  ${totalRevenueUSD.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-teal-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Revenue (INR)
                </p>
                <p className="text-2xl font-bold text-teal-600">
                  ₹{totalRevenueINR.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-teal-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-lg font-bold text-gray-900">
                  ${totalRevenueUSD.toLocaleString()}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  ₹{totalRevenueINR.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Row 2: Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {confirmedCount}
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
                  {pendingCount}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">
                  {cancelledCount}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {activeTab === "list" && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="h-5 w-5 mr-2 text-teal-600" />
              Filter Bookings
            </h2>
            <div className="text-sm text-gray-600">
              Showing {filteredBookings.length} of {totalBookings} bookings
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

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

            <select
              value={mountainFilter}
              onChange={(e) => setMountainFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="all">All Destinations</option>
              {Array.from(
                new Map(
                  currentTypeBookings.map((booking) => [
                    booking.booking.id,
                    {
                      id: booking.booking.id,
                      name: booking.mountainName,
                    },
                  ])
                ).values()
              ).map((mountain) => (
                <option key={mountain.id} value={mountain.id}>
                  {mountain.name}
                </option>
              ))}
            </select>

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
      )}

      {/* Content */}
      {activeTab === "list" ? (
        <BookingList
          bookings={bookings}
          filteredBookings={filteredBookings}
          mountains={mountains}
          onBookingUpdate={handleBookingUpdate}
        />
      ) : (
        <BookingExport
          bookings={currentTypeBookings}
          mountains={mountains}
          productType={productType}
        />
      )}
    </div>
  );
}
