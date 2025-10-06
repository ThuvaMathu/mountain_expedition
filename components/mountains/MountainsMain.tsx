"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MountainCard } from "@/components/mountains/MountainCard";
import { MountainFilters } from "@/components/mountains/MountainFilters";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { getDocs, collection } from "firebase/firestore";
import { generateMountainsMetadata } from "@/seo/metadata/mountains";
import { organizationSchema } from "@/seo/schemas";
//export const metadata = generateMountainsMetadata();
export default function MountainsMain() {
  const { t } = useLanguage();
  const [mountains, setMountains] = useState<TMountainType[]>([]);
  const [filteredMountains, setFilteredMountains] = useState<TMountainType[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: "all",
    priceRange: "all",
    season: "all",
  });

  const load = async () => {
    if (!isFirebaseConfigured || !db) {
      setMountains([]);
      return;
    }
    try {
      const snap = await getDocs(collection(db, "mountains"));
      const list: TMountainType[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setMountains(list);
    } catch (error) {
      console.error("Error loading mountains:", error);
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  useEffect(() => {
    let filtered = mountains;
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (mountain) =>
          mountain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mountain.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Difficulty filter
    if (filters.difficulty !== "all") {
      filtered = filtered.filter(
        (mountain) => mountain.difficulty === filters.difficulty
      );
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      switch (filters.priceRange) {
        case "budget":
          filtered = filtered.filter((mountain) => mountain.price < 2000);
          break;
        case "mid":
          filtered = filtered.filter(
            (mountain) => mountain.price >= 2000 && mountain.price < 10000
          );
          break;
        case "premium":
          filtered = filtered.filter((mountain) => mountain.price >= 10000);
          break;
      }
    }

    setFilteredMountains(filtered);
  }, [searchTerm, filters, mountains]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("explore_mountains")}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("mountains_page_description")}
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder={t("search_mountains")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {t("filters")}
              </Button>
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t">
                <MountainFilters filters={filters} setFilters={setFilters} />
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {t("showing_results", {
                count: filteredMountains.length,
                total: mountains.length,
              })}
            </p>
          </div>

          {/* Mountains Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMountains.map((mountain) => (
              <MountainCard key={mountain.id} mountain={mountain} />
            ))}
          </div>

          {filteredMountains.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t("no_mountains_found")}</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilters({
                    difficulty: "all",
                    priceRange: "all",
                    season: "all",
                  });
                }}
                className="mt-4"
              >
                {t("clear_filters")}
              </Button>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
