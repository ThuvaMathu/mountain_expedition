"use client";

import { useEffect, useState } from "react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { AwardManagement } from "./gallery/AwardManagement";
import { ExperienceManagement } from "./gallery/ExperienceManagement";
import { GalleryImageManagement } from "./gallery/GalleryImageManagement";

interface ExperienceSubmission {
  id: string;
  status: "pending" | "approved" | "rejected";
}

type GalleryItem = {
  id?: string;
  title: string;
  url: string;
};

type AwardItem = {
  id?: string;
  title: string;
  description: string;
  image: string;
};

export function GalleryManagement() {
  const [activeTab, setActiveTab] = useState<
    "experiences" | "gallery" | "awards"
  >("experiences");
  const [experienceCount, setExperienceCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);
  const [awardsCount, setAwardsCount] = useState(0);
  const [countsLoading, setCountsLoading] = useState(true);

  const loadCounts = async () => {
    if (!isFirebaseConfigured || !db) {
      setExperienceCount(0);
      setPendingCount(0);
      setGalleryCount(0);
      setAwardsCount(0);
      setCountsLoading(false);
      return;
    }

    try {
      // Load experience submissions count
      const experiencesSnap = await getDocs(
        collection(db, "experienceSubmissions")
      );
      const experiences: ExperienceSubmission[] = experiencesSnap.docs.map(
        (d) => ({ id: d.id, ...d.data() } as ExperienceSubmission)
      );
      setExperienceCount(experiences.length);
      setPendingCount(
        experiences.filter((exp) => exp.status === "pending").length
      );

      // Load gallery items count
      const gallerySnap = await getDocs(collection(db, "gallery"));
      setGalleryCount(gallerySnap.docs.length);

      // Load awards count
      const awardsSnap = await getDocs(collection(db, "awards"));
      setAwardsCount(awardsSnap.docs.length);
    } catch (error) {
      console.error("Error loading counts:", error);
      setExperienceCount(0);
      setPendingCount(0);
      setGalleryCount(0);
      setAwardsCount(0);
    } finally {
      setCountsLoading(false);
    }
  };

  useEffect(() => {
    loadCounts();
  }, []);

  // Refresh counts when switching tabs (in case data was modified)
  const handleTabChange = (tab: "experiences" | "gallery" | "awards") => {
    setActiveTab(tab);
    // Slight delay to allow child components to update, then refresh counts
    setTimeout(loadCounts, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
        <p className="text-gray-600">
          Manage gallery images, review user experience submissions, and
          maintain awards & recognition.
        </p>
        {!isFirebaseConfigured && (
          <div className="mt-3 p-3 rounded-md border border-yellow-200 bg-yellow-50 text-yellow-800 text-sm">
            Firebase not configured: Changes won't be saved.
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => handleTabChange("experiences")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "experiences"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Experience Submissions
              {countsLoading ? (
                <span className="ml-1 inline-block w-6 h-4 bg-gray-200 rounded animate-pulse"></span>
              ) : (
                <span className="ml-1">
                  (
                  {pendingCount > 0
                    ? `${pendingCount} pending`
                    : `${experienceCount} total`}
                  )
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabChange("gallery")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "gallery"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Gallery Images
              {countsLoading ? (
                <span className="ml-1 inline-block w-4 h-4 bg-gray-200 rounded animate-pulse"></span>
              ) : (
                <span className="ml-1">({galleryCount})</span>
              )}
            </button>

            <button
              onClick={() => handleTabChange("awards")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "awards"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Awards & Recognition
              {countsLoading ? (
                <span className="ml-1 inline-block w-4 h-4 bg-gray-200 rounded animate-pulse"></span>
              ) : (
                <span className="ml-1">({awardsCount})</span>
              )}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "experiences" && <ExperienceManagement />}
          {activeTab === "gallery" && <GalleryImageManagement />}
          {activeTab === "awards" && <AwardManagement />}
        </div>
      </div>
    </div>
  );
}
