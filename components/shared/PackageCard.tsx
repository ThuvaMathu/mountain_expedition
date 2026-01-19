"use client";

import React from "react";
import Link from "next/link";
import { Check, MapPin, Clock, Users, Ticket, MountainSnow, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PackageCardProps {
  id: string;
  type: "tours" | "trekking";
  title: string;
  image: string;
  priceINR: number;
  priceUSD: number;
  location: string;
  duration: string;
  groupSize?: string;
  availableSlots?: number;
  difficulty?: string;
  features?: string[];
  currency: "INR" | "USD";
  thumbnail?: string;
  pricingType?: "price" | "enquire";
}

export function PackageCard({
  id,
  type,
  title,
  image,
  priceINR,
  priceUSD,
  location,
  duration,
  groupSize,
  features = [],
  currency,
  availableSlots,
  difficulty,
  thumbnail,
  pricingType = "price"
}: PackageCardProps) {
  const price = currency === "INR" ? priceINR : priceUSD;
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(price);

  // Default features if none provided, to match the design's "What's include?" list
  const displayFeatures = features.length > 0 ? features : [
    `Duration: ${duration}`,
    groupSize ? `Group Size: ${groupSize}` : "Small Group",
    "Professional Guide",
    "Meals & Transport",
    "Support 24/7"
  ];

  // Helper to determine difficulty color
  const getDifficultyColor = (diff?: string) => {
    if (!diff) return "text-gray-600 bg-gray-100";
    const d = diff.toLowerCase();
    if (d.includes("easy") || d.includes("beginner")) return "text-green-700 bg-green-100";
    if (d.includes("medium") || d.includes("moderate")) return "text-orange-700 bg-orange-100";
    if (d.includes("hard") || d.includes("expert") || d.includes("difficult")) return "text-red-700 bg-red-100";
    return "text-teal-700 bg-teal-100";
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 group">
      {/* Image Header */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={thumbnail || image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {availableSlots !== undefined && availableSlots > 0 && availableSlots <= 5 && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm animate-pulse">
              Only {availableSlots} Left!
            </div>
          )}
          <div className="bg-white/90 backdrop-blur-sm text-teal-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            {type === "tours" ? "Tour" : "Trek"}
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title & Location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-teal-600 transition-colors" title={title}>
            {title}
          </h3>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <MapPin className="w-4 h-4 mr-1 text-teal-500" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        {/* Feature Grid - Replaces List */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Duration */}
          {duration && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
              <Clock className="w-4 h-4 text-teal-500 flex-shrink-0" />
              <span className="truncate">{duration}</span>
            </div>
          )}
          {/* Difficulty */}
          {difficulty && (
            <div className={`flex items-center space-x-2 text-sm p-2 rounded-lg ${getDifficultyColor(difficulty)}`}>
              <MountainSnow className="w-4 h-4 flex-shrink-0" />
              <span className="truncate capitalize">{difficulty}</span>
            </div>
          )}
          {/* Group Size */}
          {groupSize && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
              <Users className="w-4 h-4 text-teal-500 flex-shrink-0" />
              <span className="truncate">{groupSize} Guest{groupSize !== '1' ? 's' : ''}</span>
            </div>
          )}
          {/* Available Slots */}
          {availableSlots !== undefined && availableSlots > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
              <Ticket className="w-4 h-4 text-teal-500 flex-shrink-0" />
              <span className="truncate">{availableSlots} Slots Open</span>
            </div>
          )}
        </div>

        {/* Price & CTA section at bottom */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          {pricingType === "enquire" ? (
            <Link href={`/enquire/${id}`} className="block">
              <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-3 text-base font-semibold rounded-full shadow-lg shadow-teal-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/40 hover:-translate-y-1">
                Enquire Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Starting From</p>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900">{formattedPrice}</span>
                </div>
              </div>
              <Link href={`/${type}/${id}`}>
                <Button className="rounded-full bg-teal-600 hover:bg-teal-700 text-white px-6">
                  Book Now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
