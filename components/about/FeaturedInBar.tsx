"use client";

import { motion } from "framer-motion";
import { Newspaper, Tv, Radio } from "lucide-react";
import { pressLogos } from "@/lib/data/press-logos";
import { SlideUp } from "@/components/ui/motion-wrapper";

const typeIcons = {
  print: Newspaper,
  digital: Newspaper,
  tv: Tv,
  radio: Radio,
};

export function FeaturedInBar() {
  return (
    <SlideUp className="bg-gray-50 py-8 border-y border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-gray-500 mb-6">
          Featured In
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
          {pressLogos.map((press, index) => (
            <motion.div
              key={press.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              <div className={`w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center ${press.color}`}>
                {(() => {
                  const Icon = typeIcons[press.type];
                  return <Icon className="w-4 h-4" />;
                })()}
              </div>
              <span className={`font-bold ${press.color} text-lg`}>
                {press.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideUp>
  );
}
