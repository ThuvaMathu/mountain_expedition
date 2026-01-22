"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, Calendar, Star, Users, MapPin, ChevronRight, Check, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface QuickViewModalProps {
  item: TMountainType | null;
  isOpen: boolean;
  onClose: () => void;
  currency: string;
}

export function QuickViewModal({ item, isOpen, onClose, currency }: QuickViewModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!item) return null;

  const price = currency === "USD" ? (item.priceUSD || 0) : (item.priceINR || 0);
  const isIncluded = (text: string) => !text.toLowerCase().startsWith("not");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Section */}
              <div className="w-full md:w-2/5 h-48 md:h-auto relative">
                <Image
                  src={item.imageUrl?.[0] || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />

                {/* Mobile Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4 md:hidden">
                  <h3 className="text-xl font-bold text-white">{item.name}</h3>
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full md:w-3/5 p-4 md:p-6 overflow-y-auto max-h-[70vh] md:max-h-[90vh]">
                {/* Desktop Title */}
                <h3 className="hidden md:block text-2xl font-bold text-gray-900 mb-4">{item.name}</h3>

                {/* Location & Rating */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    {item.rating}
                  </span>
                </div>

                {/* Duration & Difficulty */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {item.duration}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 rounded-full text-sm text-teal-700">
                    <Users className="w-4 h-4" />
                    {item.availableSlots} spots available
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">About This Trek</h4>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {item.description || "An unforgettable adventure awaits you. Join Muthamilselvi on this incredible expedition to experience breathtaking views and challenging terrain."}
                  </p>
                </div>

                {/* What's Included */}
                {("includedItems" in item) && ((item as any).includedItems?.length > 0) && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">What's Included</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(item as any).includedItems.slice(0, 4).map((included: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            isIncluded(included) ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}>
                            {isIncluded(included) ? <Check className="w-3 h-3" /> : <XIcon className="w-3 h-3" />}
                          </div>
                          <span className="text-gray-600 truncate">{included}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price & CTA */}
                <div className="border-t border-gray-200 pt-4 mt-auto">
                  {item.pricingType === "enquire" ? (
                    <Link href={`/enquire/${item.id}`} className="block">
                      <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-6 text-lg shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all">
                        Enquire Now
                        <ChevronRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Starting from</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                          {formatCurrency(price, currency)}
                        </p>
                        <p className="text-xs text-gray-500">{item.type === 'tour' ? 'per tour' : 'per person'}</p>
                      </div>
                      <Link
                        href={item.type === "tour" ? `/tours/${item.id}` : `/trekking/${item.id}`}
                        className="shrink-0"
                      >
                        <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-6 shadow-lg">
                          Book Now
                          <ChevronRight className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
