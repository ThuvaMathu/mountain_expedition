"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Clock,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

interface FloatingWhatsAppProps {
  phoneNumber?: string; // Format: country code + number (no spaces/dashes)
  defaultMessage?: string;
  showTooltip?: boolean;
  tooltipText?: string;
  position?: "left" | "right";
  showResponseTime?: boolean;
}

const positionClasses = {
  left: "left-4 bottom-4 sm:left-6 sm:bottom-6",
  right: "right-4 bottom-4 sm:right-6 sm:bottom-6",
};

const chatQuickReplies = [
  "I'm interested in booking a trek",
  "What treks are available this month?",
  "Tell me about Everest Base Camp",
  "I need help choosing a trek",
];

export function FloatingWhatsApp({
  phoneNumber = "919876543210",
  defaultMessage = "Hi! I'm interested in learning more about your mountain expeditions.",
  showTooltip = true,
  tooltipText = "Chat with us!",
  position = "right",
  showResponseTime = true,
}: FloatingWhatsAppProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(true);
  const [message, setMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  // Hide tooltip after 5 seconds
  useEffect(() => {
    if (!showTooltip) return;
    const timer = setTimeout(() => setShowTooltipState(false), 5000);
    return () => clearTimeout(timer);
  }, [showTooltip]);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message || defaultMessage);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
    setIsChatOpen(false);
    setMessage("");
  };

  const handleQuickReply = (reply: string) => {
    const encodedMessage = encodeURIComponent(reply);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
    setIsChatOpen(false);
  };

  return (
    <>
      {/* WhatsApp Floating Button */}
      <motion.div
        className={`fixed ${positionClasses[position]} z-50`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2,
        }}
      >
        {/* Tooltip */}
        {/* <AnimatePresence>
          {showTooltipState && !isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: position === "right" ? 0 : 10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 10, x: position === "right" ? 0 : 10 }}
              className={`absolute bottom-full mb-3 flex items-center gap-2 ${
                position === "right" ? "right-0" : "left-0"
              }`}
            >
              <span className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
                {tooltipText}
              </span>
              <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence> */}

        {/* Main Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 sm:h-16 sm:w-16 sm:shadow-xl sm:shadow-green-500/40"
          aria-label="Contact on WhatsApp"
        >
          {/* Pulse Animation */}
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-20" />

          {/* Icon */}
          <AnimatePresence mode="wait">
            {isChatOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="h-6 w-6 sm:h-7 sm:w-7" />
              </motion.div>
            ) : (
              <motion.div
                key="whatsapp"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white rounded-full shadow-inner overflow-hidden">
                  <Image
                    src="/whatsapp-icon.png"
                    alt="WhatsApp"
                    width={32}
                    height={32}
                    className="w-8 h-8 sm:w-9 sm:h-9"
                  />
                </div>
                {/* <MessageCircle className="h-7 w-7 fill-white sm:h-8 sm:w-8" /> */}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unread Badge */}
          {!isChatOpen && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              1
            </span>
          )}
        </motion.button>
      </motion.div>

      {/* Chat Popup */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity"
            />

            {/* Chat Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`fixed ${positionClasses[position]} z-50 w-[calc(100vw-2rem)] max-w-[320px] sm:max-w-[350px]`}
            >
              <div className="overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">
                {/* Header */}
                <div className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4">
                  {/* Avatar */}
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-white sm:h-12 sm:w-12">
                    <MessageCircle className="h-5 w-5 fill-white sm:h-6 sm:w-6" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white sm:text-base">
                      Mountain Expeditions
                    </h4>
                    {showResponseTime && (
                      <div className="flex items-center gap-1 text-xs text-green-100">
                        <Clock className="h-3 w-3" />
                        <span>Usually replies in minutes</span>
                      </div>
                    )}
                  </div>

                  {/* Close */}
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
                    aria-label="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Body */}
                <div className="bg-slate-50 px-4 py-4 sm:px-5 sm:py-5">
                  {/* Welcome Message */}
                  <div className="mb-4 rounded-2xl rounded-tl-none bg-white p-3 shadow-sm sm:mb-5 sm:p-4">
                    <p className="text-sm text-slate-700 leading-relaxed sm:text-base">
                      👋 Namaste! Welcome to Mountain Expeditions.
                    </p>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed sm:text-base">
                      How can we help you today? Feel free to ask about our
                      treks, custom expeditions, or anything else!
                    </p>
                  </div>

                  {/* Quick Replies */}
                  {!isMinimized && (
                    <div className="mb-4 space-y-2 sm:mb-5">
                      <p className="mb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Quick Replies
                      </p>
                      {chatQuickReplies.slice(0, isMinimized ? 2 : 4).map((reply) => (
                        <button
                          key={reply}
                          onClick={() => handleQuickReply(reply)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-xs font-medium text-slate-700 transition-colors hover:border-green-300 hover:bg-green-50 sm:px-4 sm:py-3 sm:text-sm"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && message.trim()) {
                          handleWhatsAppClick();
                        }
                      }}
                    />
                    <button
                      onClick={handleWhatsAppClick}
                      disabled={!message.trim()}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed sm:h-11 sm:w-11"
                      aria-label="Send message"
                    >
                      <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>

                  {/* Footer Note */}
                  <p className="mt-3 text-center text-[10px] text-slate-400 sm:mt-4 sm:text-xs">
                    Powered by WhatsApp • Messages may be charged
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
