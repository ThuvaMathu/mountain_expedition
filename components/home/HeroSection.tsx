"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ArrowRight,
  Mountain,
  Users,
  Award,
  MapPin,
  Compass,
  Star,
  ChevronDown,
  ImageIcon,
} from "lucide-react";
import { statIconMapper } from "@/services/icon-maper";

export function HeroSection({ stats }: { stats: TStat[] }) {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const heroSlides = [
    {
      image: "/placeholder-83tbi.png",
      title: "Conquer the Seven Summits",
      subtitle: "Experience the world's highest peaks with expert guides",
      highlight: "Epic Adventures",
    },
    {
      image: "/placeholder-nwzb1.png",
      title: "Himalayan Adventures Await",
      subtitle: "Discover the majesty of the world's tallest mountain range",
      highlight: "Breathtaking Views",
    },
    {
      image: "/placeholder-7fo4z.png",
      title: "Professional Expedition Support",
      subtitle: "Safety-first approach with world-class equipment and guides",
      highlight: "Expert Guidance",
    },
  ];

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length),
      6000
    );
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const scrollToNext = () => {
    const nextSection = document.querySelector("#next-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/hero-poster.jpg"
        >
          <source src="/bg-videos/hero-video-hd.webm" type="video/webm" />

          {/* <source
            src="https://s3.ap-southeast-2.amazonaws.com/images.thuvarakan.info/hero-video-hd-1200.webm"
            type="video/webm"
          />
          <source
            src="https://s3.ap-southeast-2.amazonaws.com/images.thuvarakan.info/hero-video-hd-1200.mp4"
            type="video/mp4"
          /> */}
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1)_0%,transparent_50%)] animate-pulse" />
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 text-center text-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Highlight Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-teal-500/20 backdrop-blur-sm border border-teal-400/30 rounded-full mb-4 sm:mb-6 animate-bounce-subtle">
          <Compass className="h-4 w-4 mr-2 text-teal-300" />
          <span className="text-sm sm:text-base font-medium text-teal-200">
            {heroSlides[currentSlide].highlight}
          </span>
        </div>

        {/* Main Title with Responsive Typography */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight bg-gradient-to-r from-white via-gray-100 to-teal-200 bg-clip-text text-transparent animate-slide-up">
          {heroSlides[currentSlide].title}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
          {heroSlides[currentSlide].subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 animate-slide-up animation-delay-400">
          <Link href="/mountains">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
            >
              <Mountain className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              {t("explore_mountains")}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/gallery">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-white/70 text-white hover:bg-white hover:text-gray-900 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-white/10 backdrop-blur-sm rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 group"
            >
              <ImageIcon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              View Gallery
            </Button>
          </Link>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto animate-slide-up animation-delay-600">
          {stats.map((stat, index) => {
            const IconComponent = stat.id ? statIconMapper[stat.id] : Mountain;
            return (
              <div
                key={index}
                className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="flex justify-center mb-3">
                  <IconComponent
                    className={`h-6 w-6 sm:h-8 sm:w-8 text-teal-600 group-hover:animate-pulse`}
                  />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-300 font-medium">
                  {stat.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Adventure Features - Mobile Responsive */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto opacity-90">
          {[
            {
              icon: MapPin,
              text: "Expert Routes",
              desc: "Carefully planned paths",
            },
            { icon: Users, text: "Small Groups", desc: "Max 8 adventurers" },
            {
              icon: Award,
              text: "Certified Guides",
              desc: "Professional support",
            },
          ].map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center p-3 sm:p-4">
                <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-teal-400 mx-auto mb-2" />
                <div className="text-sm sm:text-base font-semibold text-white">
                  {feature.text}
                </div>
                <div className="text-xs sm:text-sm text-gray-300 mt-1">
                  {feature.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125 shadow-lg"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <div
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        onClick={scrollToNext}
      >
        <div className="flex flex-col items-center text-white/70 hover:text-white transition-colors">
          <span className="text-xs sm:text-sm mb-2 font-medium">
            Scroll Down
          </span>
          <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}
