import { Mountain, Plane, TrendingUp, DollarSign } from "lucide-react";

interface CategoryData {
  bookings: number;
  revenueUSD: number;
  revenueINR: number;
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
  const totalRevenueUSD = mountainData.revenueUSD + tourData.revenueUSD;
  const totalRevenueINR = mountainData.revenueINR + tourData.revenueINR;

  const mountainBookingPercent =
    totalBookings > 0 ? (mountainData.bookings / totalBookings) * 100 : 0;
  const tourBookingPercent =
    totalBookings > 0 ? (tourData.bookings / totalBookings) * 100 : 0;

  const mountainRevenueUSDPercent =
    totalRevenueUSD > 0
      ? (mountainData.revenueUSD / totalRevenueUSD) * 100
      : 0;
  const tourRevenueUSDPercent =
    totalRevenueUSD > 0 ? (tourData.revenueUSD / totalRevenueUSD) * 100 : 0;

  const mountainRevenueINRPercent =
    totalRevenueINR > 0
      ? (mountainData.revenueINR / totalRevenueINR) * 100
      : 0;
  const tourRevenueINRPercent =
    totalRevenueINR > 0 ? (tourData.revenueINR / totalRevenueINR) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-teal-600" />
          Category Performance
        </h2>
        <p className="text-sm text-gray-600">
          Mountains vs Tours - Detailed Metrics
        </p>
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
                <span className="text-sm font-semibold text-gray-900">
                  {mountainData.bookings} bookings
                  <span className="text-gray-500 ml-1">
                    ({mountainBookingPercent.toFixed(1)}%)
                  </span>
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
                <span className="text-sm font-semibold text-gray-900">
                  {tourData.bookings} bookings
                  <span className="text-gray-500 ml-1">
                    ({tourBookingPercent.toFixed(1)}%)
                  </span>
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

        {/* Revenue USD Comparison */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            Revenue Distribution (USD)
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Mountain className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Mountains</span>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  ${mountainData.revenueUSD.toLocaleString()}
                  {totalRevenueUSD > 0 && (
                    <span className="text-gray-500 ml-1">
                      ({mountainRevenueUSDPercent.toFixed(1)}%)
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${mountainRevenueUSDPercent}%` }}
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
                  ${tourData.revenueUSD.toLocaleString()}
                  {totalRevenueUSD > 0 && (
                    <span className="text-gray-500 ml-1">
                      ({tourRevenueUSDPercent.toFixed(1)}%)
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${tourRevenueUSDPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue INR Comparison */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-teal-600" />
            Revenue Distribution (INR)
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Mountain className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Mountains</span>
                </div>
                <span className="text-sm font-semibold text-teal-600">
                  ₹{mountainData.revenueINR.toLocaleString()}
                  {totalRevenueINR > 0 && (
                    <span className="text-gray-500 ml-1">
                      ({mountainRevenueINRPercent.toFixed(1)}%)
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${mountainRevenueINRPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Tours</span>
                </div>
                <span className="text-sm font-semibold text-teal-600">
                  ₹{tourData.revenueINR.toLocaleString()}
                  {totalRevenueINR > 0 && (
                    <span className="text-gray-500 ml-1">
                      ({tourRevenueINRPercent.toFixed(1)}%)
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${tourRevenueINRPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary with detailed breakdown */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 gap-3">
            {/* Total Bookings */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1 font-medium">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalBookings}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Mountains: {mountainData.bookings} | Tours:{" "}
                    {tourData.bookings}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Revenue USD */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1 font-medium">
                    Total Revenue (USD)
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ${totalRevenueUSD.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Mountains: ${mountainData.revenueUSD.toLocaleString()} |
                    Tours: ${tourData.revenueUSD.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Revenue INR */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1 font-medium">
                    Total Revenue (INR)
                  </p>
                  <p className="text-2xl font-bold text-teal-600">
                    ₹{totalRevenueINR.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Mountains: ₹{mountainData.revenueINR.toLocaleString()} |
                    Tours: ₹{tourData.revenueINR.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
