'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Star } from 'lucide-react';
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const tours = [
  {
    id: 1,
    title: 'Bangkok Cultural Heritage Tour',
    location: 'Bangkok',
    duration: '4 Days, 5 Nights',
    price: 90,
    pricePer: 'Per Day',
    rating: 5,
    reviews: 5,
    image: 'https://media.tamiladventuretrekkingclub.com/images/posters/poster-adventure.webp',
    slug: 'bangkok-cultural-heritage-tour',
  },
  {
    id: 2,
    title: 'Thailand Beaches & Island Hopping',
    location: 'Thailand',
    duration: '6 Days, 5 Nights',
    price: 60,
    pricePer: 'Per Day',
    rating: 5,
    reviews: 5,
    image: 'https://media.tamiladventuretrekkingclub.com/images/posters/poster-culture.webp',
    slug: 'thailand-beaches-island-hopping',
  },
  {
    id: 3,
    title: 'California Dreams Road Trip',
    location: 'California',
    duration: '7 Days, 6 Nights',
    price: 52,
    pricePer: 'Per Day',
    rating: 4,
    reviews: 4,
    image: 'https://media.tamiladventuretrekkingclub.com/images/posters/poster-hotels.webp',
    slug: 'california-dreams-road-trip',
  },
  {
    id: 4,
    title: 'Disneyland & Universal Family Adventure',
    location: 'California',
    duration: '5 Days, 4 Nights',
    price: 59,
    pricePer: 'Per Day',
    rating: 0,
    reviews: 0,
    image: 'https://media.tamiladventuretrekkingclub.com/images/posters/poster-wildlife.webp',
    slug: 'disneyland-universal-family-adventure',
  },
  {
    id: 5,
    title: 'Maldives Luxury Water Villa Escape',
    location: 'Maldives',
    duration: '5 Days, 4 Nights',
    price: 52,
    pricePer: 'Per Day',
    rating: 3.5,
    reviews: 3.5,
    image: 'https://media.tamiladventuretrekkingclub.com/images/posters/poster-11.webp',
    slug: 'maldives-luxury-water-villa-escape',
  },
  {
    id: 6,
    title: 'Maldives Honeymoon Special',
    location: 'Maldives',
    duration: '5 Days, 4 Nights',
    price: 89,
    pricePer: 'Per Day',
    rating: 3.5,
    reviews: 3.5,
    image: 'https://media.tamiladventuretrekkingclub.com/images/posters/poster-12.webp',
    slug: 'maldives-honeymoon-special',
  },
  {
    id: 7,
    title: 'Spain Highlights (Barcelona & Madrid)',
    location: 'Spain',
    duration: '6 Days, 5 Nights',
    price: 90,
    pricePer: 'Per Day',
    rating: 4.1,
    reviews: 4.1,
    image: 'https://media.tamiladventuretrekkingclub.com/images/posters/poster-13.webp',
    slug: 'spain-highlights-barcelona-madrid',
  },
];

export default function PopularTours() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container-fluid px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Explore Popular Tours!
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Destinations worth exploring! Here are a few popular spots
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="overflow-hidden -mx-4 px-4" ref={emblaRef}>
          <div className="flex gap-6">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="flex-[0_0_100%] md:flex-[0_0_60%] lg:flex-[0_0_45%] xl:flex-[0_0_35%] min-w-0"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Link href={`/tours/${tour.slug}`}>
                      <Image
                        src={tour.image}
                        alt={tour.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>

                    {/* Title Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Link href={`/tours/${tour.slug}`}>
                        <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {tour.title}
                        </h3>
                      </Link>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Top Section */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-teal-500" />
                        <span className="text-sm">{tour.duration}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-teal-600">${tour.price}</span>
                        <span className="text-gray-500 text-sm ml-1">{tour.pricePer}</span>
                      </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex flex-col gap-4">
                      <Link href={`/tours/${tour.slug}`}>
                        <h4 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                          {tour.title}
                        </h4>
                      </Link>

                      <div className="flex items-center justify-between">
                        <Link
                          href={`/tours/${tour.slug}`}
                          className="inline-flex items-center gap-2 px-6 py-2 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 text-sm"
                        >
                          Book Now
                        </Link>

                        {tour.rating > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">({tour.reviews} Review)</span>
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(tour.rating)
                                    ? 'text-amber-400 fill-current'
                                    : 'text-gray-200'
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={scrollPrev}
            className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 hover:bg-teal-500 hover:text-white transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 hover:bg-teal-500 hover:text-white transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
