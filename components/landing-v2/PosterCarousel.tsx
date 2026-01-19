"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { FadeIn } from "../ui/motion-wrapper";

interface Poster {
    id: string;
    url: string;
    title?: string;
}

export default function PosterCarousel() {
    const [posters, setPosters] = useState<Poster[]>([]);
    const [loading, setLoading] = useState(true);

    // Fallback images if no posters are uploaded
    const fallbackPosters = [
        { id: "1", url: "/images/posters/poster-adventure.jpg" },
        { id: "2", url: "/images/posters/poster-nature.jpg" },
        { id: "3", url: "/images/posters/poster-mountains.jpg" },
    ];

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 5000, stopOnInteraction: false }),
    ]);

    useEffect(() => {
        const fetchPosters = async () => {
            try {
                if (!db) throw new Error("Firebase not initialized");
                const q = query(collection(db, "posters"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const fetchedPosters = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as Poster[];
                    setPosters(fetchedPosters);
                } else {
                    setPosters(fallbackPosters);
                }
            } catch (error) {
                console.error("Error fetching posters:", error);
                setPosters(fallbackPosters);
            } finally {
                setLoading(false);
            }
        };

        fetchPosters();
    }, []);

    if (loading) {
        return <div className="w-full h-[400px] bg-gray-100 animate-pulse"></div>;
    }

    const displayPosters = posters.length > 0 ? posters : [];

    if (displayPosters.length === 0) return null;

    return (
        <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, #0d9488 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>
            <div className="w-full sm:max-w-7xl sm:mx-auto sm:px-4 md:px-6 lg:px-8">
                <FadeIn className="relative overflow-hidden sm:rounded-[32px] sm:shadow-2xl">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {displayPosters.map((poster) => (
                                <div className="flex-[0_0_100%] min-w-0 relative aspect-[16/9] sm:aspect-[6/2]" key={poster.id}>
                                    <img
                                        src={poster.url}
                                        alt={poster.title || "Poster"}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
