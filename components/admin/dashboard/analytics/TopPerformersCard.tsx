import { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PerformerItem {
  name: string;
  bookings: number;
  revenueUSD?: number;
  revenueINR?: number;
  email?: string;
}

interface TopPerformersCardProps {
  title: string;
  icon: LucideIcon;
  items: PerformerItem[];
  emptyIcon: LucideIcon;
  emptyMessage: string;
}

export function TopPerformersCard({
  title,
  icon: Icon,
  items,
  emptyIcon: EmptyIcon,
  emptyMessage,
}: TopPerformersCardProps) {
  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-amber-400 text-white"; // Gold
      case 1:
        return "bg-slate-400 text-white"; // Silver
      case 2:
        return "bg-orange-400 text-white"; // Bronze
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Icon className="h-5 w-5 text-teal-600" />
          {title}
        </h2>
        <p className="text-sm text-gray-500 mt-1">Based on revenue & bookings</p>
      </div>

      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item, index) => {
            const hasUSD = (item.revenueUSD ?? 0) > 0;
            const hasINR = (item.revenueINR ?? 0) > 0;
            const totalRevenue = hasUSD || hasINR;

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getRankColor(
                      index
                    )}`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-600">
                        {item.bookings} {item.bookings === 1 ? 'booking' : 'bookings'}
                      </span>
                      {item.email && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-400 truncate">
                            {item.email}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-4 flex flex-col items-end gap-1">
                  {hasUSD && (
                    <p className="text-sm font-bold text-green-700">
                      {formatCurrency(item.revenueUSD || 0, "USD", true)}
                    </p>
                  )}
                  {hasINR && (
                    <p className="text-sm font-bold text-blue-700">
                      {formatCurrency(item.revenueINR || 0, "INR", true)}
                    </p>
                  )}
                  {!totalRevenue && (
                    <p className="text-sm font-semibold text-gray-400">No revenue</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <EmptyIcon className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-gray-500 font-medium">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
