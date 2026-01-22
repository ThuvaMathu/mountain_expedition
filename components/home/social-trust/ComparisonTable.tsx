"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Crown,
  Star,
} from "lucide-react";
import { useInView } from "react-intersection-observer";

interface ComparisonRow {
  feature: string;
  us: "included" | "better" | "limited" | "none";
  others: string;
  icon?: string;
  description?: string;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: "Expert Female Leadership",
    us: "better",
    others: "Rare / None",
    icon: "🏔️",
    description: "Led by Seven Summits achiever Muthamilselvi",
  },
  {
    feature: "Guide-to-Trekker Ratio",
    us: "included",
    others: "1:12 or more",
    icon: "👥",
    description: "1:6 ratio for personalized attention",
  },
  {
    feature: "Safety Equipment",
    us: "included",
    others: "Basic / Rental",
    icon: "⛑️",
    description: "Medical kits, oxygen, satellite communication",
  },
  {
    feature: "Group Size",
    us: "included",
    others: "20+ people",
    icon: "👫",
    description: "Small groups of 8-15 for better experience",
  },
  {
    feature: "Weather Backup Plan",
    us: "included",
    others: "Not guaranteed",
    icon: "🌤️",
    description: "Free rescheduling if weather doesn't cooperate",
  },
  {
    feature: "Certified Guides",
    us: "included",
    others: "Sometimes",
    icon: "🎖️",
    description: "Government licensed, first-aid certified",
  },
  {
    feature: "Equipment Quality",
    us: "better",
    others: "Basic",
    icon: "🎒",
    description: "Premium 4-season tents, -10°C sleeping bags",
  },
  {
    feature: "Meals Included",
    us: "included",
    others: "Basic meals",
    icon: "🍲",
    description: "Nutritious, varied menu with local cuisine",
  },
  {
    feature: "Insurance Coverage",
    us: "included",
    others: "Not included",
    icon: "🛡️",
    description: "All treks fully insured",
  },
  {
    feature: "24/7 Support",
    us: "included",
    others: "Business hours",
    icon: "📞",
    description: "On-ground emergency support throughout",
  },
  {
    feature: "Sustainable Practices",
    us: "better",
    others: "Limited",
    icon: "🌱",
    description: "Eco-friendly, leave-no-trace expeditions",
  },
  {
    feature: "Success Rate",
    us: "included",
    others: "Variable",
    icon: "🎯",
    description: "97% summit success rate",
  },
];

const includedVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const betterVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
    },
  },
};

