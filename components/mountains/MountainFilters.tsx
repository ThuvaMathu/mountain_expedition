"use client";

import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Difficulty Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("difficulty")}
        </label>
        <select
          value={filters.difficulty}
          onChange={(e) => handleFilterChange("difficulty", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{t("all_difficulties")}</option>
          <option value="Beginner">{t("beginner")}</option>
          <option value="Intermediate">{t("intermediate")}</option>
          <option value="Advanced">{t("advanced")}</option>
          <option value="Expert">{t("expert")}</option>
        </select>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("price_range")}
        </label>
        <select
          value={filters.priceRange}
          onChange={(e) => handleFilterChange("priceRange", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{t("all_prices")}</option>
          <option value="budget">
            {t("budget")} ({"< $2,000"})
          </option>
          <option value="mid">{t("mid_range")} ($2,000 - $10,000)</option>
          <option value="premium">
            {t("premium")} ({"> $10,000"})
          </option>
        </select>
      </div>

      {/* Season Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("season")}
        </label>
        <select
          value={filters.season}
          onChange={(e) => handleFilterChange("season", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{t("all_seasons")}</option>
          <option value="spring">{t("spring")}</option>
          <option value="summer">{t("summer")}</option>
          <option value="autumn">{t("autumn")}</option>
          <option value="winter">{t("winter")}</option>
        </select>
      </div>
    </div>
  );
}
