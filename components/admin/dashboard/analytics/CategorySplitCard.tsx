import { Mountain, Plane, TrendingUp } from "lucide-react";

interface CategoryData {
  bookings: number;
  revenue: number;
}

interface CategorySplitCardProps {
  mountainData: CategoryData;
  tourData: CategoryData;
}

export function CategorySplitCard({
  mountainData,
  tourData,
}: CategorySplitCardProps) {
  const totalBookings = mountainData.bookings + tourData.bookings;
  const totalRevenue = mountainData.revenue + tourData.revenue;

  const mountainBookingPercent =
    totalBookings > 0 ? (mountainData.bookings / totalBookings) * 100 : 0;
  const tourBookingPercent =
    totalBookings > 0 ? (tourData.bookings / totalBookings) * 100 : 0;

  const mountainRevenuePercent =
    totalRevenue > 0 ? (mountainData.revenue / totalRevenue) * 100 : 0;
  const tourRevenuePercent =
    totalRevenue > 0 ? (tourData.revenue / totalRevenue) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-teal-600" />
          Category Performance
        </h2>
        <p className="text-sm text-gray-600">Mountains vs Tours comparison</p>
      </div>

      <div className="space-y-6">
        {/* Bookings Comparison */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Bookings Distribution
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Mountain className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Mountains</span>
                </div>
                <span className="text-sm text-gray-600">
                  {mountainData.bookings} ({mountainBookingPercent.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${mountainBookingPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Tours</span>
                </div>
                <span className="text-sm text-gray-600">
                  {tourData.bookings} ({tourBookingPercent.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${tourBookingPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Comparison */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Revenue Distribution
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Mountain className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Mountains</span>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  ${mountainData.revenue.toLocaleString()} (
                  {mountainRevenuePercent.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${mountainRevenuePercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Tours</span>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  ${tourData.revenue.toLocaleString()} (
                  {tourRevenuePercent.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${tourRevenuePercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Total Bookings</p>
              <p className="text-lg font-bold text-gray-900">{totalBookings}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
              <p className="text-lg font-bold text-green-600">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
