"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FadeIn, SlideUp, SlideRight, ScaleIn } from "../ui/motion-wrapper";

export function HeroAboutSection() {
    return (
        <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Side - Content */}
                    <div className="space-y-8 order-2 lg:order-1">
                        <SlideUp className="space-y-4">
                            <span className="inline-block text-teal-600 font-semibold tracking-wider uppercase text-sm">
                                Travel with Muthamilselvi
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Meet <br />
                                <span className="text-teal-600">Muthamilselvi</span>
                            </h2>
                        </SlideUp>

                        <SlideUp delay={0.2} className="text-lg text-gray-600 leading-relaxed max-w-xl">
                            She is the first woman from Tamil Nadu to conquer Mount Everest
                            and complete the Seven Summits, the tallest peaks on all seven
                            continents. She also holds the record as the fastest Indian
                            woman to achieve this legendary feat in just 2 years and 25
                            days.
                        </SlideUp>

                        <SlideUp delay={0.3} className="text-lg text-gray-600 leading-relaxed max-w-xl">
                            Her mission is to ignite courage in others, especially
                            women, to face challenges and achieve victories. Muthamilselvi's
                            incredible journey was about more than just climbing; it was about
                            breaking fear.
                        </SlideUp>

                        <SlideUp delay={0.4} className="pt-4">
                            <Link href="/about">
                                <Button
                                    size="lg"
                                    className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 py-6 text-lg group"
                                >
                                    Learn More
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </SlideUp>
                    </div>

                    {/* Right Side - Image Collage */}
                    <div className="relative order-1 lg:order-2 h-[500px] md:h-[600px] w-full">
                        {/* Center Main Image (Large Pill) */}
                        <FadeIn delay={0.2} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-80 h-96 md:h-[450px] rounded-[100px] overflow-hidden shadow-2xl z-20 border-4 border-white">
                            <img
                                src="/mountaineer-female-teal.png"
                                alt="Muthamilselvi Portrait"
                                className="w-full h-full object-cover"
                            />
                        </FadeIn>

                        {/* Left Image (Medium Pill) */}
                        <ScaleIn delay={0.4} className="absolute top-1/4 left-0 md:left-4 w-40 md:w-48 h-56 md:h-64 rounded-[60px] overflow-hidden shadow-xl z-10 border-4 border-white transform -rotate-6">
                            <img
                                src="/mountaineer-crevasse-rescue.png"
                                alt="Training"
                                className="w-full h-full object-cover"
                            />
                        </ScaleIn>

                        {/* Right Image (Medium Pill) */}
                        <ScaleIn delay={0.5} className="absolute bottom-1/4 right-0 md:right-4 w-40 md:w-48 h-56 md:h-64 rounded-[60px] overflow-hidden shadow-xl z-10 border-4 border-white transform rotate-6">
                            <img
                                src="/images/hero-carousal/mountains.jpg"
                                alt="Mountains"
                                className="w-full h-full object-cover"
                            />
                        </ScaleIn>

                        {/* Top Right Decorative (Small) */}
                        <ScaleIn delay={0.6} className="absolute top-10 right-10 md:right-20 w-24 h-24 rounded-full overflow-hidden shadow-lg z-0 border-2 border-teal-100 opacity-80">
                            <img
                                src="/images/hero-carousal/nature.jpg"
                                alt="Nature"
                                className="w-full h-full object-cover"
                            />
                        </ScaleIn>

                        {/* Bottom Left Decorative (Small) */}
                        <ScaleIn delay={0.7} className="absolute bottom-10 left-10 md:left-20 w-24 h-24 rounded-full overflow-hidden shadow-lg z-0 border-2 border-teal-100 opacity-80">
                            <img
                                src="/images/hero-carousal/adventure.jpg"
                                alt="Adventure"
                                className="w-full h-full object-cover"
                            />
                        </ScaleIn>

                        {/* Decorative Elements */}
                        <div className="absolute top-1/4 right-10 w-20 h-20 bg-teal-100/50 rounded-full blur-xl" />
                        <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-blue-100/50 rounded-full blur-xl" />
                    </div>
                </div>
            </div>
        </section>
    );
}
