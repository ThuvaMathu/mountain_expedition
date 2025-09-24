"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mountain } from "lucide-react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import GlobalLoader from "../global/global-loader";
import CommunityExperiences from "./CommunityExperiences";
import GalleryImages from "./GalleryImages";
import { staticGalleryImages } from "@/lib/data/static-images";

const staticImages = staticGalleryImages;

export default function GalleryMain() {
  const [approvedExperiences, setApprovedExperiences] = useState<
    TExperienceSubmission[]
  >([]);
  const [galleryItems, setGalleryItems] = useState<TJourneyImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "experiences" | "gallery"
  >("all");

  useEffect(() => {
    const loadGalleryContent = async () => {
      try {
        if (isFirebaseConfigured && db) {
          // Load approved experience submissions
          const experiencesQuery = query(
            collection(db, "experienceSubmissions"),
            where("status", "==", "approved")
          );
          const experiencesSnap = await getDocs(experiencesQuery);
          const experiences: TExperienceSubmission[] = experiencesSnap.docs.map(
            (d) => ({ id: d.id, ...d.data() } as any)
          );
          setApprovedExperiences(experiences);

          // Load gallery items
          const gallerySnap = await getDocs(collection(db, "gallery"));
          const items: TJourneyImage[] = gallerySnap.docs.map(
            (d) => ({ id: d.id, ...d.data() } as any)
          );
          setGalleryItems(items);
        } else {
          // Demo data for approved experiences
          setApprovedExperiences([
            {
              id: "exp1",
              title: "Incredible Everest Base Camp Journey",
              description:
                "The trek to Everest Base Camp was absolutely life-changing. The stunning mountain views, challenging terrain, and incredible sense of accomplishment made this an unforgettable adventure.",
              mountainName: "Mount Everest",
              rating: 5,
              images: ["/placeholder.svg", "/placeholder.svg"],
              status: "approved",
              submittedAt: new Date(Date.now() - 86400000 * 7),
              userName: "Sarah Johnson",
              userEmail: "sarah@example.com",
            },
            {
              id: "exp2",
              title: "Kilimanjaro Summit Success",
              description:
                "Reaching the summit of Kilimanjaro after 6 days of challenging but rewarding climbing. The sunrise from Uhuru Peak was absolutely breathtaking and worth every step.",
              mountainName: "Mount Kilimanjaro",
              rating: 4,
              images: ["/placeholder.svg"],
              status: "approved",
              submittedAt: new Date(Date.now() - 86400000 * 14),
              userName: "Mike Chen",
              userEmail: "mike@example.com",
            },
            {
              id: "exp3",
              title: "Denali Adventure of a Lifetime",
              description:
                "The remote wilderness of Denali provided an incredible challenge. The pristine snow-covered peaks and the sense of isolation made this expedition truly special.",
              mountainName: "Denali",
              rating: 5,
              images: [
                "/placeholder.svg",
                "/placeholder.svg",
                "/placeholder.svg",
              ],
              status: "approved",
              submittedAt: new Date(Date.now() - 86400000 * 21),
              userName: "Emma Rodriguez",
              userEmail: "emma@example.com",
            },
          ]);
          setGalleryItems([]);
        }
      } catch (error) {
        console.error("Error loading gallery content:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGalleryContent();
  }, []);

  const getFilteredContent = () => {
    switch (activeFilter) {
      case "experiences":
        return { experiences: approvedExperiences, gallery: [], static: [] };
      case "gallery":
        return { experiences: [], gallery: galleryItems, static: staticImages };
      default:
        return {
          experiences: approvedExperiences,
          gallery: galleryItems,
          static: staticImages,
        };
    }
  };

  const filteredContent = getFilteredContent();

  if (loading) {
    return <GlobalLoader />;
  }

  const totalExperiences = approvedExperiences.length;
  const totalGalleryImages = galleryItems.length + staticImages.length;
  const totalItems = totalExperiences + totalGalleryImages;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Gallery</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Explore breathtaking mountain expeditions through our curated
          collection of professional photography and real experiences shared by
          our adventurous community.
        </p>

        {/* Filter buttons */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === "all"
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            All ({totalItems})
          </button>
          <button
            onClick={() => setActiveFilter("experiences")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === "experiences"
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            Community Experiences ({totalExperiences})
          </button>
          <button
            onClick={() => setActiveFilter("gallery")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === "gallery"
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            Gallery Images ({totalGalleryImages})
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-12">
        {/* Community Experiences Section */}
        {filteredContent.experiences.length > 0 && (
          <CommunityExperiences
            experiences={filteredContent.experiences}
            showTitle={activeFilter === "all"}
          />
        )}

        {/* Gallery Images Section */}
        {(filteredContent.gallery.length > 0 ||
          filteredContent.static.length > 0) && (
          <GalleryImages
            galleryItems={filteredContent.gallery}
            staticImages={filteredContent.static}
            showTitle={activeFilter === "all"}
          />
        )}
        <section>
          <div className="mt-16 bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Share Your Adventure</h3>
            <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
              Have you completed an amazing mountain expedition? Share your
              experience, photos, and story with our community. Your adventure
              could inspire the next generation of explorers!
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Share Your Experience
            </a>
          </div>
        </section>
        {/* Empty state */}
        {filteredContent.experiences.length === 0 &&
          filteredContent.gallery.length === 0 &&
          filteredContent.static.length === 0 && (
            <div className="text-center py-20">
              <Mountain className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No content found
              </h3>
              <p className="text-gray-600">
                {activeFilter === "experiences"
                  ? "No approved community experiences yet. Be the first to share your adventure!"
                  : "No gallery images available at the moment."}
              </p>
              {activeFilter === "experiences" && (
                <div className="mt-6">
                  <a
                    href="/dashboard"
                    className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Share Your Experience
                  </a>
                </div>
              )}
            </div>
          )}
      </div>
    </main>
  );
}
