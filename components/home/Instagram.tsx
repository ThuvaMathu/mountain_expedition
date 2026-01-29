"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Instagram as InstagramIcon } from 'lucide-react';

// Static images from /images/gallery directory
const STATIC_GALLERY_IMAGES = Array.from({ length: 9 }, (_, i) => `https://media.tamiladventuretrekkingclub.com/images/gallery/img-${i + 1}.webp`);

export default function Instagram() {
  return (
    <section className="py-10 md:py-14 lg:py-16 bg-gradient-to-br from-teal-50 via-amber-50 to-white relative overflow-hidden">
      {/* Animated Car Decoration */}

      {/* Tree Decoration */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12"
        >
          Follow Instagram
        </motion.h3>

        {/* Gallery Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-2 md:gap-3 lg:gap-4">
          {STATIC_GALLERY_IMAGES.map((image, index) => (
            <motion.a
              key={index}
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative aspect-square group overflow-hidden rounded-lg"
            >
              <Image
                src={image}
                alt={`Gallery ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 16vw, 11vw"
                quality={75}
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                priority={index < 3}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/80 to-teal-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <InstagramIcon className="w-8 h-8 text-white" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
