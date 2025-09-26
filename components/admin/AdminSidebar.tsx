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
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "booking", label: "Bookings", icon: ClipboardList },
    { id: "mountains", label: "Mountains", icon: Mountain },
    { id: "blog", label: "Blog Posts", icon: FileText },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "stats", label: "Statistics", icon: BarChart2 },
    { id: "contacts", label: "Contact Details", icon: Phone },
    { id: "testimonials", label: "Testimonials", icon: Phone },
    { id: "events", label: "Events", icon: CalendarDays },
    { id: "account", label: "Admin Account", icon: Shield },
  ];

  return (
    <aside className="w-60 bg-white shadow-lg min-h-screen fixed pt-16 top-0 left-0 right-0">
      <div className=" w-full ">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-5 w-5 text-teal-600" /> Admin Panel
          </h2>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                activeTab === item.id
                  ? "bg-teal-50 text-teal-700 border-r-2 border-teal-600"
                  : "text-gray-700"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
