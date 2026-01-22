"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Cloud,
  Backpack,
  Award,
  Headphones,
  Umbrella,
  CheckCircle2,
} from "lucide-react";
import { useInView } from "react-intersection-observer";

interface GuaranteeCard {
  icon: typeof Shield;
  title: string;
  description: string;
  highlight: string;
  color: string;
  gradient: string;
}

const guarantees: GuaranteeCard[] = [
  {
    icon: Shield,
    title: "100% Safety Record",
    description: "Zero major incidents in 15+ years of operations",
    highlight: "Zero Incidents",
    color: "from-green-500 to-emerald-600",
    gradient: "bg-gradient-to-br from-green-50 to-emerald-50",
  },
  {
    icon: Cloud,
    title: "Weather Guarantee",
    description: "Free rescheduling if weather doesn't cooperate",
    highlight: "Free Reschedule",
    color: "from-blue-500 to-cyan-600",
    gradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
  },
  {
    icon: Backpack,
    title: "Premium Gear Included",
    description: "High-quality equipment provided at no extra cost",
    highlight: "No Extra Cost",
    color: "from-orange-500 to-amber-600",
    gradient: "bg-gradient-to-br from-orange-50 to-amber-50",
  },
  {
    icon: Award,
    title: "Certified Expert Guides",
    description: "All guides are government licensed and certified",
    highlight: "Govt. Licensed",
    color: "from-purple-500 to-violet-600",
    gradient: "bg-gradient-to-br from-purple-50 to-violet-50",
  },
  {
    icon: Headphones,
    title: "24/7 On-Ground Support",
    description: "Emergency assistance available throughout your journey",
    highlight: "Always Available",
    color: "from-teal-500 to-cyan-600",
    gradient: "bg-gradient-to-br from-teal-50 to-cyan-50",
  },
  {
    icon: Umbrella,
    title: "Full Insurance Coverage",
    description: "All expeditions are fully insured for your peace of mind",
    highlight: "Fully Insured",
    color: "from-rose-500 to-pink-600",
    gradient: "bg-gradient-to-br from-rose-50 to-pink-50",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
} as const;

export function SafetyGuarantees() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-white py-10 md:py-14 lg:py-16"
    >
      {/* Background decorative elements */}
      <div className="absolute left-0 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-teal-100/50 blur-3xl" />
      <div className="absolute right-0 bottom-20 h-64 w-64 translate-x-1/2 rounded-full bg-cyan-100/50 blur-3xl" />

      <div className="relative container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="mb-8 text-center sm:mb-10 md:mb-12"
        >
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 sm:mb-5 sm:px-5 sm:py-2.5"
          >
            <Shield className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
            <span className="text-xs font-semibold text-green-700 sm:text-sm">
              Your Safety is Our Priority
            </span>
          </motion.div>

          <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            Why Adventure With{" "}
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Confidence?
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base md:text-lg">
            We take care of everything so you can focus on the experience.
            Every expedition is backed by our comprehensive guarantees.
          </p>
        </motion.div>

        {/* Guarantee Cards - Mobile First Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3"
        >
          {guarantees.map((guarantee, index) => {
            const Icon = guarantee.icon;
            return (
              <motion.div
                key={guarantee.title}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`${guarantee.gradient} group relative overflow-hidden rounded-2xl border border-slate-100/50 p-5 shadow-sm transition-all duration-300 hover:shadow-xl sm:rounded-3xl sm:p-6`}
              >
                {/* Card Background Pattern */}
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/40 blur-2xl transition-transform duration-500 group-hover:scale-150" />

                {/* Icon */}
                <div className={`relative mb-4 inline-flex rounded-2xl bg-gradient-to-br ${guarantee.color} p-3 shadow-lg sm:mb-5 sm:p-4`}>
                  <Icon className="h-5 w-5 text-white sm:h-6 sm:w-6" strokeWidth={2.5} />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-base font-bold text-slate-900 sm:text-lg md:text-xl">
                  {guarantee.title}
                </h3>
                <p className="mb-3 text-xs text-slate-600 sm:text-sm">
                  {guarantee.description}
                </p>

                {/* Highlight Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 sm:px-4 sm:py-2">
                  <CheckCircle2 className="h-3 w-3 text-green-600 sm:h-4 sm:w-4" />
                  <span className="text-xs font-semibold text-slate-800 sm:text-sm">
                    {guarantee.highlight}
                  </span>
                </div>

                {/* Corner Accent */}
                <div className={`absolute bottom-0 right-0 h-16 w-16 bg-gradient-to-br ${guarantee.color} opacity-10 transition-opacity duration-300 group-hover:opacity-20`} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA - Trust Reinforcement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center sm:mt-10 md:mt-12"
        >
          <div className="mx-auto inline-flex flex-col items-center gap-3 rounded-2xl bg-slate-900 px-6 py-4 sm:flex-row sm:gap-4 sm:px-8 sm:py-5 md:rounded-3xl">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-teal-400 sm:h-6 sm:w-6" />
              <span className="text-sm font-semibold text-white sm:text-base">
                Still have questions?
              </span>
            </div>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:from-teal-600 hover:to-cyan-600 hover:scale-105 sm:px-6 sm:py-2.5"
            >
              Talk to Our Team
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
