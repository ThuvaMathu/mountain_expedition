'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function Video() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative h-[600px] overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <Image
            src="/images/posters/poster-adventure.jpg"
            alt="Video thumbnail"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.a
          href="https://www.youtube.com/watch?v=YwYoyQ1JdpQ"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative group cursor-pointer"
          onClick={() => setIsPlaying(true)}
        >
          {/* Ripple Effect */}
          <span className="absolute inset-0 rounded-full bg-teal-500/30 animate-ping" />

          {/* Main Button */}
          <div className="relative w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-teal-500/50 transition-all duration-300 group-hover:scale-110">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>

          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-white/50 group-hover:border-white transition-colors duration-300 scale-150" />
        </motion.a>
      </div>
    </section>
  );
}
