"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, ZoomIn, Play as PlayIcon, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StoryMediaGalleryProps {
  images: string[];
  videoUrl?: string;
  title?: string;
}

export function StoryMediaGallery({ images, videoUrl, title = "Story Gallery" }: StoryMediaGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play video when component mounts and when video URL changes
  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.play().catch((err) => {
        // Autoplay was prevented (browser policy), video will play on user interaction
        console.log("Autoplay prevented, user interaction required:", err);
      });
    }
  }, [videoUrl]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Format date to readable string
  const formatDate = (date: any) => {
    if (!date) return "Recent";
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Video Section - If video exists */}
      {videoUrl && (
        <div className="relative overflow-hidden rounded-2xl bg-black aspect-video sm:rounded-3xl group">
          <video
            ref={videoRef}
            controls
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster={images[0] || undefined}
            preload="metadata"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Mute/Unmute Toggle Button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 sm:h-12 sm:w-12"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </button>
        </div>
      )}

      {/* Images Grid */}
      {images && images.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl">
            {title} ({images.length} {images.length === 1 ? "Photo" : "Photos"})
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
            {images.map((imageUrl, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative aspect-square overflow-hidden rounded-xl bg-slate-100 cursor-pointer sm:rounded-2xl"
              >
                <Image
                  src={imageUrl}
                  alt={`${title} - Photo ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(min-width: 640px) 50vw, (min-width: 1024px) 33vw, 100vw"
                />
                {/* Overlay with play icon for hover */}
                <div className="absolute inset-0 bg-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white sm:h-10 sm:w-10" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImageIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedImageIndex(null)}
                className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:-right-12 sm:h-12 sm:w-12"
                aria-label="Close"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              {/* Image */}
              <div className="relative overflow-hidden rounded-2xl bg-black sm:rounded-3xl">
                <Image
                  src={images[selectedImageIndex]}
                  alt={`${title} - Photo ${selectedImageIndex + 1}`}
                  width={1200}
                  height={1200}
                  className="w-full h-auto object-contain max-h-[70vh]"
                />
              </div>

              {/* Caption */}
              <div className="mt-4 text-center">
                <p className="text-sm text-white/80 sm:text-base">
                  {selectedImageIndex + 1} / {images.length}
                </p>
              </div>

              {/* Navigation Arrows */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between -mx-12 sm:-mx-16">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(
                      selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1
                    );
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:h-12 sm:w-12"
                  aria-label="Previous image"
                >
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(
                      selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0
                    );
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:h-12 sm:w-12"
                  aria-label="Next image"
                >
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
