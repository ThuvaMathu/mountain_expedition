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
                    // Try to use local ones if they exist, otherwise empty
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
        return <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-2xl"></div>;
    }

    // If no posters and no fallbacks that work (e.g. file doesn't exist), show nothing or static
    // But we assume fallbacks might fail if files don't exist, so let's just use what we have.
    const displayPosters = posters.length > 0 ? posters : [];

    if (displayPosters.length === 0) return null;

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <FadeIn className="relative overflow-hidden rounded-[32px] shadow-2xl">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {displayPosters.map((poster) => (
                                <div className="flex-[0_0_100%] min-w-0 relative aspect-[6/2]" key={poster.id}>
                                    <img
                                        src={poster.url}
                                        alt={poster.title || "Poster"}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Gradient Overlay for Text Visibility if needed later */}
                                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div> */}
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
