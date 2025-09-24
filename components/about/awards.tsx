"use client";

import { useEffect, useState } from "react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

type Award = {
  id?: string;
  title: string;
  description: string;
  image: string;
  createdAt?: any;
};

export function Awards() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAwards = async () => {
    if (!isFirebaseConfigured || !db) {
      setAwards([
        {
          id: "award1",
          title: "National Mountaineering Excellence Award",
          description:
            "Recognized for outstanding achievements in high-altitude mountaineering and contribution to adventure sports development in India.",
          image: "/placeholder.svg",
        },
        {
          id: "award2",
          title: "International Adventure Sports Leadership",
          description:
            "Honored for exceptional leadership in organizing international climbing expeditions and promoting safe mountaineering practices.",
          image: "/placeholder.svg",
        },
        {
          id: "award3",
          title: "Tamil Nadu Adventure Sports Champion",
          description:
            "State recognition for pioneering adventure tourism and training the next generation of mountaineers in Tamil Nadu.",
          image: "/placeholder.svg",
        },
        {
          id: "award4",
          title: "Himalayan Expedition Excellence",
          description:
            "Special recognition for successful high-altitude expeditions and rescue operations in the Himalayan region.",
          image: "/placeholder.svg",
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const awardsSnapshot = await getDocs(collection(db, "awards"));
      const awardsData: Award[] = awardsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Award)
      );
      setAwards(awardsData);
    } catch (error) {
      console.error("Error loading awards:", error);
      setAwards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAwards();
  }, []);

  if (loading) {
    return (
      <section className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-12"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-64"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (awards.length === 0) {
    return (
      <section className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Awards & Recognition
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Recognition from national and international organizations for
              mountaineering achievements and leadership in adventure sports.
            </p>
            <div className="mt-12 text-gray-500">
              <p>No awards to display at the moment.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Awards & Recognition
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Recognition from national and international organizations for
            mountaineering achievements and leadership in adventure sports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {awards.map((award, index) => (
            <div
              key={award.id || index}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={award.image || "/placeholder.svg"}
                  alt={award.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">{award.title}</h3>
                <p className="text-sm text-gray-200">{award.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
