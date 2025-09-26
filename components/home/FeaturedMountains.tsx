"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Calendar, TrendingUp, Star, Users } from "lucide-react";
import { db, isFirebaseConfigured } from "@/lib/firebase"; // ✅ adjust import path
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { ImageLoader } from "../ui/image-loader";
import { useCurrencyStore } from "@/stores/currency-store";
import { formatCurrency } from "@/lib/utils";

// ✅ Use your Firestore type

export function FeaturedMountains() {
  const { t } = useLanguage();
  const [mountains, setMountains] = useState<TMountainType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { currency } = useCurrencyStore();

  // 🔥 Load function (latest 6 mountains)
  const load = async () => {
    if (!isFirebaseConfigured || !db) {
      setMountains([]);
      return;
    }
    try {
      const q = query(
        collection(db, "mountains"),
        orderBy("createdAt", "desc"),
        limit(6)
      );
      const snap = await getDocs(q);
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

  const difficulties = [
    { id: "all", name: "All" },
    { id: "Beginner", name: "Beginner" },
    { id: "Intermediate", name: "Intermediate" },
    { id: "Advanced", name: "Advanced" },
    { id: "Expert", name: "Expert" },
  ];

  const filteredMountains =
    selectedCategory === "all"
      ? mountains
      : mountains.filter((m) => m.difficulty === selectedCategory);

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
            {t("featured_expeditions")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("featured_expeditions_description")}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {difficulties.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="px-6 py-2"
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMountains.map((mountain) => (
            <div
              key={mountain.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden mountain-card-hover"
            >
              <div className="relative">
                <ImageLoader
                  src={mountain.imageUrl?.[0] || "/placeholder.svg"}
                  alt={mountain.name}
                  height="h-48"
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

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
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
                    <span className="text-2xl font-bold text-teal-600">
                      {formatCurrency(
                        currency === "USD"
                          ? mountain.priceUSD
                          : mountain.priceINR
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

                <Link href={`/mountains/${mountain.id}`}>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    {t("view_details")}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/mountains">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 bg-transparent"
            >
              View All Mountains
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
