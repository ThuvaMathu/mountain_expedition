"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  Filter,
  FileSpreadsheet,
  Users,
  Mountain,
  Calendar,
  Search,
  CheckSquare,
} from "lucide-react";

interface BookingExportProps {
  bookings: TBooking[];
  mountains: Map<string, any>;
}

export function BookingExport({ bookings, mountains }: BookingExportProps) {
  const [exportFilters, setExportFilters] = useState({
    searchTerm: "",
    statusFilter: "all",
    mountainFilter: "all",
    dateFilter: "all",
    includeMembers: true,
    includePaymentInfo: true,
    includeContactInfo: true,
    includeMedicalInfo: false,
  });

  // Filter bookings based on export filters
  const getFilteredBookingsForExport = () => {
    let filtered = bookings;

    // Search filter
    if (exportFilters.searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.bookingId
            .toLowerCase()
            .includes(exportFilters.searchTerm.toLowerCase()) ||
          booking.customerInfo.organizer.name
            .toLowerCase()
            .includes(exportFilters.searchTerm.toLowerCase()) ||
          booking.customerInfo.organizer.email
            .toLowerCase()
            .includes(exportFilters.searchTerm.toLowerCase()) ||
          booking.mountainName
            .toLowerCase()
            .includes(exportFilters.searchTerm.toLowerCase()) ||
          booking.customerInfo.organizer.country
            .toLowerCase()
            .includes(exportFilters.searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (exportFilters.statusFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.status === exportFilters.statusFilter
      );
    }

    // Mountain filter
    if (exportFilters.mountainFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.mountainId === exportFilters.mountainFilter
      );
    }

    // Date filter
    if (exportFilters.dateFilter !== "all") {
      const now = new Date();

      filtered = filtered.filter((booking) => {
        if (!booking.slotDetails?.date) return false;

        const bookingDate = new Date(booking.slotDetails.date);

        switch (exportFilters.dateFilter) {
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

    return filtered;
  };

  // Export basic bookings summary
  const exportBasicSummary = () => {
    const filtered = getFilteredBookingsForExport();

    let headers = [
      "Booking ID",
      "Mountain",
      "Organizer Name",
      "Email",
      "Country",
      "Participants",
      "Date",
      "Time",
      "Status",
      "Amount",
      "Currency",
      "Created Date",
    ];

    if (exportFilters.includeContactInfo) {
      headers.splice(5, 0, "Phone", "Emergency Contact");
    }

    if (exportFilters.includePaymentInfo) {
      headers.push(
        "Payment Method",
        "Razorpay Order ID",
        "Razorpay Payment ID"
      );
    }

    const csvContent = [
      headers.join(","),
      ...filtered.map((booking) => {
        let row = [
          booking.bookingId,
          booking.mountainName,
          `"${booking.customerInfo.organizer.name}"`,
          booking.customerInfo.organizer.email,
          booking.customerInfo.organizer.country,
          booking.participants,
          booking.slotDetails?.date || "N/A",
          booking.slotDetails?.time || "N/A",
          booking.status,
          booking.amount,
          booking.currency,
          new Date(booking.createdAt).toLocaleDateString(),
        ];

        if (exportFilters.includeContactInfo) {
          row.splice(
            5,
            0,
            booking.customerInfo.organizer.phone,
            `"${booking.customerInfo.organizer.emergencyContact}"`
          );
        }

        if (exportFilters.includePaymentInfo) {
          row.push(
            booking.paymentMethod,
            booking.razorpayOrderId,
            booking.razorpayPaymentId
          );
        }

        return row.join(",");
      }),
    ].join("\n");

    downloadCSV(
      csvContent,
      `bookings-summary-${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  // Export detailed participants list including members
  const exportDetailedParticipants = () => {
    const filtered = getFilteredBookingsForExport();

    let headers = [
      "Booking ID",
      "Mountain",
      "Date",
      "Participant Type",
      "Name",
      "Email",
      "Country",
      "Passport",
      "Phone",
      "Emergency Contact",
      "Amount (Per Booking)",
      "Status",
    ];

    if (exportFilters.includeMedicalInfo) {
      headers.push("Medical Information");
    }

    const rows: string[] = [];

    filtered.forEach((booking) => {
      // Add organizer
      let organizerRow = [
        booking.bookingId,
        booking.mountainName,
        booking.slotDetails?.date || "N/A",
        "Organizer",
        `"${booking.customerInfo.organizer.name}"`,
        booking.customerInfo.organizer.email,
        booking.customerInfo.organizer.country,
        booking.customerInfo.organizer.passport,
        booking.customerInfo.organizer.phone,
        `"${booking.customerInfo.organizer.emergencyContact}"`,
        booking.amount,
        booking.status,
      ];

      if (exportFilters.includeMedicalInfo) {
        organizerRow.push(`"${booking.customerInfo.organizer.medicalInfo}"`);
      }

      rows.push(organizerRow.join(","));

      // Add members if include members is enabled
      if (exportFilters.includeMembers && booking.customerInfo.members) {
        booking.customerInfo.members.forEach((member) => {
          let memberRow = [
            booking.bookingId,
            booking.mountainName,
            booking.slotDetails?.date || "N/A",
            "Member",
            `"${member.name}"`,
            member.email,
            member.country,
            member.passport,
            member.phone,
            `"${member.emergencyContact}"`,
            "0", // Members don't have separate amounts
            booking.status,
          ];

          if (exportFilters.includeMedicalInfo) {
            memberRow.push(`"${member.medicalInfo || ""}"`);
          }

          rows.push(memberRow.join(","));
        });
      }
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    downloadCSV(
      csvContent,
      `detailed-participants-${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  // Export mountain-wise summary
  const exportMountainSummary = () => {
    const filtered = getFilteredBookingsForExport();

    // Group by mountain
    const mountainStats = new Map();

    filtered.forEach((booking) => {
      const mountainId = booking.mountainId;
      if (!mountainStats.has(mountainId)) {
        mountainStats.set(mountainId, {
          mountainName: booking.mountainName,
          totalBookings: 0,
          totalParticipants: 0,
          totalRevenue: 0,
          confirmedBookings: 0,
          pendingBookings: 0,
          cancelledBookings: 0,
          upcomingTrips: 0,
        });
      }

      const stats = mountainStats.get(mountainId);
      stats.totalBookings++;
      stats.totalParticipants += booking.participants;
      if (booking.status === "confirmed") {
        stats.totalRevenue += booking.amount;
        stats.confirmedBookings++;
      } else if (booking.status === "pending") {
        stats.pendingBookings++;
      } else if (booking.status === "cancelled") {
        stats.cancelledBookings++;
      }

      // Check if upcoming
      if (booking.slotDetails?.date) {
        const bookingDate = new Date(booking.slotDetails.date);
        if (bookingDate >= new Date()) {
          stats.upcomingTrips++;
        }
      }
    });

    const headers = [
      "Mountain Name",
      "Total Bookings",
      "Total Participants",
      "Total Revenue (USD)",
      "Confirmed Bookings",
      "Pending Bookings",
      "Cancelled Bookings",
      "Upcoming Trips",
    ];

    const csvContent = [
      headers.join(","),
      ...Array.from(mountainStats.values()).map((stats: any) =>
        [
          `"${stats.mountainName}"`,
          stats.totalBookings,
          stats.totalParticipants,
          stats.totalRevenue,
          stats.confirmedBookings,
          stats.pendingBookings,
          stats.cancelledBookings,
          stats.upcomingTrips,
        ].join(",")
      ),
    ].join("\n");

    downloadCSV(
      csvContent,
      `mountain-summary-${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  // Export financial summary
  const exportFinancialSummary = () => {
    const filtered = getFilteredBookingsForExport();

    const monthlyStats = new Map();

    filtered.forEach((booking) => {
      if (booking.status === "confirmed") {
        const date = new Date(booking.createdAt);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        if (!monthlyStats.has(monthKey)) {
          monthlyStats.set(monthKey, {
            month: monthKey,
            totalRevenue: 0,
            totalBookings: 0,
            totalParticipants: 0,
            averageBookingValue: 0,
          });
        }

        const stats = monthlyStats.get(monthKey);
        stats.totalRevenue += booking.amount;
        stats.totalBookings++;
        stats.totalParticipants += booking.participants;
        stats.averageBookingValue = stats.totalRevenue / stats.totalBookings;
      }
    });

    const headers = [
      "Month",
      "Total Revenue (USD)",
      "Total Bookings",
      "Total Participants",
      "Average Booking Value (USD)",
    ];

    const csvContent = [
      headers.join(","),
      ...Array.from(monthlyStats.values())
        .sort((a: any, b: any) => a.month.localeCompare(b.month))
        .map((stats: any) =>
          [
            stats.month,
            stats.totalRevenue.toFixed(2),
            stats.totalBookings,
            stats.totalParticipants,
            stats.averageBookingValue.toFixed(2),
          ].join(",")
        ),
    ].join("\n");

    downloadCSV(
      csvContent,
      `financial-summary-${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  // Helper function to download CSV
  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredCount = getFilteredBookingsForExport().length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FileSpreadsheet className="h-5 w-5 mr-2 text-teal-600" />
            Export Bookings
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Configure filters and export booking data in various formats
          </p>
        </div>
        <div className="text-sm text-gray-600">
          {filteredCount} booking(s) match current filters
        </div>
      </div>

      {/* Export Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search bookings..."
            value={exportFilters.searchTerm}
            onChange={(e) =>
              setExportFilters({ ...exportFilters, searchTerm: e.target.value })
            }
            className="pl-10"
          />
        </div>

        <select
          value={exportFilters.statusFilter}
          onChange={(e) =>
            setExportFilters({ ...exportFilters, statusFilter: e.target.value })
          }
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={exportFilters.mountainFilter}
          onChange={(e) =>
            setExportFilters({
              ...exportFilters,
              mountainFilter: e.target.value,
            })
          }
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="all">All Mountains</option>
          {Array.from(mountains.values()).map((mountain) => (
            <option key={mountain.id} value={mountain.id}>
              {mountain.name}
            </option>
          ))}
        </select>

        <select
          value={exportFilters.dateFilter}
          onChange={(e) =>
            setExportFilters({ ...exportFilters, dateFilter: e.target.value })
          }
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900">
            Include in Export:
          </h3>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={exportFilters.includeMembers}
              onChange={(e) =>
                setExportFilters({
                  ...exportFilters,
                  includeMembers: e.target.checked,
                })
              }
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <span className="ml-2 text-sm text-gray-700">Group Members</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={exportFilters.includeContactInfo}
              onChange={(e) =>
                setExportFilters({
                  ...exportFilters,
                  includeContactInfo: e.target.checked,
                })
              }
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Contact Information
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={exportFilters.includePaymentInfo}
              onChange={(e) =>
                setExportFilters({
                  ...exportFilters,
                  includePaymentInfo: e.target.checked,
                })
              }
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <span className="ml-2 text-sm text-gray-700">Payment Details</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={exportFilters.includeMedicalInfo}
              onChange={(e) =>
                setExportFilters({
                  ...exportFilters,
                  includeMedicalInfo: e.target.checked,
                })
              }
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Medical Information
            </span>
          </label>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => {
              setExportFilters({
                searchTerm: "",
                statusFilter: "all",
                mountainFilter: "all",
                dateFilter: "all",
                includeMembers: true,
                includePaymentInfo: true,
                includeContactInfo: true,
                includeMedicalInfo: false,
              });
            }}
            variant="outline"
            className="w-full bg-transparent"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          onClick={exportBasicSummary}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={filteredCount === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Basic Summary
        </Button>

        <Button
          onClick={exportDetailedParticipants}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={filteredCount === 0}
        >
          <Users className="h-4 w-4 mr-2" />
          Detailed Participants
        </Button>

        <Button
          onClick={exportMountainSummary}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={filteredCount === 0}
        >
          <Mountain className="h-4 w-4 mr-2" />
          Mountain Summary
        </Button>

        <Button
          onClick={exportFinancialSummary}
          className="bg-orange-600 hover:bg-orange-700 text-white"
          disabled={filteredCount === 0}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Financial Report
        </Button>
      </div>

      {/* Export Descriptions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-gray-600">
        <div className="p-3 bg-blue-50 rounded">
          <strong className="text-blue-700">Basic Summary:</strong> Essential
          booking information including organizer details, dates, and amounts.
        </div>
        <div className="p-3 bg-green-50 rounded">
          <strong className="text-green-700">Detailed Participants:</strong>{" "}
          Complete list of all participants including group members with full
          contact details.
        </div>
        <div className="p-3 bg-purple-50 rounded">
          <strong className="text-purple-700">Mountain Summary:</strong>{" "}
          Statistics grouped by mountain including revenue, bookings, and
          participant counts.
        </div>
        <div className="p-3 bg-orange-50 rounded">
          <strong className="text-orange-700">Financial Report:</strong> Monthly
          revenue breakdown with booking statistics and averages.
        </div>
      </div>
    </div>
  );
}
