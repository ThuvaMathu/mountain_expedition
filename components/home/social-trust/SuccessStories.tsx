"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  Quote,
  Star,
  Calendar,
  Users,
  Mountain,
  Play,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import type { SuccessStory } from "@/services/get-success-stories";

interface SuccessStoriesProps {
  stories?: SuccessStory[];
}

// Fallback static stories when Firebase data is unavailable
// Fallback static stories when Firebase data is unavailable
const FALLBACK_STORIES: SuccessStory[] = [
  {
    id: "fallback-1",
    title: "Everest Base Camp Adventure",
    description: "An absolutely life-changing experience. Muthamilselvi and her team made what seemed impossible feel achievable. The support throughout was incredible!",
    mountainName: "Everest Base Camp",
    rating: 5,
    images: [],
    videoUrl: "",
    status: "approved",
    submittedAt: new Date().toISOString(),
    userName: "Rahul Sharma",
    userEmail: "rahul@example.com",
  },
  {
    id: "fallback-2",
    title: "Kedarkantha Winter Trek",
    description: "My first high-altitude trek and I couldn't have asked for better guides. Every detail was taken care of. Already planning my next adventure!",
    mountainName: "Kedarkantha",
    rating: 5,
    images: [],
    videoUrl: "",
    status: "approved",
    submittedAt: new Date().toISOString(),
    userName: "Priya Patel",
    userEmail: "priya@example.com",
  },
  {
    id: "fallback-3",
    title: "Roopkund Mystery Lake",
    description: "The mysterious lake trek was magical. Our guide's knowledge of the terrain and local stories made it so much more than just a trek.",
    mountainName: "Roopkund Lake",
    rating: 5,
    images: [],
    videoUrl: "",
    status: "approved",
    submittedAt: new Date().toISOString(),
    userName: "Arjun Menon",
    userEmail: "arjun@example.com",
  },
];

