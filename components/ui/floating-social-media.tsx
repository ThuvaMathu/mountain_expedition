'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface FloatingSocialMediaProps {
    contactDetails: TContactDetails;
}

export function FloatingSocialMedia({ contactDetails }: FloatingSocialMediaProps) {
    const [isDark, setIsDark] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            // Throttle: clear any pending timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Throttle: only update after 100ms of no scroll events
            timeoutRef.current = setTimeout(() => {
                const scrollY = window.scrollY;
                const viewportHeight = window.innerHeight;

                // Switch to dark icons after scrolling past the hero section
                setIsDark(scrollY < viewportHeight * 0.8);
            }, 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check initial position

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const socialLinks = [
        {
            name: 'Facebook',
            icon: Facebook,
            url: contactDetails.socialMedia?.facebook,
            color: 'hover:bg-blue-600'
        },
        {
            name: 'Instagram',
            icon: Instagram,
            url: contactDetails.socialMedia?.instagram,
            color: 'hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500',
            isInstagram: true
        },
        {
            name: 'Youtube',
            icon: Youtube,
            url: contactDetails.socialMedia?.youtube,
            color: 'hover:bg-red-600'
        },
    ].filter(link => link.url); // Only show links that have URLs

    if (socialLinks.length === 0) return null;

    // Dynamic classes based on scroll position - High contrast for hero section
    const bgClass = isDark
        ? 'bg-white/95 border-gray-200 shadow-lg'
        : 'bg-teal-600/90 border-teal-500/30 shadow-lg';
    const textClass = isDark ? 'text-gray-800' : 'text-white';
    const lineClass = isDark
        ? 'bg-gradient-to-b from-gray-400/60 to-transparent'
        : 'bg-gradient-to-b from-teal-600/60 to-transparent';

    return (
        <>
            {/* Mobile: Bottom Left | Desktop: Left Center Vertical */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex fixed left-4 bottom-24 z-40 flex-col gap-2 md:top-1/2 md:-translate-y-1/2 md:bottom-auto md:z-50"
            >
                {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                        <motion.div
                            key={social.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                            className="relative"
                        >
                            {/* Instagram Glowing Pulse Ring */}
                            {social.isInstagram && (
                                <div className="absolute inset-0 rounded-full bg-pink-500/40 animate-ping" style={{ animationDuration: '3s' }} />
                            )}

                            <Link
                                href={social.url!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`relative group w-11 h-11 md:w-10 md:h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:text-white ${bgClass} ${textClass} ${social.color}`}
                                aria-label={social.name}
                            >
                                <Icon className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    );
                })}

                {/* Vertical Line */}
                <div className={`w-0.5 h-12 mx-auto mt-1 transition-all duration-300 ${lineClass}`} />
            </motion.div>
        </>
    );
}
