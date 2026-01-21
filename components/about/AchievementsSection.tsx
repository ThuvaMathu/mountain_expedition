"use client";

import { Mountain, Target, Zap } from "lucide-react";
import { achievementStats } from "@/lib/data/stats-data";
import { AchievementCard } from "./AchievementCard";
import { CircularProgress } from "./CircularProgress";
import { SlideUp, StaggerContainer } from "@/components/ui/motion-wrapper";
import Image from "next/image";

export function AchievementsSection() {
  return (
    <section className="relative py-10 md:py-14 lg:py-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/muthamilselvi/with-hammer.png"
          alt="Muthamilselvi with hammer"
          fill
          className="object-contain object-right"
          sizes="80vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/35 to-white/20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <SlideUp className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-amber-100 mb-3 md:mb-4">
            <Target className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
            Achievements & Records
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            A legacy of breaking barriers and setting new standards in mountaineering
          </p>
        </SlideUp>

        {/* Key Records with Circular Progress */}
        <div className="mb-8 md:mb-12">
          <SlideUp className="flex items-center justify-center gap-2 mb-4 md:mb-8">
            <Zap className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Record-Breaking Feats</h3>
          </SlideUp>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
            <CircularProgress
              value={7}
              max={7}
              label="Seven Summits"
              icon="Mountain"
              color="teal"
              size="md"
            />
            <CircularProgress
              value={755}
              max={800}
              label="Days to Complete"
              icon="Clock"
              color="blue"
              size="md"
              suffix=""
            />
            <CircularProgress
              value={8848}
              max={8848}
              label="Highest Point (m)"
              icon="Target"
              color="purple"
              size="sm"
              suffix="m"
            />
          </div>
        </div>

        {/* Achievement Cards Grid */}
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {achievementStats.map((stat, index) => (
            <AchievementCard key={stat.id} stat={stat} index={index} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
