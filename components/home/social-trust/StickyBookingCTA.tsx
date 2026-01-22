"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, MessageCircle, Star, ChevronUp } from "lucide-react";
import Link from "next/link";

interface StickyBookingCTAProps {
  whatsappNumber?: string;
  phoneNumber?: string;
  offerText?: string;
  showTriggerOffset?: number; // Scroll amount before showing
}

export function StickyBookingCTA({
  whatsappNumber = "919876543210",
  phoneNumber = "+919876543210",
  offerText = "Limited: 15% Off Season Bookings",
  showTriggerOffset = 400,
}: StickyBookingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Handle scroll with throttle for performance
  const handleScroll = useCallback(() => {
    if (isDismissed) return;

    const scrollY = window.scrollY;
    setIsVisible(scrollY > showTriggerOffset);
  }, [showTriggerOffset, isDismissed]);

  useEffect(() => {
    // Add throttled scroll listener
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Reset dismissal after 5 minutes (in case user scrolls back)
    setTimeout(() => setIsDismissed(false), 5 * 60 * 1000);
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi! I'm interested in booking a mountain expedition. Can you help me?");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  const handleCallClick = () => {
    window.open(`tel:${phoneNumber}`);
  };



  // Don't render if dismissed and not visible
  if (!isVisible && isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Desktop: Full bar - Mobile: Compact bar */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: isMinimized ? 80 : 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-teal-100 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] backdrop-blur-md md:shadow-2xl"
          >
            {/* Offer Banner - Show above CTA on mobile, integrated on desktop */}
            {offerText && !isMinimized && (
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 py-1.5 px-3 text-center">
                <p className="text-xs font-medium text-white sm:text-sm">
                  <span className="mr-1 inline-block animate-pulse">🔥</span>
                  {offerText}
                </p>
              </div>
            )}

            {/* Main CTA Content */}
            <div className="container mx-auto px-3 py-2 sm:px-4 sm:py-3">
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                {/* Trust Indicator - Always visible */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="flex items-center rounded-full bg-amber-50 px-2 py-1 sm:px-3 sm:py-1.5">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500 sm:h-4 sm:w-4" />
                    <span className="ml-1 text-xs font-bold text-slate-800 sm:text-sm">
                      4.9
                    </span>
                  </div>
                  <div className="hidden text-xs text-slate-600 sm:block">
                    <span className="font-semibold">1,200+</span> reviews
                  </div>
                </div>

                {/* Action Buttons */}
                {!isMinimized && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* WhatsApp - Primary CTA */}
                    <button
                      onClick={handleWhatsAppClick}
                      className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-2 text-xs font-semibold text-white shadow-lg transition-all hover:bg-green-600 hover:scale-105 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
                    >
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                      <span className="sm:hidden">Chat</span>
                    </button>

                    {/* Quick Enquiry - Secondary CTA */}
                    <Link href={"/contact"}
                      className="hidden rounded-full bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-teal-600 hover:to-teal-700 hover:scale-105 sm:block"
                    >
                      Quick Enquiry
                    </Link>

                    {/* Call - Tertiary CTA */}
                    <button
                      onClick={handleCallClick}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 shadow-md transition-all hover:bg-slate-200 hover:scale-110 sm:h-10 sm:w-10"
                      aria-label="Call us"
                    >
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center gap-1">
                  {/* Enquire button for mobile (shown when not minimized) */}
                  {!isMinimized && (
                    <Link href={"/contact"}
                      className="rounded-full bg-gradient-to-r from-teal-500 to-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-lg transition-all hover:from-teal-600 hover:to-teal-700 sm:hidden"
                    >
                      Enquire
                    </Link>
                  )}

                  {/* Minimize/Restore Toggle */}
                  {/* <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                    aria-label={isMinimized ? "Restore" : "Minimize"}
                  >
                    {isMinimized ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </button> */}
                </div>
              </div>
            </div>

            {/* Safe area padding for mobile browsers */}
            <div className="h-safe-area-bottom pb-0 sm:hidden" />
          </motion.div>

          {/* Add padding to body to prevent content from being hidden */}
          <style jsx global>{`
            body {
              padding-bottom: ${isVisible && !isMinimized ? "100px" : "0"};
            }
            @media (min-width: 768px) {
              body {
                padding-bottom: ${isVisible && !isMinimized ? "80px" : "0"};
              }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
