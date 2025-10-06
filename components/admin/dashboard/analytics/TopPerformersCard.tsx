import { LucideIcon } from "lucide-react";

interface PerformerItem {
  name: string;
  bookings: number;
  revenue: number;
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
        return "bg-yellow-500";
      case 1:
        return "bg-gray-400";
      case 2:
        return "bg-orange-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Icon className="h-5 w-5 text-teal-600" />
          {title}
        </h2>
        <p className="text-sm text-gray-600">By revenue and bookings</p>
      </div>
      <div className="space-y-4">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getRankColor(
                    index
                  )}`}
                >
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.bookings} bookings
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">
                  ${item.revenue.toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            <EmptyIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
