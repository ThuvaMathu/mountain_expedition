'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FloatingSocialMediaProps {
    contactDetails: TContactDetails;
}

export function FloatingSocialMedia({ contactDetails }: FloatingSocialMediaProps) {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            // Check scroll position - if past hero section (roughly 100vh), switch to dark mode
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;

            // Switch to dark icons after scrolling past the hero section
            setIsDark(scrollY < viewportHeight * 0.8);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial position

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const socialLinks = [
        {
            name: 'Facebook',
            icon: Facebook,
            url: contactDetails.socialMedia?.facebook,
            color: 'hover:bg-blue-600'
        },
        {
            name: 'Twitter',
            icon: Twitter,
            url: contactDetails.socialMedia?.twitter,
            color: 'hover:bg-sky-500'
        },
        {
            name: 'Instagram',
            icon: Instagram,
            url: contactDetails.socialMedia?.instagram,
            color: 'hover:bg-pink-600'
        },
        {
            name: 'Youtube',
            icon: Youtube,
            url: contactDetails.socialMedia?.youtube,
            color: 'hover:bg-red-600'
        },
    ].filter(link => link.url); // Only show links that have URLs

    if (socialLinks.length === 0) return null;

    // Dynamic classes based on scroll position
    const bgClass = isDark
        ? 'bg-white/10 border-white/20'
        : 'bg-teal-600/90 border-teal-500/30 shadow-lg';
    const textClass = isDark ? 'text-white' : 'text-white';
    const lineClass = isDark
        ? 'bg-gradient-to-b from-white/40 to-transparent'
        : 'bg-gradient-to-b from-teal-600/60 to-transparent';

    return (
        <>
            {/* All Screen Sizes - Left Center Vertical (Small) */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex fixed left-4 top-1/2 -translate-y-1/2 z-50 flex-col gap-2"
            >
                {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                        <motion.div
                            key={social.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                        >
                            <Link
                                href={social.url!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group w-9 h-9 md:w-10 md:h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${bgClass} ${textClass} ${social.color}`}
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
