"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image: string;
  className?: string;
}

export function PageHero({ title, subtitle, image, className }: PageHeroProps) {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  // Parallax effect - image moves slower than scroll
  const imageY = useTransform(scrollY, [0, 500], [0, 150]);
  const overlayOpacity = useTransform(scrollY, [0, 300], [0.4, 0.7]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={cn("relative h-[50vh] md:h-[60vh] lg:h-[70vh] w-full overflow-hidden", className)}>
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 scale-110"
        style={{ y: imageY }}
      >
        <Image
          src={image}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
        {/* Animated Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"
          style={{ opacity: overlayOpacity }}
        />
        {/* Decorative gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 via-transparent to-purple-600/20" />
      </motion.div>

      {/* Animated Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
        {/* Decorative animated line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={mounted ? { width: 80, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-1 bg-gradient-to-r from-teal-400 to-purple-500 rounded-full mb-6"
        />

        {/* Title with staggered animation */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl tracking-tight"
        >
          {title}
        </motion.h1>

        {/* Subtitle with delayed animation */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="text-lg md:text-xl lg:text-2xl text-gray-100 max-w-3xl drop-shadow-lg font-medium leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Decorative bottom accent */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={mounted ? { width: 120, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full mt-6"
        />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
