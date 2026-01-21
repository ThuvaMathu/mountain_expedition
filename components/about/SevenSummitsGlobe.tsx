"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mountain, Calendar, ArrowUp, MapPin, X, Globe as GlobeIcon, Map } from "lucide-react";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { Globe } from "@/components/ui/globe";
import Image from "next/image";
import { COBEOptions } from "cobe";

// Seven Summits data with coordinates
const summits = [
  {
    id: 1,
    name: "Everest",
    date: "May 23, 2023",
    location: "Nepal",
    continent: "Asia",
    height: "8848",
    coords: [27.9881, 86.9250] as [number, number],
    summary: "First woman from Tamil Nadu to stand on top of the world",
  },
  {
    id: 2,
    name: "Elbrus",
    date: "July 21, 2023",
    location: "Russia",
    continent: "Europe",
    height: "5642",
    coords: [43.3499, 42.4453] as [number, number],
    summary: "Europe's highest peak conquered",
  },
  {
    id: 3,
    name: "Kilimanjaro",
    date: "Sept 12, 2023",
    location: "Tanzania",
    continent: "Africa",
    height: "5895",
    coords: [-3.0674, 37.3556] as [number, number],
    summary: "Successfully summited the rooftop of Africa",
  },
  {
    id: 4,
    name: "Aconcagua",
    date: "Feb 13, 2024",
    location: "Argentina",
    continent: "South America",
    height: "6962",
    coords: [-32.6532, -70.0109] as [number, number],
    summary: "Highest peak in South America",
  },
  {
    id: 5,
    name: "Kosciuszko",
    date: "Mar 17, 2024",
    location: "Australia",
    continent: "Australia",
    height: "2228",
    coords: [-36.4561, 148.2638] as [number, number],
    summary: "Conquered the highest Australian peak",
  },
  {
    id: 6,
    name: "Vinson",
    date: "Dec 22, 2024",
    location: "Antarctica",
    continent: "Antarctica",
    height: "4892",
    coords: [-78.5254, -85.6172] as [number, number],
    summary: "Successfully reached the Antarctic summit",
  },
  {
    id: 7,
    name: "Denali",
    date: "Jun 16, 2025",
    location: "USA",
    continent: "North America",
    height: "6190",
    coords: [63.0692, -151.0070] as [number, number],
    summary: "Final peak - Record completed in 755 days!",
  },
];

// Globe configuration with pin markers
const GLOBE_CONFIG: COBEOptions = {
  width: 1200,
  height: 1200,
  onRender: () => { },
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [0.95, 0.95, 0.95],
  markerColor: [0.05, 0.58, 0.53], // teal-600
  glowColor: [1, 1, 1],
  markers: summits.map((summit) => ({
    location: [summit.coords[0], summit.coords[1]] as [number, number],
    size: 0.05,
  })),
};

