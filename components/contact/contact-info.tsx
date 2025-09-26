"use client";

import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import Link from "next/link";

interface ContactDetails {
  email: string;
  phone: string;
  address: string;
}

interface ContactInfoProps {
  contactDetails: ContactDetails;
}

export function ContactInfo({ contactDetails }: ContactInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Contact Information
      </h3>

      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <MapPin className="h-5 w-5 text-teal-600" />
          </div>
          <div className="ml-4">
            <h4 className="font-medium text-gray-900">Address</h4>
            <p className="text-gray-600 text-sm mt-1 leading-relaxed">
              {contactDetails.address}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <Phone className="h-5 w-5 text-teal-600" />
          </div>
          <div className="ml-4">
            <h4 className="font-medium text-gray-900">Phone</h4>
            <a
              href={`tel:${contactDetails.phone}`}
              className="text-teal-600 hover:text-teal-700 text-sm mt-1 block transition-colors"
            >
              {contactDetails.phone}
            </a>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <Mail className="h-5 w-5 text-teal-600" />
          </div>
          <div className="ml-4">
            <h4 className="font-medium text-gray-900">Email</h4>
            <a
              href={`mailto:${contactDetails.email}`}
              className="text-teal-600 hover:text-teal-700 text-sm mt-1 block transition-colors"
            >
              {contactDetails.email}
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Follow Us</h4>
        <div className="flex space-x-4">
          <Link
            href="#"
            className="text-gray-400 hover:text-teal-400 transition-colors"
          >
            <Facebook className="h-6 w-6" />
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-teal-400 transition-colors"
          >
            <Twitter className="h-6 w-6" />
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-teal-400 transition-colors"
          >
            <Instagram className="h-6 w-6" />
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-teal-400 transition-colors"
          >
            <Youtube className="h-6 w-6" />
          </Link>
        </div>
      </div>

      <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
        <div className="flex items-center mb-2">
          <Globe className="h-4 w-4 text-teal-600 mr-2" />
          <h4 className="font-medium text-teal-800">Response Time</h4>
        </div>
        <p className="text-teal-700 text-sm">
          We typically respond to inquiries within <strong>2-4 hours</strong>{" "}
          during business hours, and within <strong>24 hours</strong> on
          weekends.
        </p>
      </div>
    </div>
  );
}
