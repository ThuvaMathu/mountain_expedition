"use client";

import { useState } from "react";
import ImageModal from "./ImageModal";
import Pagination from "./Pagination";
import Image from "next/image";
import { ImageLoader } from "../ui/image-loader";
import { SlideUp, StaggerContainer, StaggerItem } from "../ui/motion-wrapper";

interface StaticImage {
  src: string;
  title: string;
}

interface ImageData {
  src: string;
  title: string;
  id: string;
  mountainId?: string;
  type: "static" | "gallery";
}

interface GalleryImagesProps {
  galleryItems: TJourneyImage[];
  staticImages: StaticImage[];
  showTitle?: boolean;
}

const ITEMS_PER_PAGE = 20;

export default function GalleryImages({
  galleryItems,
  staticImages,
  showTitle = true,
}: GalleryImagesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Combine and format all images
  const allImages: ImageData[] = [
    ...staticImages.map((img, index) => ({
      id: `static-${index}`,
      src: img.src,
      title: img.title,
      type: "static" as const,
    })),
    ...galleryItems.map((item) => ({
      id: item.id,
      src: item.thumbnailUrl || item.url, // Use thumbnail for grid, fallback to full image
      title: item.title,
      type: "gallery" as const,
    })),
  ];

  const totalPages = Math.ceil(allImages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentImages = allImages.slice(startIndex, endIndex);

  const handleImageClick = (imageIndex: number) => {
    const globalIndex = startIndex + imageIndex;
    setCurrentImageIndex(globalIndex);
    setModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleModalNavigate = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (allImages.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-gray-400 mb-4">
          <svg
            className="h-16 w-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No images found
        </h3>
        <p className="text-gray-600">
          No gallery images available at the moment.
        </p>
      </div>
    );
  }

  return (
    <section>
      {showTitle && (
        <SlideUp className="text-center mb-8">
          <div className="inline-block">
            <div className="h-1 w-20 bg-gradient-to-r from-teal-400 to-purple-500 rounded-full mb-4 mx-auto" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Gallery Images
          </h2>
          <p className="text-gray-600">
            Professional photography showcasing mountain expeditions
          </p>
          <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-teal-400 to-transparent rounded-full mt-4 mx-auto" />
        </SlideUp>
      )}

      {/* Image Grid with Staggered Animation */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentImages.map((image, index) => (
          <StaggerItem key={image.id}>
            <div
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              <div className="relative overflow-hidden">
                <div className="relative w-full h-48 overflow-hidden">
                  <ImageLoader
                    fill
                    loading="lazy"
                    src={image.src || "/placeholder.svg"}
                    alt={image.title}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-medium text-sm truncate">{image.title}</p>
                </div>

                {/* Hover overlay with click hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white bg-opacity-90 rounded-full p-3 transform group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="h-6 w-6 text-gray-700"
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

              <div className="p-3">
                <div className="text-gray-800 font-medium text-sm truncate group-hover:text-teal-600 transition-colors duration-200">
                  {image.title}
                </div>
                {image.mountainId && (
                  <div className="text-xs text-gray-600 truncate mt-1">
                    Mountain: {image.mountainId}
                  </div>
                )}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={allImages.length}
      />

      {/* Image Modal */}
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
