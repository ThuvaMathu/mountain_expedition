"use client";

import { motion } from "framer-motion";
import { Heart, BookOpen, Quote, ExternalLink } from "lucide-react";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function PhilosophySection() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Quote Highlight */}
        <SlideUp className="mb-10">
          <div className="relative bg-gradient-to-r from-teal-50 via-amber-50 to-teal-50 rounded-2xl p-8 md:p-10 overflow-hidden">
            <Quote className="absolute top-4 left-4 w-12 h-12 text-teal-100" />
            <blockquote className="relative z-10 text-center max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed">
                &quot;My mission is to ignite courage in others, especially women, to face challenges
                and achieve victories in their homes, careers, and personal dreams.&quot;
              </p>
              <cite className="inline-flex items-center gap-2 mt-6 text-teal-700 font-semibold">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                Muthamilselvi Narayanan
              </cite>
            </blockquote>
          </div>
        </SlideUp>

        {/* Compact Book Feature - Split View */}
        <SlideUp>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 md:p-8 border border-amber-100">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Book Cover - Full Spread Image */}
              <div className="flex justify-center order-2 md:order-1 w-full">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full max-w-sm md:max-w-md aspect-[2/1]"
                >
                  <Image
                    src="/book-cover.jpg"
                    alt="Imayathai Thotta Sadhanai Payanam Book Cover"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              </div>

              {/* Book Info - Compact */}
              <div className="order-1 md:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full text-amber-700 text-xs font-medium mb-3">
                  <BookOpen className="w-3 h-3" />
                  Published Book
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                  &quot;Imayathai Thotta Sadhanai Payanam&quot;
                </h3>
                <p className="font-semibold text-gray-800 text-sm mb-2">
                  இமயத்தைத் தொட்ட சாதனைப் பயணம்
                </p>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  Autobiography of the first Tamil woman to scale Mount Everest, documenting her life journey and expedition experience.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-amber-700 border border-amber-200">
                    First-hand Everest Journey
                  </span>
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-amber-700 border border-amber-200">
                    Inspirational Stories
                  </span>
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-amber-700 border border-amber-200">
                    Lessons in Determination
                  </span>
                </div>
                {/* Buy on Amazon Button */}
                <Link href="https://www.amazon.in/dp/9334236809" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Buy on Amazon
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </SlideUp>
      </div>
    </section>
  );
}
