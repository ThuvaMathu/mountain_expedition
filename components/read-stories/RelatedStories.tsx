"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SuccessStory } from "@/services/get-success-stories";

interface RelatedStoriesProps {
  currentStoryId: string;
  stories?: SuccessStory[];
  limit?: number;
}

// Format date helper
function formatDate(date: string | any): string {
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
}

export function RelatedStories({
  currentStoryId,
  stories: propStories,
  limit = 6,
}: RelatedStoriesProps) {
  const [relatedStories, setRelatedStories] = useState<SuccessStory[]>([]);

  // Filter out current story and limit
  useEffect(() => {
    const filtered = (propStories || []).filter(s => s.id !== currentStoryId).slice(0, limit);
    setRelatedStories(filtered);
  }, [propStories, currentStoryId, limit]);

  if (relatedStories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg sm:rounded-3xl sm:p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-4 sm:text-xl">
        More Success Stories
      </h3>

      <div className="overflow-hidden">
        <div className="flex gap-4">
          {relatedStories.map((story) => (
            <Link
              key={story.id}
              href={`/read-stories/${story.id}`}
              className="flex-[0_0_100%] md:flex-[0_0_48%] min-w-0"
            >
              <div className="group relative overflow-hidden rounded-xl bg-slate-50 p-3 transition-all hover:shadow-md hover:bg-slate-100">
                {/* Thumbnail */}
                <div className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-gradient-to-br from-teal-100 to-cyan-100">
                  {story.images && story.images[0] && (
                    <img
                      src={story.images[0]}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {story.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90">
                        <svg
                          className="h-4 w-4 fill-teal-600"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <h4 className="mb-1 text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-teal-600 transition-colors">
                  {story.title}
                </h4>
                <p className="text-xs text-slate-500 mb-2">{story.mountainName}</p>

                {/* Rating & Date */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-500" />
                    <span className="font-semibold">{story.rating}</span>
                  </div>
                  <div className="text-slate-400">
                    {formatDate(story.submittedAt)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
