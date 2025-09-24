"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  User,
  ChevronDown,
  LogOut,
  Settings,
  UserCircle,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

interface UserSelectorProps {
  variant?: "desktop" | "mobile";
}

export function UserSelector({ variant = "desktop" }: UserSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  if (variant === "mobile") {
    return (
      <div className="px-3 py-2">
        {user ? (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <UserCircle className="h-4 w-4 mr-2" />
              {user.displayName || user.email}
            </div>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <User className="h-4 w-4 mr-2" />
                {t("dashboard")}
              </Button>
            </Link>
            {user.isAdmin && (
              <Link href="/admin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t("logout")}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Account
            </div>
            <Link href="/auth/login">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <LogIn className="h-4 w-4 mr-2" />
                {t("login")}
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                {t("register")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Desktop version
  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/auth/login">
          <Button variant="ghost" size="sm">
            <LogIn className="h-4 w-4 mr-2" />
            {t("login")}
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            {t("register")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:bg-gray-100"
      >
        <UserCircle className="h-5 w-5" />
        <span className="font-medium max-w-24 truncate">
          {user.displayName || user.email?.split("@")[0] || "User"}
        </span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="font-medium text-gray-900 truncate">
              {user.displayName || "User"}
            </div>
            <div className="text-sm text-gray-500 truncate">{user.email}</div>
          </div>

          <div className="py-1">
            <Link href="/dashboard">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors text-gray-700"
              >
                <User className="h-4 w-4" />
                <span>{t("dashboard")}</span>
              </button>
            </Link>

            {user.isAdmin && (
              <Link href="/admin">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors text-gray-700"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin Panel</span>
                </button>
              </Link>
            )}
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span>{t("logout")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
