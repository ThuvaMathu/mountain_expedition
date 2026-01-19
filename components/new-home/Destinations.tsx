'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';


const destinations = [
  { id: 1, name: 'Bangkok', tours: 1, image: '/images/gallery/img-20.jpg' },
  { id: 2, name: 'Maldives', tours: 2, image: '/images/gallery/img-21.jpg' },
  { id: 3, name: 'Thailand', tours: 1, image: '/images/gallery/img-22.jpg' },
  { id: 4, name: 'Paris', tours: 0, image: '/images/gallery/img-23.jpg' },
  { id: 5, name: 'Hong Kong', tours: 0, image: '/images/gallery/img-24.jpg' },
  { id: 6, name: 'Tokyo', tours: 0, image: '/images/gallery/img-25.jpg' },
  { id: 7, name: 'Spain', tours: 1, image: '/images/gallery/img-26.jpg' },
  { id: 8, name: 'California', tours: 2, image: '/images/gallery/img-27.jpg' },
];

const happyCustomers = [
  '/images/gallery/img-1.jpg',
  '/images/gallery/img-2.jpg',
  '/images/gallery/img-3.jpg',
];

export default function Destinations() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              <span className="text-teal-400">Most Favorite</span> Tour Places!
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Choosing a destination can be exciting but also a bit overwhelming with so many amazing places out there! Let's narrow it down a little. Are you dreaming of peaceful nature, buzzing cities, historical wonders, or relaxing beaches?
            </p>

            {/* Happy Customers */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {happyCustomers.map((avatar, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 rounded-full border-2 border-slate-800 overflow-hidden"
                  >
                    <Image
                      src={avatar}
                      alt="Happy customer"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <span className="text-3xl font-bold text-teal-400">3.5k</span>
                <p className="text-gray-400 text-sm">Happy Customer</p>
              </div>
            </div>
          </motion.div>

          {/* Right - Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Top Destination Badge */}
            <div className="absolute -top-4 right-4 z-20 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              <span className="text-teal-100">Top!</span> Destination
            </div>

            {/* Carousel */}
            <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
              <div className="flex">
                {destinations.map((destination) => (
                  <div key={destination.id} className="flex-[0_0_80%] md:flex-[0_0_50%] min-w-0 pl-4">
                    <div className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-[4/5]">
                      <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">
                          {destination.name}
                        </h3>
                        <span className="text-gray-300 text-sm">
                          {destination.tours > 0 ? `${destination.tours} Tour${destination.tours > 1 ? 's' : ''}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={scrollPrev}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-teal-500 transition-colors duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={scrollNext}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-teal-500 transition-colors duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Image */}
    </section>
  );
}
