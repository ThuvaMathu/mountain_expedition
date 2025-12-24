"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What services does your travel agency offer?",
    answer: "We offer a wide range of travel services including flight bookings, hotel reservations, holiday packages, customized itineraries, visa assistance, and travel insurance."
  },
  {
    question: "Can I customize my travel package?",
    answer: "Yes, absolutely! We specialize in tailor-made holidays. You can customize your itinerary, accommodation, and activities to suit your preferences and budget."
  },
  {
    question: "Do you offer travel insurance?",
    answer: "Yes, we provide comprehensive travel insurance options to ensure your trip is safe and secure against unforeseen circumstances."
  },
  {
    question: "What happens if my flight is delayed or canceled?",
    answer: "Our 24/7 support team will assist you with rebooking and making necessary alternative arrangements to minimize disruption to your travel plans."
  },
  {
    question: "How do I make a booking?",
    answer: "You can book directly through our website, or contact our support team via phone or WhatsApp for personalized assistance."
  },
  {
    question: "Do I need to pay in full at the time of booking?",
    answer: "For most packages, a deposit is required to confirm the booking, with the balance due closer to the travel date. Specific terms depend on the package selected."
  },
  {
    question: "Can I cancel or reschedule my trip?",
    answer: "Cancellation and rescheduling policies vary by package and provider. We will guide you through the process and help minimize any potential fees."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500">
            Have questions? We're here to help.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
                key={index} 
                className="border-b border-gray-100 last:border-0"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
              >
                <span className={cn(
                    "text-lg font-medium transition-colors",
                    openIndex === index ? "text-orange-600" : "text-gray-900 group-hover:text-orange-600"
                )}>
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-orange-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-orange-600" />
                )}
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  openIndex === index ? "max-h-48 opacity-100 mb-6" : "max-h-0 opacity-0"
                )}
              >
                <p className="text-gray-600 leading-relaxed pr-8">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
