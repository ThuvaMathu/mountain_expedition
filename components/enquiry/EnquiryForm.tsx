"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Users, Phone, Mail as MailIcon, Clock, CheckCircle2 } from "lucide-react";
import { ImageLoader } from "@/components/ui/image-loader";
import { TrustBadges } from "./TrustBadges";
import { BrandFaceTrust } from "./BrandFaceTrust";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { GuaranteePromise } from "./GuaranteePromise";
import { TestimonialsCarousel } from "./TestimonialsCarousel";
import { EnquiryHero } from "./EnquiryHero";

interface EnquiryFormProps {
    packageData: any;
    packageType: "trekking" | "tour";
    contactDetails: any;
    stats?: any[];
    testimonials?: any[];
}

export function EnquiryForm({ packageData, packageType, contactDetails, stats, testimonials }: EnquiryFormProps) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: `I'm interested in ${packageData.name}. Please provide pricing and availability details.`,
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/email/enquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    packageId: packageData.id,
                    packageName: packageData.name,
                    packageType: packageType,
                }),
            });

            if (response.ok) {
                setSuccess(true);
            }
        } catch (error) {
            console.error("Enquiry submission failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* WhatsApp Float - Always show with fallback number */}
            {/* <WhatsAppFloat
                phoneNumber={contactDetails?.socialMedia?.whatsapp || contactDetails?.phone}
                message={`Hi! I'm interested in ${packageData.name}. Please provide more details.`}
            /> */}

            <div className="container mx-auto px-4 max-w-6xl py-12">


                {/* Hero Section */}
                <EnquiryHero
                    packageName={packageData.name}
                    location={packageData.location}
                    duration={packageData.duration}
                    difficulty={packageData.difficulty}
                    imageUrl={packageData.imageUrl}
                    packageType={packageType}
                    packageId={packageData.id}
                    stats={stats}
                />
                {/* Trust Badges */}
                <TrustBadges />

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Package Summary & Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Brand Face / Trust Component - Move to top for visibility */}
                        <BrandFaceTrust />

                        {/* Package Summary Card */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="relative h-48">
                                <ImageLoader
                                    src={packageData.imageUrl?.[0] || "/placeholder.svg"}
                                    alt={packageData.name}
                                    height="h-48"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h2 className="text-xl font-bold text-white mb-1">{packageData.name}</h2>
                                    <div className="flex flex-wrap gap-2 text-white/90 text-xs">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {packageData.location}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 text-teal-600" />
                                    <span>{packageData.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users className="h-4 w-4 text-teal-600" />
                                    <span>{packageData.groupSize}</span>
                                </div>
                                <div className="pt-3 border-t">
                                    <p className="text-xs text-gray-500">
                                        Fill out the form to receive detailed pricing and availability information for this {packageType}.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Phone</p>
                                        <a href={`tel:${contactDetails.phone}`} className="text-sm text-teal-600 hover:underline">
                                            {contactDetails.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MailIcon className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Email</p>
                                        <a href={`mailto:${contactDetails.email}`} className="text-sm text-teal-600 hover:underline break-all">
                                            {contactDetails.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Address</p>
                                        <p className="text-sm text-gray-600">{contactDetails.address}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Office Hours */}
                            <div className="pt-4 border-t">
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock className="h-5 w-5 text-teal-600" />
                                    <h4 className="text-sm font-semibold text-gray-900">Office Hours</h4>
                                </div>
                                <div className="space-y-1">
                                    {contactDetails.officeHours?.map((schedule: any, index: number) => (
                                        <div key={index} className="flex justify-between text-xs text-gray-600">
                                            <span>{schedule.day}</span>
                                            <span>{schedule.hours}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column - Enquiry Form */}
                    <div className="lg:col-span-2" id="enquiry-form-section">
                        {!success ? (
                            <div className="bg-white rounded-2xl shadow-xl border-2 border-teal-100 overflow-hidden">
                                {/* Form Header */}
                                <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 md:px-8 py-4 md:py-6 text-white">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MailIcon className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <div>
                                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Get Your Personalized Quote</h1>
                                            <p className="text-teal-100 text-xs md:text-sm">Fill the form below - Response within 24 hours</p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-4 md:space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Your Name <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                required
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                placeholder="John Doe"
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                required
                                                type="tel"
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                placeholder="+91 98765 43210"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            required
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            placeholder="john@example.com"
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            rows={6}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                                            placeholder="Tell us about your requirements, preferred dates, group size, etc."
                                        />
                                    </div>

                                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                                        <p className="text-sm text-teal-800">
                                            <strong>What happens next?</strong> Our team will review your enquiry and send you a detailed quote including pricing, itinerary, and availability within 24 hours.
                                        </p>
                                    </div>

                                    {/* Guarantee Promise */}
                                    <GuaranteePromise />

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-6 text-lg font-semibold"
                                    >
                                        {loading ? "Sending..." : "Submit Enquiry"}
                                    </Button>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-3">Enquiry Submitted!</h2>
                                <p className="text-lg text-gray-600 mb-6">
                                    Thank you for your interest in <strong>{packageData.name}</strong>.
                                </p>
                                <p className="text-gray-600 mb-8">
                                    We've received your enquiry and our team will get back to you within 24 hours with detailed pricing and availability information.
                                </p>
                                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 inline-block">
                                    <p className="text-sm text-teal-800">
                                        Check your email <strong>{form.email}</strong> for confirmation.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Testimonials Carousel */}
                        {testimonials && testimonials.length > 0 && !success && (
                            <div className="mt-8">
                                <TestimonialsCarousel testimonials={testimonials} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
