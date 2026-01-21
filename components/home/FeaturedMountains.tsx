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
import { SlideUp, SlideRight, StaggerContainer, StaggerItem } from "../ui/motion-wrapper";

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
        .slice(0, 4);

      setMountains(combinedList);
    } catch (error) {
      console.error("Error loading featured items:", error);
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SlideUp className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Uncover The Beauty Of Your<br />Next Destination
          </h2>
        </SlideUp>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Large Feature Card */}
          <SlideRight className="lg:col-span-1 h-full">
            <div className="relative h-full min-h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
              <ImageLoader
                src="/images/posters/poster-29.jpg"
                alt="Featured Destination"
                height="h-full"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-3xl font-bold text-white mb-6 leading-snug">
                  Enjoy The Stunning Natural Beauty That Awaits At Every Destination.
                </h3>
                <Link href="/tours">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white border-none rounded-lg px-8 py-6 text-lg font-semibold w-full sm:w-auto">
                    View More Destinations
                  </Button>
                </Link>
              </div>
            </div>
          </SlideRight>

          {/* Right Column - 2x2 Grid */}
          <StaggerContainer className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {mountains.slice(0, 4).map((item) => (
              <StaggerItem key={item.id} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex flex-col hover:shadow-xl transition-shadow duration-300">
                {/* Image */}
                <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                  <ImageLoader
                    src={item.imageUrl?.[0] || "/placeholder.svg"}
                    alt={item.name}
                    height="h-48"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-teal-700 flex items-center shadow-sm">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {item.location.split(',').pop()?.trim().substring(0, 10) || "Adventure"}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow">
                  <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{item.name}</h4>

                  <div className="flex items-center text-xs text-gray-500 space-x-3 mb-4">
                    <span className="flex items-center bg-gray-50 px-2 py-1 rounded">
                      <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                      {item.duration}
                    </span>
                    <span className="flex items-center bg-gray-50 px-2 py-1 rounded">
                      <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                      {item.rating} Rating
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        {formatCurrency(
                          currency === "USD" ? (item.priceUSD ?? 0) : (item.priceINR ?? 0),
                          currency
                        )}
                      </span>
                      <span className="text-xs text-gray-500 block">
                        {item.type === 'tour' ? 'per tour' : 'per person'}
                      </span>
                    </div>
                    <Link href={item.type === "tour" ? `/tours/${item.id}` : `/trekking/${item.id}`}>
                      <Button variant="outline" className="border-gray-200 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}

            {mountains.length < 4 && Array.from({ length: 4 - mountains.length }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 h-[360px]">
                <p>More Coming Soon</p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </div >
    </section >
  );
}
