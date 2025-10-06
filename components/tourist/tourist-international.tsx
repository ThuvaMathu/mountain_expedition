"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TouristCard } from "@/components/tourist/tourist-card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plane, Globe, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import Link from "next/link";
export default function InternationalTouristMain() {
  const { t } = useLanguage();
  const [internationalPackages, setInternationalPackages] = useState<
    TMountainType[]
  >([]);
  const [filteredPackages, setFilteredPackages] = useState<TMountainType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "international", // Fixed to international
    difficulty: "all",
    priceRange: "all",
    season: "all",
    duration: "all",
  });

  const load = async () => {
    if (!isFirebaseConfigured || !db) {
      setInternationalPackages([]);
      return;
    }
    try {
      // Query only international packages
      const q = query(
        collection(db, "tourist-packages"),
        where("category", "==", "international")
      );
      const snap = await getDocs(q);
      const list: TMountainType[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setInternationalPackages(list);
    } catch (error) {
      console.error("Error loading international packages:", error);
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  useEffect(() => {
    let filtered = internationalPackages;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [searchTerm, filters, internationalPackages]);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl text-white p-8 mb-12">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <Plane className="h-8 w-8 text-teal-700" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4">
                International Tourist Packages
              </h1>
              <p className="text-xl text-teal-100 max-w-3xl mx-auto mb-8">
                Discover the world's most incredible destinations with our
                curated international travel packages. From exotic tropical
                islands to historic European cities, adventure awaits across the
                globe.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto text-teal-700">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Globe className="h-5 w-5" />
                    <span className="text-2xl font-bold">
                      {internationalPackages.length}
                    </span>
                  </div>
                  <p className=" text-sm">Countries</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Plane className="h-5 w-5" />
                    <span className="text-2xl font-bold">$799+</span>
                  </div>
                  <p className=" text-sm">Starting From</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Users className="h-5 w-5" />
                    <span className="text-2xl font-bold">500+</span>
                  </div>
                  <p className="text-sm">Global Travelers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Destinations */}
          {/* <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Popular Destinations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-teal-600 text-xl">🏛️</span>
              </div>
              <h3 className="font-semibold text-gray-900">Europe</h3>
              <p className="text-sm text-gray-600">Historic Cities</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-teal-600 text-xl">🏝️</span>
              </div>
              <h3 className="font-semibold text-gray-900">Southeast Asia</h3>
              <p className="text-sm text-gray-600">Tropical Paradise</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-teal-600 text-xl">🗽</span>
              </div>
              <h3 className="font-semibold text-gray-900">North America</h3>
              <p className="text-sm text-gray-600">Modern Wonders</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-teal-600 text-xl">🦁</span>
              </div>
              <h3 className="font-semibold text-gray-900">Africa</h3>
              <p className="text-sm text-gray-600">Wildlife Safari</p>
            </div>
          </div>
        </div> */}

          {/* Search and Filter Bar */}
          {/* <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search international packages..."
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
        </div> */}

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              Showing {filteredPackages.length} international packages
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Plane className="h-4 w-4 text-teal-600" />
              <span>Explore the World</span>
            </div>
          </div>

          {/* Tourist Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((internationalPackage) => (
              <TouristCard
                key={internationalPackage.id}
                tourist={internationalPackage}
                category="international"
              />
            ))}
          </div>

          {filteredPackages.length === 0 && (
            <div className="text-center py-12">
              <div className="mb-4">
                <Plane className="mx-auto h-12 w-12 text-teal-400" />
              </div>
              <p className="text-gray-500 text-lg mb-4">
                No international packages found
              </p>
              <p className="text-gray-400 mb-6">
                Try adjusting your search criteria or explore all our global
                destinations
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilters({
                    category: "international",
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

          {/* Why Choose International Travel */}
          {filteredPackages.length > 0 && (
            <div className="mt-16">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                  Why Choose International Travel?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="h-8 w-8 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Cultural Immersion
                    </h3>
                    <p className="text-gray-600">
                      Experience diverse cultures, cuisines, and traditions from
                      around the world.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Iconic Landmarks
                    </h3>
                    <p className="text-gray-600">
                      Visit world-famous monuments, natural wonders, and
                      bucket-list destinations.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plane className="h-8 w-8 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Life-Changing Adventures
                    </h3>
                    <p className="text-gray-600">
                      Create unforgettable memories with unique experiences you
                      can't find anywhere else.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Travel Tips */}
          {filteredPackages.length > 0 && (
            <div className="mt-12 bg-teal-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                International Travel Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-teal-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    1
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Passport & Visa
                  </h4>
                  <p className="text-sm text-gray-600">
                    Ensure valid passport and check visa requirements
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-teal-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    2
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Travel Insurance
                  </h4>
                  <p className="text-sm text-gray-600">
                    Protect yourself with comprehensive travel coverage
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-teal-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    3
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Currency Exchange
                  </h4>
                  <p className="text-sm text-gray-600">
                    Check exchange rates and carry some local currency
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-teal-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    4
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Local Customs
                  </h4>
                  <p className="text-sm text-gray-600">
                    Research local customs and cultural etiquette
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Call to Action */}
          {filteredPackages.length > 0 && (
            <div className="mt-16 text-center bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready for Your Global Adventure?
              </h2>
              <p className="text-xl mb-6 text-teal-100">
                Let our international travel experts help you plan the perfect
                overseas experience.
              </p>
              <div className="space-x-4">
                <Link
                  href="/contact"
                  className="bg-white rounded-md py-1.5 px-3 text-teal-600  hover:text-teal-900 hover:shadow-lg shadow-teal-800 transition-all duration-300 ease-linear"
                >
                  Contact Travel Expert
                </Link>
                <Link
                  href={"/contact"}
                  className="bg-white rounded-md py-1.5 px-3 text-teal-600  hover:text-teal-900 hover:shadow-lg shadow-teal-800 transition-all duration-300 ease-linear"
                >
                  Custom International Package
                </Link>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
