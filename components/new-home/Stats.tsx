'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Trophy, Users, Map, Compass } from 'lucide-react';

const stats = [
  {
    id: 1,
    title: 'Awards Winning',
    value: 3600,
    suffix: '+',
    icon: Trophy,
  },
  {
    id: 2,
    title: 'Happy Traveler',
    value: 7634,
    suffix: '+',
    icon: Users,
  },
  {
    id: 3,
    title: 'Tours success',
    value: 2.5,
    suffix: 'k+',
    icon: Map,
  },
  {
    id: 4,
    title: 'Our Experience',
    value: 25,
    suffix: '+',
    icon: Compass,
  },
];

function Counter({ value, suffix, duration = 2000 }: { value: number; suffix: string; duration?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        setCount(value * progress);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {typeof value === 'number' && value % 1 !== 0 ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  );
}



export default function Stats() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 mx-auto relative group-hover:scale-110 transition-transform duration-300 flex items-center justify-center bg-teal-50 rounded-2xl text-teal-600">
                    <IconComponent className="w-8 h-8" />
                  </div>
                </div>

                <h4 className="text-lg font-bold text-gray-900 mb-2">{stat.title}</h4>

                <div className="text-3xl md:text-4xl font-bold text-teal-600">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
