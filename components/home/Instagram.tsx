"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Instagram as InstagramIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useContactDetails } from '@/hooks/useContactDetails';

// Static images from /images/gallery directory
const STATIC_GALLERY_IMAGES = Array.from({ length: 9 }, (_, i) => `https://media.tamiladventuretrekkingclub.com/images/gallery/img-${i + 1}.webp`);

export default function Instagram() {
  const { contact } = useContactDetails();

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 relative overflow-hidden">
      {/* Decorative elements for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(13,148,136,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(249,115,22,0.1),transparent_50%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Follow Our Adventures
          </h3>
          <p className="text-teal-200 text-base md:text-lg max-w-2xl mx-auto mb-6">
            Join 10,000+ adventure enthusiasts following Muthamilselvi's journey across the seven summits
          </p>
          {/* Prominent Instagram CTA */}
          <Link href={contact?.socialMedia?.instagram || "https://www.instagram.com"} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-lg px-8 py-6 rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105">
              <InstagramIcon className="w-6 h-6 mr-3" />
              Follow on Instagram
            </Button>
          </Link>
        </motion.div>

        {/* Gallery Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-2 md:gap-3 lg:gap-4">
          {STATIC_GALLERY_IMAGES.map((image, index) => (
            <motion.a
              key={index}
              href={contact?.socialMedia?.instagram || "https://www.instagram.com"}
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
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                loading="lazy"
                quality={75}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/90 to-purple-600/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <InstagramIcon className="w-8 h-8 text-white" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
