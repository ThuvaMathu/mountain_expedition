"use client";

import { useState } from "react";
import { Star, User, Calendar, Mountain } from "lucide-react";
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
        <div className=" text-center mb-8">
          <h2 className="text-2xl lg:text-3xl  font-bold text-gray-900 mb-2">
            Community Experiences
          </h2>
          <p className="text-gray-600">
            Real stories and photos from our expedition community
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {experiences.map((experience) => (
          <div
            key={experience.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Experience images */}
            {experience.images.length > 0 && (
              <div className="relative">
                {experience.images.length === 1 ? (
                  // Single image - full width
                  <div
                    className="relative cursor-pointer group"
                    onClick={() =>
                      handleImageClick(experience.images, experience.title, 0)
                    }
                  >
                    <img
                      src={experience.images[0] || "/placeholder.svg"}
                      alt={experience.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  // Multiple images - grid layout
                  <div className="grid grid-cols-2 gap-1">
                    {experience.images.slice(0, 2).map((image, index) => (
                      <div
                        key={index}
                        className="relative cursor-pointer group"
                        onClick={() =>
                          handleImageClick(
                            experience.images,
                            experience.title,
                            index
                          )
                        }
                      >
                        <div className="relative w-full h-48 overflow-hidden">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${experience.title} ${index + 1}`}
                            fill
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="/placeholder.svg"
                            sizes="(max-width: 768px) 100vw,
           (max-width: 1200px) 50vw,
           33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-90 rounded-full p-2">
                            <svg
                              className="h-4 w-4 text-gray-700"
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
                )}

                {/* Image count overlay */}
                {experience.images.length > 2 && (
                  <div
                    className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-opacity-80 transition-all"
                    onClick={() =>
                      handleImageClick(experience.images, experience.title, 0)
                    }
                  >
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
                    <Mountain className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{experience.mountainName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < experience.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">
                    ({experience.rating}/5)
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-3">
                {experience.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{experience.userName}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
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
