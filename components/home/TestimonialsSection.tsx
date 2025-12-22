"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star, Users, MapPin, Mountain, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Everest Trekker",
    image: "/placeholder-nwzb1.png", 
    text: "Tamil Adventure Trekking Club made my dream of climbing Kilimanjaro come true. The guides were incredible, and I felt safe every step of the way. Highly recommended!",
    rating: 5,
    date: "28 OCT",
    mountain: "Kilimanjaro"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Mountain Enthusiast",
    image: "/placeholder-83tbi.png",
    text: "The Everest Base Camp trek was life-changing. The organization was flawless, and the team's expertise showed throughout the journey.",
    rating: 5,
    date: "15 NOV",
    mountain: "Everest Base Camp"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Adventure Seeker",
    image: "/placeholder-7fo4z.png",
    text: "Professional, safe, and absolutely amazing experience. The team went above and beyond to ensure our success on Aconcagua.",
    rating: 5,
    date: "02 DEC",
    mountain: "Aconcagua"
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Alpinist",
    image: "/placeholder-nwzb1.png",
    text: "An unforgettable adventure! The team's professionalism and attention to detail made this challenging climb both safe and enjoyable.",
    rating: 5,
    date: "10 DEC",
    mountain: "Mont Blanc"
  },
  {
    id: 5,
    name: "Priya Sharma",
    role: "Nature Lover",
    image: "/placeholder-83tbi.png",
    text: "The most beautiful and well-organized trek I've ever experienced. Every moment was carefully planned and executed to perfection.",
    rating: 5,
    date: "20 DEC",
    mountain: "Annapurna"
  }
];

export function TestimonialsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    slidesToScroll: 1,
    containScroll: "trimSnaps"
  }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);

  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Decorative Map/Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Stats Section - Matches Reference */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-20 gap-10">
            {/* Trusted By */}
            <div className="flex items-center gap-6">
                <div className="relative">
                    <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                        <img src="/mountaineer-female-teal.png" alt="Trust" className="w-full h-full object-cover" />
                    </div>
                     <div className="absolute -top-2 -right-2">
                         <span className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full text-white text-xs">
                             <Users className="w-4 h-4" />
                         </span>
                     </div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                        Trusted by <span className="text-teal-600 underline decoration-teal-300 decoration-4 underline-offset-4">500+</span> <br/>
                        happy adventurers.
                    </h3>
                </div>
            </div>

            {/* Guides Count */}
            <div className="flex items-center gap-4 border-l-2 border-gray-100 pl-8 hidden md:flex">
                <div>
                     <h3 className="text-4xl font-bold text-gray-900">50+</h3>
                     <p className="text-sm text-gray-500 font-medium">Expert Guides <br/> for your journey.</p>
                </div>
            </div>

            {/* Rating */}
             <div className="flex items-center gap-4 border-l-2 border-gray-100 pl-8">
                <div>
                     <h3 className="text-4xl font-bold text-gray-900">4.9</h3>
                     <div className="flex items-center gap-1 my-1">
                         {[1,2,3,4,5].map(i => (
                             <Star key={i} className="w-4 h-4 text-orange-400 fill-current" />
                         ))}
                     </div>
                     <p className="text-sm text-gray-500 font-medium">1,200 Ratings</p>
                </div>
            </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden -mx-4 px-4 py-8" ref={emblaRef}>
          <div className="flex gap-6">
            {testimonials.map((item) => (
              <div 
                key={item.id} 
                className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_32%] min-w-0"
              >
                <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 h-full flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                    
                    {/* Header: Avatar & Name */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100 shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-500">{item.role}</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mb-6 flex-grow">
                        <p className="text-gray-600 leading-relaxed text-[15px]">
                            "{item.text}"
                        </p>
                    </div>

                     {/* Mountain Tag */}
                     <div className="flex items-center gap-2 mb-6">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-md">
                            <Mountain className="w-3 h-3" />
                            {item.mountain}
                        </span>
                     </div>


                    {/* Footer: Rating & Date */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-gray-900 mr-2">{item.rating.toFixed(1)}</span>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={cn("w-4 h-4", i < item.rating ? "text-orange-400 fill-current" : "text-gray-200")} />
                            ))}
                        </div>
                        <div className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-lg">
                            {item.date}
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
                <button
                    key={idx}
                    className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        idx === activeIndex ? "w-8 bg-teal-600" : "bg-gray-300"
                    )}
                    onClick={() => emblaApi?.scrollTo(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                />
            ))}
        </div>

      </div>
    </section>
  );
}

