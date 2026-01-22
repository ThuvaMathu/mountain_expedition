"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function AdventureHero() {
    return (
        <section className="relative h-[30vh] md:h-[40vh] overflow-hidden bg-gray-900">
            {/* Background Images Grid */}
            <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-4 gap-0">
                <div className="relative h-full">
                    <Image
                        src="/images/posters/poster-29.jpg"
                        alt="Adventure"
                        fill
                        className="object-cover"
                        sizes="25vw"
                    />
                </div>
                <div className="relative h-full">
                    <Image
                        src="/images/posters/poster-adventure.jpg"
                        alt="Adventure"
                        fill
                        className="object-cover"
                        sizes="25vw"
                    />
                </div>
                <div className="relative h-full">
                    <Image
                        src="/images/posters/poster-30.jpg"
                        alt="Adventure"
                        fill
                        className="object-cover"
                        sizes="25vw"
                    />
                </div>
                <div className="relative h-full hidden md:block">
                    <Image
                        src="/images/posters/poster-31.jpg"
                        alt="Adventure"
                        fill
                        className="object-cover"
                        sizes="25vw"
                    />
                </div>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-teal-500/40 via-teal-600/50 to-teal-700/60 mix-blend-multiply" />

            {/* Large Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                    className="text-[14vw] md:text-[16vw] font-black text-white/20 tracking-tighter leading-none select-none"
                    style={{
                        WebkitTextStroke: "2px rgba(255, 255, 255, 0.3)",
                        textShadow: "0 10px 40px rgba(0, 0, 0, 0.3)"
                    }}
                >
                    ADVENTURE
                </motion.h2>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-gray-50 to-transparent" />
        </section>
    );
}
