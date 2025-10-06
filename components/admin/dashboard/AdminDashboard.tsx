"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Mountain,
  Calendar,
  DollarSign,
  Download,
  Plane,
  Trophy,
  Globe,
} from "lucide-react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

// Import new components
import { StatsGrid } from "./stats/StatsGrid";
import { TopPerformersCard } from "./analytics/TopPerformersCard";
import { CategorySplitCard } from "./analytics/CategorySplitCard";
import { DashboardFilters } from "./filters/DashboardFilters";
import { RecentBookingsList } from "./bookings/RecentBookingsList";

interface FilterState {
  search: string;
  type: string;
  status: string;
  selectedItem: string;
  dateRange: string;
}

export function AdminDashboard() {
  // State management
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalUSDRevenue: 0,
    totalINRRevenue: 0,
    activeMountains: 0,
    activeTours: 0,
    totalUsers: 0,
  });

  const [topMountains, setTopMountains] = useState<any[]>([]);
  const [topTours, setTopTours] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [categorySplit, setCategorySplit] = useState({
    mountains: { bookings: 0, revenue: 0 },
    tours: { bookings: 0, revenue: 0 },
  });

  const [allBookings, setAllBookings] = useState<TBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  const [allItems, setAllItems] = useState<any[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: "all",
    status: "all",
    selectedItem: "all",
    dateRange: "all",
  });

  const [loading, setLoading] = useState(true);

  // Load all data
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
        const bookingsList = bookingsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // const bookingsList = bookingsSnap.docs.map((doc) => ({
        //   id: doc.id,
        //   type: "mountain",
        //   ...doc.data(),
        // }));

        // Load mountains
        const mountainsSnap = await getDocs(collection(db, "mountains"));
        const mountainsList = mountainsSnap.docs.map((doc) => ({
          id: doc.id,
          type: "mountain",
          ...doc.data(),
        }));

        // Load tourist packages
        const toursSnap = await getDocs(collection(db, "tourist-packages"));
        const toursList = toursSnap.docs.map((doc) => ({
          id: doc.id,
          type: "tour",
          ...doc.data(),
        }));

        // Load tour bookings (if separate collection exists)

        // Combine all bookings
        const combinedBookings: TBooking[] = bookingsList as TBooking[];
        setAllBookings(combinedBookings);

        // Combine all items for filter dropdown
        const combinedItems = [
          ...mountainsList.map((m: any) => ({
            id: m.id,
            name: m.name,
            type: "mountain",
          })),
          ...toursList.map((t: any) => ({
            id: t.id,
            name: t.name,
            type: "tour",
          })),
        ];
        setAllItems(combinedItems);

        // Calculate statistics
        calculateStats(
          combinedBookings,
          mountainsList,
          toursList,
          bookingsList as TBooking[]
        );
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate all statistics
  const calculateStats = (
    combinedBookings: any[],
    mountainsList: any[],
    toursList: any[],
    bookingList: TBooking[]
  ) => {
    // Total bookings
    const totalBookings = combinedBookings.length;

    // Calculate revenue by currency
    const totalUSDRevenue = combinedBookings
      .filter((b) => b.status === "confirmed" && b.currency === "USD")
      .reduce((sum, b) => sum + (b.amount || 0), 0);

    const totalINRRevenue = combinedBookings
      .filter((b) => b.status === "confirmed" && b.currency === "INR")
      .reduce((sum, b) => sum + (b.amount || 0), 0);

    // Unique users
    const uniqueUsers = new Set(
      combinedBookings.map(
        (b) => b.customerInfo?.organizer?.email || b.userEmail
      )
    ).size;

    setStats({
      totalBookings,
      totalUSDRevenue,
      totalINRRevenue,
      activeMountains: mountainsList.length,
      activeTours: toursList.length,
      totalUsers: uniqueUsers,
    });

    // Calculate category split
    const mountainBookingList = bookingList.filter(
      (b) => b.status === "confirmed" && b.booking.type === "trekking"
    );

    const tourBookingList = bookingList.filter(
      (b) => b.status === "confirmed" && b.booking.type === "tour"
    );

    const mountainRevenue = mountainBookingList.reduce(
      (sum, b) => sum + (b.amount || 0),
      0
    );

    const tourRevenue = tourBookingList.reduce(
      (sum, b) => sum + (b.amount || 0),
      0
    );

    setCategorySplit({
      mountains: {
        bookings: mountainBookingList.length,
        revenue: mountainRevenue,
      },
      tours: {
        bookings: tourBookingList.length,
        revenue: tourRevenue,
      },
    });

    // Calculate top performers
    calculateTopPerformers(mountainsList, toursList, combinedBookings);

    // Calculate most active users
    calculateActiveUsers(combinedBookings);
  };

  // Calculate top performing mountains and tours
  const calculateTopPerformers = (
    mountainsList: any[],
    toursList: any[],
    bookings: any[]
  ) => {
    // Group bookings by mountain/tour
    const mountainStats = new Map();
    const tourStats = new Map();

    bookings.forEach((booking) => {
      const bookingType = booking.booking?.type;
      const itemId = booking.booking?.id;

      // For trekking bookings
      if (bookingType === "trekking" && itemId) {
        if (!mountainStats.has(itemId)) {
          mountainStats.set(itemId, {
            name: booking.mountainName || "Unknown",
            bookings: 0,
            revenue: 0,
          });
        }
        const stats = mountainStats.get(itemId);
        stats.bookings++;
        if (booking.status === "confirmed") {
          stats.revenue += booking.amount || 0;
        }
      }
      // For tour bookings
      else if (bookingType === "tour" && itemId) {
        if (!tourStats.has(itemId)) {
          tourStats.set(itemId, {
            name: booking.mountainName || "Unknown",
            bookings: 0,
            revenue: 0,
          });
        }
        const stats = tourStats.get(itemId);
        stats.bookings++;
        if (booking.status === "confirmed") {
          stats.revenue += booking.amount || 0;
        }
      }
    });

    // Sort and get top 4
    const topMountains = Array.from(mountainStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4);

    const topTours = Array.from(tourStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4);

    setTopMountains(topMountains);
    setTopTours(topTours);
  };

  // Calculate most active users
  const calculateActiveUsers = (bookings: any[]) => {
    const userMap = new Map();

    bookings.forEach((booking) => {
      const email = booking.customerInfo?.organizer?.email || booking.userEmail;
      const name = booking.customerInfo?.organizer?.name || "Unknown User";

      if (!userMap.has(email)) {
        userMap.set(email, { name, email, bookings: 0, revenue: 0 });
      }

      const user = userMap.get(email);
      user.bookings++;
      if (booking.status === "confirmed") {
        user.revenue += booking.amount || 0;
      }
    });

    const topUsers = Array.from(userMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4);

    setActiveUsers(topUsers);
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...allBookings];

    // Type filter
    if (filters.type !== "all") {
      filtered = filtered.filter((b) => {
        if (filters.type === "mountains") return b.booking.type === "trekking";
        if (filters.type === "tour") return b.booking.type === "tour";
        return true;
      });
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((b) => b.status === filters.status);
    }

    // Item filter
    if (filters.selectedItem !== "all") {
      filtered = filtered.filter((b) => b.booking?.id === filters.selectedItem);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.bookingId?.toLowerCase().includes(searchLower) ||
          b.mountainName?.toLowerCase().includes(searchLower) ||
          b.booking.type?.toLowerCase().includes(searchLower) ||
          b.customerInfo?.organizer?.name
            ?.toLowerCase()
            .includes(searchLower) ||
          b.customerInfo?.organizer?.email?.toLowerCase().includes(searchLower)
      );
    }

    // Date filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      filtered = filtered.filter((b) => {
        if (!b.slotDetails?.date) return false;
        const bookingDate = new Date(b.slotDetails.date);

        switch (filters.dateRange) {
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
          default:
            return true;
        }
      });
    }

    setFilteredBookings(filtered);
  }, [allBookings, filters]);

  // Export functions
  const exportBookingsReport = () => {
    if (allBookings.length === 0) {
      alert("No bookings data to export");
      return;
    }

    const csvData = allBookings.map((b: any) => ({
      bookingId: b.bookingId,
      type:
        b.booking?.type === "trekking" ? "Mountain Trekking" : "Tour Package",
      item: b.mountainName,
      customer: b.customerInfo?.organizer?.name || "Unknown",
      email: b.customerInfo?.organizer?.email || b.userEmail,
      date: b.slotDetails?.date || "N/A",
      participants: b.participants,
      amount: b.amount,
      currency: b.currency,
      status: b.status,
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(csvData[0]).join(",") +
      "\n" +
      csvData.map((row) => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `bookings-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats cards configuration
  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "Revenue (INR)",
      value: formatCurrency(stats.totalINRRevenue, "INR", true),
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Revenue (USD)",
      value: formatCurrency(stats.totalUSDRevenue, "USD", true),
      icon: DollarSign,
      color: "bg-green-600",
    },
    {
      title: "Mountains",
      value: stats.activeMountains,
      icon: Mountain,
      color: "bg-purple-500",
    },
    {
      title: "Tour Packages",
      value: stats.activeTours,
      icon: Plane,
      color: "bg-blue-600",
    },
  ];

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
            Overview of mountains, tours, and bookings.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={exportBookingsReport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={statCards} />

      {/* Analytics Grid (2x2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Mountains */}
        <TopPerformersCard
          title="Top Performing Mountains"
          icon={Trophy}
          items={topMountains}
          emptyIcon={Mountain}
          emptyMessage="No mountain data available"
        />

        {/* Top Tours */}
        <TopPerformersCard
          title="Top Performing Tours"
          icon={Globe}
          items={topTours}
          emptyIcon={Plane}
          emptyMessage="No tour data available"
        />

        {/* Most Active Users */}
        <TopPerformersCard
          title="Most Active Users"
          icon={Users}
          items={activeUsers}
          emptyIcon={Users}
          emptyMessage="No user data available"
        />

        {/* Category Split */}
        <CategorySplitCard
          mountainData={categorySplit.mountains}
          tourData={categorySplit.tours}
        />
      </div>

      {/* Filters */}
      <DashboardFilters
        filters={filters}
        onFilterChange={setFilters}
        items={allItems}
      />

      {/* Recent Bookings */}
      <RecentBookingsList bookings={filteredBookings} loading={loading} />
    </div>
  );
}
