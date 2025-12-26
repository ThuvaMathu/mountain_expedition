"use client";

import { useState } from "react";
import { Star, User, Calendar, Mountain, Play } from "lucide-react";
import ImageModal from "./ImageModal";
import { formatDate, formatFirestoreDate } from "@/lib/utils";
import Image from "next/image";

interface ImageData {
  src: string;
  title: string;
  id: string;
}

interface CommunityExperiencesProps {
  experiences: TExperienceSubmission[];
  showTitle?: boolean;
}

export default function CommunityExperiences({
  experiences,
  showTitle = true,
}: CommunityExperiencesProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState<ImageData[]>([]);

  const handleImageClick = (
    experienceImages: string[],
    experienceTitle: string,
    imageIndex: number
  ) => {
    // Create image data for modal
    const imageData: ImageData[] = experienceImages.map((img, idx) => ({
      id: `exp-img-${idx}`,
      src: img,
      title: `${experienceTitle} - Image ${idx + 1}`,
    }));

    setAllImages(imageData);
    setCurrentImageIndex(imageIndex);
    setModalOpen(true);
  };

  const handleModalNavigate = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (experiences.length === 0) {
    return (
      <div className="text-center py-20">
        <Mountain className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No community experiences yet
        </h3>
        <p className="text-gray-600 mb-6">
          Be the first to share your adventure with our community!
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
        >
          Share Your Experience
        </a>
      </div>
    );
  }

  return (
    <section>
      {showTitle && (
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Community Experiences
          </h2>
          <p className="text-lg text-gray-600">
            Real stories and photos from our expedition community
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {experiences.map((experience) => (
          <div
            key={experience.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            {/* Media Section */}
            <div className="relative">
              {/* Video Section */}
              {experience.videoUrl && (
                <div className="relative bg-gray-900 aspect-video">
                  <video
                    className="w-full h-full object-cover"
                    poster={experience.images?.[0]}
                    controls
                    preload="metadata"
                  >
                    <source src={experience.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {/* Images Section */}
              {experience.images && experience.images.length > 0 && (
                <div className={experience.videoUrl ? "mt-1" : ""}>
                  {experience.images.length === 1 && !experience.videoUrl ? (
                    // Single image - full width
                    <div
                      className="relative aspect-video cursor-pointer group overflow-hidden"
                      onClick={() =>
                        handleImageClick(experience.images, experience.title, 0)
                      }
                    >
                      <Image
                        src={experience.images[0]}
                        alt={experience.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                    </div>
                  ) : experience.images.length >= 2 ? (
                    // Multiple images - grid
                    <div className="grid grid-cols-2 gap-1">
                      {experience.images.slice(0, 2).map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-video cursor-pointer group overflow-hidden"
                          onClick={() =>
                            handleImageClick(
                              experience.images,
                              experience.title,
                              index
                            )
                          }
                        >
                          <Image
                            src={image}
                            alt={`${experience.title} ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                              <svg
                                className="h-5 w-5 text-gray-700"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {/* Image count badge */}
                  {experience.images.length > 2 && (
                    <div
                      className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-black/90 transition-all shadow-lg z-10"
                      onClick={() =>
                        handleImageClick(experience.images, experience.title, 0)
                      }
                    >
                      +{experience.images.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {experience.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 gap-2">
                    <Mountain className="h-4 w-4 flex-shrink-0 text-teal-600" />
                    <span className="font-medium">{experience.mountainName}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex flex-col items-end ml-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < experience.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 mt-1">
                    {experience.rating}/5
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                {experience.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium truncate">{experience.userName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>{formatFirestoreDate(experience.submittedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        images={allImages}
        currentIndex={currentImageIndex}
        onNavigate={handleModalNavigate}
      />
    </section>
  );
}
