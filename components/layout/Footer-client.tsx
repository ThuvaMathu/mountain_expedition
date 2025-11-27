"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  Clock,
} from "lucide-react";
import AppLogo from "../ui/app-logo";
import { COMPANY_INFO } from "@/seo/config";

type OfficeHours = {
  day: string;
  hours: string;
};

type ContactDetails = {
  email: string;
  phone: string;
  address: string;
  emergencyPhone: string;
  officeHours: OfficeHours[];
  faqs: any[];
};

type FooterClientProps = {
  contactDetails: ContactDetails;
  hideRoutes: string[];
};

export function FooterClient({
  contactDetails,
  hideRoutes,
}: FooterClientProps) {
  const pathname = usePathname();

  // Check if current route should hide footer
  if (hideRoutes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <AppLogo textColor="text-white" />
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Your trusted partner for world-class mountain expeditions. We
              provide safe, professional, and unforgettable climbing experiences
              across the globe.
            </p>
            <div className="flex space-x-4">
              <Link
                href={COMPANY_INFO.social.facebook}
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </Link>
              <Link
                href={COMPANY_INFO.social.twitter}
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </Link>
              <Link
                href={COMPANY_INFO.social.instagram}
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </Link>
              <Link
                href={COMPANY_INFO.social.youtube}
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                <Youtube className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/mountains"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Mountains
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-teal-400" />
                <span className="text-gray-300">{contactDetails.email}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-teal-400" />
                <span className="text-gray-300">{contactDetails.phone}</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-5">
                  <Clock className="h-5 w-5 text-teal-400 mt-1" />
                </div>
                <div className="w-fit">
                  {contactDetails.officeHours.map((hrTime, i) => (
                    <span key={i} className="text-gray-300 block">
                      {hrTime.day}: {hrTime.hours}
                    </span>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Tamil Adventure Treckking Club. All
              rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
