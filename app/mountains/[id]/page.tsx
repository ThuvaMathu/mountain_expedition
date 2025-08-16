"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { PriceComparison } from "@/components/booking/PriceComparison";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  MapPin,
  Calendar,
  TrendingUp,
  Star,
  Users,
  Clock,
  Shield,
  Award,
  Camera,
} from "lucide-react";

interface Mountain {
  id: string;
  name: string;
  location: string;
  altitude: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  bestSeason: string;
  images: string[];
  price: number;
  rating: number;
  totalReviews: number;
  availableSlots: number;
  category: "seven-summits" | "himalayas" | "indian-peaks";
  description: string;
  longDescription: string;
  duration: string;
  groupSize: string;
  included: string[];
  notIncluded: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
    altitude: number;
  }>;
  competitorPrices: Array<{
    company: string;
    price: number;
  }>;
}

export default function MountainDetailPage() {
  const params = useParams();
  const { t } = useLanguage();
  const [mountain, setMountain] = useState<Mountain | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch from Firebase
    const mockMountain: Mountain = {
      id: params.id as string,
      name: "Mount Everest",
      location: "Nepal/Tibet",
      altitude: 8849,
      difficulty: "Expert",
      bestSeason: "April - May",
      images: [
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      price: 65000,
      rating: 4.8,
      totalReviews: 234,
      availableSlots: 12,
      category: "seven-summits",
      description:
        "The world's highest peak, offering the ultimate mountaineering challenge.",
      longDescription:
        "Mount Everest, standing at 8,849 meters above sea level, represents the pinnacle of mountaineering achievement. This expedition offers experienced climbers the opportunity to stand atop the world's highest peak. Our comprehensive program includes acclimatization rotations, expert Sherpa support, and all necessary equipment for a safe and successful summit attempt.",
      duration: "65 days",
      groupSize: "6-12 climbers",
      included: [
        "All permits and fees",
        "Experienced expedition leader",
        "Sherpa support (1:1 ratio)",
        "Base camp accommodation",
        "All meals during expedition",
        "Oxygen and medical supplies",
        "Satellite communication",
        "Airport transfers in Kathmandu",
      ],
      notIncluded: [
        "International flights",
        "Nepal visa fees",
        "Personal climbing equipment",
        "Travel insurance",
        "Personal expenses",
        "Tips for staff",
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival in Kathmandu",
          description: "Meet the team, gear check, and expedition briefing",
          altitude: 1400,
        },
        {
          day: 2,
          title: "Fly to Lukla, Trek to Phakding",
          description: "Scenic flight to Lukla and begin trek",
          altitude: 2610,
        },
        {
          day: 3,
          title: "Trek to Namche Bazaar",
          description: "Cross suspension bridges and climb to Sherpa capital",
          altitude: 3440,
        },
        {
          day: 4,
          title: "Arrival in Kathmandu",
          description: "Meet the team, gear check, and expedition briefing",
          altitude: 1400,
        },
        {
          day: 5,
          title: "Fly to Lukla, Trek to Phakding",
          description: "Scenic flight to Lukla and begin trek",
          altitude: 2610,
        },
        {
          day: 6,
          title: "Trek to Namche Bazaar",
          description: "Cross suspension bridges and climb to Sherpa capital",
          altitude: 3440,
        },
        // Add more days...
      ],
      competitorPrices: [
        { company: "Alpine Ascents", price: 68000 },
        { company: "Adventure Consultants", price: 72000 },
        { company: "Himalayan Experience", price: 69500 },
        { company: "Summit Quest", price: 65000 },
      ],
    };
    setMountain(mockMountain);
  }, [params.id]);

  if (!mountain) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mountain details...</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              {mountain.name}
            </h1>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-lg font-medium">{mountain.rating}</span>
              <span className="text-gray-600">
                ({mountain.totalReviews} reviews)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{mountain.location}</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>{mountain.altitude.toLocaleString()}m</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{mountain.bestSeason}</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                mountain.difficulty
              )}`}
            >
              {mountain.difficulty}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={mountain.images[selectedImage] || "/placeholder.svg"}
                  alt={mountain.name}
                  className="w-full h-96 object-cover"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-4 right-4 bg-white bg-opacity-90"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {selectedImage + 1} / {mountain.images.length}
                </Button>
              </div>

              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {mountain.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? "border-blue-600"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${mountain.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Expedition
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {mountain.longDescription}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Duration</div>
                    <div className="text-gray-600">{mountain.duration}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Group Size</div>
                    <div className="text-gray-600">{mountain.groupSize}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">
                      Safety Rating
                    </div>
                    <div className="text-gray-600">Excellent</div>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                What's Included
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Included
                  </h3>
                  <ul className="space-y-2">
                    {mountain.included.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-700 mb-4">
                    Not Included
                  </h3>
                  <ul className="space-y-2">
                    {mountain.notIncluded.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-600 mr-2">✗</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Price Comparison */}
            {/* <PriceComparison competitorPrices={mountain.competitorPrices} /> */}

            {/* Itinerary Preview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Expedition Itinerary
              </h2>
              <div className="space-y-4">
                {mountain.itinerary.slice(0, 4).map((day) => (
                  <div
                    key={day.day}
                    className="border-l-4 border-blue-600 pl-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Day {day.day}: {day.title}
                      </h3>
                      <span className="text-sm text-gray-600">
                        {day.altitude}m
                      </span>
                    </div>
                    <p className="text-gray-700">{day.description}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-6">
                View Complete Itinerary
              </Button>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-blue-600">
                    ${mountain.price.toLocaleString()}
                  </div>
                  <div className="text-gray-600">per person</div>
                  <div className="flex items-center justify-center mt-2 text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{mountain.availableSlots} slots available</span>
                  </div>
                </div>

                {!showBooking ? (
                  <div className="space-y-4">
                    <Button
                      onClick={() => setShowBooking(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                    >
                      Check Availability & Book
                    </Button>
                    <Button variant="outline" className="w-full">
                      Download Brochure
                    </Button>
                    <Button variant="outline" className="w-full">
                      Contact Expert
                    </Button>
                  </div>
                ) : (
                  <BookingCalendar mountain={mountain} />
                )}

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-1" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      <span>Expert Guides</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
