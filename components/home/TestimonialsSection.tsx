"use client";
import React, { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  mountain?: string;
  rating: number;
  text: string;
  image?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: any;
}

interface TestimonialsCarouselProps {
  onGiveReviewClick?: () => void;
}

export function TestimonialsCarousel({
  onGiveReviewClick,
}: TestimonialsCarouselProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const router = useRouter();
  // Fallback testimonials for when Firebase is not configured
  const fallbackTestimonials: Testimonial[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      location: "California, USA",
      mountain: "Mount Kilimanjaro",
      rating: 5,
      text: "Summit Quest made my dream of climbing Kilimanjaro come true. The guides were incredible, and I felt safe every step of the way. Highly recommended!",
      image: "/placeholder.svg?height=80&width=80",
      status: "approved",
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Michael Chen",
      location: "Singapore",
      mountain: "Everest Base Camp",
      rating: 5,
      text: "The Everest Base Camp trek was life-changing. The organization was flawless, and the team's expertise showed throughout the journey.",
      image: "/placeholder.svg?height=80&width=80",
      status: "approved",
      createdAt: new Date(),
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      location: "Madrid, Spain",
      mountain: "Aconcagua",
      rating: 5,
      text: "Professional, safe, and absolutely amazing experience. The Summit Quest team went above and beyond to ensure our success on Aconcagua.",
      image: "/placeholder.svg?height=80&width=80",
      status: "approved",
      createdAt: new Date(),
    },
    {
      id: "4",
      name: "James Wilson",
      location: "London, UK",
      mountain: "Mont Blanc",
      rating: 5,
      text: "An unforgettable adventure! The team's professionalism and attention to detail made this challenging climb both safe and enjoyable.",
      image: "/placeholder.svg?height=80&width=80",
      status: "approved",
      createdAt: new Date(),
    },
    {
      id: "5",
      name: "Priya Sharma",
      location: "Mumbai, India",
      mountain: "Annapurna Circuit",
      rating: 5,
      text: "The most beautiful and well-organized trek I've ever experienced. Every moment was carefully planned and executed to perfection.",
      image: "/placeholder.svg?height=80&width=80",
      status: "approved",
      createdAt: new Date(),
    },
  ];

  const loadTestimonials = async () => {
    if (!isFirebaseConfigured || !db) {
      setTestimonials(fallbackTestimonials);
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, "testimonials"),
        where("status", "==", "approved"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const loadedTestimonials = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Testimonial[];

      if (loadedTestimonials.length === 0) {
        setTestimonials(fallbackTestimonials);
      } else {
        setTestimonials(loadedTestimonials);
      }
    } catch (err) {
      console.error("Error loading testimonials:", err);
      setError("Failed to load testimonials");
      setTestimonials(fallbackTestimonials);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg max-w-3xl mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
              >
                <div className="h-8 w-8 bg-gray-200 rounded mb-4"></div>
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div
                      key={j}
                      className="h-5 w-5 bg-gray-200 rounded mr-1"
                    ></div>
                  ))}
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div className="space-y-1 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadTestimonials}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const visibleTestimonials = testimonials
    .slice(currentIndex, currentIndex + 3)
    .concat(
      testimonials.slice(0, Math.max(0, currentIndex + 3 - testimonials.length))
    );

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-100 rounded-full opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-teal-600 mr-3" />
            <h2 className="text-4xl font-bold text-gray-900">
              What Our Climbers Say
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Don't just take our word for it. Here's what our adventurers have to
            say about their experiences.
          </p>

          {/* Give Review Button */}
          <button
            onClick={() => router.push("/review")}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-teal-800 to-teal-600 cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Star className="h-5 w-5 mr-2" />
            Share Your Experience
          </button>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {testimonials.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-teal-700 hover:shadow-xl transition-all duration-200"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-teal-700 hover:shadow-xl transition-all duration-200"
                aria-label="Next testimonials"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-500">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="bg-white rounded-2xl shadow-lg p-8 relative transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-gray-100"
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 left-8">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-700 to-teal-600 rounded-full flex items-center justify-center">
                    <Quote className="h-4 w-4 text-white" />
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center mb-6 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    ({testimonial.rating}/5)
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                  "{testimonial.text}"
                </p>

                {/* Mountain Badge */}
                {testimonial.mountain && (
                  <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                    {testimonial.mountain}
                  </div>
                )}

                {/* User Info */}
                <div className="flex items-center">
                  <img
                    src={
                      testimonial.image || "/placeholder.svg?height=60&width=60"
                    }
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg?height=60&width=60";
                    }}
                  />
                  <div>
                    <div className="font-bold text-gray-900 text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-600">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          {testimonials.length > 3 && (
            <div className="flex justify-center mt-12 space-x-2">
              {Array.from({ length: Math.ceil(testimonials.length / 3) }).map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index * 3)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      Math.floor(currentIndex / 3) === index
                        ? "bg-teal-700 w-8"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to testimonial group ${index + 1}`}
                  />
                )
              )}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-700">
                  {testimonials.length}
                </div>
                <div className="text-sm text-gray-600">Happy Climbers</div>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">
                  {(
                    testimonials.reduce((acc, t) => acc + t.rating, 0) /
                    testimonials.length
                  ).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
