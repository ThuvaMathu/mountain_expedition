"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { Testimonial } from "@/services/get-testimonials";
import { SlideUp } from "@/components/ui/motion-wrapper";

interface TestimonialsCarouselProps {
    testimonials: Testimonial[];
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!testimonials || testimonials.length === 0) return null;

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const current = testimonials[currentIndex];

    return (
        <SlideUp>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">What Trekkers Say</h3>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={prevTestimonial}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            aria-label="Previous review"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={nextTestimonial}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            aria-label="Next review"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                >
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-teal-200" />

                    <div className="pl-6">
                        {/* Stars */}
                        <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                        i < (current.rating || 5)
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Review Text */}
                        <p className="text-gray-700 italic mb-4">"{current.text}"</p>

                        {/* Author */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                                {current.name?.charAt(0) || "U"}
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900 text-sm">{current.name}</div>
                                <div className="text-xs text-gray-500">
                                    {current.mountain || "Trekker"} • {current.date || "Recently"}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-1.5 mt-4">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                                index === currentIndex
                                    ? "bg-teal-500 w-6"
                                    : "bg-gray-300 hover:bg-gray-400"
                            }`}
                            aria-label={`Go to review ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Auto-play */}
                <div className="text-center mt-3">
                    <span className="text-xs text-gray-400">
                        Verified reviews from our community
                    </span>
                </div>
            </div>
        </SlideUp>
    );
}
