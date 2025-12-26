"use client";

import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, SlideUp } from "../ui/motion-wrapper";

interface VideoItem {
    id: string;
    title: string;
    url: string;
    thumbnailUrl?: string;
    createdAt: any;
}

export function VideoGallerySection() {
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: "start",
        slidesToScroll: 1,
        breakpoints: {
            "(min-width: 768px)": { slidesToScroll: 2 },
            "(min-width: 1024px)": { slidesToScroll: 3 },
        },
    });

    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
    const [playingId, setPlayingId] = useState<string | null>(null);

    const scrollPrev = useCallback(
        () => emblaApi && emblaApi.scrollPrev(),
        [emblaApi]
    );
    const scrollNext = useCallback(
        () => emblaApi && emblaApi.scrollNext(),
        [emblaApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                if (!db) return;
                const q = query(
                    collection(db, "videos"),
                    orderBy("createdAt", "desc"),
                    limit(10)
                );
                const snapshot = await getDocs(q);
                const fetchedVideos = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as VideoItem[];
                setVideos(fetchedVideos);
            } catch (error) {
                console.error("Error fetching videos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    // Track video play state
    const handlePlay = (videoId: string) => {
        setPlayingId(videoId);
    };

    const handlePause = () => {
        setPlayingId(null);
    };

    if (loading) return null;
    if (videos.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <SlideUp>
                        <div className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
                            Expedition Diaries
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900">
                            Watch Our Adventures
                        </h2>
                        <p className="mt-4 text-gray-600 max-w-2xl">
                            See what it's like to be on top of the world. Capture the moments
                            that matter.
                        </p>
                    </SlideUp>

                    {/* Navigation Buttons */}
                    <div className="hidden md:flex space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full w-12 h-12 border-gray-200 hover:bg-white hover:border-teal-500 hover:text-teal-600 transition-colors"
                            onClick={scrollPrev}
                            disabled={!prevBtnEnabled}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full w-12 h-12 border-gray-200 hover:bg-white hover:border-teal-500 hover:text-teal-600 transition-colors"
                            onClick={scrollNext}
                            disabled={!nextBtnEnabled}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <FadeIn className="relative overflow-hidden">
                    <div className="relative overflow-hidden" ref={emblaRef}>
                        <div className="flex -ml-4">
                            {videos.map((video) => (
                                <div
                                    className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0 pl-4"
                                    key={video.id}
                                >
                                    <div className="relative aspect-[9/16] md:aspect-[3/4] rounded-3xl overflow-hidden group bg-gray-900 shadow-xl">
                                        {/* Video with poster thumbnail */}
                                        <video
                                            className="absolute inset-0 w-full h-full object-cover"
                                            poster={video.thumbnailUrl || undefined}
                                            loop
                                            controls
                                            muted
                                            playsInline
                                            preload="metadata"
                                            onPlay={() => handlePlay(video.id)}
                                            onPause={handlePause}
                                            onEnded={handlePause}
                                        >
                                            <source src={video.url} type="video/mp4" />
                                        </video>

                                        {/* Play button and overlay - only show when not playing */}
                                        {playingId !== video.id && (
                                            <>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 shadow-lg">
                                                        <Play className="w-8 h-8 text-white fill-current translate-x-1" />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* Title overlay */}
                                        <div className="absolute bottom-0 left-0 p-6 w-full pointer-events-none">
                                            <h3 className="text-white font-bold text-xl leading-snug line-clamp-2 drop-shadow-lg">
                                                {video.title}
                                            </h3>
                                            {playingId !== video.id && (
                                                <p className="text-gray-200 text-xs mt-2 uppercase tracking-wide font-medium drop-shadow">
                                                    Click to Play
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
