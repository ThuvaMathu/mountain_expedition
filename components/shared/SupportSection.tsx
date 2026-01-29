"use client";

import React from "react";
import { MessageCircle, RefreshCw, Headphones, ThumbsUp, Shield, Map, Zap, Star } from "lucide-react";

const features = [
  {
    icon: Zap, // Diving and Snorkeling equivalent -> "Reliable Service"
    title: "Reliable Service",
    description: "Every moment of your trip is verified by our team to ensuring safe trip.",
    id: "01",
  },
  {
    icon: Map, // Professional Tour Guide
    title: "Professional Tour Guide",
    description: "Our professional tour guides are specialists who provide incredible knowledge.",
    id: "02",
  },
  {
    icon: Star, // Memorable
    title: "Memorable",
    description: "Every moment of your trip is verified by our team ensuring safe trip.",
    id: "03",
  },
  {
    icon: Shield, // Easy and Comfort
    title: "Easy and Comfort",
    description: "We also provide amazing deals and budget friendly packages for you.",
    id: "04",
  },
  {
    icon: ThumbsUp, // Local Expertise 
    title: "Local Expertise",
    description: "Stay with locals and receive tips only a local leads and knows.",
    id: "05",
  },
];

export function SupportSection() {
  return (
    <section className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Your Journey, Our <br className="hidden md:block" />
              Priority Always
            </h2>
          </div>
          <div className="max-w-md text-gray-600 text-sm md:text-base border-l-4 border-orange-200 pl-4">
            From curated tours to expert guides, we ensure every step of your adventure is seamless and unforgettable.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-gray-300 font-bold text-xl">
                    {feature.id}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
          {/* Feature Image Block - Optional, creates a nice visual break layout like reference */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg min-h-[300px] group hidden lg:block">
            <img
              src="https://media.tamiladventuretrekkingclub.com/images/gallery/grid-1.webp" // Using a generic placeholder or existing one
              onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2670&auto=format&fit=crop"}
              alt="Adventure"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-white text-2xl font-bold mb-2">Explore the Unseen</h3>
              <p className="text-white/80 text-sm">Discover places you've never been before.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
