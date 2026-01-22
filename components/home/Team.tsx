'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const guides = [
  {
    id: 1,
    name: 'Murphy',
    role: 'Tourist Guide',
    image: '/images/gallery/img-31.jpg',
    slug: 'murphy',
  },
  {
    id: 2,
    name: 'Murray',
    role: 'Tourist Guide',
    image: '/images/gallery/img-32.jpg',
    slug: 'murray',
  },
  {
    id: 3,
    name: 'Alexis Cox',
    role: 'Tourist Guide',
    image: '/images/gallery/img-33.jpg',
    slug: 'alexis-cox',
  },
  {
    id: 4,
    name: 'Crawford',
    role: 'Tourist Guide',
    image: '/images/gallery/img-34.jpg',
    slug: 'crawford',
  },
];

export default function Team() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

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
            Meet With <span className="text-teal-500">Tour Guides</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Destinations worth exploring! Here are a few popular spots
          </p>
        </motion.div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Featured Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative hidden lg:block"
          >
            <div className="relative h-[600px]">
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <Image
                  src="/images/gallery/img-30.jpg"
                  alt="Expert Guides"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Circle Shape Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-96 h-96 border-4 border-teal-500/30 rounded-full" />
              </div>

              {/* Text Overlay */}
              <div className="absolute bottom-12 left-12 right-12">
                <h3 className="text-4xl font-bold text-white mb-2">
                  We Employ only<br />Specialists
                </h3>
              </div>
            </div>
          </motion.div>

          {/* Right - Guide Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    {/* Image */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={guide.image}
                        alt={guide.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Social Links */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-gray-900 hover:bg-teal-500 hover:text-white transition-colors">
                          <Twitter className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-gray-900 hover:bg-teal-500 hover:text-white transition-colors">
                          <Facebook className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-gray-900 hover:bg-teal-500 hover:text-white transition-colors">
                          <Instagram className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 text-center">
                      <Link href={`/team/${guide.slug}`}>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                          {guide.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mt-1">{guide.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