export function SevenSummitsGlobe() {
  const [activeSummit, setActiveSummit] = useState(0);
  const [selectedSummit, setSelectedSummit] = useState<typeof summits[0] | null>(null);

  return (
    <section className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-12 md:py-16 lg:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SlideUp className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-teal-500/20 rounded-full text-teal-400 text-xs md:text-sm font-medium mb-4 md:mb-6">
            <Mountain className="w-3 h-3 md:w-4 md:h-4" />
            <span>The Ultimate Achievement</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
            The Seven Summits Journey
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg px-4">
            Explore the interactive globe to trace the incredible journey across all seven continents
          </p>
        </SlideUp>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Globe with Pin Markers */}
          <div className="relative flex justify-center items-center min-h-[350px] md:min-h-[450px] lg:min-h-[500px]">
            <Globe config={GLOBE_CONFIG} className="max-w-[300px] md:max-w-[450px] lg:max-w-[600px]" />
            {/* Globe glow effect */}
            <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/50 rounded-full -z-10" />

            {/* Floating Pin Legend */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <MapPin className="w-3 h-3 md:w-4 md:h-4 text-teal-400" />
              <span className="text-white text-xs md:text-sm">7 Summit Locations</span>
            </div>
          </div>

          {/* Summit Info Panel */}
          <div className="relative">
            {/* Summit selector */}
            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
              {summits.map((summit, index) => (
                <button
                  key={summit.id}
                  onClick={() => setActiveSummit(index)}
                  className={`flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 md:px-4 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all ${activeSummit === index
                    ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                >
                  <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{summit.name}</span>
                </button>
              ))}
            </div>

            {/* Active Summit Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSummit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20"
              >
                {/* Header */}
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-5">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold text-white truncate">
                      {summits[activeSummit].name}
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm flex items-center gap-1 md:gap-2 mt-0.5 md:mt-1">
                      <GlobeIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      <span className="truncate">{summits[activeSummit].continent}</span>
                    </p>
                  </div>
                  <div className="ml-auto text-2xl md:text-3xl font-bold text-teal-400 shrink-0">
                    #{activeSummit + 1}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-5">
                  <div className="flex flex-col md:flex-row items-center md:gap-2 px-2 md:px-4 py-2 md:py-3 bg-white/5 rounded-xl text-center">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-amber-400 shrink-0 mb-1 md:mb-0" />
                    <div>
                      <div className="text-[10px] md:text-xs text-gray-400">Date</div>
                      <div className="text-white text-[10px] md:text-sm font-medium truncate">{summits[activeSummit].date.split(' ')[0]}</div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center md:gap-2 px-2 md:px-4 py-2 md:py-3 bg-white/5 rounded-xl text-center">
                    <Map className="w-4 h-4 md:w-5 md:h-5 text-teal-400 shrink-0 mb-1 md:mb-0" />
                    <div>
                      <div className="text-[10px] md:text-xs text-gray-400">Location</div>
                      <div className="text-white text-[10px] md:text-sm font-medium truncate">{summits[activeSummit].location}</div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center md:gap-2 px-2 md:px-4 py-2 md:py-3 bg-white/5 rounded-xl text-center">
                    <ArrowUp className="w-4 h-4 md:w-5 md:h-5 text-teal-400 shrink-0 mb-1 md:mb-0" />
                    <div>
                      <div className="text-[10px] md:text-xs text-gray-400">Height</div>
                      <div className="text-white text-[10px] md:text-sm font-bold">{summits[activeSummit].height}m</div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-sm md:text-base mb-4 md:mb-6">{summits[activeSummit].summary}</p>

                {/* Progress indicator */}
                <div className="mb-3 md:mb-4">
                  <div className="flex items-center justify-between text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2">
                    <span>Journey Progress</span>
                    <span className="text-teal-400 font-semibold">{activeSummit + 1}/7</span>
                  </div>
                  <div className="h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      key={activeSummit}
                      initial={{ width: 0 }}
                      animate={{ width: `${((activeSummit + 1) / 7) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-teal-500 via-amber-500 to-teal-500 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Stats Banner */}
        <SlideUp className="mt-10 md:mt-16">
          <div className="bg-gradient-to-r from-teal-600/20 via-amber-500/20 to-teal-600/20 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-teal-500/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
              <div className="group">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">
                  7
                </div>
                <div className="text-xs md:text-sm text-gray-400">Summits Completed</div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-amber-400 mb-1 group-hover:scale-110 transition-transform">
                  755
                </div>
                <div className="text-xs md:text-sm text-gray-400">Total Days</div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">
                  7
                </div>
                <div className="text-xs md:text-sm text-gray-400">Continents</div>
              </div>
              <div className="group">
                <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-teal-400 mb-1 group-hover:scale-110 transition-transform">
                  1st
                </div>
                <div className="text-xs md:text-sm text-gray-400">Tamil Woman</div>
              </div>
            </div>
          </div>
        </SlideUp>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedSummit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4"
            onClick={() => setSelectedSummit(null)}
          >
            <button
              onClick={() => setSelectedSummit(null)}
              className="absolute top-3 right-3 md:top-4 md:right-4 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <Image
                  src="/images/muthamilselvi/img-1.png"
                  alt={selectedSummit.name}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{selectedSummit.name}</h3>
                <p className="text-gray-300 text-sm md:text-base">{selectedSummit.height}m • {selectedSummit.continent} • {selectedSummit.date}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
