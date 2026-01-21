"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { staticGalleryImages } from "@/lib/data/static-images";
import { SlideUp } from "@/components/ui/motion-wrapper";
import Link from "next/link";

export function EnhancedGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const displayedImages = staticGalleryImages.slice(0, 8); // Reduced to 8 images

  return (
    <section className="bg-white py-8 md:py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SlideUp className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 py-0.5 md:px-3 md:py-1 bg-amber-100 rounded-full text-amber-700 text-xs md:text-sm font-medium mb-2 md:mb-3">
              <ZoomIn className="w-2.5 h-2.5 md:w-3 md:h-3" />
              <span>Gallery</span>
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
              Journey in Pictures
            </h2>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center sm:justify-start gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors shadow-sm text-xs md:text-sm w-full sm:w-auto"
          >
            <span>View All</span>
            <ZoomIn className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Link>
        </SlideUp>

        {/* Neat Gallery Grid - 8 images with varied heights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {displayedImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`relative overflow-hidden rounded-lg cursor-pointer group aspect-square ${
                i === 0 ? "md:row-span-2 md:aspect-[3/4]" : i === 4 ? "md:row-span-2 md:aspect-[3/4]" : ""
              }`}
              onClick={() => setSelectedImage(i)}
            >
              <Image
                src={img.src}
                alt={img.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
                  <p className="text-white text-[10px] md:text-xs font-medium line-clamp-1">{img.title}</p>
                </div>
              </div>
              {/* Zoom icon */}
              <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-6 h-6 md:w-7 md:h-7 rounded-full bg-amber-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                <ZoomIn className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            >
              <X className="w-4 h-4 md:w-6 md:h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[60vh] md:h-[75vh] bg-gray-900 rounded-lg overflow-hidden">
                <Image
                  src={displayedImages[selectedImage].src}
                  alt={displayedImages[selectedImage].title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-center font-medium text-xs md:text-sm">
                  {displayedImages[selectedImage].title}
                </p>
              </div>

              {/* Navigation arrows */}
              {selectedImage > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage - 1);
                  }}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors text-lg md:text-xl"
                >
                  ←
                </button>
              )}
              {selectedImage < displayedImages.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage + 1);
                  }}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors text-lg md:text-xl"
                >
                  →
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
