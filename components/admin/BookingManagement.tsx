"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"list" | "export">("list");

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

  // Handle booking updates from child components
  const handleBookingUpdate = (updatedBookings: TBooking[]) => {
    setBookings(updatedBookings);
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
            Manage all expedition bookings, update status, export data, and
            handle customer requests.
          </p>
        </div>

        {/* Tab Navigation */}
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

      {/* Filters - Only show when on booking list tab */}
      {activeTab === "list" && (
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
      )}

      {/* Content based on active tab */}
      {activeTab === "list" ? (
        <BookingList
          bookings={filteredBookings}
          mountains={mountains}
          onBookingUpdate={handleBookingUpdate}
        />
      ) : (
        <BookingExport bookings={bookings} mountains={mountains} />
      )}
    </div>
  );
}
