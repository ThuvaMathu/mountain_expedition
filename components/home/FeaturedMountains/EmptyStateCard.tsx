"use client";

import { motion } from "framer-motion";
import { Mountain, Clock, Bell } from "lucide-react";
import Link from "next/link";

export function EmptyStateCard({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 md:p-6 border border-gray-200 flex flex-col items-center justify-center text-center h-[360px] relative overflow-hidden group"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          animate={{
            backgroundPosition: ["0 0", "60px 60px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Mountain Silhouette Animation */}
      <div className="relative mb-4">
        <motion.div
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Mountain className="w-16 h-16 text-teal-300" strokeWidth={1} />
        </motion.div>
        <motion.div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-teal-200 rounded-full"
          animate={{
            scaleX: [0.5, 1, 0.5],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 + 0.3 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold mb-3"
      >
        <Bell className="w-3.5 h-3.5" />
        Coming Soon
      </motion.div>

      {/* Title */}
      <h4 className="text-base md:text-lg font-bold text-gray-800 mb-2">
        Exciting Adventures Ahead
      </h4>

      {/* Description */}
      <p className="text-sm text-gray-500 mb-4 max-w-[200px]">
        We're crafting new expeditions. Stay tuned for upcoming adventures!
      </p>

      {/* Notify Link */}
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 text-sm text-teal-600 font-semibold hover:text-teal-700 transition-colors group"
      >
        <Clock className="w-4 h-4" />
        <span>Notify Me</span>
      </Link>
    </motion.div>
  );
}
