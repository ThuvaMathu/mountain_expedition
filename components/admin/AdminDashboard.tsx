"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Mountain,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  Search,
  Download,
  Filter,
  BarChart3,
  Trophy,
  LucidePieChart as RechartsPieChart,
  Pi as Pie,
  Bell as Cell,
} from "lucide-react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar } from "recharts"
//import { subDays } from "date-fns"

interface Booking {
  id: string;
  bookingId: string;
  mountainId: string;
  mountainName?: string;
  date: string;
  timeSlot: string;
  participants: number;
  amount: number;
  currency: string;
  status: "confirmed" | "pending" | "cancelled";
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: any;
}

interface MountainBookings {
  mountainId: string;
  mountainName: string;
  mountainImage?: string;
  totalBookings: number;
  totalRevenue: number;
  bookings: Booking[];
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeMountains: 0,
    totalUsers: 0,
    monthlyGrowth: 0,
  });

  const [mountainBookings, setMountainBookings] = useState<MountainBookings[]>(
    []
  );
  const [filteredMountainBookings, setFilteredMountainBookings] = useState<
    MountainBookings[]
  >([]);
  const [selectedMountain, setSelectedMountain] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // const [dateRange, setDateRange] = useState<DateRange>({
  //   from: subDays(new Date(), 30),
  //   to: new Date(),
  // })
  const [dateFilter, setDateFilter] = useState<
    "daily" | "weekly" | "monthly" | "custom"
  >("monthly");
  const [bookingTrends, setBookingTrends] = useState<any[]>([]);
  const [topMountains, setTopMountains] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [bookingStatusRatio, setBookingStatusRatio] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isFirebaseConfigured && db) {
          // Load bookings
          const bookingsSnap = await getDocs(
            query(collection(db, "bookings"), orderBy("createdAt", "desc"))
          );
          const bookingsList: Booking[] = bookingsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Booking[];

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

          // Group bookings by mountain
          const mountainBookingsMap = new Map<string, MountainBookings>();

          bookingsList.forEach((booking) => {
            const mountain = mountainsMap.get(booking.mountainId);
            const mountainName =
              mountain?.name ||
              booking.mountainName ||
              `Mountain ${booking.mountainId}`;

            if (!mountainBookingsMap.has(booking.mountainId)) {
              mountainBookingsMap.set(booking.mountainId, {
                mountainId: booking.mountainId,
                mountainName,
                mountainImage: mountain?.imageUrl,
                totalBookings: 0,
                totalRevenue: 0,
                bookings: [],
              });
            }

            const mountainBooking = mountainBookingsMap.get(
              booking.mountainId
            )!;
            mountainBooking.bookings.push(booking);
            mountainBooking.totalBookings++;
            if (booking.status === "confirmed") {
              mountainBooking.totalRevenue += booking.amount;
            }
          });

          const mountainBookingsArray = Array.from(
            mountainBookingsMap.values()
          ).sort((a, b) => b.totalRevenue - a.totalRevenue);

          setMountainBookings(mountainBookingsArray);
          setFilteredMountainBookings(mountainBookingsArray);

          // Calculate stats
          const totalRevenue = bookingsList
            .filter((b) => b.status === "confirmed")
            .reduce((sum, booking) => sum + booking.amount, 0);

          setStats({
            totalBookings: bookingsList.length,
            totalRevenue,
            activeMountains: mountainsSnap.docs.length,
            totalUsers: new Set(bookingsList.map((b) => b.customerInfo.email))
              .size,
            monthlyGrowth: 12.5, // Mock data
          });
        } else {
          // Demo data
          const demoMountainBookings: MountainBookings[] = [
            {
              mountainId: "1",
              mountainName: "Mount Everest",
              mountainImage: "/mount-everest-summit.png",
              totalBookings: 8,
              totalRevenue: 520000,
              bookings: [
                {
                  id: "1",
                  bookingId: "BK001",
                  mountainId: "1",
                  mountainName: "Mount Everest",
                  date: "2024-05-15",
                  timeSlot: "04:00",
                  participants: 1,
                  amount: 65000,
                  currency: "USD",
                  status: "confirmed",
                  customerInfo: {
                    name: "John Doe",
                    email: "john@example.com",
                    phone: "+1234567890",
                  },
                  createdAt: new Date("2024-01-15"),
                },
                {
                  id: "2",
                  bookingId: "BK003",
                  mountainId: "1",
                  mountainName: "Mount Everest",
                  date: "2024-05-20",
                  timeSlot: "05:00",
                  participants: 2,
                  amount: 130000,
                  currency: "USD",
                  status: "confirmed",
                  customerInfo: {
                    name: "Alice Johnson",
                    email: "alice@example.com",
                    phone: "+1234567891",
                  },
                  createdAt: new Date("2024-01-16"),
                },
                {
                  id: "3",
                  bookingId: "BK005",
                  mountainId: "1",
                  mountainName: "Mount Everest",
                  date: "2024-06-01",
                  timeSlot: "04:00",
                  participants: 1,
                  amount: 65000,
                  currency: "USD",
                  status: "pending",
                  customerInfo: {
                    name: "Mike Wilson",
                    email: "mike@example.com",
                  },
                  createdAt: new Date("2024-01-18"),
                },
              ],
            },
            {
              mountainId: "2",
              mountainName: "Kilimanjaro",
              mountainImage: "/mount-kilimanjaro-acacia.png",
              totalBookings: 12,
              totalRevenue: 42000,
              bookings: [
                {
                  id: "4",
                  bookingId: "BK002",
                  mountainId: "2",
                  mountainName: "Kilimanjaro",
                  date: "2024-03-20",
                  timeSlot: "06:00",
                  participants: 2,
                  amount: 7000,
                  currency: "USD",
                  status: "confirmed",
                  customerInfo: {
                    name: "Jane Smith",
                    email: "jane@example.com",
                    phone: "+1234567892",
                  },
                  createdAt: new Date("2024-01-14"),
                },
                {
                  id: "5",
                  bookingId: "BK004",
                  mountainId: "2",
                  mountainName: "Kilimanjaro",
                  date: "2024-04-15",
                  timeSlot: "08:00",
                  participants: 3,
                  amount: 10500,
                  currency: "USD",
                  status: "confirmed",
                  customerInfo: {
                    name: "Robert Brown",
                    email: "robert@example.com",
                  },
                  createdAt: new Date("2024-01-17"),
                },
              ],
            },
            {
              mountainId: "3",
              mountainName: "Denali",
              mountainImage: "/denali-snowy-peak.png",
              totalBookings: 5,
              totalRevenue: 42500,
              bookings: [
                {
                  id: "6",
                  bookingId: "BK006",
                  mountainId: "3",
                  mountainName: "Denali",
                  date: "2024-07-10",
                  timeSlot: "05:00",
                  participants: 1,
                  amount: 8500,
                  currency: "USD",
                  status: "confirmed",
                  customerInfo: {
                    name: "Sarah Davis",
                    email: "sarah@example.com",
                    phone: "+1234567893",
                  },
                  createdAt: new Date("2024-01-19"),
                },
              ],
            },
          ];

          setMountainBookings(demoMountainBookings);
          setFilteredMountainBookings(demoMountainBookings);
          setStats({
            totalBookings: 25,
            totalRevenue: 604500,
            activeMountains: 8,
            totalUsers: 18,
            monthlyGrowth: 12.5,
          });

          setTopMountains([
            { name: "Mount Everest", bookings: 8, revenue: 520000 },
            { name: "Denali", bookings: 5, revenue: 42500 },
            { name: "Kilimanjaro", bookings: 12, revenue: 42000 },
            { name: "Mont Blanc", bookings: 6, revenue: 18000 },
          ]);

          setActiveUsers([
            { name: "John Doe", bookings: 3, totalSpent: 195000 },
            { name: "Alice Johnson", bookings: 2, totalSpent: 130000 },
            { name: "Sarah Davis", bookings: 2, totalSpent: 17000 },
            { name: "Robert Brown", bookings: 1, totalSpent: 10500 },
          ]);

          setBookingTrends([
            { month: "Jan", bookings: 4, revenue: 120000 },
            { month: "Feb", bookings: 6, revenue: 180000 },
            { month: "Mar", bookings: 8, revenue: 240000 },
            { month: "Apr", bookings: 5, revenue: 150000 },
            { month: "May", bookings: 12, revenue: 360000 },
            { month: "Jun", bookings: 10, revenue: 300000 },
          ]);

          setBookingStatusRatio([
            { name: "Confirmed", value: 18, color: "#10B981" },
            { name: "Pending", value: 5, color: "#F59E0B" },
            { name: "Cancelled", value: 2, color: "#EF4444" },
          ]);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter bookings based on selected filters
  useEffect(() => {
    let filtered = mountainBookings;

    // Filter by mountain
    if (selectedMountain !== "all") {
      filtered = filtered.filter((mb) => mb.mountainId === selectedMountain);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (mb) =>
          mb.mountainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mb.bookings.some(
            (booking) =>
              booking.customerInfo.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              booking.customerInfo.email
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter bookings within each mountain by status
    if (statusFilter !== "all") {
      filtered = filtered
        .map((mb) => ({
          ...mb,
          bookings: mb.bookings.filter(
            (booking) => booking.status === statusFilter
          ),
        }))
        .filter((mb) => mb.bookings.length > 0);
    }

    setFilteredMountainBookings(filtered);
  }, [mountainBookings, selectedMountain, statusFilter, searchTerm]);

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Total Revenue",
      value: `$${(stats.totalRevenue / 1000000).toFixed(1)}M`,
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

  const exportToCSV = (data: any[], filename: string) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(data[0]).join(",") +
      "\n" +
      data.map((row) => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportBookingsReport = () => {
    const allBookings = mountainBookings.flatMap((mb) =>
      mb.bookings.map((booking) => ({
        bookingId: booking.bookingId,
        mountain: mb.mountainName,
        customer: booking.customerInfo.name,
        email: booking.customerInfo.email,
        date: booking.date,
        participants: booking.participants,
        amount: booking.amount,
        status: booking.status,
      }))
    );
    exportToCSV(allBookings, "bookings-report");
  };

  const exportEarningsReport = () => {
    const earningsData = mountainBookings.map((mb) => ({
      mountain: mb.mountainName,
      totalBookings: mb.totalBookings,
      totalRevenue: mb.totalRevenue,
      avgBookingValue: Math.round(mb.totalRevenue / mb.totalBookings),
    }));
    exportToCSV(earningsData, "earnings-report");
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your expeditions.
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

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Date Range
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full lg:w-48"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom Range</option>
          </select>

          {dateFilter === "custom" && (
            <div className="flex gap-2">
              <input
                type="date"
                //value={dateRange.from?.toISOString().split("T")[0] || ""}
                //onChange={(e) => setDateRange((prev) => ({ ...prev, from: new Date(e.target.value) }))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <input
                type="date"
                // value={dateRange.to?.toISOString().split("T")[0] || ""}
                //onChange={(e) => setDateRange((prev) => ({ ...prev, to: new Date(e.target.value) }))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-1">
                    vs last month
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.color} flex-shrink-0`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

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
            {topMountains.map((mountain, index) => (
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
            ))}
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
            {activeUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
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
            ))}
          </div>
        </div>
      </div>

      {/* Booking Trends Graph */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Booking Trends
          </h2>
          <p className="text-sm text-gray-600">
            Monthly booking and revenue trends
          </p>
        </div>
        <div className="h-80">
          {/* <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bookingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="bookings" fill="#3B82F6" name="Bookings" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={3}
                name="Revenue ($)"
              />
            </LineChart>
          </ResponsiveContainer> */}
        </div>
      </div>

      {/* Booking Status Ratio */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <RechartsPieChart className="h-5 w-5 text-green-500" />
            Booking Status Distribution
          </h2>
          <p className="text-sm text-gray-600">
            Pending vs Confirmed vs Cancelled bookings
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="h-64 w-64">
            {/* <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={bookingStatusRatio}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bookingStatusRatio.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer> */}
          </div>
          <div className="space-y-3">
            {bookingStatusRatio.map((status, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <span className="font-medium">{status.name}</span>
                <span className="text-gray-600">({status.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Mountain className="h-5 w-5 mr-2 text-teal-600" />
            Mountain Bookings
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
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
              {mountainBookings.map((mb) => (
                <option key={mb.mountainId} value={mb.mountainId}>
                  {mb.mountainName}
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

      {/* Mountain Bookings Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredMountainBookings.map((mountainBooking) => (
          <div
            key={mountainBooking.mountainId}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Mountain Header */}
            <div className="relative">
              {mountainBooking.mountainImage && (
                <img
                  src={mountainBooking.mountainImage || "/placeholder.svg"}
                  alt={mountainBooking.mountainName}
                  className="w-full h-32 sm:h-40 object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg lg:text-xl font-bold text-white mb-1">
                  {mountainBooking.mountainName}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-white/90">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {mountainBooking.totalBookings} bookings
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />$
                    {mountainBooking.totalRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Recent Bookings</h4>
                <span className="text-sm text-gray-500">
                  {mountainBooking.bookings.length} booking
                  {mountainBooking.bookings.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {mountainBooking.bookings.slice(0, 10).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900 truncate">
                          {booking.customerInfo.name}
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
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(booking.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <span className="h-3 w-3 mr-1">🕐</span>
                          {booking.timeSlot}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {booking.participants} pax
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {booking.customerInfo.email}
                      </p>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <p className="font-semibold text-green-600">
                        ${booking.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.bookingId}
                      </p>
                    </div>
                  </div>
                ))}

                {mountainBooking.bookings.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No bookings found</p>
                  </div>
                )}
              </div>

              {mountainBooking.bookings.length > 10 && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-teal-600 border-teal-600 hover:bg-teal-50 bg-transparent"
                  >
                    View All {mountainBooking.bookings.length} Bookings
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredMountainBookings.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 lg:p-12 text-center">
          <Mountain className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedMountain !== "all" || statusFilter !== "all"
              ? "Try adjusting your filters to see more results."
              : "Bookings will appear here once customers start making reservations."}
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

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button className="text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <div className="flex items-center">
              <Mountain className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
              <span className="font-medium text-blue-900">
                Add New Mountain
              </span>
            </div>
          </button>
          <button className="text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
              <span className="font-medium text-green-900">
                Manage Bookings
              </span>
            </div>
          </button>
          <button className="text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0" />
              <span className="font-medium text-purple-900">
                Create Blog Post
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
