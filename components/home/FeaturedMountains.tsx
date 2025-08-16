"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import { MapPin, Calendar, TrendingUp, Star, Users } from "lucide-react"

interface Mountain {
  id: string
  name: string
  location: string
  altitude: number
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  bestSeason: string
  image: string
  price: number
  rating: number
  totalReviews: number
  availableSlots: number
  category: "seven-summits" | "himalayas" | "indian-peaks"
}

export function FeaturedMountains() {
  const { t } = useLanguage()
  const [mountains, setMountains] = useState<Mountain[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const featuredMountains: Mountain[] = [
    {
      id: "1",
      name: "Mount Everest",
      location: "Nepal/Tibet",
      altitude: 8849,
      difficulty: "Expert",
      bestSeason: "April - May",
      image: "/mount-everest-summit.png",
      price: 65000,
      rating: 4.8,
      totalReviews: 234,
      availableSlots: 12,
      category: "seven-summits",
    },
    {
      id: "2",
      name: "Kilimanjaro",
      location: "Tanzania",
      altitude: 5895,
      difficulty: "Intermediate",
      bestSeason: "June - October",
      image: "/mount-kilimanjaro-acacia.png",
      price: 3500,
      rating: 4.9,
      totalReviews: 456,
      availableSlots: 24,
      category: "seven-summits",
    },
    {
      id: "3",
      name: "Kanchenjunga",
      location: "Nepal/India",
      altitude: 8586,
      difficulty: "Expert",
      bestSeason: "April - May, September - November",
      image: "/kanchenjunga-peak.png",
      price: 45000,
      rating: 4.7,
      totalReviews: 89,
      availableSlots: 8,
      category: "himalayas",
    },
    {
      id: "4",
      name: "Stok Kangri",
      location: "Ladakh, India",
      altitude: 6153,
      difficulty: "Advanced",
      bestSeason: "July - September",
      image: "/stok-kangri-ladakh.png",
      price: 1200,
      rating: 4.6,
      totalReviews: 167,
      availableSlots: 18,
      category: "indian-peaks",
    },
    {
      id: "5",
      name: "Denali",
      location: "Alaska, USA",
      altitude: 6190,
      difficulty: "Expert",
      bestSeason: "May - July",
      image: "/denali-snowy-peak.png",
      price: 8500,
      rating: 4.5,
      totalReviews: 123,
      availableSlots: 15,
      category: "seven-summits",
    },
    {
      id: "6",
      name: "Annapurna Base Camp",
      location: "Nepal",
      altitude: 4130,
      difficulty: "Intermediate",
      bestSeason: "March - May, September - November",
      image: "/annapurna-base-camp-trek.png",
      price: 1800,
      rating: 4.8,
      totalReviews: 312,
      availableSlots: 32,
      category: "himalayas",
    },
  ]

  useEffect(() => setMountains(featuredMountains), [])

  const categories = [
    { id: "all", name: t("all_mountains") },
    { id: "seven-summits", name: t("seven_summits") },
    { id: "himalayas", name: t("himalayas") },
    { id: "indian-peaks", name: t("indian_peaks") },
  ]

  const filteredMountains =
    selectedCategory === "all" ? mountains : mountains.filter((m) => m.category === selectedCategory)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-orange-100 text-orange-800"
      case "Expert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("featured_expeditions")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("featured_expeditions_description")}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="px-6 py-2"
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMountains.map((mountain) => (
            <div key={mountain.id} className="bg-white rounded-xl shadow-lg overflow-hidden mountain-card-hover">
              <div className="relative">
                <img
                  src={mountain.image || "/placeholder.svg"}
                  alt={mountain.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(mountain.difficulty)}`}
                  >
                    {mountain.difficulty}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-3 py-1">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{mountain.rating}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{mountain.name}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{mountain.location}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">{mountain.altitude.toLocaleString()}m</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">{mountain.bestSeason}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-teal-600">${mountain.price.toLocaleString()}</span>
                    <span className="text-gray-500 text-sm ml-1">per person</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{mountain.availableSlots} slots</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 mr-1 text-yellow-400" />
                    <span>
                      {mountain.rating} ({mountain.totalReviews} reviews)
                    </span>
                  </div>
                </div>

                <Link href={`/mountains/${mountain.id}`}>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700"> {t("view_details")} </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/mountains">
            <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
              {t("view_all_mountains")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
