"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Star, User, Calendar, Mountain } from "lucide-react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import GlobalLoader from "../global/global-loader";

const staticImages = [
  { src: "/everest-base-camp.png", title: "Everest Base Camp" },
  { src: "/placeholder-hbowb.png", title: "Kilimanjaro Summit" },
  { src: "/denali-ridge.png", title: "Denali Ridge" },
  { src: "/himalaya-valley.png", title: "Himalayan Valley" },
];

interface ExperienceSubmission {
  id: string;
  title: string;
  description: string;
  mountainName: string;
  rating: number;
  images: string[];
  status: "pending" | "approved" | "rejected";
  submittedAt: any;
  userName: string;
  userEmail: string;
}

interface GalleryItem {
  id: string;
  title: string;
  url: string;
  mountainId?: string;
  createdAt?: any;
}

export default function GalleryMain() {
  const [approvedExperiences, setApprovedExperiences] = useState<
    ExperienceSubmission[]
  >([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "experiences" | "gallery"
  >("all");

  useEffect(() => {
    const loadGalleryContent = async () => {
      try {
        // if (isFirebaseConfigured && db) {
        if (false) {
          // Load approved experience submissions
          const experiencesQuery = query(
            collection(db, "experienceSubmissions"),
            where("status", "==", "approved")
          );
          const experiencesSnap = await getDocs(experiencesQuery);
          const experiences: ExperienceSubmission[] = experiencesSnap.docs.map(
            (d) => ({ id: d.id, ...d.data() } as any)
          );
          setApprovedExperiences(experiences);

          // Load gallery items
          const gallerySnap = await getDocs(collection(db, "gallery"));
          const items: GalleryItem[] = gallerySnap.docs.map(
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

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Gallery</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Explore breathtaking mountain expeditions through our curated
          collection of professional photography and real experiences shared by
          our adventurous community.
        </p>

        {/* Filter buttons */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === "all"
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            All (
            {approvedExperiences.length +
              galleryItems.length +
              staticImages.length}
            )
          </button>
          <button
            onClick={() => setActiveFilter("experiences")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === "experiences"
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            Community Experiences ({approvedExperiences.length})
          </button>
          <button
            onClick={() => setActiveFilter("gallery")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === "gallery"
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            Gallery Images ({galleryItems.length + staticImages.length})
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {/* Community Experiences Section */}
        {filteredContent.experiences.length > 0 && (
          <section>
            {activeFilter === "all" && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Community Experiences
                </h2>
                <p className="text-gray-600">
                  Real stories and photos from our expedition community
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredContent.experiences.map((experience) => (
                <div
                  key={experience.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Experience images */}
                  {experience.images.length > 0 && (
                    <div className="relative">
                      <div className="grid grid-cols-2 gap-1">
                        {experience.images.slice(0, 2).map((image, index) => (
                          <img
                            key={index}
                            src={image || "/placeholder.svg"}
                            alt={`${experience.title} ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                        ))}
                        {experience.images.length === 1 && (
                          <img
                            src={experience.images[0] || "/placeholder.svg"}
                            alt={experience.title}
                            className="w-full h-48 object-cover col-span-2"
                          />
                        )}
                      </div>
                      {experience.images.length > 2 && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                          +{experience.images.length - 2} more
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {experience.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Mountain className="h-4 w-4 mr-1" />
                          {experience.mountainName}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        {[...Array(experience.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {experience.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {experience.userName}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(experience.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery Images Section */}
        {(filteredContent.gallery.length > 0 ||
          filteredContent.static.length > 0) && (
          <section>
            {activeFilter === "all" && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Gallery Images
                </h2>
                <p className="text-gray-600">
                  Professional photography showcasing mountain expeditions
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Static images */}
              {filteredContent.static.map((img, idx) => (
                <div
                  key={`static-${idx}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={img.src || "/placeholder.svg"}
                      alt={img.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="font-medium">{img.title}</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-gray-800 font-medium">{img.title}</div>
                  </div>
                </div>
              ))}

              {/* Dynamic gallery items */}
              {filteredContent.gallery.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.url || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="font-medium">{item.title}</p>
                      {item.mountainId && (
                        <p className="text-sm text-gray-200">
                          Mountain: {item.mountainId}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-gray-800 font-medium">
                      {item.title}
                    </div>
                    {item.mountainId && (
                      <div className="text-xs text-gray-600">
                        Mountain: {item.mountainId}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

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
            </div>
          )}
      </div>

      {approvedExperiences.length > 0 && (
        <div className="mt-16 bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Share Your Adventure</h2>
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
      )}
    </main>
  );
}
