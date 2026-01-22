"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Mountain, Compass, ArrowRight } from "lucide-react";
import { ImageLoader } from "@/components/ui/image-loader";

export function HeroCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [expeditionsCount, setExpeditionsCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Tilt effect values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  // Optimized mouse handler using requestAnimationFrame to prevent forced reflows
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    // Cancel any pending RAF to avoid stacking
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    // Batch DOM reads and writes using RAF
    rafRef.current = requestAnimationFrame(() => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;

      x.set(xPct);
      y.set(yPct);
      rafRef.current = null;
    });
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    // Clean up any pending RAF
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, [x, y]);

  // Animate counter on mount
  useEffect(() => {
    const duration = 2000;
    const start = Date.now();
    const target = 50;

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setExpeditionsCount(Math.floor(target * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();

    // Cleanup
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative h-full min-h-[400px] md:min-h-[500px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl group"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageLoader
          src="/images/muthamilselvi/img-3.png"
          alt="Featured Destination"
          height="h-full"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-500 group-hover:from-black/90" />

      {/* Animated Particles - Reduced from 8 to 4 for better performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${20 + i * 20}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/80 backdrop-blur-sm rounded-full text-white text-xs font-semibold mb-4 md:mb-6"
        >
          <Compass className="w-3.5 h-3.5" />
          Explore With Muthamilselvi
        </motion.div>

        {/* Animated Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 mb-4 md:mb-6"
        >
          <Mountain className="w-6 h-6 md:w-8 md:h-8 text-teal-400" />
          <div>
            <span className="text-3xl md:text-4xl font-bold text-teal-400">{expeditionsCount}+</span>
            <span className="text-white text-sm md:text-base ml-2">Expeditions Completed</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl md:text-3xl font-bold text-white mb-4 md:mb-6 leading-snug"
        >
          Enjoy The Stunning Natural Beauty That Awaits At Every Destination.
        </motion.h3>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            href="/about"
            className="group/btn inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              View More Destinations
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </span>
            {/* Button Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-500"
              animate={{
                opacity: [0, 0.5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
