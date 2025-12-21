"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Calendar, TrendingUp, Star, Users } from "lucide-react";
import { db, isFirebaseConfigured } from "@/lib/firebase"; // ✅ adjust import path
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { ImageLoader } from "../ui/image-loader";
import { useCurrencyStore } from "@/stores/currency-store";
import { formatCurrency } from "@/lib/utils";

// ✅ Use your Firestore type

export function FeaturedMountains() {
  const { t } = useLanguage();
  const [mountains, setMountains] = useState<TMountainType[]>([]);
  const { currency } = useCurrencyStore();

  // Load function (latest 3 available mountains/tours)
  const load = async () => {
    if (!isFirebaseConfigured || !db) {
      setMountains([]);
      return;
    }
    try {
      // Fetch latest mountains and tours (fetch more to allow for client-side filtering of availability)
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

      const processDocs = (docs: any[]) => {
         return docs.map((d) => {
           const data = d.data() as any;
           // Calculate total available slots from dates checking for future dates only
           let computedSlots = 0;
           const today = new Date();
           today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

           if (data.availableDates && Array.isArray(data.availableDates)) {
             data.availableDates.forEach((date: any) => {
               // Check if date is outdated
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
             ...data,
             availableSlots: computedSlots // Override with computed future slots
           };
        });
      };

      const mountainsList = processDocs(mountainsSnap.docs);
      const toursList = processDocs(toursSnap.docs);
      
      // Combine and Sort
      const combinedList = [...mountainsList, ...toursList]
        .filter((m) => m.availableSlots > 0)
        .sort((a, b) => {
           // Sort by CreatedAt Descending
           const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
           const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
           return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 3);
        
      setMountains(combinedList);
    } catch (error) {
      console.error("Error loading featured items:", error);
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-orange-100 text-orange-800";
      case "Expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Expeditions & Tours
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our most popular and available trekking experiences.
          </p>
        </div>

        <div className={`grid gap-8 ${
          mountains.length === 1 
            ? "grid-cols-1 max-w-5xl mx-auto" 
            : mountains.length === 2 
            ? "grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto" 
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}>
          {mountains.map((mountain) => {
            const isSingle = mountains.length === 1;
            return (
              <div
                key={mountain.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden mountain-card-hover ${
                  isSingle ? "md:grid md:grid-cols-2" : ""
                }`}
              >
                <div className={`relative ${isSingle ? "h-64 md:h-auto" : ""}`}>
                  <ImageLoader
                    src={mountain.imageUrl?.[0] || "/placeholder.svg"}
                    alt={mountain.name}
                    height={isSingle ? "h-96" : "h-48"}
                    priority
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                        mountain.difficulty
                      )}`}
                    >
                      {mountain.difficulty}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-3 py-1">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">
                        {mountain.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`p-6 ${isSingle ? "md:p-10 flex flex-col justify-center" : ""}`}>
                  <h3 className={`font-bold text-gray-900 mb-2 ${isSingle ? "text-3xl" : "text-xl"}`}>
                    {mountain.name}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{mountain.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {mountain.altitude.toLocaleString()}m
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">{mountain.bestSeason}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className={`font-bold text-teal-600 ${isSingle ? "text-3xl" : "text-2xl"}`}>
                        {formatCurrency(
                          currency === "USD"
                            ? mountain.priceUSD
                            : mountain.priceINR,
                          currency
                        )}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">
                        per person
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{mountain.availableSlots} slots</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-1 text-yellow-400" />
                      <span>
                        {mountain.rating} ({mountain.totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                  
                  {isSingle && (
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {mountain.description || "Experience the adventure of a lifetime with our expert guides and comprehensive packages."}
                    </p>
                  )}

                  <Link href={mountain.type === "tour" ? `/tourist/${mountain.id}` : `/mountains/${mountain.id}`}>
                    <Button className={`w-full bg-teal-600 hover:bg-teal-700 ${isSingle ? "text-lg py-6" : ""}`}>
                      {t("view_details")}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/mountains">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 bg-transparent"
            >
              View All Adventures
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
