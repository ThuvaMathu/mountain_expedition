"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface WhatsAppFloatProps {
    phoneNumber: string;
    message?: string;
}

export function WhatsAppFloat({ phoneNumber, message }: WhatsAppFloatProps) {
    // Format phone number (remove +, spaces, etc.)
    const formattedPhone = phoneNumber?.replace(/[^\d]/g, "") || "";

    // Create pre-filled message
    const defaultMsg = message || "Hi! I'm interested in learning more about your trekking packages.";

    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(defaultMsg)}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-2xl hover:shadow-[#25D366]/40 transition-all duration-300 px-1 py-1 pr-3 group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Pulse Animation Ring */}
            <motion.span
                className="absolute inset-0 rounded-full bg-[#25D366] opacity-30"
                animate={{
                    scale: [1, 1.4, 1.4],
                    opacity: [0.5, 0, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                }}
            />

            {/* WhatsApp Icon Container */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white rounded-full shadow-inner overflow-hidden">
                <Image
                    src="/whatsapp-icon.png"
                    alt="WhatsApp"
                    width={32}
                    height={32}
                    className="w-8 h-8 sm:w-9 sm:h-9"
                />
            </div>

            {/* Chat Text - Shows on hover */}
            <span className="text-sm sm:text-base font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap max-w-0 group-hover:max-w-[200px] overflow-hidden">
                Chat on WhatsApp
            </span>
        </motion.a>
    );
}
