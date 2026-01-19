'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const FALLBACK_TESTIMONIALS = [
  {
    id: '1',
    name: 'Amelia Warner',
    role: 'Patient',
    image: '/images/gallery/img-40.jpg',
    text: 'Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum, a 1st-century BC text by the Roman statesman and philosopher Cicero, with.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Kevin Martin',
    role: 'Patient',
    image: '/images/gallery/img-41.jpg',
    text: 'Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum, a 1st-century BC text by the Roman statesman and philosopher Cicero, with.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Zeynep',
    role: 'Patient',
    image: '/images/gallery/img-42.jpg',
    text: 'Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum, a 1st-century BC text by the Roman statesman and philosopher Cicero, with.',
    rating: 5,
  },
  {
    id: '4',
    name: 'Antonio',
    role: 'Patient',
    image: '/images/gallery/img-43.jpg',
    text: 'Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum, a 1st-century BC text by the Roman statesman and philosopher Cicero, with.',
    rating: 5,
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    containScroll: "trimSnaps"
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        if (!db) {
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "testimonials"),
          where("status", "==", "approved")
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const fetchedData = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name || "Anonymous",
            role: doc.data().location || "Adventurer",
            image: doc.data().image || "/placeholder-user.jpg",
            text: doc.data().text || "",
            rating: doc.data().rating || 5,
          }));
          setTestimonials(fetchedData);
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-28 bg-gray-50 relative overflow-hidden">
      {/* Background Map Pattern */}

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Client Says!
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Destinations worth exploring! Here are a few popular spots
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="overflow-hidden -mx-4 px-4 py-8" ref={emblaRef}>
          <div className="flex gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_40%] min-w-0"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Image */}
                  <div className="relative aspect-square">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />

                    {/* Rating */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < item.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.role}</p>
                      </div>
                      <Quote className="w-8 h-8 text-teal-500/20" />
                    </div>

                    <p className="text-gray-600 leading-relaxed line-clamp-4">
                      "{item.text}"
                    </p>
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
            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-900 hover:bg-teal-500 hover:text-white transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-900 hover:bg-teal-500 hover:text-white transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
