"use client";

import { motion } from "framer-motion";
import { heroStats } from "@/lib/data/stats-data";
import { StatCounter } from "./StatCounter";

export function HeroStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
    >
      {heroStats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + index * 0.1 }}
        >
          <StatCounter stat={stat} className="h-full" />
        </motion.div>
      ))}
    </motion.div>
  );
}
