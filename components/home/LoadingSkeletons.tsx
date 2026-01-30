import React from "react";

export function SkeletonNextAdventure() {
    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="h-48 bg-gray-200 rounded animate-pulse mb-4" />
                            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function SkeletonFeaturedMountains() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-gray-50 rounded-lg overflow-hidden">
                            <div className="h-64 bg-gray-200 animate-pulse" />
                            <div className="p-4">
                                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function SkeletonPosterCarousel() {
    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
            </div>
        </section>
    );
}

export function SkeletonBlog() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-50 rounded-lg overflow-hidden">
                            <div className="h-48 bg-gray-200 animate-pulse" />
                            <div className="p-4">
                                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                                <div className="h-3 bg-gray-200 rounded animate-pulse mb-2" />
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function SkeletonSection() {
    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            </div>
        </section>
    );
}
