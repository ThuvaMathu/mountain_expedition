'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, MapPin, Users, Award, Star, Mountain } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSmartCarousel } from './useSmartCarousel';
import type { HeroSlide } from './HeroSection.types';
import { NumberTicker } from '@/components/ui/number-ticker';
import { statIconMapper } from '@/services/icon-maper';

interface HeroSectionProps {
    stats?: TStat[];
}

// Slide data - Optimized to 3 slides for better performance
const heroSlides: HeroSlide[] = [
    // ============= IMAGE SLIDES =============
    {
        id: 1,
        type: 'image',
        src: 'https://media.tamiladventuretrekkingclub.com/images/hero/hero-image4.webp',
        title: 'Adventure Awaits',
        subtitle: 'Experience breathtaking landscapes and unforgettable journeys',
        ctaLink: '/tours',
        ctaText: 'View Tours',
    },

    {
        id: 2,
        type: 'video',
        src: 'https://media.tamiladventuretrekkingclub.com/Videos/hero-video1.mp4',
        title: 'Awards & Recognition',
        subtitle: 'Celebrating excellence in mountaineering and adventure tourism',
        ctaLink: '/about',
        ctaText: 'Learn More',
    },

    {
        id: 3,
        type: 'image',
        src: 'https://media.tamiladventuretrekkingclub.com/images/hero/hero-image3.webp',
        title: 'Summit Success',
        subtitle: 'Stand on top of the world with our expert climbing expeditions',
        ctaLink: '/trekking',
        ctaText: 'View Treks',
    },
];

// Adventure features data
const adventureFeatures = [
    {
        icon: MapPin,
        text: 'Expert Routes',
        desc: 'Carefully planned paths',
    },
    {
        icon: Users,
        text: 'Small Groups',
        desc: 'Max 8 adventurers',
    },
    {
        icon: Award,
        text: 'Certified Guides',
        desc: 'Professional support',
    },
    {
        icon: Star,
        text: '5-Star Rated',
        desc: 'Excellent reviews',
    },
];

