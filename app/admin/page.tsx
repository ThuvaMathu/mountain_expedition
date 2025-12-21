"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
//import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { BlogManagement } from "@/components/admin/BlogManagement";
import { GalleryManagement } from "@/components/admin/GalleryManagement";
import { StatsManagement } from "@/components/admin/StatsManagement";
import { ContactsManagement } from "@/components/admin/ContactsManagement";
import { EventManagement } from "@/components/admin/EventsManagement";
import { AdminAccount } from "@/components/admin/AdminAccount";
import { BookingManagement } from "@/components/admin/booking/BookingManagement";
import { TestimonialManagement } from "@/components/admin/TestimonialManagement";
import TourAndTravelManagement from "@/components/admin/TouristPackageManagement";
import MountainManagement from "@/components/admin/MountainManagement";
import { Menu, Settings } from "lucide-react";
import { AdminDashboard } from "@/components/admin/dashboard/AdminDashboard";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
      }
      if (!user?.isAdmin) {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "booking":
        return <BookingManagement />;
      case "mountains":
        return <MountainManagement />;
      case "trourist":
        return <TourAndTravelManagement />;
      case "blog":
        return <BlogManagement />;
      case "gallery":
        return <GalleryManagement />;
      case "stats":
        return <StatsManagement />;
      case "contacts":
        return <ContactsManagement />;
      case "testimonials":
        return <TestimonialManagement />;
      case "events":
        return <EventManagement />;
      case "account":
        return <AdminAccount />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex relative bg-gray-50 min-h-screen overflow-x-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm h-16">
        <div className="font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-5 w-5 text-teal-600" /> Admin Panel
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 md:ml-64 p-4 lg:p-8 pt-20 md:pt-8 transition-all duration-300 overflow-x-hidden min-w-0">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
}
