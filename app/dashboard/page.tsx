"use client";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import DashboardPageMain from "@/components/user-dashboard/user-dashboard-main";
import { useAuth } from "@/contexts/AuthContext";
import { generateDashboardMetadata } from "@/seo/metadata/dashboard";
import { organizationSchema } from "@/seo/schemas";
import Link from "next/link";
import type React from "react";
//export const metadata = generateDashboardMetadata();
export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (!user) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Please sign in to view your dashboard
        </h1>
        <Link href="/auth/login">
          <Button className="bg-teal-600 hover:bg-teal-700">Sign in</Button>
        </Link>
      </main>
    );
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />{" "}
      <DashboardPageMain />
    </>
  );
}