export default function HeroSection({ stats = [] }: HeroSectionProps) {
    const { emblaRef, selectedIndex, scrollNext, scrollPrev, registerVideo, handleVideoEnd } =
        useSmartCarousel({ slides: heroSlides });

    const scrollToNext = () => {
        const nextSection = document.querySelector('#next-section');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative w-full min-h-screen overflow-hidden">
            {/* Embla Carousel Container - Background Media Only */}
            <div className="overflow-hidden h-full" ref={emblaRef}>
                <div className="flex h-full">
                    {heroSlides.map((slide, index) => (
                        <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative min-h-screen">
                            {/* Media Background */}
                            {slide.type === 'video' ? (
                                <>
                                    <video
                                        ref={(el) => registerVideo(index, el)}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        muted
                                        playsInline
                                        autoPlay
                                        onEnded={handleVideoEnd}
                                        preload={index === 0 ? "auto" : "metadata"} // Preload first video fully
                                        poster="https://media.tamiladventuretrekkingclub.com/images/posters/poster-adventure.webp"
                                    >
                                        {/* Use correct MIME type for MP4 - iOS Safari doesn't support WebM */}
                                        <source src={slide.src} type="video/mp4" />
                                    </video>
                                    {/* Fallback image - shows when video fails to load on mobile */}
                                    <Image
                                        src='https://media.tamiladventuretrekkingclub.com/images/posters/poster-adventure.webp'
                                        alt="Mountain expedition"
                                        fill
                                        sizes="100vw"
                                        className="object-cover -z-10"
                                        priority={index === 0} // Prioritize first image for faster LCP
                                        fetchPriority={index === 0 ? "high" : "auto"}
                                        placeholder="blur"
                                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMzM0MTU1Ii8+PC9zdmc+"
                                        quality={85}
                                    />
                                </>
                            ) : (
                                <Image
                                    src={slide.src}
                                    alt={slide.title}
                                    fill
                                    sizes="100vw"
                                    quality={75}
                                    className="object-cover"
                                    priority={index === 0}
                                    fetchPriority={index === 0 ? "high" : "auto"}
                                    placeholder="blur"
                                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMzM0MTU1Ii8+PC9zdmc+"
                                />
                            )}

                            {/* Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Static Content Overlay - Outside Carousel */}
            <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 pb-16 sm:pb-20 pointer-events-none">
                <div className="container mx-auto max-w-6xl text-center text-white pointer-events-auto">
                    {/* Title - Changes with slide */}
                    <motion.h1
                        key={`title-${selectedIndex}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 leading-tight"
                    >
                        {heroSlides[selectedIndex].title}
                    </motion.h1>

                    {/* Subtitle - Changes with slide */}
                    <motion.p
                        key={`subtitle-${selectedIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-4 sm:mb-6 leading-relaxed max-w-3xl mx-auto"
                    >
                        {heroSlides[selectedIndex].subtitle}
                    </motion.p>

                    {/* CTA Button - Changes with slide */}
                    <motion.div
                        key={`cta-${selectedIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mb-6 sm:mb-8"
                    >
                        <Link
                            href={heroSlides[selectedIndex].ctaLink}
                            className="inline-block px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 hover:-translate-y-1 text-sm sm:text-base md:text-lg"
                        >
                            {heroSlides[selectedIndex].ctaText}
                        </Link>
                    </motion.div>

                    {/* Stats Grid - Static, doesn't change with slides */}
                    {stats.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-4xl mx-auto mb-6 sm:mb-8"
                        >
                            {stats.map((stat, idx) => {
                                const IconComponent = stat.id ? statIconMapper[stat.id] : Mountain;
                                const numericValue = parseInt(stat.value.replace(/[^0-9]/g, '')) || 0;
                                const suffix = stat.value.replace(/[0-9]/g, '');

                                return (
                                    <div
                                        key={idx}
                                        className="text-center p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group"
                                    >
                                        <div className="flex justify-center mb-2">
                                            <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-teal-400 group-hover:animate-pulse" />
                                        </div>
                                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                            {numericValue > 0 ? (
                                                <>
                                                    <NumberTicker
                                                        value={numericValue}
                                                        delay={0.8 + idx * 0.1}
                                                        className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                                                    />
                                                    {suffix}
                                                </>
                                            ) : (
                                                stat.value
                                            )}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-300 font-medium">
                                            {stat.title}
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* Adventure Features - Static, doesn't change with slides */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.2 }}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto opacity-90"
                    >
                        {adventureFeatures.map((feature, idx) => {
                            const IconComponent = feature.icon;
                            return (
                                <div key={idx} className="text-center p-2 sm:p-3">
                                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-teal-400 mx-auto mb-1 sm:mb-2" />
                                    <div className="text-xs sm:text-sm md:text-base font-semibold text-white">
                                        {feature.text}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-300 mt-0.5 sm:mt-1">
                                        {feature.desc}
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>

            {/* Navigation Arrows - Hidden on small mobile, visible on larger screens */}
            <button
                onClick={scrollPrev}
                className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 hidden sm:block"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </button>

            <button
                onClick={scrollNext}
                className="absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 hidden sm:block"
                aria-label="Next slide"
            >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </button>

            {/* Slide Indicators - Mobile First */}
            <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
                {heroSlides.map((slide, index) => (
                    <button
                        key={slide.id}
                        onClick={() => {
                            if (emblaRef && 'current' in emblaRef && emblaRef.current) {
                                const emblaApi = emblaRef.current as any;
                                if (emblaApi.scrollTo) {
                                    emblaApi.scrollTo(index);
                                }
                            }
                        }}
                        className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${selectedIndex === index
                            ? 'w-8 sm:w-10 md:w-12 bg-teal-500'
                            : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/70'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute z-20 bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer"
                onClick={scrollToNext}
            >
                <div className="flex flex-col items-center text-white/80 hover:text-white transition-colors animate-bounce">
                    <span className="text-xs sm:text-sm mb-1 font-medium whitespace-nowrap">
                        Scroll Down
                    </span>
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </div>
            </motion.div>
        </section>
    );
}
