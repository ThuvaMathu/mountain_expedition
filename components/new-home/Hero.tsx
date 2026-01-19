'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { Globe } from '../ui/globe';
import { Snowfall } from '../ui/snowfall';


export default function HeroSection() {
  return (
    <section className="relative h-screen lg:min-h-[90vh] flex items-end lg:items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/herobg1.jpg"
          alt="Mountain expedition background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Muthamilselvi Image - Background on mobile (smaller, positioned), Right side on desktop */}
      <div className="absolute bottom-0 left-0 right-0 h-[90%] z-5 lg:hidden">
        <Image
          src="/hero5.png"
          alt="Muthamilselvi"
          fill
          className="object-contain object-bottom"
          priority
        />
      </div>

      {/* Darker gradient overlay for mobile readability */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90 lg:from-slate-900/60 lg:via-slate-900/40 lg:to-slate-900/80 z-10" /> */}

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 -z-20 hidden lg:block">
        <Globe className='opacity-50 scale-125' />
      </div>

      {/* Flight Animation - Top Left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-2 left-8 lg:top-4 lg:left-14 z-30"
      >
        <motion.div
          animate={{
            x: [0, 300, 0],
            y: [0, -50, 0],
          }}
          transition={{
            x: { duration: 15, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          }}
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-48 lg:h-48"
        >
          <img
            src="/flight.png"
            alt="Flight"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </motion.div>
      </motion.div>

      {/* Rotating circles decoration */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block">
        <div className="relative w-[500px] h-[500px]">
          <Globe className='z-20 opacity-20 scale-150' />
        </div>
      </div>

      {/* Snowfall Effect */}
      <Snowfall quantity={80} color="#ffffff" minSpeed={0.3} maxSpeed={1.5} />

      {/* Main Content - Centered on mobile, Side on desktop */}
      <div className="container mx-auto w-full px-4 z-30 absolute inset-0 flex items-center justify-center lg:static lg:py-12 lg:items-start lg:justify-start">
        <div className="flex flex-col w-full lg:flex-row items-center justify-center lg:justify-between lg:gap-8">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left ">
            {/* Small Title */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block text-teal-400 font-medium text-xs sm:text-sm md:text-base lg:text-lg mb-3"
            >
              Discover
            </motion.span>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold text-white mb-2 md:mb-3 lg:mb-6"
            >
              Explore With
              <span className="block text-teal-400">Muthamilselvi</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-200 mb-4 md:mb-6 lg:mb-10 max-w-2xl mx-auto lg:mx-0"
            >
              First Tamil Woman to Summit Everest. First to complete the Seven Summits. Now, she wants to take you there
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a
                href="/mountains"
                className="inline-flex items-center gap-2 px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 hover:-translate-y-1 text-xs sm:text-sm md:text-base"
              >
                Explore Expeditions
                <Search className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </a>
            </motion.div>
          </div>

          {/* Muthamilselvi Image - Desktop only */}
          <div className="hidden lg:flex lg:w-1/2 items-center justify-center z-30 order-1 lg:order-2">
            <motion.div
              animate={{ y: [0, -15] }}
              transition={{ duration: 4, ease: "easeInOut" }}
              className="w-full max-w-[400px] xl:max-w-[500px]"
            >
              <div className='relative w-full aspect-[3/5]'>
                <Image
                  src="/hero5.png"
                  alt="Muthamilselvi"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Discount Badge - Desktop only */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-20 right-10 hidden lg:block"
      >
        <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-lg">
          <span className="text-xs">Get Up To</span>
          <span className="text-3xl font-bold">50%</span>
          <span className="text-xs">Discount</span>
        </div>
      </motion.div>

    </section>
  );
}
