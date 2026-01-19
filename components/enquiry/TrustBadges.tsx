"use client";

import { Clock, HeadphonesIcon, CheckCircle, Lock } from "lucide-react";
import { SlideUp } from "@/components/ui/motion-wrapper";

const badges = [
    {
        icon: Clock,
        title: "Quick Response",
        description: "Reply within 24 hours",
    },
    {
        icon: HeadphonesIcon,
        title: "24/7 Support",
        description: "Always here to help",
    },
    {
        icon: CheckCircle,
        title: "Verified Experts",
        description: "Certified guides only",
    },
    {
        icon: Lock,
        title: "Best Price Guarantee",
        description: "No hidden charges",
    },
];

export function TrustBadges() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            {badges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                    <SlideUp key={badge.title} delay={index * 0.05}>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-4 text-center hover:shadow-md hover:border-teal-200 transition-all duration-300">
                            <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-teal-100 rounded-full mb-2">
                                <Icon className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
                            </div>
                            <div className="text-xs md:text-sm font-semibold text-gray-900">
                                {badge.title}
                            </div>
                            <div className="text-xs text-gray-500 hidden md:block">
                                {badge.description}
                            </div>
                        </div>
                    </SlideUp>
                );
            })}
        </div>
    );
}
