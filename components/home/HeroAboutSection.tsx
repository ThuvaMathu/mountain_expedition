"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mountain, Award, Target } from "lucide-react";
import { SlideUp } from "../ui/motion-wrapper";
import { motion } from "framer-motion";

const achievements = [
    {
        icon: Mountain,
        title: "Seven Summits",
        description: "First Tamil woman to conquer all 7 peaks"
    },
    {
        icon: Award,
        title: "Everest Conqueror",
        description: "Summited the world's highest peak"
    },
    {
        icon: Target,
        title: "Record Breaker",
        description: "Fastest Indian woman - 2 years 25 days"
    }
];

export function HeroAboutSection() {
    return (
        <section className="relative py-10 md:py-14 lg:py-16 overflow-hidden bg-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, #f59e0b 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    {/* Left Side - Image Collage */}
                    <div className="relative order-1 lg:order-1 w-full">
                        <SlideUp className="relative">
                            {/* Main Image with animated border */}
                            <div className="relative aspect-[3/4] w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
                                {/* Background Image (behind, smaller) */}
                                <motion.div
                                    animate={{ rotate: [0, -4, 4, 0] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 rounded-3xl rotate-12 translate-x-28 overflow-hidden shadow-xl border-4 border-white/80 scale-90 translate-y-12"
                                >
                                    <img
                                        src="/images/muthamilselvi/img-1.png"
                                        alt="Training"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                                <motion.div
                                    animate={{ rotate: [3, 5, -5, 0] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 rounded-3xl -rotate-12 -translate-x-28 overflow-hidden shadow-xl border-4 border-white/80 scale-90 -translate-y-12"
                                >
                                    <img
                                        src="/images/muthamilselvi/img-2.png"
                                        alt="Training"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>

                                {/* Animated gradient background for main image */}
                                <motion.div
                                    animate={{ rotate: [0, 3, -3, 0] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -inset-4 bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-500 rounded-3xl opacity-70 -z-10"
                                />

                                {/* Main Image (front, larger) */}
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[3/4] z-10">
                                    <img
                                        src="/images/muthamilselvi/img-4.png"
                                        alt="Muthamilselvi"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Floating Badge */}
                                <motion.div
                                    animate={{ y: [0, -12, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -bottom-4 -right-4 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl p-5 shadow-xl border-2 border-white z-20"
                                >
                                    <div className="text-center">
                                        <div className="text-4xl font-bold">7</div>
                                        <div className="text-xs uppercase tracking-wide font-semibold">Summits</div>
                                    </div>
                                </motion.div>
                            </div>
                        </SlideUp>
                    </div>

                    {/* Right Side - Content */}
                    <div className="space-y-8 order-2 lg:order-2">
                        <SlideUp className="space-y-4">
                            <span className="inline-block text-teal-600 font-semibold tracking-wider uppercase text-sm">
                                Welcome to
                            </span>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                                Tamil Adventure Trekking Club
                            </h1>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                                Authentic Trekking Experiences across the world.
                            </h2>
                        </SlideUp>

                        <SlideUp delay={0.2} className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl font-medium">
                            Led by <span className="font-bold text-teal-700">Muthamilselvi Narayanan</span> – Fastest Indian woman to complete the 7 highest peaks of the world.
                        </SlideUp>

                        {/* Achievement Cards */}
                        <div className="grid sm:grid-cols-3 gap-4 pt-4">
                            {achievements.map((item, index) => (
                                <SlideUp key={item.title} delay={0.3 + index * 0.1}>
                                    <div className="bg-white border border-teal-100 rounded-2xl p-4 text-center hover:shadow-lg hover:shadow-teal-500/20 hover:border-teal-300 transition-all duration-300 hover:-translate-y-1">
                                        <item.icon className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                                        <h4 className="text-gray-900 font-semibold text-sm">{item.title}</h4>
                                        <p className="text-gray-500 text-xs mt-1">{item.description}</p>
                                    </div>
                                </SlideUp>
                            ))}
                        </div>

                        <SlideUp delay={0.6} className="pt-4">
                            <Link href="/about">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-full px-8 py-6 text-lg group shadow-lg shadow-teal-500/30"
                                >
                                    Learn More About Her
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </SlideUp>
                    </div>
                </div>
            </div>
        </section>
    );
}
