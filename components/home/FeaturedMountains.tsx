"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useCurrencyStore } from "@/stores/currency-store";
import { SlideUp, StaggerContainer, FadeIn } from "../ui/motion-wrapper";
import { HeroCard } from "./FeaturedMountains/HeroCard";
import { MountainCard } from "./FeaturedMountains/MountainCard";
import { QuickViewModal } from "./FeaturedMountains/QuickViewModal";
import { EmptyStateCard } from "./FeaturedMountains/EmptyStateCard";
import { ArrowRight, Compass } from "lucide-react";

export function FeaturedMountains() {
  const [mountains, setMountains] = useState<TMountainType[]>([]);
  const [quickViewItem, setQuickViewItem] = useState<TMountainType | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { currency } = useCurrencyStore();

  // Load function (latest available mountains/tours)
  const load = async () => {
    if (!isFirebaseConfigured || !db) {
      setMountains([]);
      return;
    }
    try {
      // Fetch latest mountains and tours
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
          today.setHours(0, 0, 0, 0);

          if (data.availableDates && Array.isArray(data.availableDates)) {
            data.availableDates.forEach((date: any) => {
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
            availableSlots: computedSlots
          };
        });
      };

      const mountainsList = processDocs(mountainsSnap.docs);
      const toursList = processDocs(toursSnap.docs);

      // Combine and Sort
      const combinedList = [...mountainsList, ...toursList]
        .filter((m) => m.availableSlots > 0)
        .sort((a, b) => {
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

  const handleQuickView = (item: TMountainType) => {
    setQuickViewItem(item);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setTimeout(() => setQuickViewItem(null), 300);
  };

  return (
    <section className="py-10 md:py-14 lg:py-16 bg-gradient-to-br from-teal-50 via-amber-50 to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SlideUp className="text-center mb-6 md:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold mb-4">
            <Compass className="w-4 h-4" />
            <span>Featured Expeditions</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-2">
            Top Destinations To Travel With<br />Muthamilselvi
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
            Handpicked adventures to ignite your spirit of exploration
          </p>
        </SlideUp>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          {/* Left Column - Hero Card */}
          <div className="lg:col-span-1 order-first lg:order-first h-full">
            <HeroCard />
          </div>

          {/* Right Column - 2x2 Grid */}
          <StaggerContainer
            className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
            delay={0.2}
          >
            {mountains.slice(0, 4).map((item, index) => (
              <MountainCard
                key={item.id}
                item={item}
                currency={currency}
                onQuickView={() => handleQuickView(item)}
                index={index}
              />
            ))}

            {/* Empty State Cards */}
            {mountains.length < 4 && Array.from({ length: 4 - mountains.length }).map((_, i) => (
              <EmptyStateCard key={`empty-${i}`} index={mountains.length + i} />
            ))}
          </StaggerContainer>
        </div>

        {/* Explore More CTAs */}
        <FadeIn className="text-center mt-10 md:mt-14">
          <p className="text-gray-600 text-sm mb-4">Ready for your next adventure?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Trekking CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/trekking"
                className="group relative inline-flex items-center gap-3 px-6 py-3.5 md:px-8 md:py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-base md:text-lg">Trekking Expeditions</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </Link>
              <p className="text-xs text-gray-500 mt-2 sm:hidden">Conquer the peaks</p>
            </motion.div>

            {/* Tours CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/tours"
                className="group relative inline-flex items-center gap-3 px-6 py-3.5 md:px-8 md:py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-base md:text-lg">Tour Packages</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </Link>
              <p className="text-xs text-gray-500 mt-2 sm:hidden">Curated journeys</p>
            </motion.div>
          </div>

          {/* Desktop helper text */}
          <div className="hidden sm:flex justify-center gap-8 mt-4 text-xs text-gray-500">
            <span>Conquer the peaks</span>
            <span>•</span>
            <span>Curated journeys</span>
          </div>
        </FadeIn>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        item={quickViewItem}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
        currency={currency}
      />
    </section>
  );
}
