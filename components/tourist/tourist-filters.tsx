"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface Filters {
  category: string;
  difficulty: string;
  priceRange: string;
  season: string;
  duration: string;
}

interface TouristFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export function TouristFilters({ filters, setFilters }: TouristFiltersProps) {
  const { t } = useLanguage();

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tourist Type
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="domestic">Domestic</option>
          <option value="international">International</option>
        </select>
      </div>

      {/* Difficulty Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Experience Level
        </label>
        <select
          value={filters.difficulty}
          onChange={(e) => handleFilterChange("difficulty", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>
      </div>

      {/* Duration Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duration
        </label>
        <select
          value={filters.duration}
          onChange={(e) => handleFilterChange("duration", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Any Duration</option>
          <option value="1-3">1-3 Days</option>
          <option value="4-7">4-7 Days</option>
          <option value="8-14">8-14 Days</option>
          <option value="15+">15+ Days</option>
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
          <option value="budget">Budget (&lt; $500)</option>
          <option value="mid">Mid Range ($500 - $2,000)</option>
          <option value="premium">Premium (&gt; $2,000)</option>
        </select>
      </div>

      {/* Season Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Best Season
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
          <option value="year-round">Year Round</option>
        </select>
      </div>
    </div>
  );
}
