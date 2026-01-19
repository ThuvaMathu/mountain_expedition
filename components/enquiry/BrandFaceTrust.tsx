"use client";

import { SlideUp } from "@/components/ui/motion-wrapper";
import { Mountain, Award, Target, Crown, Star, Quote, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const achievements = [
    {
        icon: Crown,
        title: "Everest",
        value: "8,848m"
    },
    {
        icon: Mountain,
        title: "7 Summits",
        value: "Complete"
    },
    {
        icon: Target,
        title: "Record",
        value: "2y 25d"
    },
];

export function BrandFaceTrust() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900 rounded-3xl shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)',
                    backgroundSize: '30px 30px'
                }} />
            </div>

            {/* Glowing orb effect */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
                <SlideUp>
                    {/* Header with Image */}
                    <div className="relative p-6 pb-4 text-center">
                        {/* Top badge */}
                        <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                                Your Expedition Leader
                            </span>
                        </div>

                        {/* Profile Image */}
                        <div className="relative inline-block mb-4">
                            {/* Animated gradient rings */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 opacity-40 blur-sm"
                                style={{ padding: '3px' }}
                            />

                            {/* Image container with gradient border */}
                            <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 mx-auto">
                                <div className="w-full h-full rounded-full overflow-hidden border-3 border-slate-900">
                                    <Image
                                        src="/images/muthamilselvi/img-4.png"
                                        alt="Muthamilselvi - Everest Summiteer"
                                        width={112}
                                        height={112}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <motion.div
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-2 -right-2 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-xl px-2 py-1 shadow-lg border-2 border-white/20"
                            >
                                <div className="text-center">
                                    <div className="text-lg font-bold leading-none">7</div>
                                    <div className="text-xs uppercase tracking-wide font-semibold">Summits</div>
                                </div>
                            </motion.div>

                            {/* Quote icon decoration */}
                            <div className="absolute -top-1 -left-1 text-teal-400/20">
                                <Quote className="w-6 h-6" fill="currentColor" />
                            </div>
                        </div>

                        {/* Name & Title */}
                        <h3 className="text-lg font-bold text-white mb-0.5">
                            Muthamilselvi Narayanan
                        </h3>
                        <p className="text-teal-300 text-xs font-medium mb-2">
                            Everest Summiteer • First Tamil Woman
                        </p>

                        {/* Divider */}
                        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent mx-auto" />
                    </div>

                    {/* Stats Grid */}
                    <div className="px-4 pb-3">
                        <div className="grid grid-cols-3 gap-2">
                            {achievements.map((achievement) => {
                                const Icon = achievement.icon;
                                return (
                                    <div
                                        key={achievement.title}
                                        className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 text-center border border-white/10"
                                    >
                                        <div className="inline-flex items-center justify-center w-7 h-7 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-lg mb-1.5 shadow-lg">
                                            <Icon className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="text-amber-400 text-xs font-bold">
                                            {achievement.value}
                                        </div>
                                        <div className="text-white/80 text-xs mt-0.5">
                                            {achievement.title}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Trust Points */}
                    <div className="px-4 pb-4">
                        <div className="space-y-1.5">
                            {[
                                "15+ Years Mountaineering",
                                "500+ Expeditions Led",
                                "Certified Expert Guide"
                            ].map((point, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-white/80 text-xs">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                                    <span>{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Trust Bar */}
                    <div className="px-4 pb-4 pt-2 border-t border-white/10">
                        <div className="flex items-center justify-center gap-1.5 text-white/60 text-xs">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span>2000+ Climbers • 50+ Mountains</span>
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        </div>
                    </div>
                </SlideUp>
            </div>
        </div>
    );
}
