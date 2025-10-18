import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Mountain, Home, Compass, ArrowRight } from "lucide-react";
import AppLogo from "@/components/ui/app-logo";

export default function NotFound() {
  return (
    <>
      {" "}
      <main className="flex-1 flex items-center justify-center bg-gray-50 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05)_0%,transparent_50%)]" />
        <div className="absolute top-20 left-10 opacity-10">
          <Mountain className="h-32 w-32 text-teal-600 animate-float" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-10">
          <Mountain className="h-24 w-24 text-teal-600 animate-float animation-delay-2" />
        </div>
        <div className="absolute w-sm -bottom-40 -right-10 -rotate-12 skew-3">
          <div className="relative">
            <video
              className="w-full h-full object-cover [mask-image:radial-gradient(circle,white_70%,transparent_100%)]"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              // poster="/images/hero-poster.jpg"
            >
              <source src="/bg-videos/loop-demo.mp4" type="video/webm" />
            </video>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          {/* Animated Mountain Icon */}
          <div className="flex justify-center mb-8 animate-bounce-subtle">
            <div className="relative">
              <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-teal-500 to-teal-600 p-6 rounded-full shadow-xl">
                <AppLogo size="large" isWithText={false} />
              </div>
            </div>
          </div>

          {/* 404 Number */}
          <h1 className="text-8xl sm:text-9xl lg:text-[180px] font-bold mb-4 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-400 bg-clip-text text-transparent leading-none animate-slide-up">
            404
          </h1>

          {/* Main Message */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-slide-up animation-delay-200">
            Peak Not Found
          </h2>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up animation-delay-400">
            Looks like you've wandered off the trail. The summit you're looking
            for doesn't exist or has been moved to a different route.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up animation-delay-600">
            <Link href="/">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <Home className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Return Home
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/mountains">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-8 py-6 text-lg rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 group"
              >
                <Compass className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                Explore Mountains
              </Button>
            </Link>
          </div>

          {/* Helper Text */}
          <p className="mt-12 text-sm text-gray-500 animate-slide-up animation-delay-800">
            Lost? Use the navigation above or contact our support team for
            assistance.
          </p>
        </div>
      </main>
    </>
  );
}
