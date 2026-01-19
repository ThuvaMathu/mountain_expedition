"use client";

import { useState } from "react";
import { MapPin, Calendar, Mountain, ArrowRight, Sparkles, Phone, User, CheckCircle2, ChevronDown } from "lucide-react";
import { ImageLoader } from "@/components/ui/image-loader";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StatBadgesGrid } from "./StatBadge";

interface EnquiryHeroProps {
    packageName: string;
    location: string;
    duration: string;
    difficulty?: string;
    imageUrl?: string[];
    packageType: "trekking" | "tour";
    packageId: string;
    stats?: {
        id?: string;
        title: string;
        value: string;
        description?: string;
        icon?: string;
        order?: number;
    }[];
    onSubmitQuickEnquiry?: (data: { name: string; phone: string }) => Promise<void>;
}

export function EnquiryHero({
    packageName,
    location,
    duration,
    difficulty,
    imageUrl,
    packageType,
    packageId,
    stats,
}: EnquiryHeroProps) {
    const [quickForm, setQuickForm] = useState({ name: "", phone: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleSubmitQuick = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/email/enquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: quickForm.name,
                    phone: quickForm.phone,
                    email: `quick-${quickForm.name.toLowerCase().replace(/\s+/g, '.')}@enquiry.com`,
                    message: `Quick enquiry for ${packageName}. Please contact me via phone for pricing and availability.`,
                    packageId,
                    packageName,
                    packageType,
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                    setQuickForm({ name: "", phone: "" });
                }, 3000);
            }
        } catch (error) {
            console.error("Quick enquiry failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const scrollToForm = () => {
        document.getElementById("enquiry-form-section")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden mb-6 md:mb-8">
            {/* Hero Image Section */}
            <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
                <ImageLoader
                    src={imageUrl?.[0] || "/placeholder.svg"}
                    alt={packageName}
                    height="h-full"
                    className="w-full h-full object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />

                {/* Decorative Badge - Top Right */}
                <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 border border-white/20">
                    <span className="text-white/90 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        {packageType === "trekking" ? "Premium" : "Exclusive"}
                    </span>
                </div>
            </div>

            {/* Content Section - Not absolute, flows naturally */}
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 px-4 sm:px-5 md:px-6 py-5 md:py-6">
                <SlideUp>
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-teal-300/80 text-xs mb-2">
                        <span className="capitalize">{packageType}s</span>
                        <span>→</span>
                        <span className="truncate">{location}</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight">
                        {packageName}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-white/70 text-xs sm:text-sm md:text-base mb-4 line-clamp-2">
                        {packageType === "trekking"
                            ? "Join India's finest expedition leader for an unforgettable adventure."
                            : "Experience the journey of a lifetime with expert guidance."}
                    </p>

                    {/* Quick Info Cards */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20 flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-teal-300 flex-shrink-0" />
                            <span className="text-white text-xs">{location}</span>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-teal-300 flex-shrink-0" />
                            <span className="text-white text-xs">{duration}</span>
                        </div>

                        {difficulty && (
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20 flex items-center gap-2">
                                <Mountain className="w-3.5 h-3.5 text-teal-300 flex-shrink-0" />
                                <span className="text-white text-xs">{difficulty}</span>
                            </div>
                        )}
                    </div>

                    {/* Stats Badges - Integrated */}
                    {stats && stats.length > 0 && (
                        <div className="mb-4">
                            <StatBadgesGrid stats={stats} maxStats={4} />
                        </div>
                    )}

                    {/* CTA Section */}
                    <AnimatePresence mode="wait">
                        {!showForm ? (
                            <motion.div
                                key="cta"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col gap-2.5 sm:gap-3"
                            >
                                {/* Primary CTA */}
                                <motion.button
                                    animate={{ scale: [1, 1.015, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    onClick={() => setShowForm(true)}
                                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl px-4 py-3 sm:px-5 sm:py-3 shadow-lg shadow-teal-500/30 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300"
                                >
                                    <Phone className="w-4 h-4" />
                                    Get Free Quote
                                    <ArrowRight className="w-4 h-4" />
                                </motion.button>

                                {/* Secondary CTA - Scroll to form */}
                                <Button
                                    onClick={scrollToForm}
                                    variant="outline"
                                    className="w-full bg-white/10 hover:bg-white/20 text-white border-white/30 rounded-xl px-4 py-2.5 text-sm font-medium"
                                >
                                    Full Form
                                    <ChevronDown className="w-4 h-4 inline ml-1" />
                                </Button>
                            </motion.div>
                        ) : (
                            /* Quick Inline Form */
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                            >
                                {isSuccess ? (
                                    <div className="text-center py-3">
                                        <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                        <p className="text-white font-semibold text-sm">We'll call you shortly!</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmitQuick} className="space-y-3">
                                        <div className="flex items-center justify-between text-white mb-2">
                                            <span className="font-semibold text-sm flex items-center gap-2">
                                                <User className="w-4 h-4 text-teal-300" />
                                                Quick Enquire
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setShowForm(false)}
                                                className="text-white/70 hover:text-white p-1"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                required
                                                value={quickForm.name}
                                                onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                                                className="w-full px-3 py-2 bg-white border border-white/30 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Phone"
                                                required
                                                value={quickForm.phone}
                                                onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
                                                className="w-full px-3 py-2 bg-white border border-white/30 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white py-2.5 font-semibold rounded-lg shadow-lg text-sm"
                                        >
                                            {isSubmitting ? "Sending..." : "Request Callback"}
                                        </Button>
                                        <p className="text-white/60 text-xs text-center">
                                            Or scroll for detailed form ↓
                                        </p>
                                    </form>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </SlideUp>
            </div>
        </div>
    );
}
