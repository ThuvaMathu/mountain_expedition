"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Mountain,
  Globe,
  User,
  LogOut,
  MapPin,
  Plane,
  ChevronDown,
  Compass,
} from "lucide-react";
import AppLogo from "../ui/app-logo";
import { CurrencySelector } from "./navbar/currency-selector";
import { UserSelector } from "./navbar/user-selector";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTouristDropdownOpen, setIsTouristDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <AppLogo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              About
            </Link>

            {/* Adventures Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsTouristDropdownOpen(!isTouristDropdownOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-teal-600 transition-colors"
                aria-expanded={isTouristDropdownOpen}
                aria-haspopup="true"
              >
                <span>Adventures</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isTouristDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
                  <div className="py-2">
                    <Link
                      href="/tours"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                      onClick={() => setIsTouristDropdownOpen(false)}
                    >
                      <Globe className="h-4 w-4 mr-3 text-teal-600" />
                      <div>
                        <div className="font-medium">Tours</div>
                        <div className="text-xs text-gray-500">
                          Explore Global & Domestic
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/trekking"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      onClick={() => setIsTouristDropdownOpen(false)}
                    >
                      <Mountain className="h-4 w-4 mr-3 text-blue-600" />
                      <div>
                        <div className="font-medium">Trekking</div>
                        <div className="text-xs text-gray-500">
                          Mountain Expeditions
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/gallery"
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              Gallery
            </Link>
            <Link
              href="/blog"
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              Contact
            </Link>

            {/* Currency Selector */}
            <CurrencySelector variant="desktop" />

            {/* User Selector */}
            <UserSelector variant="desktop" />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-teal-600"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-teal-600"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              {/* Mobile Adventures Links */}
              <div className="px-3 py-2">
                <div className="text-gray-900 font-medium mb-2">
                  Adventures
                </div>
                <div className="pl-4 space-y-1">
                  <Link
                    href="/tours"
                    className="flex items-center py-1 text-gray-600 hover:text-teal-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Tours
                  </Link>
                  <Link
                    href="/trekking"
                    className="flex items-center py-1 text-gray-600 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <Mountain className="h-4 w-4 mr-2" />
                    Trekking
                  </Link>
                </div>
              </div>

              <Link
                href="/gallery"
                className="block px-3 py-2 text-gray-700 hover:text-teal-600"
                onClick={() => setIsOpen(false)}
              >
                Gallery
              </Link>
              <Link
                href="/blog"
                className="block px-3 py-2 text-gray-700 hover:text-teal-600"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-teal-600"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile Currency Selector */}
              <CurrencySelector variant="mobile" />

              {/* Mobile User Selector */}
              <UserSelector variant="mobile" />
            </div>
          </div>
        )}
      </div>

      {/* Dropdown Backdrop for Desktop */}
      {isTouristDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsTouristDropdownOpen(false)}
        />
      )}
    </nav>
  );
}
