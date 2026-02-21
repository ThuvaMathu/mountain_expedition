"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Star, TrendingUp, Eye, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageLoader } from "@/components/ui/image-loader";
import { formatCurrency } from "@/lib/utils";

interface MountainCardProps {
  item: TMountainType;
  currency: string;
  onQuickView: () => void;
  index?: number;
}

// Difficulty levels
const getDifficultyLevel = (item: TMountainType) => {
  const level = item.difficulty || "moderate";
  const levels = {
    easy: { label: "Easy", color: "bg-green-500", percent: 25 },
    moderate: { label: "Moderate", color: "bg-yellow-500", percent: 50 },
    challenging: { label: "Challenging", color: "bg-orange-500", percent: 75 },
    expert: { label: "Expert", color: "bg-red-500", percent: 100 },
  };
  return levels[level as keyof typeof levels] || levels.moderate;
};

// Urgency badge based on available slots
const getUrgencyBadge = (slots: number, createdAt?: any) => {
  const now = new Date();
  const createdDate = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt || 0);
  const daysSinceCreation = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceCreation < 7) {
    return { text: "New", variant: "new" };
  }

  if (slots <= 5) {
    return { text: `${slots} left`, variant: "urgent" };
  }
  if (slots <= 15) {
    return { text: "Filling Fast", variant: "warning" };
  }

  return null;
};

// Category badge logic - Domestic vs International
const getCategoryBadge = (category?: string) => {
  const isDomestic = category === 'domestic';

  return {
    text: isDomestic ? 'Domestic' : 'International',
    color: isDomestic ? 'bg-green-600' : 'bg-blue-600'
  };
};

export function MountainCard({ item, currency, onQuickView, index = 0 }: MountainCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const difficulty = getDifficultyLevel(item);
  const urgencyBadge = getUrgencyBadge(item.availableSlots, item.createdAt);

  const cardVariants: any = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -6, transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-2xl p-3 md:p-4 shadow-lg border border-gray-100 flex flex-col relative overflow-hidden group"
      style={{ originY: 0 }}
    >
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          boxShadow: isHovered ? "inset 0 0 0 2px rgba(13, 148, 136, 0.3)" : "none",
        }}
      />

      {/* Quick View Button */}
      <button
        onClick={onQuickView}
        className="absolute top-12 right-12 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-teal-500 hover:text-white"
        aria-label="Quick view"
      >
        <Eye className="w-4 h-4" />
      </button>

      {/* Urgency Badge */}
      {urgencyBadge && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.2 }}
          className={`absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1 shadow-sm ${urgencyBadge.variant === "urgent"
            ? "bg-red-500 text-white"
            : urgencyBadge.variant === "warning"
              ? "bg-orange-500 text-white"
              : "bg-teal-500 text-white"
            }`}
        >
          {urgencyBadge.variant === "urgent" && <Zap className="w-3 h-3" />}
          {urgencyBadge.text}
        </motion.div>
      )}

      {/* Image */}
      <div className="relative h-44 md:h-48 rounded-xl overflow-hidden mb-3 md:mb-4">
        <ImageLoader
          src={item.imageUrl?.[0] || "/placeholder.svg"}
          alt={item.name}
          height="h-full"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Location Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-teal-700 flex items-center shadow-sm">
          <TrendingUp className="h-3 w-3 mr-1" />
          {item.location.split(',').pop()?.trim().substring(0, 15) || "Adventure"}
        </div>

        {/* Category Badge - Domestic/International */}
        <div className={`absolute bottom-3 right-3 ${getCategoryBadge(item.category).color} text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm`}>
          {getCategoryBadge(item.category).text}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <h4 className="text-base md:text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
          {item.name}
        </h4>

        {/* Difficulty Badge & Level Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Difficulty</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${difficulty.color}`}>
              {difficulty.label}
            </span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${difficulty.percent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`h-full ${difficulty.color} rounded-full`}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center text-[10px] md:text-xs text-gray-500 gap-2 mb-3">
          <span className="flex items-center bg-gray-50 px-2 py-1 rounded">
            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
            {item.duration}
          </span>
          <span className="flex items-center bg-gray-50 px-2 py-1 rounded">
            <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
            {item.rating}
          </span>
        </div>

        <div className="mt-auto">
          {item.pricingType === "enquire" ? (
            <Link href={`/enquire/${item.id}`} className="block">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 animate-gradient-x" />
                <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white relative z-10 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300">
                  Enquire Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            </Link>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  {formatCurrency(
                    currency === "USD" ? (item.priceUSD || 0) : (item.priceINR || 0),
                    currency
                  )}
                </span>
                <span className="text-[10px] md:text-xs text-gray-500 block">
                  {item.type === 'tour' ? 'per tour' : 'per person'}
                </span>
              </div>
              <Link
                href={item.type === "tour" ? `/tours/${item.id}` : `/trekking/${item.id}`}
                className="shrink-0"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-200 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all duration-300 shadow-sm hover:shadow-lg"
                >
                  Book
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
