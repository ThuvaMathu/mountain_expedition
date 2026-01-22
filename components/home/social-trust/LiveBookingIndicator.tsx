"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, X, Sparkles } from "lucide-react";

interface BookingEvent {
  id: string;
  customerName: string;
  destination: string;
  timeAgo: string;
  avatar?: string;
}

interface LiveBookingIndicatorProps {
  enabled?: boolean;
  showInterval?: number; // How long each notification shows (ms)
  pauseBetween?: number; // Pause between notifications (ms)
  startPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  // For demo: pre-defined bookings to rotate through
  demoBookings?: BookingEvent[];
}

const demoBookings: BookingEvent[] = [
  {
    id: "1",
    customerName: "Rajesh Kumar",
    destination: "Everest Base Camp",
    timeAgo: "2 minutes ago",
  },
  {
    id: "2",
    customerName: "Sneha Patel",
    destination: "Kedarkantha Trek",
    timeAgo: "5 minutes ago",
  },
  {
    id: "3",
    customerName: "Amit Singh",
    destination: "Roopkund Lake",
    timeAgo: "8 minutes ago",
  },
  {
    id: "4",
    customerName: "Priya Nair",
    destination: "Hampta Pass",
    timeAgo: "12 minutes ago",
  },
  {
    id: "5",
    customerName: "Vikram Reddy",
    destination: "Valley of Flowers",
    timeAgo: "15 minutes ago",
  },
  {
    id: "6",
    customerName: "Anita Sharma",
    destination: "Bali Pass",
    timeAgo: "20 minutes ago",
  },
  {
    id: "7",
    customerName: "Karthik Iyer",
    destination: "Kashmir Great Lakes",
    timeAgo: "25 minutes ago",
  },
];

const positionClasses = {
  "top-left": "top-4 left-4 sm:top-6 sm:left-6",
  "top-right": "top-4 right-4 sm:top-6 sm:right-6",
  "bottom-left": "bottom-4 left-4 sm:bottom-6 sm:left-6",
  "bottom-right": "bottom-4 right-4 sm:bottom-6 sm:right-6",
};

export function LiveBookingIndicator({
  enabled = true,
  showInterval = 5000,
  pauseBetween = 3000,
  startPosition = "bottom-right",
  demoBookings: customBookings,
}: LiveBookingIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<BookingEvent | null>(
    null
  );
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const bookings = customBookings || demoBookings;

  const showNextBooking = useCallback(() => {
    if (!enabled || isDismissed) return;

    // Get next booking (cycling through)
    const nextIndex = currentIndex % bookings.length;
    setCurrentBooking(bookings[nextIndex]);
    setCurrentIndex(nextIndex + 1);

    // Show notification
    setIsVisible(true);

    // Hide after showInterval
    setTimeout(() => {
      setIsVisible(false);
    }, showInterval);
  }, [currentIndex, bookings, enabled, isDismissed, showInterval]);

  useEffect(() => {
    if (!enabled || isDismissed) return;

    // Initial delay before first notification
    const initialDelay = setTimeout(() => {
      showNextBooking();

      // Set up recurring notifications
      const interval = setInterval(() => {
        setIsVisible(false);
        // Wait for exit animation, then show next
        setTimeout(() => {
          if (!isDismissed) {
            showNextBooking();
          }
        }, 500);
      }, showInterval + pauseBetween);

      return () => clearInterval(interval);
    }, 3000);

    return () => clearTimeout(initialDelay);
  }, [enabled, isDismissed, showInterval, pauseBetween, showNextBooking]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Reset dismissal after 10 minutes
    setTimeout(() => setIsDismissed(false), 10 * 60 * 1000);
  };

  if (!currentBooking || !enabled) return null;

  // Get initials from name
  const initials = currentBooking.customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <AnimatePresence>
      {isVisible && currentBooking && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`fixed z-50 ${positionClasses[startPosition]} max-w-[280px] sm:max-w-[320px]`}
        >
          <div className="relative overflow-hidden rounded-xl bg-white shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:rounded-2xl">
            {/* Gradient Accent */}
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-teal-500 to-cyan-500" />

            {/* Content */}
            <div className="flex items-start gap-3 p-3 sm:gap-4 sm:p-4">
              {/* Avatar */}
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-xs font-bold text-white sm:h-12 sm:w-12 sm:text-sm">
                {initials}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="mb-0.5 flex items-center gap-1.5 sm:mb-1">
                  <Sparkles className="h-3 w-3 text-amber-500 sm:h-3.5 sm:w-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-600 sm:text-xs">
                    Recent Booking
                  </span>
                </div>
                <p className="text-xs text-slate-800 sm:text-sm">
                  <span className="font-semibold">{currentBooking.customerName}</span>{" "}
                  just booked
                </p>
                <p className="truncate text-xs font-semibold text-slate-600 sm:text-sm">
                  {currentBooking.destination}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400 sm:mt-1 sm:text-xs">
                  {currentBooking.timeAgo}
                </p>
              </div>

              {/* Dismiss Button */}
              <button
                onClick={handleDismiss}
                className="flex flex-shrink-0 h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Dismiss"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>

            {/* Bottom Bar - Animated Progress */}
            <div className="h-0.5 bg-slate-100">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: showInterval / 1000, ease: "linear" }}
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook version for programmatic control
export function useLiveBookingIndicator() {
  const [booking, setBooking] = useState<BookingEvent | null>(null);
  const [show, setShow] = useState(false);

  const showBooking = useCallback((booking: BookingEvent) => {
    setBooking(booking);
    setShow(true);

    setTimeout(() => {
      setShow(false);
    }, 5000);
  }, []);

  return {
    booking,
    show,
    showBooking,
    hide: () => setShow(false),
  };
}
