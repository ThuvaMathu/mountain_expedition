import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, Star, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCurrencyStore } from "@/stores/currency-store";
import { ImageLoader } from "../ui/image-loader";

interface TouristCardProps {
  tourist: TMountainType; // Reusing TMountainType for tourist packages
  category: "domestic" | "international";
}

export function TouristCard({ tourist, category }: TouristCardProps) {
  const { currency } = useCurrencyStore();

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

  const getCategoryColor = (cat: string) => {
    return cat === "domestic"
      ? "bg-blue-100 text-blue-800"
      : "bg-purple-100 text-purple-800";
  };

  const getTotalSlots = (tourist: TMountainType) => {
    return (
      tourist.availableDates?.reduce(
        (total, date) => total + date.slots.length,
        0
      ) || 0
    );
  };

  const getAvailableSlots = (tourist: TMountainType) => {
    return (
      tourist.availableDates?.reduce((total, date) => {
        return (
          total +
          date.slots.reduce((dateTotal, slot) => {
            return (
              dateTotal +
              Math.max(0, slot.maxParticipants - slot.bookedParticipants)
            );
          }, 0)
        );
      }, 0) || 0
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden tourist-card-hover">
      <div className="relative">
        <ImageLoader
          src={tourist.imageUrl?.[0] || "/placeholder.svg"}
          alt={tourist.name}
          height="h-56"
          priority
        />

        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
              category
            )}`}
          >
            {category === "domestic" ? "Domestic" : "International"}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
              tourist.difficulty
            )}`}
          >
            {tourist.difficulty}
          </span>
        </div>

        <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-3 py-1">
          <div className="flex items-center space-x-1">
            <div className="text-sm">
              <span className="text-green-600 font-medium">
                {getAvailableSlots(tourist)}
              </span>
              <span className="text-gray-500"> spots available</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{tourist.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {tourist.description}
        </p>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{tourist.location}</span>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm">{tourist.duration}</span>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="text-sm">{tourist.bestSeason}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-teal-600">
              {formatCurrency(
                currency === "USD" ? tourist.priceUSD : tourist.priceINR
              )}
            </span>
            <span className="text-gray-500 text-sm ml-1">per person</span>
          </div>
          <div className="text-xs text-gray-500">
            {tourist.availableDates?.length || 0} dates •{" "}
            {getTotalSlots(tourist)} slots
          </div>
        </div>

        <Link href={`/tourist/${tourist.id}`}>
          <Button className="w-full bg-teal-600 hover:bg-teal-700">
            View Details & Book
          </Button>
        </Link>
      </div>
    </div>
  );
}
