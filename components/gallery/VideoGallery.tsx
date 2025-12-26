"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { FadeIn } from "../ui/motion-wrapper";

interface Video {
    id: string;
    title: string;
    description?: string;
    url: string;
    thumbnailUrl?: string;
    createdAt: any;
}

interface VideoGalleryProps {
    showTitle?: boolean;
}

export default function VideoGallery({ showTitle = true }: VideoGalleryProps) {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVideos = async () => {
            try {
                if (isFirebaseConfigured && db) {
                    const videosSnap = await getDocs(collection(db, "videos"));
                    const videoItems: Video[] = videosSnap.docs.map((d) => ({
                        id: d.id,
                        ...d.data(),
                    } as Video));
                    setVideos(videoItems);
                }
            } catch (error) {
                console.error("Error loading videos:", error);
            } finally {
                setLoading(false);
            }
        };

        loadVideos();
    }, []);

    if (loading) {
        return (
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-video bg-gray-200 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (videos.length === 0) return null;

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {showTitle && (
                    <FadeIn>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Video Gallery
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Watch our adventure videos and expedition highlights
                            </p>
                        </div>
                    </FadeIn>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video, index) => (
                        <FadeIn key={video.id} delay={index * 0.1}>
                            <div className="group relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                                <div className="relative w-full h-full">
                                    {/* Video with poster thumbnail */}
                                    <video
                                        className="w-full h-full object-cover"
                                        controls
                                        poster={video.thumbnailUrl || undefined}
                                        preload="metadata"
                                    >
                                        <source src={video.url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>

                                    {/* Title Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pointer-events-none">
                                        <h3 className="text-white font-semibold text-lg">
                                            {video.title}
                                        </h3>
                                        {video.description && (
                                            <p className="text-gray-300 text-sm line-clamp-1 mt-1">
                                                {video.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
