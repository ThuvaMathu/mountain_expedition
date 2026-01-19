"use client";

import { Users, Mountain, Award, Globe } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
    Users,
    Mountain,
    Award,
    Globe,
};

interface StatBadgeProps {
    stat: {
        id?: string;
        title: string;
        value: string;
        description?: string;
        icon?: string;
        order?: number;
    };
    delay?: number;
}

export function StatBadge({ stat, delay = 0 }: StatBadgeProps) {
    const Icon = iconMap[stat.icon || "Award"] || Award;

    // Extract numeric value for cleaner display
    const displayValue = stat.value;

    return (
        <div
            className="group relative bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl px-2.5 py-2 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3 border border-white/20 flex items-center gap-2 sm:gap-2.5 md:gap-3 transition-all duration-300 hover:bg-white/15 hover:scale-105"
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Icon */}
            <div className="flex-shrink-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                </div>
            </div>

            {/* Value */}
            <div className="flex-1 min-w-0">
                <div className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight">
                    {displayValue}
                </div>
                <div className="text-white/70 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wide truncate">
                    {stat.title}
                </div>
            </div>

            {/* Shine effect on hover */}
            <div className="absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
        </div>
    );
}

interface StatBadgesGridProps {
    stats: {
        id?: string;
        title: string;
        value: string;
        description?: string;
        icon?: string;
        order?: number;
    }[];
    maxStats?: number;
}

export function StatBadgesGrid({ stats, maxStats = 4 }: StatBadgesGridProps) {
    if (!stats || stats.length === 0) return null;

    const displayStats = stats.slice(0, maxStats);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3">
            {displayStats.map((stat, index) => (
                <StatBadge key={stat.id || index} stat={stat} delay={index * 100} />
            ))}
        </div>
    );
}
