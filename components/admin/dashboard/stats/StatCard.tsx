import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  change?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color,
  change,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color} flex-shrink-0`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {change && (
        <div className="flex items-center mt-2">
          <span className="text-sm text-gray-500">{change}</span>
        </div>
      )}
    </div>
  );
}
