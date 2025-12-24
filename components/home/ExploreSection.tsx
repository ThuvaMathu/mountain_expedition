"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn, SlideUp } from "../ui/motion-wrapper";

export function ExploreSection() {
  const destinations = [
    {
      image: "/images/hero-carousal/beech.jpg",
      label: "BEACH",
      gradient: "from-cyan-400/40 to-blue-500/40",
    },
    {
      image: "/images/hero-carousal/nature.jpg",
      label: "NATURE",
      gradient: "from-green-400/40 to-emerald-500/40",
    },
    {
      image: "/images/hero-carousal/hotels.jpg",
      label: "HOTEL",
      gradient: "from-purple-400/40 to-pink-500/40",
    },
    {
      image: "/images/hero-carousal/mountains.jpg",
      label: "MOUNTAINS",
      gradient: "from-slate-400/40 to-gray-600/40",
    },
    {
      image: "/images/hero-carousal/adventure.jpg",
      label: "ADVENTURE",
      gradient: "from-orange-400/40 to-red-500/40",
    },
    {
      image: "/images/hero-carousal/culture.jpg",
      label: "CULTURE",
      gradient: "from-amber-400/40 to-yellow-500/40",
    },
    {
      image: "/images/hero-carousal/wildlife.jpg",
      label: "WILDLIFE",
      gradient: "from-teal-400/40 to-cyan-500/40",
    },
    {
      image: "/images/hero-carousal/camping.jpg",
      label: "CAMPING",
      gradient: "from-indigo-400/40 to-purple-500/40",
    },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [
      Autoplay({
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section
      id="next-section"
      className="relative min-h-screen overflow-hidden bg-white"
    >
      {/* Decorative Background Elements matching site theme */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Left Side - Content */}
          <div className="space-y-6 lg:space-y-8">
            <SlideUp>
              {/* Badge */}
              <div className="inline-block mb-6">
                <span className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-700 rounded-md text-xs font-semibold tracking-wider uppercase border border-teal-200">
                  Travel worldwide
                </span>
              </div>

              {/* Main Heading */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight uppercase mb-6">
                NEVER STOP
                <br />
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  EXPLORING
                </span>
                <br />
                THE WORLD
              </h2>

              {/* Description */}
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-lg mb-8">
                Join the journey of a lifetime as you explore breathtaking
                destinations across the globe. From serene beaches to majestic
                mountains, discover unforgettable moments and create memories that
                will last forever.
              </p>

              {/* CTA Button */}
              <div className="pt-2">
                <Link href="/mountains">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white px-6 py-3 text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    EXPLORE NOW
                  </Button>
                </Link>
              </div>
            </SlideUp>

            {/* Slide Indicators */}
            <FadeIn delay={0.3} className="flex items-center gap-3 pt-4">
              <button
                onClick={scrollPrev}
                className="w-8 h-8 flex items-center justify-center bg-white hover:bg-teal-50 border border-teal-200 rounded-full shadow-sm transition-all duration-300 hover:shadow-md"
                aria-label="Previous slide"
              >
                <svg
                  className="w-4 h-4 text-teal-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={scrollNext}
                className="w-8 h-8 flex items-center justify-center bg-white hover:bg-teal-50 border border-teal-200 rounded-full shadow-sm transition-all duration-300 hover:shadow-md"
                aria-label="Next slide"
              >
                <svg
                  className="w-4 h-4 text-teal-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

            </FadeIn>
          </div>

          {/* Right Side - Horizontal Carousel */}
          <div className="relative">
            {/* Decorative Dots Pattern */}
            <div className="absolute -top-4 -left-4 grid grid-cols-4 gap-2 opacity-30 z-10">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-teal-600 rounded-full" />
              ))}
            </div>

            {/* Carousel Container */}
            <div className="overflow-hidden -mx-4 sm:mx-0" ref={emblaRef}>
              <div className="flex gap-4 sm:gap-6 pl-4 sm:pl-0">
                {destinations.map((destination, index) => (
                  <div
                    key={index}
                    className="flex-[0_0_85%] sm:flex-[0_0_280px] md:flex-[0_0_320px] relative group"
                  >
                    <div className="relative h-[350px] sm:h-[400px] md:h-[480px] rounded-2xl overflow-hidden shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-200">
                      <img
                        src={destination.image}
                        alt={destination.label}
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient Overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${destination.gradient}`}
                      />
                      {/* Label */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-wider drop-shadow-2xl">
                          {destination.label}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

