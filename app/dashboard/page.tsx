"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import DashboardPageMain from "@/components/user-dashboard/user-dashboard-main";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import type React from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">
            Please sign in to view your dashboard
          </h1>
          <Link href="/auth/login">
            <Button className="bg-teal-600 hover:bg-teal-700">Sign in</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <DashboardPageMain />
      <Footer />
    </div>
  );
}
