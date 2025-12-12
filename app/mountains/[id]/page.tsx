"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { Button } from "@/components/ui/button";
import { ImageLoader } from "@/components/ui/image-loader";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  MapPin,
  Calendar,
  TrendingUp,
  Star,
  Users,
  Clock,
  Shield,
  Award,
  Camera,
  AlertTriangle,
  Download,
} from "lucide-react";
import { mockMountain } from "@/lib/data/demo-data";
import { isFirebaseConfigured, db } from "@/lib/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import { getAvailableSlots } from "@/lib/utils";
import { useCurrencyStore } from "@/stores/currency-store";
import { pdf } from "@react-pdf/renderer";
import { BrochureTemplate } from "@/lib/pdf-templates/brochure-template";
import { toast } from "react-toastify";

export default function MountainDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mountain, setMountain] = useState<TMountainType | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { loadCurrency, formatedValue, getCurrencyValue } = useCurrencyStore();

  // Handle brochure download
  const handleDownloadBrochure = async () => {
    if (!mountain) return;

    setIsDownloading(true);
    try {
      // Generate PDF
      const blob = await pdf(<BrochureTemplate mountain={mountain} />).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${mountain.name.replace(/\s+/g, "_")}_Brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Brochure downloaded successfully!");
    } catch (error) {
      console.error("Error downloading brochure:", error);
      toast.error("Failed to download brochure. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle contact expert
  const handleContactExpert = () => {
    router.push("/contact");
  };

  // Check if event is disabled or outdated
  const isDisabled = useMemo(() => {
    if (!mountain) return false;
    if (mountain.status === "disabled") return true;
    if (mountain.status === "outdated") return true;

    // Auto-detect: Check if all dates are in the past
    const allDatesExpired = mountain.availableDates?.every(dateObj => {
      return new Date(dateObj.date) < new Date();
    });

    return allDatesExpired;
  }, [mountain]);

  const getDisabledReason = () => {
    if (!mountain) return "";
    if (mountain.status === "disabled" && mountain.disabledReason) {
      return mountain.disabledReason;
    }
    if (mountain.status === "outdated" || (mountain.availableDates?.every(dateObj => new Date(dateObj.date) < new Date()))) {
      return "This trek is no longer available";
    }
    return "Currently unavailable";
  };
  // useEffect(() => {
  //   // In a real app, this would fetch from Firebase
  //   const demoMountain: TMountainType = mockMountain;
  //   setMountain(demoMountain);
  // }, [params.id]);
  const load = async () => {
    if (!isFirebaseConfigured || !db) {
      setMountain(null);
      return;
    }
    try {
      const q = query(
        collection(db, "mountains"),
        where("id", "==", params.id)
      );
      const snap = await getDocs(q);
      const list: TMountainType[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      const tempMount = list[0];
      setMountain(tempMount || null);
      loadCurrency({
        INR: tempMount.priceINR,
        USD: tempMount.priceUSD,
      });
    } catch (error) {
      console.error("Error loading mountains:", error);
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);
  if (!mountain) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mountain details...</p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-orange-100 text-orange-800";
      case "Expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-gray-900">{mountain.name}</h1>
          {!isDisabled && (
            <div className="text-sm">
              <span className="text-green-600 font-medium">
                {getAvailableSlots(mountain)}
              </span>
              <span className="text-gray-500"> spots available</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-gray-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{mountain.location}</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>{mountain.altitude.toLocaleString()}m</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{mountain.bestSeason}</span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
              mountain.difficulty
            )}`}
          >
            {mountain.difficulty}
          </span>
        </div>
      </div>

      {/* Unavailability Banner */}
      {isDisabled && (
        <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong className="font-bold">This event is currently unavailable.</strong> {getDisabledReason()}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative">
              <ImageLoader
                src={mountain.imageUrl[selectedImage] || "/placeholder.svg"}
                alt={mountain.name}
                height="h-96"
                priority
                className="w-full"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 bg-white bg-opacity-90"
              >
                <Camera className="h-4 w-4 mr-2" />
                {selectedImage + 1} / {mountain.imageUrl.length}
              </Button>
            </div>

            <div className="p-4">
              <div className="flex space-x-2 overflow-x-auto">
                {mountain.imageUrl.map((image, index) => (
                  <button
                    key={`thumb-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-teal-600"
                        : "border-gray-200"
                    }`}
                  >
                    <ImageLoader
                      src={image || "/placeholder.svg"}
                      alt={`${mountain.name} ${index + 1}`}
                      height="h-20"
                      priority={index < 4}
                      className="w-full"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About This Expedition
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {mountain.longDescription}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-teal-600" />
                <div>
                  <div className="font-medium text-gray-900">Duration</div>
                  <div className="text-gray-600">{mountain.duration}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-teal-600" />
                <div>
                  <div className="font-medium text-gray-900">Group Size</div>
                  <div className="text-gray-600">{mountain.groupSize}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-teal-600" />
                <div>
                  <div className="font-medium text-gray-900">Safety Rating</div>
                  <div className="text-gray-600">Excellent</div>
                </div>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              What's Included
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Included
                </h3>
                <ul className="space-y-2">
                  {mountain.included.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-4">
                  Not Included
                </h3>
                <ul className="space-y-2">
                  {mountain.notIncluded.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-600 mr-2">✗</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Price Comparison */}

          {/* Itinerary Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Expedition Itinerary
            </h2>
            <div className="space-y-4">
              {mountain.itinerary.slice(0, 5).map((day) => (
                <div key={day.day} className="border-l-4 border-teal-600 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      Day {day.day}: {day.title}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {day.altitude}m
                    </span>
                  </div>
                  <p className="text-gray-700">{day.description}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-6">
              View Complete Itinerary
            </Button>
          </div>
        </div>

        {/* Right Column - Booking */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-teal-600">
                  {formatedValue()}
                </div>
                <div className="text-gray-600">per person</div>
                <div className="flex items-center justify-center mt-2 text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{getAvailableSlots(mountain)} slots available</span>
                </div>
              </div>

              {isDisabled ? (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">Booking is not available for this event.</p>
                  <Link href="/contact">
                    <Button className="w-full bg-teal-600 hover:bg-teal-700">
                      Contact Us for Similar Events
                    </Button>
                  </Link>
                </div>
              ) : !showBooking ? (
                <div className="space-y-4">
                  <Button
                    onClick={() => setShowBooking(true)}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 text-lg"
                  >
                    Check Availability & Book
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDownloadBrochure}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600 mr-2"></div>
                        Generating...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Download className="h-4 w-4 mr-2" />
                        Download Brochure
                      </div>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleContactExpert}
                  >
                    Contact Expert
                  </Button>
                </div>
              ) : (
                <BookingCalendar mountain={mountain} />
              )}

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    <span>Expert Guides</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