function StoryCard({ story }: { story: SuccessStory }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play video on mount
  useEffect(() => {
    if (videoRef.current && story.videoUrl) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay prevented, video will play on interaction
        setIsPlaying(false);
      });
    }
  }, [story.videoUrl]);

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Format date
  const formatDate = (date: string | any) => {
    if (!date) return "Recent";
    if (date?.seconds) {
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

  // Get thumbnail or first image
  const coverImage = story.thumbnails?.[0] || story.images?.[0] || "";
  const hasVideo = !!story.videoUrl;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl sm:rounded-3xl flex flex-col h-full">
      {/* Image/Video Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-teal-500 to-cyan-600 sm:h-56 md:h-64 shrink-0">
        {/* Video - autoplay muted */}
        {hasVideo ? (
          <>
            <video
              ref={videoRef}
              src={story.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              poster={coverImage || undefined}
              preload="metadata"
            />
            {/* Mute Toggle Button */}
            <button
              onClick={toggleMute}
              className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 sm:h-8 sm:w-8 z-20"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </button>
          </>
        ) : coverImage ? (
          <Image
            src={coverImage}
            alt={story.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 mx-auto sm:h-20 sm:w-20">
                <Mountain className="h-8 w-8 text-white sm:h-10 sm:w-10" />
              </div>
              <p className="text-lg font-bold text-white sm:text-xl">{story.mountainName}</p>
            </div>
          </div>
        )}

        {/* Video Play Button Overlay (clicks go to detail page) */}
        {hasVideo && (
          <Link href={`/read-stories/${story.id}`} className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg sm:h-14 sm:w-14 z-10">
            <Play className="h-5 w-5 fill-teal-600 text-teal-600 sm:h-6 sm:w-6" />
          </Link>
        )}

        {/* Success Badge */}
        <div className="absolute left-3 top-3 rounded-full bg-green-500 px-3 py-1.5 sm:left-4 sm:top-4 z-10">
          <p className="text-xs font-bold text-white sm:text-sm">
            Success Story
          </p>
        </div>

        {/* Rating Badge */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1.5 sm:right-4 sm:top-4 z-10">
          <Star className="h-3 w-3 fill-amber-500 text-amber-500 sm:h-4 sm:w-4" />
          <span className="text-xs font-bold text-slate-800 sm:text-sm">
            {story.rating}.0
          </span>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
        {/* Customer Info */}
        <div className="mb-4 flex items-center gap-3">
          {/* Avatar with initial */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-lg font-bold text-white sm:h-14 sm:w-14 sm:text-xl">
            {story.userName?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="truncate text-base font-bold text-slate-900 sm:text-lg">
              {story.userName}
            </h4>
            <p className="text-xs text-slate-500 sm:text-sm">{story.mountainName}</p>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mb-4 relative flex-1">
          <Quote className="absolute -top-1 -left-2 h-8 w-8 text-teal-100 sm:h-10 sm:w-10 sm:-left-3" />
          <p className="pl-6 text-sm text-slate-600 leading-relaxed sm:pl-8 sm:text-base line-clamp-3">
            {story.description}
          </p>
        </div>

        {/* Trip Details */}
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 sm:text-sm">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{formatDate(story.submittedAt)}</span>
          </div>
          {story.images && story.images.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 sm:text-sm">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{story.images.length} Photos</span>
            </div>
          )}
        </div>

        {/* Success Rate Indicator */}
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 sm:px-4 sm:py-2.5">
          <CheckCircle2 className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
          <div>
            <p className="text-xs font-semibold text-green-700 sm:text-sm">
              Verified Experience
            </p>
            <p className="text-[10px] text-green-600 sm:text-xs">
              {story.mountainName}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="border-t border-slate-100 px-4 py-3 sm:px-5 sm:py-4 mt-auto">
        <Link
          href={`/read-stories/${story.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-teal-600 hover:to-cyan-600 sm:rounded-2xl sm:py-3"
        >
          <span>Read Full Story</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

export function SuccessStories({ stories: propStories }: SuccessStoriesProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [stories, setStories] = useState<SuccessStory[]>(propStories || FALLBACK_STORIES);

  // Update stories when prop changes
  useEffect(() => {
    if (propStories && propStories.length > 0) {
      setStories(propStories);
    }
  }, [propStories]);

  // Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  // Scroll handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white py-10 md:py-14 lg:py-16"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-400 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Background Elements */}
      {/* <div className="absolute left-0 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-teal-100/30 blur-3xl" />
      <div className="absolute right-0 bottom-1/4 h-96 w-96 translate-x-1/2 rounded-full bg-cyan-100/30 blur-3xl" /> */}

      <div className="relative container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="mb-8 text-center sm:mb-10 md:mb-12"
        >
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 sm:mb-5 sm:px-5 sm:py-2.5"
          >
            <Star className="h-4 w-4 fill-amber-500 text-amber-500 sm:h-5 sm:w-5" />
            <span className="text-xs font-semibold text-amber-700 sm:text-sm">
              Real Success Stories
            </span>
          </motion.div>

          <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            Adventures That{" "}
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Changed Lives
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base md:text-lg">
            Real experiences from adventurers who achieved their dreams with us.
          </p>
        </motion.div>

        {/* Success Stats - Mobile First */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
          className="mb-8 grid grid-cols-3 gap-3 rounded-2xl bg-slate-900 p-4 sm:gap-4 sm:rounded-3xl sm:p-6 md:gap-6"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-teal-400 sm:text-3xl md:text-4xl">
              97%
            </p>
            <p className="text-xs text-slate-400 sm:text-sm md:text-base">
              Summit Success
            </p>
          </div>
          <div className="text-center border-l border-slate-700">
            <p className="text-2xl font-bold text-teal-400 sm:text-3xl md:text-4xl">
              500+
            </p>
            <p className="text-xs text-slate-400 sm:text-sm md:text-base">
              Success Stories
            </p>
          </div>
          <div className="text-center border-l border-slate-700">
            <p className="text-2xl font-bold text-teal-400 sm:text-3xl md:text-4xl">
              15+
            </p>
            <p className="text-xs text-slate-400 sm:text-sm md:text-base">
              Years Expertise
            </p>
          </div>
        </motion.div>

        {/* Stories Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Carousel Container */}
          <div className="overflow-hidden -mx-4 px-4 py-8" ref={emblaRef}>
            <div className="flex gap-4 sm:gap-6">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_33%] min-w-0"
                >
                  <StoryCard story={story} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {stories.length > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6 sm:mt-8">
              <button
                onClick={scrollPrev}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-teal-100 hover:text-teal-600 disabled:opacity-30 disabled:cursor-not-allowed sm:h-12 sm:w-12"
                disabled={activeIndex === 0}
                aria-label="Previous story"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              {/* Dot Indicators */}
              <div className="flex justify-center gap-2">
                {stories.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => emblaApi?.scrollTo(idx)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      idx === activeIndex ? "w-8 bg-teal-600" : "bg-slate-300"
                    )}
                    aria-label={`Go to story ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={scrollNext}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-teal-100 hover:text-teal-600 disabled:opacity-30 disabled:cursor-not-allowed sm:h-12 sm:w-12"
                disabled={activeIndex === stories.length - 1}
                aria-label="Next story"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center sm:mt-12 md:mt-14"
        >
          <p className="mb-4 text-sm text-slate-600 sm:text-base md:text-lg">
            Ready to create your own success story?
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/trekking"
              className="w-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-teal-600 hover:to-cyan-600 hover:scale-105 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
            >
              Browse Expeditions
            </Link>
            <Link
              href="/gallery"
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-teal-300 hover:bg-teal-50 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
            >
              <Play className="h-4 w-4" />
              View All Stories
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
