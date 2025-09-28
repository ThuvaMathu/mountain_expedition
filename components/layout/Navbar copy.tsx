"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Menu, X, Mountain, Globe, User, LogOut } from "lucide-react";
import AppLogo from "../ui/app-logo";
import { CurrencySelector } from "./navbar/currency-selector";
import { UserSelector } from "./navbar/user-selector";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
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
              {t("home")}
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              {t("about")}
            </Link>
            <Link
              href="/mountains"
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              {t("mountains")}
            </Link>
            <Link
              href="/gallery"
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              {t("gallery")}
            </Link>
            <Link
              href="/blog"
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              {t("blog")}
            </Link>

            {/* Currency Selector */}
            <CurrencySelector variant="desktop" />

            {/* Language Toggle - Commented out as per original */}
            {/* <Button variant="ghost" size="sm" onClick={toggleLanguage} className="flex items-center space-x-1">
              <Globe className="h-4 w-4" />
              <span>{language === "en" ? "EN" : "TA"}</span>
            </Button> */}

            {/* User Selector */}
            <UserSelector variant="desktop" />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
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
              >
                {t("home")}
              </Link>
              <Link
                href="/mountains"
                className="block px-3 py-2 text-gray-700 hover:text-teal-600"
              >
                {t("mountains")}
              </Link>
              <Link
                href="/gallery"
                className="block px-3 py-2 text-gray-700 hover:text-teal-600"
              >
                {t("gallery")}
              </Link>
              <Link
                href="/blog"
                className="block px-3 py-2 text-gray-700 hover:text-teal-600"
              >
                {t("blog")}
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-teal-600"
              >
                {t("about")}
              </Link>

              {/* Mobile Currency Selector */}
              <CurrencySelector variant="mobile" />

              {/* Mobile Language Toggle */}
              {/* <div className="px-3 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="flex items-center space-x-1"
                >
                  <Globe className="h-4 w-4" />
                  <span>{language === "en" ? "English" : "தமிழ்"}</span>
                </Button>
              </div> */}

              {/* Mobile User Selector */}
              <UserSelector variant="mobile" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
