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
import { SlideUp, FadeIn } from "../ui/motion-wrapper";

const staticImages = staticGalleryImages;

export default function GalleryMain() {
  const [approvedExperiences, setApprovedExperiences] = useState<
    TExperienceSubmission[]
  >([]);
  const [galleryItems, setGalleryItems] = useState<TJourneyImage[]>([]);
  const [galleryStats, setGalleryStats] = useState<TStat[]>([]);
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

    const loadGalleryStats = async () => {
      try {
        const response = await fetch("/api/stats/gallery");
        if (response.ok) {
          const stats = await response.json();
          setGalleryStats(stats);
        }
      } catch (error) {
        console.error("Error loading gallery stats:", error);
        // Fallback to default values
        setGalleryStats([
          { id: "shared-stories", title: "Shared Stories", value: "500+", order: 1 },
          { id: "photos", title: "Photos", value: "2K+", order: 2 },
          { id: "mountains", title: "Mountains", value: "50+", order: 3 },
        ]);
      }
    };

    loadGalleryContent();
    loadGalleryStats();
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
      {/* Animated Header Section */}
      <SlideUp className="text-center mb-10">
        <div className="inline-block">
          <div className="h-1 w-20 bg-gradient-to-r from-teal-400 to-purple-500 rounded-full mb-4 mx-auto" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Gallery</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Explore breathtaking mountain expeditions through our curated
          collection of professional photography and real experiences shared by
          our adventurous community.
        </p>

        {/* Animated Filter buttons */}
        <FadeIn delay={0.2}>
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${activeFilter === "all"
                ? "bg-teal-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
            >
              All ({totalItems})
            </button>
            <button
              onClick={() => setActiveFilter("experiences")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${activeFilter === "experiences"
                ? "bg-teal-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
            >
              Community Experiences ({totalExperiences})
            </button>
            <button
              onClick={() => setActiveFilter("gallery")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${activeFilter === "gallery"
                ? "bg-teal-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
            >
              Gallery Images ({totalGalleryImages})
            </button>
          </div>
        </FadeIn>
        <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-teal-400 to-transparent rounded-full mx-auto" />
      </SlideUp>

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
        <FadeIn delay={0.3}>
          <section className="mt-16">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Background Image with Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/images/posters/poster-adventure.jpg')",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900/95 via-teal-800/90 to-purple-900/85" />
              </div>

              {/* Content */}
              <div className="relative z-10 px-8 py-16 md:py-20">
                <div className="max-w-3xl mx-auto text-center">
                  {/* Icon with pulse animation */}
                  <SlideUp delay={0.1}>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6 animate-pulse">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </SlideUp>

                  {/* Title */}
                  <SlideUp delay={0.2}>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      Share Your Adventure
                    </h3>
                  </SlideUp>

                  {/* Description */}
                  <SlideUp delay={0.3}>
                    <p className="text-lg text-white/90 mb-8 leading-relaxed">
                      Have you completed an amazing mountain expedition? Share your
                      experience, photos, and story with our community. Your adventure
                      could inspire the next generation of explorers!
                    </p>
                  </SlideUp>

                  {/* CTA Button */}
                  <SlideUp delay={0.4}>
                    <a
                      href="/dashboard"
                      className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    >
                      <span>Share Your Experience</span>
                      <svg
                        className="w-5 h-5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </a>
                  </SlideUp>

                  {/* Animated Stats */}
                  <SlideUp delay={0.5}>
                    <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                      {galleryStats.map((stat, index) => (
                        <div
                          key={stat.id}
                          className="text-center transform transition-transform hover:scale-110 duration-300"
                        >
                          <div
                            className="text-3xl font-bold text-white mb-1 animate-pulse"
                            style={{ animationDelay: `${index * 0.2}s` }}
                          >
                            {stat.value}
                          </div>
                          <div className="text-sm text-white/80">{stat.title}</div>
                        </div>
                      ))}
                    </div>
                  </SlideUp>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
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
