"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Mountain, Award, Globe } from "lucide-react";
import { TStat } from "@/types/types.d";
import { SlideUp } from "@/components/ui/motion-wrapper";

interface TrustStatsProps {
    stats: TStat[];
}

const iconMap: Record<string, React.ElementType> = {
    Users,
    Mountain,
    Award,
    Globe,
};

export function TrustStats({ stats }: TrustStatsProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!stats || stats.length === 0) return null;

    return (
        <section className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 py-8 md:py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {stats.map((stat, index) => {
                        const Icon = iconMap[stat.icon || "Award"] || Award;
                        const numericValue = parseInt(stat.value.replace(/[^\d]/g, "")) || 0;

                        return (
                            <SlideUp key={stat.id || index} delay={index * 0.1}>
                                <div className="text-center text-white">
                                    <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                                        <Icon className="w-6 h-6 md:w-7 md:h-7" />
                                    </div>
                                    {mounted && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                                        >
                                            <div className="text-2xl md:text-4xl font-bold mb-1">
                                                {stat.value}
                                            </div>
                                        </motion.div>
                                    )}
                                    <div className="text-xs md:text-sm font-medium opacity-90">
                                        {stat.title}
                                    </div>
                                    {stat.description && (
                                        <div className="text-xs opacity-75 mt-1 hidden md:block">
                                            {stat.description}
                                        </div>
                                    )}
                                </div>
                            </SlideUp>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
