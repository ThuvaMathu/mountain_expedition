"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/PageHero";
import { PackageCard } from "@/components/shared/PackageCard";
import { useCurrencyStore } from "@/stores/currency-store";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";
import { Globe2, MapPin, Sparkles } from "lucide-react";
import { LoadingSection } from "@/components/shared/LoadingSection";

// Dynamic imports for performance
const TestimonialsCarousel = dynamic(() => import("@/components/home/TestimonialsSection").then(mod => ({ default: mod.TestimonialsCarousel })), {
  loading: () => <LoadingSection />,
  ssr: false,
});

const SupportSection = dynamic(() => import("@/components/shared/SupportSection").then(mod => ({ default: mod.SupportSection })), {
  loading: () => <LoadingSection />,
  ssr: false,
});

// Type definition matching the Admin one roughly
// Type definition matching the Admin one roughly
interface TourPackage {
  id: string;
  name: string;
  category: "domestic" | "international";
  location: string;
  duration: string;
  groupSize: string;
  priceINR: number;
  priceUSD: number;
  imageUrl?: string[];
  thumbnailUrl?: string;
  description: string;
  difficulty?: string;
  availableSlots?: number; // Computed property
  availableDates?: any[];
  [key: string]: any;
}

export default function ToursPage() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "domestic" | "international">("all");
  const { currency } = useCurrencyStore();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        if (!db) return; // Handle no firebase
        const snap = await getDocs(collection(db, "tourist-packages"));
        const data = snap.docs.map((d) => {
          const raw = d.data();

          // Calculate available slots
          let computedSlots = 0;
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (raw.availableDates && Array.isArray(raw.availableDates)) {
            raw.availableDates.forEach((date: any) => {
              const dateObj = new Date(date.date);
              if (dateObj >= today) {
                if (date.slots && Array.isArray(date.slots)) {
                  date.slots.forEach((slot: any) => {
                    const available = (slot.maxParticipants || 0) - (slot.bookedParticipants || 0);
                    if (available > 0) computedSlots += available;
                  });
                }
              }
            });
          }

          return {
            id: d.id,
            ...raw,
            availableSlots: computedSlots
          } as TourPackage;
        });
        setPackages(data);
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Helper to check availability
  const isAvailable = (pkg: TourPackage) => {
    // If explicit status check exists
    if (pkg.status === "disabled" || pkg.status === "outdated") return false;
    // If no dates, unavailable
    if (!pkg.availableDates || pkg.availableDates.length === 0) return false;
    // Check if any date is future
    return pkg.availableDates.some((dateObj: any) => new Date(dateObj.date) >= new Date());
  };

  const getRegion = (pkg: TourPackage) => {
    if (pkg.category === "domestic") return "India";
    if (pkg.location.includes(",")) {
      const parts = pkg.location.split(",");
      return parts[parts.length - 1].trim();
    }
    return pkg.location;
  };

  const groupedPackages = packages.reduce((acc, pkg) => {
    if (!isAvailable(pkg)) return acc;
    const region = getRegion(pkg);
    if (!acc[region]) acc[region] = [];
    acc[region].push(pkg);
    return acc;
  }, {} as Record<string, TourPackage[]>);

  const unavailablePackages = packages.filter(p => !isAvailable(p));

  const filteredRegions = Object.keys(groupedPackages).filter((region) => {
    if (filter === "all") return true;
    if (filter === "domestic") return region === "India";
    if (filter === "international") return region !== "India";
    return true;
  });

  filteredRegions.sort((a, b) => {
    if (a === "India") return -1;
    if (b === "India") return 1;
    return a.localeCompare(b);
  });


  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">

      {/* Hero Section */}
      <PageHero
        title="Discover Amazing Destinations"
        subtitle="Embark on unforgettable journeys to breathtaking locations around the world. From exotic international adventures to incredible domestic getaways, find your perfect escape."
        image="/images/posters/poster-13.jpg"
      />

      {/* Filter Toggles - Modern Segmented Control */}
      <SlideUp className="sticky top-16 z-40 bg-gradient-to-b from-white via-white/95 to-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5">
          {/* Desktop View */}
          <div className="hidden sm:flex justify-center">
            <div className="inline-flex items-center gap-1 p-1.5 bg-gray-100/80 rounded-full shadow-inner">
              <button
                onClick={() => setFilter("all")}
                className={`group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${filter === "all"
                  ? "bg-white text-teal-700 shadow-md scale-105"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
              >
                <Sparkles className={`w-4 h-4 transition-transform duration-300 ${filter === "all" ? "text-teal-600 scale-110" : "text-gray-400 group-hover:scale-110"
                  }`} />
                <span className="text-sm font-semibold">All Packages</span>
                {filter === "all" && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-teal-600 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setFilter("international")}
                className={`group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${filter === "international"
                  ? "bg-white text-purple-700 shadow-md scale-105"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
              >
                <Globe2 className={`w-4 h-4 transition-transform duration-300 ${filter === "international" ? "text-purple-600 scale-110" : "text-gray-400 group-hover:scale-110"
                  }`} />
                <span className="text-sm font-semibold">International</span>
                {filter === "international" && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-purple-600 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setFilter("domestic")}
                className={`group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${filter === "domestic"
                  ? "bg-white text-blue-700 shadow-md scale-105"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
              >
                <MapPin className={`w-4 h-4 transition-transform duration-300 ${filter === "domestic" ? "text-blue-600 scale-110" : "text-gray-400 group-hover:scale-110"
                  }`} />
                <span className="text-sm font-semibold">Domestic</span>
                {filter === "domestic" && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile View */}
          <div className="flex sm:hidden flex-col gap-2">
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-100/80 rounded-2xl shadow-inner">
              <button
                onClick={() => setFilter("all")}
                className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl font-medium transition-all duration-300 ${filter === "all"
                  ? "bg-white text-teal-700 shadow-md"
                  : "text-gray-600 hover:bg-white/50"
                  }`}
              >
                <Sparkles className={`w-5 h-5 ${filter === "all" ? "text-teal-600" : "text-gray-400"
                  }`} />
                <span className="text-xs font-semibold">All</span>
              </button>

              <button
                onClick={() => setFilter("international")}
                className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl font-medium transition-all duration-300 ${filter === "international"
                  ? "bg-white text-purple-700 shadow-md"
                  : "text-gray-600 hover:bg-white/50"
                  }`}
              >
                <Globe2 className={`w-5 h-5 ${filter === "international" ? "text-purple-600" : "text-gray-400"
                  }`} />
                <span className="text-xs font-semibold">Global</span>
              </button>

              <button
                onClick={() => setFilter("domestic")}
                className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl font-medium transition-all duration-300 ${filter === "domestic"
                  ? "bg-white text-blue-700 shadow-md"
                  : "text-gray-600 hover:bg-white/50"
                  }`}
              >
                <MapPin className={`w-5 h-5 ${filter === "domestic" ? "text-blue-600" : "text-gray-400"
                  }`} />
                <span className="text-xs font-semibold">India</span>
              </button>
            </div>
          </div>
        </div>
      </SlideUp>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
          </div>
        ) : filteredRegions.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No active packages found for this category.</p>
          </div>
        ) : (
          filteredRegions.map((region) => (
            <section key={region} className="animate-fade-in">
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-10 w-1 bg-gradient-to-b from-teal-400 to-blue-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-gray-800">{region}</h2>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedPackages[region].map((tour) => (
                  <StaggerItem key={tour.id} className="h-full">
                    <PackageCard
                      id={tour.id}
                      type="tours"
                      title={tour.name}
                      image={tour.imageUrl?.[0] || "/images/posters/poster-adventure.jpg"}
                      thumbnail={tour.thumbnailUrl}
                      priceINR={tour.priceINR || 0}
                      priceUSD={tour.priceUSD || 0}
                      location={tour.location}
                      duration={tour.duration}
                      groupSize={tour.groupSize}
                      difficulty={tour.difficulty}
                      availableSlots={tour.availableSlots}
                      currency={currency}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </section>
          ))
        )}

        {/* Unavailable Section */}
        {!loading && unavailablePackages.length > 0 && filter === 'all' && (
          <div className="mt-16 pt-16 border-t border-gray-200">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Upcoming / Past Expeditions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                Currently unavailable for booking. Contact us for enquiries.
              </p>
            </div>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-75">
              {unavailablePackages.map((tour) => (
                <StaggerItem key={tour.id} className="h-full grayscale hover:grayscale-0 transition-all duration-500">
                  <PackageCard
                    id={tour.id}
                    type="tours"
                    title={tour.name}
                    image={tour.imageUrl?.[0] || "/images/posters/poster-adventure.jpg"}
                    thumbnail={tour.thumbnailUrl}
                    priceINR={tour.priceINR || 0}
                    priceUSD={tour.priceUSD || 0}
                    location={tour.location}
                    duration={tour.duration}
                    groupSize={tour.groupSize}
                    difficulty={tour.difficulty}
                    availableSlots={tour.availableSlots}
                    currency={currency}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}

        {/* Support Section */}
        <SupportSection />

        {/* Testimonials */}
        <TestimonialsCarousel />
      </div>
    </div>
  );
}
