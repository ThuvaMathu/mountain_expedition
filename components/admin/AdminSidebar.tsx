"use client";

import {
  BarChart3,
  Mountain,
  ImageIcon,
  FileText,
  BarChart2,
  Phone,
  CalendarDays,
  Shield,
  Settings,
  ClipboardList,
  Bus,
  // MessageSquare,
  MessageSquare,
  X,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import AppLogo from "../ui/app-logo";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
}: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "booking", label: "Bookings", icon: ClipboardList },
    { id: "trourist", label: "Tour & Travel", icon: Bus },
    { id: "mountains", label: "Trekking", icon: Mountain },
    { id: "blog", label: "Blog Posts", icon: FileText },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "stats", label: "Statistics", icon: BarChart2 },
    { id: "contacts", label: "Contact Details", icon: Phone },
    { id: "testimonials", label: "Testimonials", icon: MessageSquare },
    //  { id: "events", label: "Events", icon: CalendarDays },
    { id: "account", label: "Admin Account", icon: Shield },
  ];

  return (
    <>
      {/* Sidebar Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="h-full grid grid-rows-[auto_auto_minmax(0,1fr)_auto] bg-white border-r">
          <div className="p-4 border-b flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <AppLogo isWithText={false} size="small" />
              <span className="font-bold text-teal-700">Tamil Adventure</span>
            </Link>
            <button
              onClick={onClose}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-6 py-4 border-b">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Settings className="h-4 w-4" /> Admin Panel
            </h2>
          </div>

          <nav className="overflow-y-auto py-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose(); // Close sidebar on selection (mobile)
                }}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${activeTab === item.id
                    ? "bg-teal-50 text-teal-700 border-r-2 border-teal-600"
                    : "text-gray-700"
                  }`}
              >
                <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t bg-gray-50">
            <Link href="/" className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-teal-700 bg-white border border-teal-200 rounded-md hover:bg-teal-50 transition-colors">
              <LogOut className="h-4 w-4 mr-2" />
              Back to Website
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
