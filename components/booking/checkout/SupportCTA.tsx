"use client";

import React from "react";
import { MessageCircle, Phone, Mail, Users } from "lucide-react";
import { useContactDetails } from "@/hooks/useContactDetails";

const SupportCTA = React.memo(() => {
    const { contact } = useContactDetails();

    // Use whatsapp from socialMedia, fallback to phone number
    const whatsappNumber = contact.socialMedia?.whatsapp || contact.phone;

    return (
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-8 border border-teal-100 shadow-sm">
            {/* Icon + Headline */}
            <div className="flex items-center justify-center mb-3">
                <div className="bg-teal-100 rounded-full p-3 mr-3">
                    <Users className="h-6 w-6 text-teal-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                    Questions? We're Here to Help
                </h3>
            </div>

            {/* Supporting Text */}
            <p className="text-center text-gray-700 mb-6 max-w-2xl mx-auto">
                Our adventure experts are standing by to answer any questions about your trek, clarify details, or help customize your experience. No question is too small!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                {/* Primary CTA - WhatsApp - Always show */}
                <a
                    href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Hi!%20I%20have%20questions%20about%20my%20booking`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
                >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Chat on WhatsApp
                </a>

                {/* Secondary CTAs */}
                <div className="flex gap-3 w-full sm:w-auto">
                    <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center justify-center px-5 py-3 bg-white hover:bg-gray-50 text-teal-700 border-2 border-teal-200 rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-initial"
                    >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Us
                    </a>
                    <a
                        href={`mailto:${contact.email}?subject=Booking%20Question`}
                        className="flex items-center justify-center px-5 py-3 bg-white hover:bg-gray-50 text-teal-700 border-2 border-teal-200 rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-initial"
                    >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                    </a>
                </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-6 pt-6 border-t border-teal-200">
                <p className="text-center text-sm text-gray-600">
                    <span className="font-semibold text-teal-700">Available 24/7</span> • Average response time: Under 5 minutes
                </p>
            </div>
        </div>
    );
});

SupportCTA.displayName = "SupportCTA";

export default SupportCTA;
