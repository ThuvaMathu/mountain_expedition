"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TouristCard } from "@/components/tourist/tourist-card";
import { TouristFilters } from "@/components/tourist/tourist-filters";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Filter, MapPin, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { getDocs, collection } from "firebase/firestore";

export default function TouristPackagesPage() {
  const { t } = useLanguage();
  const [touristPackages, setTouristPackages] = useState<TMountainType[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TMountainType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    difficulty: "all",
    priceRange: "all",
    season: "all",
    duration: "all",
  });

  const load = async () => {
    if (!isFirebaseConfigured || !db) {
      setTouristPackages([]);
      return;
    }
    try {
      const snap = await getDocs(collection(db, "tourist-packages"));
      const list: TMountainType[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setTouristPackages(list);
    } catch (error) {
      console.error("Error loading tourist packages:", error);
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  useEffect(() => {
    let filtered = touristPackages;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (pkg) => (pkg as any).category === filters.category
      );
    }

    // Difficulty filter
    if (filters.difficulty !== "all") {
      filtered = filtered.filter(
        (pkg) => pkg.difficulty === filters.difficulty
      );
    }

    // Duration filter
    if (filters.duration !== "all") {
      filtered = filtered.filter((pkg) => {
        const duration = pkg.duration.toLowerCase();
        switch (filters.duration) {
          case "1-3":
            return (
              duration.includes("1") ||
              duration.includes("2") ||
              duration.includes("3")
            );
          case "4-7":
            return (
              duration.includes("4") ||
              duration.includes("5") ||
              duration.includes("6") ||
              duration.includes("7")
            );
          case "8-14":
            return ["8", "9", "10", "11", "12", "13", "14"].some((d) =>
              duration.includes(d)
            );
          case "15+":
            return (
              duration.includes("15") ||
              duration.includes("week") ||
              duration.includes("month")
            );
          default:
            return true;
        }
      });
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      switch (filters.priceRange) {
        case "budget":
          filtered = filtered.filter((pkg) => pkg.priceUSD < 500);
          break;
        case "mid":
          filtered = filtered.filter(
            (pkg) => pkg.priceUSD >= 500 && pkg.priceUSD < 2000
          );
          break;
        case "premium":
          filtered = filtered.filter((pkg) => pkg.priceUSD >= 2000);
          break;
      }
    }

    setFilteredPackages(filtered);
  }, [searchTerm, filters, touristPackages]);

  // Get stats for display
  const domesticCount = touristPackages.filter(
    (pkg) => (pkg as any).category === "domestic"
  ).length;
  const internationalCount = touristPackages.filter(
    (pkg) => (pkg as any).category === "international"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tourist Packages
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover amazing destinations with our carefully curated tourist
            packages. From local cultural experiences to international
            adventures.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <MapPin className="h-6 w-6 text-teal-600" />
                <span className="text-2xl font-bold text-teal-600">
                  {domesticCount}
                </span>
              </div>
              <p className="text-gray-600">Domestic Packages</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Plane className="h-6 w-6 text-teal-600" />
                <span className="text-2xl font-bold text-teal-600">
                  {internationalCount}
                </span>
              </div>
              <p className="text-gray-600">International Packages</p>
            </div>
          </div>
        </div>

        {/* Quick Category Links */}
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            variant={filters.category === "all" ? "default" : "outline"}
            onClick={() => setFilters({ ...filters, category: "all" })}
            className="flex items-center space-x-2"
          >
            <span>All Packages</span>
          </Button>
          <Button
            variant={filters.category === "domestic" ? "default" : "outline"}
            onClick={() => setFilters({ ...filters, category: "domestic" })}
            className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700"
          >
            <MapPin className="h-4 w-4" />
            <span>Domestic</span>
          </Button>
          <Button
            variant={
              filters.category === "international" ? "default" : "outline"
            }
            onClick={() =>
              setFilters({ ...filters, category: "international" })
            }
            className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700"
          >
            <Plane className="h-4 w-4" />
            <span>International</span>
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search tourist packages..."
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
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t">
              <TouristFilters filters={filters} setFilters={setFilters} />
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPackages.length} of {touristPackages.length}{" "}
            tourist packages
          </p>
        </div>

        {/* Tourist Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((touristPackage) => (
            <TouristCard
              key={touristPackage.id}
              tourist={touristPackage}
              category={(touristPackage as any).category || "domestic"}
            />
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg mb-4">
              No tourist packages found
            </p>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria or browse all packages
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilters({
                  category: "all",
                  difficulty: "all",
                  priceRange: "all",
                  season: "all",
                  duration: "all",
                });
              }}
              className="mt-4"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Call to Action */}
        {filteredPackages.length > 0 && (
          <div className="mt-16 text-center bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl mb-6 text-teal-100">
              Let us create a custom package just for you
            </p>
            <div className="space-x-4">
              <Button
                variant="outline"
                className="bg-white text-teal-600 hover:bg-gray-100"
              >
                Contact Our Experts
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-teal-600"
              >
                Custom Package Request
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
