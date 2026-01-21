"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FadeIn, SlideUp } from "@/components/ui/motion-wrapper";

// Client components
import { SevenSummitsGlobe } from "@/components/about/SevenSummitsGlobe";
import { AchievementsSection } from "@/components/about/AchievementsSection";
import { AwardsTabs } from "@/components/about/AwardsTabs";
import { TrustSection } from "@/components/about/TrustSection";
import { PhilosophySection } from "@/components/about/PhilosophySection";
import { EnhancedGallery } from "@/components/about/EnhancedGallery";
import { EnquiryCTA } from "@/components/about/EnquiryCTA";
import { HeroStats } from "@/components/about/HeroStats";

export function AboutPageContent() {
  return (
    <>
      {/* Hero Section - The Face of Our Brand */}
      <header className="relative isolate bg-gradient-to-b from-teal-50 to-white">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          <div className="grid gap-6 md:gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left - Content */}
            <SlideUp>
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                The Global Peak Warrior
              </span>
              <h1 className="mt-3 md:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                Muthamilselvi Narayanan
              </h1>
              <p className="mt-3 md:mt-4 text-base md:text-lg text-gray-700 max-w-lg">
                First Tamil woman to conquer Mount Everest and complete the Seven Summits in just{" "}
                <span className="font-semibold text-teal-600">755 days</span> — the fastest Indian
                woman record.
              </p>

              {/* Hero Stats */}
              <HeroStats />

              {/* CTA Buttons */}
              <div className="mt-6 md:mt-8 flex flex-wrap gap-3">
                <Link
                  href="#timeline"
                  className="inline-flex items-center justify-center rounded-md bg-teal-600 px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base text-white shadow-sm hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 transition-colors"
                >
                  View The Journey
                </Link>
                <Link
                  href="/enquire"
                  className="inline-flex items-center justify-center rounded-md border border-amber-200 bg-white px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base text-amber-700 hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 transition-colors"
                >
                  Get In Touch
                </Link>
              </div>
            </SlideUp>

            {/* Right - Image with Overlay Stats */}
            <FadeIn className="relative order-first lg:order-last">
              <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-200">
                <Image
                  src="/images/muthamilselvi/profile_1.1.jpg"
                  alt="Portrait of N. Muthamizh Selvi on a snowy summit"
                  width={1200}
                  height={800}
                  priority
                  className="aspect-square w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay badges */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 md:bottom-4 md:left-4 md:right-4 md:gap-2">
                  <span className="px-3 py-1.5 md:px-4 md:py-2 bg-teal-600/95 backdrop-blur-sm rounded-full text-xs md:text-sm font-semibold text-white shadow-sm">
                    7 Summits
                  </span>
                  <span className="px-3 py-1.5 md:px-4 md:py-2 bg-amber-500/95 backdrop-blur-sm rounded-full text-xs md:text-sm font-semibold text-white shadow-sm">
                    755 Days
                  </span>
                  <span className="px-3 py-1.5 md:px-4 md:py-2 bg-white/95 backdrop-blur-sm rounded-full text-xs md:text-sm font-semibold text-teal-700 shadow-sm">
                    Record Holder
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </header>

      <main>
        {/* Tamil Adventure Trekking Club - Redesigned with Video Background */}
        <section className="border-t border-gray-100 relative overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-white/80 z-10" />
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-50"
            >
              <source src="/bg-videos/logo-video.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
            <SlideUp className="text-center mb-12">
              <span className="inline-flex items-center rounded-full bg-teal-100/90 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-teal-700 ring-1 ring-inset ring-teal-200 mb-6">
                The Community
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                Explore, Inspire, Conquer
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto text-lg">
                Tamil Adventure Trekking Club — bringing together passionate mountain explorers
              </p>
            </SlideUp>

            {/* 3 Icon Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-100 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mb-4 shadow-md">
                  <span className="text-3xl">🧗</span>
                </div>
                <h3 className="text-xl font-bold text-teal-700 mb-2">Explore</h3>
                <p className="text-sm text-gray-600">Discover breathtaking mountains and new adventures</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-100 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4 shadow-md">
                  <span className="text-3xl">💫</span>
                </div>
                <h3 className="text-xl font-bold text-amber-700 mb-2">Inspire</h3>
                <p className="text-sm text-gray-600">Motivate others to push beyond their limits</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-100 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mb-4 shadow-md">
                  <span className="text-3xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold text-teal-700 mb-2">Conquer</h3>
                <p className="text-sm text-gray-600">Achieve goals through discipline and resilience</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Seven Summits Journey - Interactive Globe */}
        <SevenSummitsGlobe />

        {/* Achievements Section - Redesigned with Icon Stats */}
        <AchievementsSection />

        {/* Awards Section - Tabbed Interface */}
        <AwardsTabs />

        {/* Trust Section - Certifications & Recognition */}
        <TrustSection />

        {/* Philosophy & Mission - Icon Cards + Book Feature */}
        <section id="philosophy">
          <PhilosophySection />
        </section>

        {/* Enhanced Gallery - Masonry Layout with Lightbox */}
        <EnhancedGallery />

        {/* Final CTA - Enquiry Focused */}
        <section id="support">
          <EnquiryCTA />
        </section>
      </main>
    </>
  );
}
