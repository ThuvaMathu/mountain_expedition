"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { MountainManagement } from "@/components/admin/MountainManagement";
import { BlogManagement } from "@/components/admin/BlogManagement";
import { GalleryManagement } from "@/components/admin/GalleryManagement";
import { StatsManagement } from "@/components/admin/StatsManagement";
import { ContactsManagement } from "@/components/admin/ContactsManagement";
import { EventsManagement } from "@/components/admin/EventsManagement";
import { AdminAccount } from "@/components/admin/AdminAccount";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/admin/login");
      } else if (!user?.isAdmin) {
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
      case "mountains":
        return <MountainManagement />;
      case "blog":
        return <BlogManagement />;
      case "gallery":
        return <GalleryManagement />;
      case "stats":
        return <StatsManagement />;
      case "contacts":
        return <ContactsManagement />;
      case "events":
        return <EventsManagement />;
      case "account":
        return <AdminAccount />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex relative">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 ml-60 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
