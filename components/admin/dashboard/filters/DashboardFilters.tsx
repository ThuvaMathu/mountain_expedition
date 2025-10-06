import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FilterState {
  search: string;
  type: string;
  status: string;
  selectedItem: string;
  dateRange: string;
}

interface DashboardFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  items: Array<{ id: string; name: string; type: "mountain" | "tour" }>;
}

export function DashboardFilters({
  filters,
  onFilterChange,
  items,
}: DashboardFiltersProps) {
  const handleChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      type: "all",
      status: "all",
      selectedItem: "all",
      dateRange: "all",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-teal-600" />
          Quick Filters
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="bg-transparent"
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={(e) => handleChange("type", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="all">All Types</option>
          <option value="mountains">Mountains Only</option>
          <option value="tour">Tours Only</option>
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Item Selector */}
        <select
          value={filters.selectedItem}
          onChange={(e) => handleChange("selectedItem", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="all">All Items</option>
          {items
            .filter((item) => {
              if (filters.type === "mountains") return item.type === "mountain";
              if (filters.type === "tours") return item.type === "tour";
              return true;
            })
            .map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
        </select>

        {/* Date Range */}
        <select
          value={filters.dateRange}
          onChange={(e) => handleChange("dateRange", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>
    </div>
  );
}
