"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn, SlideUp } from "../ui/motion-wrapper";

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
    align: "start",
    skipSnaps: false,
    dragFree: false,
  }, [
    Autoplay({ delay: 3000, stopOnInteraction: false, rootNode: (emblaRoot) => emblaRoot.parentElement })
  ]);



  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <SlideUp className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Awards & Recognition
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Celebrating excellence and historic achievements in mountaineering across the globe.
          </p>
        </SlideUp>

        <div className="relative max-w-7xl mx-auto">
          {/* Carousel Viewport */}
          <FadeIn>
            <div className="overflow-hidden py-10" ref={emblaRef}>
              <div className="flex touch-pan-y">
                {allAwards.map((award, index) => {
                  return (
                    <div
                      key={index}
                      className="flex-[0_0_80%] md:flex-[0_0_40%] lg:flex-[0_0_30%] min-w-0 px-4"
                    >
                      <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                        {/* Image */}


                        <Image
                          src={award.image}
                          alt={award.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 30vw"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
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
          </FadeIn>

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
    </section >
  );
}

