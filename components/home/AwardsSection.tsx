"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function AwardsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
  }, [
    Autoplay({ delay: 4000, stopOnInteraction: false })
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Awards & Recognition
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Celebrating excellence and historic achievements in mountaineering across the globe.
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Carousel Viewport */}
          <div className="overflow-hidden py-10" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {allAwards.map((award, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={index}
                    className="flex-[0_0_80%] md:flex-[0_0_40%] lg:flex-[0_0_30%] min-w-0 px-4 transition-all duration-500 ease-out"
                    style={{
                      transform: isSelected ? "scale(1.1)" : "scale(0.9)",
                      opacity: isSelected ? 1 : 0.7,
                      zIndex: isSelected ? 10 : 1,
                    }}
                  >
                    <div className={cn(
                      "relative h-[400px] rounded-2xl overflow-hidden shadow-lg transition-shadow duration-300",
                      isSelected ? "shadow-2xl ring-4 ring-teal-500/20" : ""
                    )}>
                      {/* Image */}
                      <img
                        src={award.image}
                        alt={award.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center transform transition-transform duration-300">
                        <span className="inline-block px-3 py-1 bg-teal-600 text-xs font-semibold rounded-full mb-3">
                          {award.category}
                        </span>
                        <h3 className="text-2xl font-bold mb-1 leading-tight">
                          {award.title}
                        </h3>
                        <p className="text-gray-300 text-sm font-medium mb-2">
                          {award.subtitle}
                        </p>
                        <p className="text-gray-400 text-xs uppercase tracking-widest">
                          {award.date}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <button
              onClick={scrollPrev}
              className="group p-4 rounded-full border border-gray-300 hover:border-teal-600 hover:bg-teal-50 transition-all duration-300"
              aria-label="Previous slide"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-teal-600" />
            </button>
            <button
              onClick={scrollNext}
              className="group p-4 rounded-full border border-gray-300 hover:border-teal-600 hover:bg-teal-50 transition-all duration-300"
              aria-label="Next slide"
            >
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-teal-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

