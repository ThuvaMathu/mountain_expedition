"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight, Trophy, Award, Medal, Globe2 } from "lucide-react";
import { FadeIn, SlideUp } from "@/components/ui/motion-wrapper";

// Combined awards data for the carousel
const allAwards = [
  {
    title: "Fastest Indian Woman",
    subtitle: "Seven Summits Record",
    date: "June 2025",
    image: "/images/awards/summit-celebration.jpg",
    category: "National Record"
  },
  {
    title: "Everest Conqueror",
    subtitle: "First Tamil Woman",
    date: "May 2023",
    image: "/images/awards/everest-achievement.jpg",
    category: "Historic"
  },
  {
    title: "Kalpana Chawla Award",
    subtitle: "Tamil Nadu Govt",
    date: "2023",
    image: "/images/awards/govt-award.jpg",
    category: "Government"
  },
  {
    title: "Singa Pen Award",
    subtitle: "Aval Vikatan",
    date: "2023",
    image: "/images/awards/media-award-1.jpg",
    category: "Media"
  },
  {
    title: "Trailblazing Icon",
    subtitle: "FETNA (USA)",
    date: "2025",
    image: "/images/awards/international-fetna.jpg",
    category: "International"
  },
  {
    title: "Sakthi Award",
    subtitle: "Puthiya Thalaimurai",
    date: "2025",
    image: "/images/awards/media-award-2.jpg",
    category: "Media"
  }
];

const categories = [
  { key: "all", label: "All", icon: Trophy },
  { key: "National Record", label: "Records", icon: Trophy },
  { key: "Government", label: "Government", icon: Award },
  { key: "Media", label: "Media", icon: Medal },
  { key: "International", label: "International", icon: Globe2 },
];

export function AwardsTabs() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: false,
  }, [
    Autoplay({ delay: 3000, stopOnInteraction: false, rootNode: (emblaRoot) => emblaRoot.parentElement })
  ]);

  const filteredAwards = activeCategory === "all"
    ? allAwards
    : allAwards.filter(award => award.category === activeCategory);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SlideUp className="text-center mb-6 md:mb-10">
          <div className="inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 mb-2 md:mb-3 shadow-lg">
            <Trophy className="w-5 h-5 md:w-7 md:h-7 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
            Awards & Recognition
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-xs md:text-sm">
            Celebrating excellence and historic achievements in mountaineering
          </p>
        </SlideUp>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-6 md:mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.key;
            const count = category.key === "all"
              ? allAwards.length
              : allAwards.filter(a => a.category === category.key).length;

            return (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium md:font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <Icon className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">{category.label}</span>
                <span className={`px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold ${
                  isActive ? "bg-white/25 text-white" : "bg-amber-100 text-amber-700"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Carousel */}
        <div className="relative">
          <FadeIn>
            <div className="overflow-hidden py-4 md:py-6" ref={emblaRef}>
              <div className="flex touch-pan-y">
                {filteredAwards.map((award, index) => {
                  return (
                    <div
                      key={index}
                      className="flex-[0_0_75%] sm:flex-[0_0_60%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0 px-2 md:px-3"
                    >
                      <div className="relative h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <Image
                          src={award.image}
                          alt={award.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 75vw, (max-width: 768px) 60vw, (max-width: 1200px) 45vw, 30vw"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 text-white text-center transform transition-transform duration-300">
                          <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 bg-teal-600 text-[10px] md:text-xs font-semibold rounded-full mb-1.5 md:mb-2">
                            {award.category}
                          </span>
                          <h3 className="text-base md:text-xl lg:text-2xl font-bold mb-0.5 md:mb-1 leading-tight">
                            {award.title}
                          </h3>
                          <p className="text-gray-300 text-xs md:text-sm font-medium mb-0.5 md:mb-1">
                            {award.subtitle}
                          </p>
                          <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">
                            {award.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 md:gap-6 mt-3 md:mt-4">
            <button
              onClick={scrollPrev}
              className="group p-2 md:p-3 rounded-full border border-gray-300 hover:border-amber-600 hover:bg-amber-50 transition-all duration-300"
              aria-label="Previous slide"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-amber-600" />
            </button>
            <button
              onClick={scrollNext}
              className="group p-2 md:p-3 rounded-full border border-gray-300 hover:border-amber-600 hover:bg-amber-50 transition-all duration-300"
              aria-label="Next slide"
            >
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-amber-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
