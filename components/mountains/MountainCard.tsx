import Link from "next/link"
import { Button } from "@/components/ui/button"
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
  description: string
}

interface MountainCardProps {
  mountain: Mountain
}

export function MountainCard({ mountain }: MountainCardProps) {
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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mountain-card-hover">
      <div className="relative">
        <img src={mountain.image || "/placeholder.svg"} alt={mountain.name} className="w-full h-64 object-cover" />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(mountain.difficulty)}`}>
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
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{mountain.description}</p>
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
          <Button className="w-full bg-teal-600 hover:bg-teal-700">View Details & Book</Button>
        </Link>
      </div>
    </div>
  )
}
