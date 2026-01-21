"use client";

import { motion } from "framer-motion";
import { LucideIcon, icons } from "lucide-react";
import { StatItem } from "@/lib/data/stats-data";

interface AchievementCardProps {
  stat: StatItem;
  index?: number;
}

const iconMap: Record<string, LucideIcon> = {
  Mountain: icons.Mountain,
  Clock: icons.Clock,
  Award: icons.Award,
  ArrowUp: icons.ArrowUp,
  Trophy: icons.Trophy,
  BookOpen: icons.BookOpen,
  Globe: icons.Globe,
  Users: icons.Users,
  Target: icons.Target,
  Medal: icons.Medal,
  Star: icons.Star,
};

export function AchievementCard({ stat, index = 0 }: AchievementCardProps) {
  const Icon = iconMap[stat.icon] || icons.Award;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className={`${stat.bgColor} rounded-xl md:rounded-2xl p-3 md:p-5 lg:p-6 text-center relative overflow-hidden group`}
    >
      {/* Background decoration */}
      <div className="absolute -right-6 -bottom-6 md:-right-8 md:-bottom-8 w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/30 group-hover:scale-150 transition-transform duration-500" />

      {/* Icon */}
      <div className={`${stat.color} mx-auto mb-2 md:mb-4 relative z-10`}>
        <div className="w-10 h-10 md:w-14 md:h-16 lg:w-16 lg:h-16 mx-auto rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8" strokeWidth={2.5} />
        </div>
      </div>

      {/* Value */}
      <div className={`${stat.color} text-2xl md:text-3xl lg:text-5xl font-bold mb-1 md:mb-2 relative z-10`}>
        {stat.prefix && <span className="text-sm md:text-base lg:text-xl font-medium">{stat.prefix}</span>}
        {stat.value}
        {stat.suffix && <span className="text-sm md:text-base lg:text-xl font-medium">{stat.suffix}</span>}
      </div>

      {/* Label */}
      <div className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 mb-0.5 md:mb-1 relative z-10">
        {stat.label}
      </div>

      {/* Description */}
      {stat.description && (
        <div className="text-[10px] md:text-xs text-gray-600 max-w-[150px] md:max-w-[180px] mx-auto relative z-10">
          {stat.description}
        </div>
      )}

      {/* Highlight badge */}
      {stat.highlight && (
        <div className="absolute top-2 right-2 md:top-3 md:right-3">
          <span className="inline-flex items-center px-1.5 py-0.5 md:px-2 md:py-1 rounded-full bg-white/80 text-[10px] md:text-xs font-medium text-amber-600">
            <icons.Star className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1 fill-current" />
            <span className="hidden sm:inline">Record</span>
          </span>
        </div>
      )}
    </motion.div>
  );
}
