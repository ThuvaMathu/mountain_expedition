import React from "react";
import { Trophy } from "lucide-react";

export function LoadingAwards() {
    return (
        <section className="border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                {/* Header Skeleton */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
                        <Trophy className="w-8 h-8 text-teal-600 animate-pulse" />
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
                </div>

                {/* Award Cards Skeleton */}
                {[1, 2, 3, 4].map((section) => (
                    <div key={section} className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
                            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {[1, 2].map((card) => (
                                <div
                                    key={card}
                                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Image Skeleton */}
                                        <div className="md:w-2/5 h-48 md:h-auto bg-gray-200 animate-pulse" />

                                        {/* Content Skeleton */}
                                        <div className="flex-1 p-6 space-y-3">
                                            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                                            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                                            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                                            <div className="space-y-2">
                                                <div className="h-3 bg-gray-200 rounded animate-pulse" />
                                                <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
