"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ArrowRight,
  Play,
  Mountain,
  Users,
  Award,
  Calendar,
} from "lucide-react";

export function HeroSection() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: "/placeholder-83tbi.png",
      title: "Conquer the Seven Summits",
      subtitle: "Experience the world's highest peaks with expert guides",
    },
    {
      image: "/placeholder-nwzb1.png",
      title: "Himalayan Adventures Await",
      subtitle: "Discover the majesty of the world's tallest mountain range",
    },
    {
      image: "/placeholder-7fo4z.png",
      title: "Professional Expedition Support",
      subtitle: "Safety-first approach with world-class equipment and guides",
    },
  ];

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length),
      5000
    );
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
          >
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </div>
        ))}
      </div> */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://s3.ap-southeast-2.amazonaws.com/images.thuvarakan.info/13831626_1920_1080_60fps.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          {heroSlides[currentSlide].title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          {heroSlides[currentSlide].subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/mountains">
            <Button
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg"
            >
              {t("explore_mountains")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg bg-transparent"
          >
            <Play className="mr-2 h-5 w-5" />
            {t("watch_video")}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Mountain className="h-8 w-8 text-teal-300" />
            </div>
            <div className="text-3xl font-bold">50+</div>
            <div className="text-sm text-gray-300">{t("mountains")}</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users className="h-8 w-8 text-teal-300" />
            </div>
            <div className="text-3xl font-bold">2000+</div>
            <div className="text-sm text-gray-300">{t("climbers")}</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Award className="h-8 w-8 text-teal-300" />
            </div>
            <div className="text-3xl font-bold">15</div>
            <div className="text-sm text-gray-300">{t("years_experience")}</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Calendar className="h-8 w-8 text-teal-300" />
            </div>
            <div className="text-3xl font-bold">365</div>
            <div className="text-sm text-gray-300">{t("days_year")}</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
