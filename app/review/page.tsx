"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MountainCard } from "@/components/mountains/MountainCard";
import { MountainFilters } from "@/components/mountains/MountainFilters";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { getDocs, collection } from "firebase/firestore";
import ReviewSubmissionForm from "@/components/home/ReviewSubmissionForm";

export default function MountainsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <ReviewSubmissionForm />
      </main>

      <Footer />
    </div>
  );
}
