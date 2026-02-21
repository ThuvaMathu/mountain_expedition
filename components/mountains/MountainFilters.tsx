"use client";


import { useCurrencyStore } from "@/stores/currency-store";

interface Filters {
  difficulty: string;
  priceRange: string;
  season: string;
}

interface MountainFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export function MountainFilters({ filters, setFilters }: MountainFiltersProps) {

  const { currency } = useCurrencyStore();

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Difficulty Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Difficulty
        </label>
        <select
          value={filters.difficulty}
          onChange={(e) => handleFilterChange("difficulty", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Difficulties</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <select
          value={filters.priceRange}
          onChange={(e) => handleFilterChange("priceRange", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Prices</option>
          <option value="budget">
            Budget ({currency === "INR" ? "< ₹1,50,000" : "< $2,000"})
          </option>
          <option value="mid">
            Mid Range{" "}
            ({currency === "INR" ? "₹1,50,000 - ₹8,00,000" : "$2,000 - $10,000"})
          </option>
          <option value="premium">
            Premium ({currency === "INR" ? "> ₹8,00,000" : "> $10,000"})
          </option>
        </select>
      </div>

      {/* Season Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Season
        </label>
        <select
          value={filters.season}
          onChange={(e) => handleFilterChange("season", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Seasons</option>
          <option value="spring">Spring</option>
          <option value="summer">Summer</option>
          <option value="autumn">Autumn</option>
          <option value="winter">Winter</option>
        </select>
      </div>
    </div>
  );
}
