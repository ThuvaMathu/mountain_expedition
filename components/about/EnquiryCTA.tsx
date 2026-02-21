"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Phone, MessageCircle, ArrowRight, Mountain } from "lucide-react";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { useContactDetails } from "@/hooks/useContactDetails";

export function EnquiryCTA() {
  const { contact } = useContactDetails();
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-10 md:py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SlideUp>
          <div className="bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-700 rounded-2xl md:rounded-3xl p-5 md:p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-center">
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/20 rounded-full mb-4 md:mb-6">
                  <Mountain className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-xs md:text-sm font-medium">Start Your Adventure</span>
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-2 md:mb-4">
                  Ready to Begin Your Own Journey?
                </h2>
                <p className="text-teal-50 text-sm md:text-base lg:text-lg mb-4 md:mb-8 max-w-xl">
                  Join our expeditions and experience the thrill of the mountains. Whether you're a
                  beginner or an experienced trekker, we have adventures tailored for you.
                </p>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-4 md:gap-6 text-xs md:text-sm">
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 md:gap-2 hover:text-white transition-colors">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-teal-200" />
                    <span>{contact.email}</span>
                  </a>
                  <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 md:gap-2 hover:text-white transition-colors">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-teal-200" />
                    <span>{contact.phone}</span>
                  </a>
                </div>
              </div>

              {/* Right Content - CTAs */}
              <div className="space-y-3 md:space-y-4">
                {/* Primary CTA - Enquiry */}
                <Link
                  href="/enquire"
                  className="group flex items-center justify-between gap-3 md:gap-4 bg-white text-teal-700 rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm md:text-base lg:text-lg">Send an Enquiry</h3>
                      <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Get personalized trek recommendations</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-teal-600 group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>

                {/* Secondary CTA - Packages */}
                <Link
                  href="/packages"
                  className="group flex items-center justify-between gap-3 md:gap-4 bg-white/10 backdrop-blur-sm text-white rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Mountain className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm md:text-base lg:text-lg">View Packages</h3>
                      <p className="text-xs md:text-sm text-teal-100 hidden sm:block">Explore our upcoming expeditions</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>

                {/* Tertiary CTA - Contact */}
                <Link
                  href="/contact"
                  className="group flex items-center justify-between gap-3 md:gap-4 bg-transparent text-white rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 border border-dashed border-white/30 hover:border-white/60 hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm md:text-base lg:text-lg">General Contact</h3>
                      <p className="text-xs md:text-sm text-teal-100 hidden sm:block">For partnerships and press inquiries</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="relative z-10 mt-6 md:mt-8 lg:mt-10 pt-4 md:pt-6 lg:pt-8 border-t border-white/20 text-center text-teal-100 text-xs md:text-sm">
              <p>
                For press inquiries and speaking engagements, please use our{" "}
                <Link href="/contact" className="underline hover:text-white transition-colors">
                  contact form
                </Link>
                .
              </p>
            </div>
          </div>
        </SlideUp>
      </div>
    </section>
  );
}
