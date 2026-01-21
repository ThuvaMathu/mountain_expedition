"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { ImageLoader } from "../ui/image-loader";
import { SlideUp, ScaleIn } from "../ui/motion-wrapper";
import { Calendar, MapPin, ArrowRight, Clock, Users, Mountain, Star, TrendingUp } from "lucide-react";
import { useCurrencyStore } from "@/stores/currency-store";
import { formatCurrency } from "@/lib/utils";

interface UpcomingPackage {
  id: string;
  type: "trekking" | "tour";
  name: string;
  location: string;
  imageUrl: string[];
  thumbnailUrl?: string;
  duration: string;
  description: string;
  longDescription?: string;
  upcomingDate?: string;
  daysUntil?: number;
  groupSize?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  rating?: number;
  bestSeason?: string;
  altitude?: number;
  pricingType?: "price" | "enquire";
  priceINR?: number;
  priceUSD?: number;
  highlights?: string[];
  included?: string[];
}

export function NextAdventure() {
  const [upcomingPackage, setUpcomingPackage] = useState<UpcomingPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currency } = useCurrencyStore();

  useEffect(() => {
    loadUpcomingPackage();
  }, []);

  const loadUpcomingPackage = async () => {
    if (!isFirebaseConfigured || !db) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch both mountains and tours
      const mountainsQuery = query(
        collection(db, "mountains"),
        orderBy("createdAt", "desc"),
        limit(50)
      );

      const toursQuery = query(
        collection(db, "tourist-packages"),
        orderBy("createdAt", "desc"),
        limit(50)
      );

      const [mountainsSnap, toursSnap] = await Promise.all([
        getDocs(mountainsQuery),
        getDocs(toursQuery)
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let closestPackage: UpcomingPackage | null = null;
      let minDaysDiff = Infinity;

      // Process mountains
      mountainsSnap.docs.forEach((doc) => {
        const data = doc.data() as any;
        if (!data.availableDates || !Array.isArray(data.availableDates)) return;

        // Find the closest upcoming date
        data.availableDates.forEach((dateObj: any) => {
          const dateObjDate = new Date(dateObj.date);
          if (dateObjDate >= today) {
            const daysDiff = Math.ceil((dateObjDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            // Check if there are available slots
            const hasAvailableSlots = dateObj.slots?.some((slot: any) => {
              const available = (slot.maxParticipants || 0) - (slot.bookedParticipants || 0);
              return available > 0;
            });

            if (hasAvailableSlots && daysDiff < minDaysDiff) {
              minDaysDiff = daysDiff;
              closestPackage = {
                id: doc.id,
                type: "trekking",
                name: data.name,
                location: data.location,
                imageUrl: data.imageUrl || [],
                thumbnailUrl: data.thumbnailUrl,
                duration: data.duration,
                description: data.description,
                longDescription: data.longDescription,
                upcomingDate: dateObj.date,
                daysUntil: daysDiff,
                groupSize: data.groupSize,
                difficulty: data.difficulty,
                rating: data.rating,
                bestSeason: data.bestSeason,
                altitude: data.altitude,
                pricingType: data.pricingType,
                priceINR: data.priceINR,
                priceUSD: data.priceUSD,
                highlights: data.highlights,
                included: data.included
              };
            }
          }
        });
      });

      // Process tours
      toursSnap.docs.forEach((doc) => {
        const data = doc.data() as any;
        if (!data.availableDates || !Array.isArray(data.availableDates)) return;

        data.availableDates.forEach((dateObj: any) => {
          const dateObjDate = new Date(dateObj.date);
          if (dateObjDate >= today) {
            const daysDiff = Math.ceil((dateObjDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            const hasAvailableSlots = dateObj.slots?.some((slot: any) => {
              const available = (slot.maxParticipants || 0) - (slot.bookedParticipants || 0);
              return available > 0;
            });

            if (hasAvailableSlots && daysDiff < minDaysDiff) {
              minDaysDiff = daysDiff;
              closestPackage = {
                id: doc.id,
                type: "tour",
                name: data.name,
                location: data.location,
                imageUrl: data.imageUrl || [],
                thumbnailUrl: data.thumbnailUrl,
                duration: data.duration,
                description: data.description,
                longDescription: data.longDescription,
                upcomingDate: dateObj.date,
                daysUntil: daysDiff,
                groupSize: data.groupSize,
                difficulty: data.difficulty,
                rating: data.rating,
                bestSeason: data.bestSeason,
                altitude: data.altitude,
                pricingType: data.pricingType,
                priceINR: data.priceINR,
                priceUSD: data.priceUSD,
                highlights: data.highlights,
                included: data.included
              };
            }
          }
        });
      });

      setUpcomingPackage(closestPackage);
    } catch (error) {
      console.error("Error loading upcoming package:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getUrgencyText = (days?: number): { text: string; color: string; bg: string } => {
    if (!days) return { text: "New Adventure", color: "text-teal-600", bg: "bg-teal-50" };
    if (days <= 7) return { text: "Departing Soon!", color: "text-red-600", bg: "bg-red-50" };
    if (days <= 30) return { text: "Limited Spots", color: "text-amber-600", bg: "bg-amber-50" };
    return { text: "Coming Up", color: "text-teal-600", bg: "bg-teal-50" };
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-700 border-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Advanced":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Expert":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Don't render if no upcoming package or still loading
  if (isLoading || !upcomingPackage) {
    return null;
  }

  const urgency = getUrgencyText(upcomingPackage.daysUntil);
  const difficultyColor = getDifficultyColor(upcomingPackage.difficulty);
  const detailUrl = upcomingPackage.type === "tour"
    ? `/tours/${upcomingPackage.id}`
    : `/trekking/${upcomingPackage.id}`;
  const displayPrice = currency === "USD" ? (upcomingPackage.priceUSD || 0) : (upcomingPackage.priceINR || 0);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-400 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left - Image Card */}
          <SlideUp className="order-2 lg:order-1 flex flex-col">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group flex-1 min-h-[400px]">
              <ImageLoader
                src={upcomingPackage.thumbnailUrl || upcomingPackage.imageUrl?.[0] || "/placeholder-mountain.jpg"}
                alt={upcomingPackage.name}
                height="h-full"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Top Badges */}
              <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                {upcomingPackage.difficulty && (
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${difficultyColor} backdrop-blur-sm`}>
                    {upcomingPackage.difficulty}
                  </span>
                )}
                <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-gray-900 border border-gray-200 flex items-center gap-1.5 shadow-sm">
                  <Calendar className="h-3.5 w-3.5 text-teal-600" />
                  {upcomingPackage.upcomingDate && formatDate(upcomingPackage.upcomingDate)}
                </span>
              </div>

              {/* Days Badge */}
              {upcomingPackage.daysUntil !== undefined && (
                <div className="absolute bottom-6 right-6">
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-3 rounded-2xl shadow-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{upcomingPackage.daysUntil}</div>
                      <div className="text-xs text-teal-100 uppercase tracking-wide">Days Away</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Highlights */}
            {upcomingPackage.highlights && upcomingPackage.highlights.length > 0 && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {upcomingPackage.highlights.slice(0, 4).map((highlight, i) => (
                  <div key={i} className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl text-center text-sm font-medium text-gray-700 border border-gray-200 shadow-sm">
                    {highlight}
                  </div>
                ))}
              </div>
            )}
          </SlideUp>

          {/* Right - Content */}
          <ScaleIn className="order-1 lg:order-2">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border-2 shadow-sm">
              <span className={`w-2 h-2 rounded-full animate-pulse ${urgency.bg.replace('bg-', 'bg-')}`} />
              <span className={`font-semibold ${urgency.color}`}>{urgency.text}</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-gray-900">
              Where We're<br />
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Going Next
              </span>
            </h2>

            <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
              Join {upcomingPackage.name}
            </h3>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed line-clamp-3">
              {upcomingPackage.longDescription || upcomingPackage.description}
            </p>

            {/* Quick Details */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm">
                <MapPin className="h-5 w-5 text-teal-600" />
                <span className="text-gray-700 font-medium">{upcomingPackage.location}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm">
                <Clock className="h-5 w-5 text-teal-600" />
                <span className="text-gray-700 font-medium">{upcomingPackage.duration}</span>
              </div>
              {upcomingPackage.groupSize && (
                <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm">
                  <Users className="h-5 w-5 text-teal-600" />
                  <span className="text-gray-700 font-medium">{upcomingPackage.groupSize}</span>
                </div>
              )}
              {upcomingPackage.altitude && upcomingPackage.altitude > 0 && (
                <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm">
                  <Mountain className="h-5 w-5 text-teal-600" />
                  <span className="text-gray-700 font-medium">{upcomingPackage.altitude.toLocaleString()}m</span>
                </div>
              )}
              {/* {upcomingPackage.rating && (
                <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm">
                  <Star className="h-5 w-5 text-amber-500 fill-current" />
                  <span className="text-gray-700 font-medium">{upcomingPackage.rating}</span>
                </div>
              )} */}
            </div>

            {/* Best Season */}
            {upcomingPackage.bestSeason && (
              <div className="mb-6 flex items-center gap-2 text-gray-600">
                <TrendingUp className="h-4 w-4 text-teal-600" />
                <span className="text-sm">Best Season: <strong>{upcomingPackage.bestSeason}</strong></span>
              </div>
            )}

            {/* Price Display */}
            {upcomingPackage.pricingType !== "enquire" && displayPrice > 0 && (
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(displayPrice, currency)}
                </span>
                <span className="text-gray-500 ml-2">
                  per {upcomingPackage.type === "tour" ? "tour" : "person"}
                </span>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {upcomingPackage.pricingType === "enquire" ? (
                <Link href={`/enquire/${upcomingPackage.id}`} className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg shadow-teal-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/40 hover:-translate-y-1">
                    Enquire Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link href={detailUrl} className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg shadow-teal-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/40 hover:-translate-y-1">
                    Book Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
              <Link href={detailUrl} className="flex-1">
                <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300">
                  View Details
                </Button>
              </Link>
            </div>


          </ScaleIn>
        </div>
      </div>
    </section>
  );
}
