'use client';

import { motion } from 'framer-motion';
import { MapPin, MessageSquare, CreditCard, Mountain } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const steps = [
  {
    number: 1,
    icon: MapPin,
    title: 'Choose Destination',
    description: 'All you have to do is, first select your preferred destination and proceed',
  },
  {
    number: 2,
    icon: MessageSquare,
    title: 'Enquire',
    description: 'Send us your enquiry and our team will get back to you with all the details you need.',

  },
  {
    number: 3,
    icon: CreditCard,
    title: 'Make Payment',
    description: 'You are important to us. We pay attention to the quality of every service we provide to you.',

  },
  {
    number: 4,
    icon: Mountain,
    title: 'Ready For The Trekking',
    description: 'We have seen that you have fulfilled all the requirements, now you are ready for the trek.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function BookingSteps() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Easy Steps <span className="text-teal-500">For Bookings</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Destinations worth exploring! Here are a few popular spots.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 mb-16"
        >
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="group relative"
              >
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 h-full flex flex-col">
                  {/* Step Number */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-6xl font-bold text-teal-100 group-hover:text-teal-200 transition-colors">
                      {step.number}
                    </span>
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (index + 1) % 2 !== 0 && (
                  <div className="hidden sm:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-teal-300 to-teal-100" />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Special Offer Banner */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600 rounded-2xl p-6 md:p-8 shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6"> */}
        {/* Discount Badge */}
        {/* <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur rounded-full w-20 h-20 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">48</span>
                <span className="text-xs text-white/80">% Off</span>
              </div>
            </div> */}

        {/* Text */}
        {/* <div className="text-center md:text-left flex-1">
              <span className="text-teal-100 text-sm font-medium">Get Special Offer</span>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                Tours and Trip Packages, Globally
              </h3>
            </div> */}

        {/* CTA Button */}
        {/* <Link
              href="/tours"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-teal-600 font-semibold rounded-full hover:bg-gray-100 hover:shadow-lg transition-all duration-300"
            >
              Discover More
            </Link>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}
