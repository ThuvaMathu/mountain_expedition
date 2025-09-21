"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Mountain,
  Calendar,
  DollarSign,
  TrendingUp,
  Search,
  Download,
  Filter,
  Trophy,
  Clock,
  MapPin,
  Star,
} from "lucide-react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

interface Booking {
  id: string;
  bookingId: string;
  mountainId: string;
  mountainName?: string;
  amount: number;
  currency: string;
  status: "confirmed" | "pending" | "cancelled";
  participants: number;
  customerInfo: {
    organizer: {
      name: string;
      email: string;
      phone?: string;
    };
    members?: any[];
  };
  slotDetails: {
    date: string;
    time: string;
    id: string;
  } | null;
  createdAt: any;
  userEmail: string;
}

interface MountainEvent {
  id: string;
  name: string;
  location: string;
  imageUrl: string[];
  price: number;
  priceUSD: number;
  difficulty: string;
  duration: string;
  availableDates: Array<{
    date: string;
    slots: Array<{
      id: string;
      time: string;
      maxParticipants: number;
      bookedParticipants: number;
      priceMultiplier: number;
    }>;
  }>;
  bookings: Booking[];
  totalBookings: number;
  totalRevenue: number;
  upcomingSlots: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalUSDRevenue: 0,
    totalINRRevenue: 0,
    activeMountains: 0,
    totalUsers: 0,
    monthlyGrowth: 0,
  });

  const [mountainEvents, setMountainEvents] = useState<MountainEvent[]>([]);
  const [filteredMountainEvents, setFilteredMountainEvents] = useState<
    MountainEvent[]
  >([]);
  const [selectedMountain, setSelectedMountain] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [topMountains, setTopMountains] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!isFirebaseConfigured || !db) {
          console.log("Firebase not configured");
          setLoading(false);
          return;
        }

        // Load bookings
        const bookingsSnap = await getDocs(
          query(collection(db, "bookings"), orderBy("createdAt", "desc"))
        );
        const bookingsList: Booking[] = bookingsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[];

        // Load mountains
        const mountainsSnap = await getDocs(
          query(collection(db, "mountains"), orderBy("createdAt", "desc"))
        );
        const mountainsList = mountainsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Process mountain events with their bookings
        const currentDate = new Date();
        const mountainEventsMap = new Map<string, MountainEvent>();

        // Initialize mountain events
        mountainsList.forEach((mountain: any) => {
          const upcomingDates =
            mountain.availableDates?.filter((dateSlot: any) => {
              return new Date(dateSlot.date) >= currentDate;
            }) || [];

          const upcomingSlots = upcomingDates.reduce(
            (total: number, dateSlot: any) => {
              return total + (dateSlot.slots?.length || 0);
            },
            0
          );

          mountainEventsMap.set(mountain.id, {
            id: mountain.id,
            name: mountain.name || "Unknown Mountain",
            location: mountain.location || "Unknown Location",
            imageUrl: mountain.imageUrl || [],
            price: mountain.price || 0,
            priceUSD: mountain.priceUSD || 0,
            difficulty: mountain.difficulty || "Unknown",
            duration: mountain.duration || "Unknown",
            availableDates: upcomingDates,
            bookings: [],
            totalBookings: 0,
            totalRevenue: 0,
            upcomingSlots,
          });
        });

        // Add bookings to respective mountains
        bookingsList.forEach((booking) => {
          const mountainEvent = mountainEventsMap.get(booking.mountainId);
          if (mountainEvent) {
            mountainEvent.bookings.push(booking);
            mountainEvent.totalBookings++;
            if (booking.status === "confirmed") {
              mountainEvent.totalRevenue += booking.amount || 0;
            }
          }
        });

        const mountainEventsArray = Array.from(mountainEventsMap.values()).sort(
          (a, b) => b.totalRevenue - a.totalRevenue
        );

        setMountainEvents(mountainEventsArray);
        setFilteredMountainEvents(mountainEventsArray);

        // Calculate stats
        const totalUSDRevenue = bookingsList
          .filter((b) => b.status === "confirmed" && b.currency === "USD")
          .reduce((sum, booking) => sum + (booking.amount || 0), 0);
        const totalINRRevenue = bookingsList
          .filter((b) => b.status === "confirmed" && b.currency === "INR")
          .reduce((sum, booking) => sum + (booking.amount || 0), 0);

        const uniqueUsers = new Set(
          bookingsList.map(
            (b) => b.customerInfo?.organizer?.email || b.userEmail
          )
        ).size;

        setStats({
          totalBookings: bookingsList.length,
          totalUSDRevenue,
          totalINRRevenue,
          activeMountains: mountainsList.length,
          totalUsers: uniqueUsers,
          monthlyGrowth: 0, // Calculate based on actual data if needed
        });

        // Set top performing mountains
        const topPerforming = mountainEventsArray
          .filter((m) => m.totalRevenue > 0)
          .slice(0, 4)
          .map((mountain) => ({
            name: mountain.name,
            bookings: mountain.totalBookings,
            revenue: mountain.totalRevenue,
          }));

        setTopMountains(topPerforming);

        // Set most active users
        const userBookingsMap = new Map();
        bookingsList.forEach((booking) => {
          const userEmail =
            booking.customerInfo?.organizer?.email || booking.userEmail;
          const userName =
            booking.customerInfo?.organizer?.name || "Unknown User";

          if (!userBookingsMap.has(userEmail)) {
            userBookingsMap.set(userEmail, {
              name: userName,
              email: userEmail,
              bookings: 0,
              totalSpent: 0,
            });
          }

          const userData = userBookingsMap.get(userEmail);
          userData.bookings++;
          if (booking.status === "confirmed") {
            userData.totalSpent += booking.amount || 0;
          }
        });

        const topUsers = Array.from(userBookingsMap.values())
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 4);

        setActiveUsers(topUsers);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter mountain events based on selected filters
  useEffect(() => {
    let filtered = mountainEvents;

    // Filter by mountain
    if (selectedMountain !== "all") {
      filtered = filtered.filter((me) => me.id === selectedMountain);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (me) =>
          me.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          me.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          me.bookings.some(
            (booking) =>
              booking.customerInfo?.organizer?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              booking.customerInfo?.organizer?.email
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              booking.bookingId
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter bookings within each mountain by status
    if (statusFilter !== "all") {
      filtered = filtered
        .map((me) => ({
          ...me,
          bookings: me.bookings.filter(
            (booking) => booking.status === statusFilter
          ),
        }))
        .filter((me) => me.bookings.length > 0 || statusFilter === "all");
    }

    setFilteredMountainEvents(filtered);
  }, [mountainEvents, selectedMountain, statusFilter, searchTerm]);

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Total INR Revenue",
      value: `${formatCurrency(stats.totalINRRevenue, "INR", true)}`,
      icon: DollarSign,
      color: "bg-green-500",
      change: "+18%",
    },
    {
      title: "Total USD Revenue",
      value: `${formatCurrency(stats.totalUSDRevenue, "USD", true)}`,
      icon: DollarSign,
      color: "bg-green-500",
      change: "+18%",
    },
    {
      title: "Active Mountains",
      value: stats.activeMountains,
      icon: Mountain,
      color: "bg-purple-500",
      change: "+3%",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-orange-500",
      change: "+25%",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-orange-100 text-orange-700";
      case "expert":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const exportBookingsReport = () => {
    const allBookings = mountainEvents.flatMap((me) =>
      me.bookings.map((booking) => ({
        bookingId: booking.bookingId,
        mountain: me.name,
        customer: booking.customerInfo?.organizer?.name || "Unknown",
        email: booking.customerInfo?.organizer?.email || booking.userEmail,
        date: booking.slotDetails?.date || "N/A",
        time: booking.slotDetails?.time || "N/A",
        participants: booking.participants,
        amount: booking.amount,
        status: booking.status,
        currency: booking.currency,
      }))
    );

    if (allBookings.length === 0) {
      alert("No bookings data to export");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(allBookings[0]).join(",") +
      "\n" +
      allBookings.map((row) => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bookings-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportEarningsReport = () => {
    const earningsData = mountainEvents.map((me) => ({
      mountain: me.name,
      totalBookings: me.totalBookings,
      totalRevenue: me.totalRevenue,
      avgBookingValue:
        me.totalBookings > 0
          ? Math.round(me.totalRevenue / me.totalBookings)
          : 0,
      upcomingSlots: me.upcomingSlots,
    }));

    if (earningsData.length === 0) {
      alert("No earnings data to export");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(earningsData[0]).join(",") +
      "\n" +
      earningsData.map((row) => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "earnings-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your mountain
            expeditions.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={exportBookingsReport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Bookings
          </Button>
          <Button onClick={exportEarningsReport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Earnings
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} flex-shrink-0`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            {/* <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{stat.change}</span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div> */}
          </div>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Mountains */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Performing Mountains
            </h2>
            <p className="text-sm text-gray-600">By revenue and bookings</p>
          </div>
          <div className="space-y-4">
            {topMountains.length > 0 ? (
              topMountains.map((mountain, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : index === 2
                          ? "bg-orange-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{mountain.name}</p>
                      <p className="text-sm text-gray-600">
                        {mountain.bookings} bookings
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      ${mountain.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No revenue data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Most Active Users */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Most Active Users
            </h2>
            <p className="text-sm text-gray-600">
              Based on bookings and spending
            </p>
          </div>
          <div className="space-y-4">
            {activeUsers.length > 0 ? (
              activeUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">
                        {user.bookings} bookings
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      ${user.totalSpent.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No user data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Mountain className="h-5 w-5 mr-2 text-teal-600" />
            Upcoming Mountain Events & Bookings
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>

            <select
              value={selectedMountain}
              onChange={(e) => setSelectedMountain(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="all">All Mountains</option>
              {mountainEvents.map((me) => (
                <option key={me.id} value={me.id}>
                  {me.name}
                </option>
              ))}
            </select>

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
          </div>
        </div>
      </div>

      {/* Mountain Events Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredMountainEvents.map((mountainEvent) => (
          <div
            key={mountainEvent.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Mountain Header */}
            <div className="relative">
              {mountainEvent.imageUrl.length > 0 && (
                <img
                  src={mountainEvent.imageUrl[0]}
                  alt={mountainEvent.name}
                  className="w-full h-32 sm:h-40 object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg lg:text-xl font-bold text-white mb-1">
                  {mountainEvent.name}
                </h3>
                <div className="flex flex-wrap gap-2 text-sm text-white/90 mb-2">
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {mountainEvent.location}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {mountainEvent.duration}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      mountainEvent.difficulty
                    )}`}
                  >
                    {mountainEvent.difficulty}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-white/90">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {mountainEvent.totalBookings} bookings
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />$
                    {mountainEvent.totalRevenue.toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <Mountain className="h-4 w-4 mr-1" />
                    {mountainEvent.upcomingSlots} upcoming slots
                  </span>
                </div>
              </div>
            </div>

            {/* Event Details and Bookings */}
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Recent Bookings</h4>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-teal-600">
                    ${mountainEvent.priceUSD || mountainEvent.price}
                  </span>
                  <span className="text-sm text-gray-500">USD</span>
                </div>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {mountainEvent.bookings.slice(0, 10).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900 truncate">
                          {booking.customerInfo?.organizer?.name ||
                            "Unknown Customer"}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-600">
                        {booking.slotDetails && (
                          <>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {booking.slotDetails.date}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {booking.slotDetails.time}
                            </span>
                          </>
                        )}
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {booking.participants} pax
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {booking.customerInfo?.organizer?.email ||
                          booking.userEmail}
                      </p>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <p className="font-semibold text-green-600">
                        ${booking.amount?.toLocaleString() || 0}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.bookingId}
                      </p>
                    </div>
                  </div>
                ))}

                {mountainEvent.bookings.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No bookings found</p>
                  </div>
                )}
              </div>

              {mountainEvent.bookings.length > 10 && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-teal-600 border-teal-600 hover:bg-teal-50 bg-transparent"
                  >
                    View All {mountainEvent.bookings.length} Bookings
                  </Button>
                </div>
              )}

              {/* Upcoming Available Slots */}
              {mountainEvent.availableDates.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h5 className="font-semibold text-gray-900 mb-3">
                    Upcoming Available Dates
                  </h5>
                  <div className="space-y-2">
                    {mountainEvent.availableDates
                      .slice(0, 3)
                      .map((dateSlot, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="font-medium">{dateSlot.date}</span>
                          <span className="text-gray-600">
                            {dateSlot.slots?.length || 0} time slots available
                          </span>
                        </div>
                      ))}
                    {mountainEvent.availableDates.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{mountainEvent.availableDates.length - 3} more dates
                        available
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredMountainEvents.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 lg:p-12 text-center">
          <Mountain className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No mountain events found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedMountain !== "all" || statusFilter !== "all"
              ? "Try adjusting your filters to see more results."
              : "Mountain events will appear here once they are added to the system."}
          </p>
          {(searchTerm ||
            selectedMountain !== "all" ||
            statusFilter !== "all") && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedMountain("all");
                setStatusFilter("all");
              }}
              className="text-teal-600 border-teal-600 hover:bg-teal-50"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