export function ComparisonTable() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(
    new Set()
  );

  const toggleExpand = (index: string) => {
    setExpandedFeatures((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: ComparisonRow["us"]) => {
    switch (status) {
      case "included":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 sm:h-7 sm:w-7">
            <Check className="h-3.5 w-3.5 text-green-600 sm:h-4 sm:w-4" />
          </div>
        );
      case "better":
        return (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 sm:h-8 sm:w-8">
            <Star className="h-4 w-4 fill-white text-white sm:h-5 sm:w-5" />
          </div>
        );
      default:
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 sm:h-7 sm:w-7">
            <X className="h-3.5 w-3.5 text-slate-400 sm:h-4 sm:w-4" />
          </div>
        );
    }
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-10 md:py-16 lg:py-20"
    >
      {/* Background Elements */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-teal-100/20 blur-3xl" />

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
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 sm:mb-5 sm:px-5 sm:py-2.5"
          >
            <Crown className="h-4 w-4 text-amber-600 sm:h-5 sm:w-5" />
            <span className="text-xs font-semibold text-amber-700 sm:text-sm">
              Why Choose Us
            </span>
          </motion.div>

          <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            See The{" "}
            <span className="bg-gradient-to-r from-amber-600 to-teal-600 bg-clip-text text-transparent">
              Difference
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base md:text-lg">
            We believe in transparent pricing and delivering real value. Here's
            how we compare to typical operators.
          </p>
        </motion.div>

        {/* Comparison Table - Mobile First */}
        <div className="mx-auto max-w-4xl">
          {/* Header - Hidden on mobile, visible on tablet+ */}
          <div className="mb-4 hidden rounded-t-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 sm:grid sm:grid-cols-3 md:rounded-t-3xl md:px-8 md:py-5">
            <div className="text-sm font-medium text-slate-400">Feature</div>
            <div className="text-center font-bold text-white">Mountain Expeditions</div>
            <div className="text-center text-sm font-medium text-slate-400">
              Typical Operators
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="space-y-3 sm:space-y-2">
            {comparisonData.map((row, index) => {
              const isExpanded = expandedFeatures.has(String(index));
              const indexStr = String(index);

              return (
                <motion.div
                  key={row.feature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`overflow-hidden rounded-xl border transition-all duration-300 sm:rounded-2xl ${
                    row.us === "better"
                      ? "border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 sm:border-2 sm:border-amber-300"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {/* Mobile View - Stacked */}
                  <div className="sm:hidden">
                    <button
                      onClick={() => toggleExpand(indexStr)}
                      className="flex w-full items-center gap-3 p-4 text-left"
                    >
                      {getStatusIcon(row.us)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg sm:hidden">{row.icon}</span>
                          <span className="text-sm font-semibold text-slate-900">
                            {row.feature}
                          </span>
                        </div>
                      </div>
                      {row.description && (
                        <div className="flex-shrink-0">
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                      )}
                    </button>

                    {/* Expanded Details */}
                    {isExpanded && row.description && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="border-t border-slate-100 px-4 pb-4 pt-2"
                      >
                        <p className="pl-9 text-xs text-slate-600">
                          {row.description}
                        </p>
                      </motion.div>
                    )}

                    {/* Comparison Values */}
                    <div className="flex border-t border-slate-100">
                      <div className="flex-1 border-r border-slate-100 bg-teal-50/50 px-4 py-3">
                        <p className="text-xs font-semibold text-teal-700">
                          {row.us === "better" ? "✨ Premium" : "✓ Included"}
                        </p>
                      </div>
                      <div className="flex-1 px-4 py-3">
                        <p className="text-xs text-slate-500">{row.others}</p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop View - Grid */}
                  <div className="hidden sm:grid sm:grid-cols-3">
                    {/* Feature Name */}
                    <div className="flex items-center gap-3 border-b border-r border-slate-100 bg-slate-50/50 px-6 py-4 md:px-8">
                      <span className="text-xl">{row.icon}</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {row.feature}
                      </span>
                    </div>

                    {/* Our Value */}
                    <div
                      className={`flex items-center justify-center border-b border-r px-4 py-4 sm:px-6 ${
                        row.us === "better"
                          ? "bg-gradient-to-r from-amber-50 to-orange-50"
                          : "bg-teal-50/30"
                      }`}
                    >
                      {row.us === "better" ? (
                        <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1.5">
                          <Star className="h-3.5 w-3.5 fill-white text-white" />
                          <span className="text-xs font-bold text-white">
                            Superior
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1.5">
                          <Check className="h-3.5 w-3.5 text-teal-600" />
                          <span className="text-xs font-semibold text-teal-700">
                            Included
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Others Value */}
                    <div className="flex items-center justify-center border-b bg-slate-50/30 px-4 py-4 sm:px-6">
                      <span className="text-sm text-slate-500">{row.others}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center sm:mt-10"
          >
            <div className="mx-auto inline-flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 px-6 py-5 text-white shadow-xl sm:gap-5 sm:rounded-3xl sm:px-10 sm:py-6 md:flex-row">
              <div className="text-left">
                <p className="text-base font-bold sm:text-lg md:text-xl">
                  Ready to experience the difference?
                </p>
                <p className="text-xs text-teal-100 sm:text-sm md:text-base">
                  Book your next adventure with confidence
                </p>
              </div>
              <button className="w-full rounded-full bg-white px-6 py-3 text-sm font-bold text-teal-600 shadow-lg transition-all hover:scale-105 hover:bg-teal-50 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base">
                Browse Expeditions
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
