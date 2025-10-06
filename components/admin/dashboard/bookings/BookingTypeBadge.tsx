import { Mountain, Plane } from "lucide-react";

interface BookingTypeBadgeProps {
  type: "trekking" | "tour";
}

export function BookingTypeBadge({ type }: BookingTypeBadgeProps) {
  if (type === "trekking") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
        <Mountain className="h-3 w-3 mr-1" />
        Trekking
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
      <Plane className="h-3 w-3 mr-1" />
      Tour
    </span>
  );
}
