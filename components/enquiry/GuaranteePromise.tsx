"use client";

import { CheckCircle, Shield, DollarSign, RotateCcw } from "lucide-react";
import { SlideUp } from "@/components/ui/motion-wrapper";

const guarantees = [
    {
        icon: Shield,
        title: "100% Safety First",
        description: "Certified guides & quality equipment",
    },
    {
        icon: DollarSign,
        title: "Transparent Pricing",
        description: "No hidden fees or surprises",
    },
    {
        icon: RotateCcw,
        title: "Easy Cancellation",
        description: "Free cancellation up to 48 hours",
    },
    {
        icon: CheckCircle,
        title: "Satisfaction Guaranteed",
        description: "We're committed to your experience",
    },
];

export function GuaranteePromise() {
    return (
        <SlideUp>
            <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-center gap-1 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Our Promise to You</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {guarantees.map((guarantee) => {
                        const Icon = guarantee.icon;
                        return (
                            <div key={guarantee.title} className="flex items-center gap-2">
                                <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <Icon className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-gray-900">
                                        {guarantee.title}
                                    </div>
                                    <div className="text-xs text-gray-500 hidden sm:block">
                                        {guarantee.description}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </SlideUp>
    );
}
