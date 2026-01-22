"use client";

import { motion } from "framer-motion";
import { Award, ShieldCheck, Users, Star, Globe, Mountain } from "lucide-react";
import { useInView } from "react-intersection-observer";

// Trust badge data
const trustBadges = [
  {
    icon: Award,
    value: "15+",
    label: "Years Experience",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "Safety Record",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Users,
    value: "500+",
    label: "Happy Expeditions",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Star,
    value: "4.9",
    label: "Average Rating",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    icon: Globe,
    value: "50+",
    label: "Countries Served",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Mountain,
    value: "7",
    label: "Summits Conquered",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

// Partner logos (using text-based for now - replace with actual logos)
const partners = [
  { name: "TripAdvisor", color: "text-green-600" },
  { name: "Lonely Planet", color: "text-blue-700" },
  { name: "National Geographic", color: "text-yellow-600" },
  { name: "Adventure Travel", color: "text-orange-600" },
  { name: "Forbes Travel", color: "text-purple-600" },
];

const certifications = [
  "ISO 9001:2015 Certified",
  "Government Registered",
  "AETA Member",
  "Insurance Covered",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
} as const;

export function TrustBadgeBar() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-8 md:py-12"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />

      <div className="relative container mx-auto px-4 sm:px-6">
        {/* Main Trust Badges - Mobile First */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-8 md:mb-12"
        >
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            className="mb-6 text-center text-lg font-bold text-slate-800 sm:text-xl md:text-2xl"
          >
            Trusted by Adventurers Worldwide
          </motion.h2>

          {/* Grid Layout - 2 cols mobile, 3 cols tablet, 6 cols desktop */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={badge.label}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className={`${badge.bgColor} group relative overflow-hidden rounded-xl p-3 text-center shadow-sm transition-shadow hover:shadow-md sm:rounded-2xl sm:p-4`}
                >
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:animate-shimmer" />

                  <div className={`${badge.color} mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white sm:mb-3 sm:h-12 sm:w-12`}>
                    <Icon className="h-4 w-4 sm:h-6 sm:w-6" strokeWidth={2.5} />
                  </div>
                  <div className={`text-lg font-bold ${badge.color} sm:text-2xl`}>
                    {badge.value}
                  </div>
                  <div className="text-xs text-slate-600 sm:text-sm">
                    {badge.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Featured In / Partners - Scrollable on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6 md:mb-8"
        >
          <p className="mb-4 text-center text-sm font-medium text-slate-500 sm:text-base">
            Featured In & Partnered With
          </p>
          {/* Mobile: horizontal scroll - Desktop: flex wrap centered */}
          <div className="flex flex-wrap justify-center gap-3 overflow-x-auto pb-2 sm:gap-6 md:gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex-shrink-0 px-4 py-2"
              >
                <span
                  className={`text-lg font-bold ${partner.color} sm:text-xl md:text-2xl`}
                >
                  {partner.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications - Pill badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* Mobile: horizontal scroll - Desktop: flex wrap */}
          <div className="flex flex-wrap justify-center gap-2 overflow-x-auto pb-1 sm:gap-3">
            {certifications.map((cert, index) => (
              <motion.span
                key={cert}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
              >
                <ShieldCheck className="h-3 w-3 text-green-600 sm:h-4 sm:w-4" />
                {cert}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
