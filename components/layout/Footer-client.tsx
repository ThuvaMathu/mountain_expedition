'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, Send } from 'lucide-react';
import { useState } from 'react';
import { COMPANY_INFO } from '@/seo/config';
import { getContactDetails } from '@/services/get-contact';
import AppLogo from '../ui/app-logo';
import { usePathname } from 'next/navigation';

const destinations = [
  { name: 'Trekking', slug: 'trekking' },
  { name: 'Tours', slug: 'tours' },
  { name: 'Mountains', slug: 'mountains' },
  { name: 'Gallery', slug: 'gallery' },
];

const exploreLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Trekking', href: '/trekking' },
  { name: 'Tours', href: '/tours' },
  { name: 'Mountains', href: '/mountains' },
  { name: 'Blog', href: '/blog' },
];

const quickLinks = [
  { name: 'Contact Us', href: '/contact' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Write a Review', href: '/review' },
  { name: 'Success Stories', href: '/read-stories' },
  { name: 'Policies', href: '/policy' },
];

// Diverse Instagram gallery images
const instagramImages = [
  'https://media.tamiladventuretrekkingclub.com/images/gallery/img-10.webp',
  'https://media.tamiladventuretrekkingclub.com/images/gallery/img-15.webp',
  'https://media.tamiladventuretrekkingclub.com/images/gallery/img-20.webp',
  'https://media.tamiladventuretrekkingclub.com/images/gallery/img-25.webp',
  'https://media.tamiladventuretrekkingclub.com/images/gallery/img-30.webp',
  'https://media.tamiladventuretrekkingclub.com/images/gallery/img-35.webp',
  'https://media.tamiladventuretrekkingclub.com/images/gallery/img-40.webp',
  'https://media.tamiladventuretrekkingclub.com/images/gallery/img-45.webp',
  'https://media.tamiladventuretrekkingclub.com/images/gallery/img-50.webp',
];

const socialLinks = [
  { name: 'facebook', icon: Facebook, url: 'https://www.facebook.com' },
  { name: 'twitter', icon: Twitter, url: 'https://www.twitter.com' },
  { name: 'linkedin', icon: Linkedin, url: 'https://www.linkedin.com' },
  { name: 'instagram', icon: Instagram, url: 'https://www.instagram.com' },
];
type FooterClientProps = {
  contactDetails: TContactDetails;
};
export default function FooterClient({
  contactDetails,
}: FooterClientProps) {
  const [email, setEmail] = useState('');
  const pathname = usePathname();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribed:', email);
    setEmail('');
  };
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative pt-16 pb-8 text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://media.tamiladventuretrekkingclub.com/images/posters/poster-39.webp"
          alt="Footer Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/75 via-slate-900/80 to-slate-900/85" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="container mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 md:p-12 shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  Subscribe <span className="text-teal-200">Now!</span>
                </h3>
                <p className="text-teal-100">
                  Sign up to our weekly newsletter to get the latest updates.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address..."
                  required
                  className="flex-1 w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40 backdrop-blur transition-all"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-teal-600 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg"
                >
                  <span className="hidden sm:inline">Subscribe</span>
                  <span className="sm:hidden">Join Now</span>
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >

              <Link href="/" className="inline-block mb-6">
                <AppLogo textColor="text-white" size="medium" />
              </Link>
              <p className="text-gray-200 mb-6 leading-relaxed">
                Your trusted partner for unforgettable mountain adventures and trekking experiences across the Himalayas.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-teal-500 transition-all duration-300 hover:scale-110"
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-xl font-bold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                {destinations.map((dest) => (
                  <li key={dest.slug}>
                    <Link
                      href={`/${dest.slug}`}
                      className="text-gray-200 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {dest.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Explore */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-xl font-bold mb-6 text-white">Explore</h4>
              <ul className="space-y-3">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-200 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Us */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="text-xl font-bold mb-6 text-white">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-teal-400 shrink-0 mt-1" />
                  <a
                    href="tel:+911234567898"
                    className="text-gray-200 hover:text-white transition-colors duration-300"
                  >
                    {contactDetails.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-teal-400 shrink-0 mt-1" />
                  <a
                    href="mailto:info@example.com"
                    className="text-gray-200 hover:text-white transition-colors duration-300"
                  >
                    {contactDetails.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-1" />
                  <span className="text-gray-200">
                    {contactDetails.address}
                  </span>
                </li>
              </ul>

              {/* Quick Links */}
              {/* <div className="mt-6">
                <ul className="space-y-2">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-300 hover:text-teal-400 transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div> */}
            </motion.div>
          </div>


          {/* Copyright */}

          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-300">
                Copyright © 2025{' '}
                <span className="text-teal-400 font-semibold">{COMPANY_INFO.legalName}</span>
                . All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link
                  href="/policy#privacy"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                  scroll={false}
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/policy#terms"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                  scroll={false}
                >
                  Terms of Service
                </Link>
                <Link
                  href="/policy#cookies"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                  scroll={false}
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
