"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Mountain, Clock, ArrowUp, Calendar, X } from "lucide-react";
import { summitsData, Summit } from "@/lib/data/summits-data";
import { SlideUp, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

const continentColors: Record<string, string> = {
  Asia: "bg-red-500",
  Europe: "bg-blue-500",
  Africa: "bg-amber-500",
  "South America": "bg-green-500",
  Australia: "bg-yellow-500",
  Antarctica: "bg-cyan-400",
  "North America": "bg-purple-500",
};

export function WorldMapTimeline() {
  const [selectedSummit, setSelectedSummit] = useState<Summit | null>(null);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SlideUp className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
            <Mountain className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The Seven Summits Journey
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A record-breaking journey across all seven continents, completed in just{" "}
            <span className="font-semibold text-teal-600">2 years and 25 days</span>
          </p>
        </SlideUp>

        {/* Progress Banner */}
        <SlideUp className="mb-8">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Mountain className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm opacity-90">Journey Complete</div>
                  <div className="text-2xl font-bold">7/7 Summits</div>
                </div>
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold">755</div>
                  <div className="text-xs opacity-80">Days</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">39.6</div>
                  <div className="text-xs opacity-80">KM Total Height</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">7</div>
                  <div className="text-xs opacity-80">Continents</div>
                </div>
              </div>
            </div>
          </div>
        </SlideUp>

        {/* World Map with Markers */}
        <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 rounded-3xl p-4 md:p-8 overflow-hidden">
          {/* Simplified World Map SVG */}
          <svg
            viewBox="0 0 800 400"
            className="w-full h-auto"
            style={{ maxHeight: "400px" }}
          >
            {/* Ocean background */}
            <rect width="800" height="400" fill="#e0f2fe" />

            {/* Simplified continents */}
            {/* North America */}
            <path
              d="M50,50 L200,50 L220,120 L180,180 L100,160 L50,120 Z"
              fill="#d1d5db"
              stroke="#9ca3af"
              strokeWidth="1"
            />
            {/* South America */}
            <path
              d="M150,190 L220,190 L200,320 L160,300 Z"
              fill="#d1d5db"
              stroke="#9ca3af"
              strokeWidth="1"
            />
            {/* Europe */}
            <path
              d="M350,50 L450,50 L440,100 L380,100 Z"
              fill="#d1d5db"
              stroke="#9ca3af"
              strokeWidth="1"
            />
            {/* Africa */}
            <path
              d="M360,120 L480,120 L460,280 L380,260 Z"
              fill="#d1d5db"
              stroke="#9ca3af"
              strokeWidth="1"
            />
            {/* Asia */}
            <path
              d="M460,50 L700,50 L680,180 L500,160 L460,100 Z"
              fill="#d1d5db"
              stroke="#9ca3af"
              strokeWidth="1"
            />
            {/* Australia */}
            <path
              d="M620,250 L720,250 L700,320 L620,300 Z"
              fill="#d1d5db"
              stroke="#9ca3af"
              strokeWidth="1"
            />
            {/* Antarctica */}
            <path
              d="M100,360 L700,360 L680,390 L120,390 Z"
              fill="#e5e7eb"
              stroke="#9ca3af"
              strokeWidth="1"
            />

            {/* Connection lines between summits (in order) */}
            <motion.path
              d="M120,90 L380,70 L430,160 L180,240 L680,280 L350,380 L120,90"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
              opacity="0.4"
            />

            {/* Gradient for connection line */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
            </defs>

            {/* Summit markers */}
            {summitsData.map((summit, index) => (
              <g key={summit.id}>
                {/* Marker circle */}
                <motion.circle
                  cx={(summit.mapX / 100) * 800}
                  cy={(summit.mapY / 100) * 400}
                  r="12"
                  fill={continentColors[summit.continent] || "#0d9488"}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedSummit(summit)}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.3 }}
                />
                {/* Order number */}
                <motion.text
                  x={(summit.mapX / 100) * 800}
                  y={(summit.mapY / 100) * 400 + 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  pointerEvents="none"
                >
                  {index + 1}
                </motion.text>
                {/* Summit name label */}
                <motion.text
                  x={(summit.mapX / 100) * 800}
                  y={(summit.mapY / 100) * 400 - 18}
                  textAnchor="middle"
                  fill="#374151"
                  fontSize="11"
                  fontWeight="600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  pointerEvents="none"
                >
                  {summit.name}
                </motion.text>
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs text-gray-600">
            {Object.entries(continentColors).map(([name, color]) => (
              <div key={name} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summit Cards - Below Map */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {summitsData.map((summit, index) => (
            <motion.div
              key={summit.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedSummit(summit)}
              className="cursor-pointer"
            >
              <motion.div
                whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                className={`bg-white rounded-xl p-4 border-2 transition-all ${
                  selectedSummit?.id === summit.id
                    ? "border-teal-500 shadow-lg"
                    : "border-gray-100 hover:border-teal-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-full ${continentColors[summit.continent]} flex items-center justify-center text-white text-sm font-bold`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {summit.date.split(" ")[0]} {summit.date.split(" ")[1]}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{summit.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <ArrowUp className="w-3 h-3 text-teal-600" />
                  <span className="text-sm font-medium text-teal-600">{summit.height}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{summit.summary}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Summit Detail Modal */}
        <AnimatePresence>
          {selectedSummit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedSummit(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  {/* Header Image */}
                  <div className="relative h-48 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-t-2xl flex items-center justify-center">
                    <Mountain className="w-16 h-16 text-white/30" />
                    <button
                      onClick={() => setSelectedSummit(null)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full ${continentColors[selectedSummit.continent]} text-white text-sm font-medium`}
                    >
                      {selectedSummit.continent}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedSummit.name}
                      </h3>
                      <div className="flex items-center gap-1 text-teal-600 font-semibold">
                        <ArrowUp className="w-5 h-5" />
                        {selectedSummit.height}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {selectedSummit.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedSummit.location}
                      </div>
                    </div>

                    <p className="text-gray-700">{selectedSummit.summary}</p>

                    <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Summit #{summitsData.findIndex((s) => s.id === selectedSummit.id) + 1} of 7
                      </div>
                      <button
                        onClick={() => setSelectedSummit(null)}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
