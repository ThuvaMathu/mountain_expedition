'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface HappyCustomersProps {
    testimonials: Array<{
        id: string;
        name: string;
        image: string;
    }>;
    count?: number;
    label?: string;
}

export function HappyCustomers({
    testimonials,
    count = 3500,
    label = "Happy Customer"
}: HappyCustomersProps) {
    // Take only the first 3 for avatar display
    const displayTestimonials = testimonials.slice(0, 3);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
        >
            {/* Avatar Stack */}
            <div className="flex -space-x-3">
                {displayTestimonials.map((testimonial, index) => (
                    <div
                        key={testimonial.id}
                        className="w-12 h-12 rounded-full border-2 border-slate-800 overflow-hidden hover:scale-110 transition-transform duration-300"
                        style={{ zIndex: displayTestimonials.length - index }}
                    >
                        <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Count and Label */}
            <div>
                <span className="text-3xl font-bold text-teal-400">
                    {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
                </span>
                <p className="text-gray-400 text-sm">{label}</p>
            </div>
        </motion.div>
    );
}
