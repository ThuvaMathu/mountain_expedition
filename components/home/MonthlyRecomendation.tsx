'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Compass, Award } from 'lucide-react';
import { Testimonial } from '@/services/get-testimonials';
import { HappyCustomers } from './HappyCustomers';

const features = [
  {
    icon: MapPin,
    title: 'Trusted travel guide',
    description: 'Provides reliable information to help travelers plan their trips efficiently and safely.',
  },
  {
    icon: Compass,
    title: 'Mission & Vision',
    description: 'Aims to connect people to positive experience through travel, helping them see the world differently.',
  },
];

const happyCustomers = [
  'https://media.tamiladventuretrekkingclub.com/images/gallery/img-7.webp',
  'https://media.tamiladventuretrekkingclub.com/images/gallery/img-7.webp',
  'https://media.tamiladventuretrekkingclub.com/images/gallery/img-7.webp',
];
interface DestinationsProps {
  testimonials?: Testimonial[];
}
export default function MonthlyRec({ testimonials = [] }: DestinationsProps) {
  return (
    <section className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative h-[500px]">
              {/* Large Image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <Image
                  src="https://media.tamiladventuretrekkingclub.com/images/gallery/img-19.webp"
                  alt="Beautiful destinations"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Circle Image */}
              <div className="absolute -bottom-8 -left-8 w-52 h-52 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <Image
                  src="https://media.tamiladventuretrekkingclub.com/images/gallery/img-7.webp"
                  alt="Adventure"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Small Floating Image */}
              <div className="absolute -top-4 -right-4 w-64 h-64 rotate-12 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://media.tamiladventuretrekkingclub.com/images/gallery/img-17.webp"
                  alt="Travel"
                  fill
                  className="object-cover"
                />
              </div>

            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              We <span className="text-teal-500">Recommend</span> Beautiful Destinations Every Month
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Tamil Adventure Trekking Club is a multi-award-winning strategy and content creation agency that specializes in travel marketing...
            </p>

            {/* Features */}
            <div className="space-y-6 mb-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                      <IconComponent className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* CTA Button */}
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
              >
                Discover More
              </Link>

              {/* Happy Customers */}
              {testimonials.length > 0 && (
                <HappyCustomers
                  testimonials={testimonials}
                  label="Happy Customer"
                />
              )}
            </div>

            {/* Experience Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 inline-block bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl p-6 shadow-lg"
            >
              <span className="text-5xl font-bold text-amber-600">25</span>
              <p className="text-gray-700 font-medium mt-1">Years of Experience</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
