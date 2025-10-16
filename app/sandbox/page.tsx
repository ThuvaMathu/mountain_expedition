"use client";

import { useState } from "react";
import { Mountain, Mail, ArrowRight, CheckCircle } from "lucide-react";
import AppLogo from "@/components/ui/app-logo";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // Check if response has content before parsing
      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("JSON parse error:", parseError, "Response text:", text);
        throw new Error("Invalid server response");
      }

      if (response.ok) {
        setIsSubscribed(true);
        setTimeout(() => {
          setIsSubscribed(false);
          setEmail("");
        }, 5000);
      } else {
        const errorMessage =
          data.error || "Failed to subscribe. Please try again.";
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Mountain silhouette overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-slate-900/80 to-transparent"></div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8 animate-float">
          <AppLogo isWithText={false} size="large" />
        </div>

        {/* Main heading */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-teal-300 to-white bg-clip-text text-transparent leading-tight">
          Tamil Adventure Trekking Club
        </h1>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-teal-200 to-white bg-clip-text text-transparent leading-tight">
          Something Epic is Coming
        </h1>

        <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          We're preparing an extraordinary adventure experience. Get ready to
          conquer new heights.
        </p>

        {/* Email subscription form */}
        <div className="max-w-md mx-auto mb-12">
          <p className="text-teal-200 font-medium mb-4">
            Be the first to know when we launch
          </p>

          {!isSubscribed ? (
            <>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? "Subscribing..." : "Notify Me"}
                  {!isLoading && (
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </form>
              {error && (
                <div className="mt-3 flex items-center justify-center py-3 px-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-full">
                  <span className="text-red-300 text-sm font-medium">
                    {error}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center py-4 px-6 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full animate-slide-up">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-green-300 font-medium">
                Thank you! We'll notify you soon.
              </span>
            </div>
          )}
        </div>

        {/* Features preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          {[
            { icon: Mountain, text: "Expert-Led Expeditions" },
            { icon: CheckCircle, text: "Premium Experience" },
            { icon: Mail, text: "Exclusive Updates" },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-center justify-center space-x-3 text-gray-300 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all"
            >
              <feature.icon className="h-5 w-5 text-teal-400" />
              <span className="text-sm font-medium">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-gray-400 text-sm">
          Join thousands of adventurers waiting for the ultimate climbing
          experience
        </p>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
