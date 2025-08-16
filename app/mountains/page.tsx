'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MountainCard } from '@/components/mountains/MountainCard'
import { MountainFilters } from '@/components/mountains/MountainFilters'
import { useLanguage } from '@/contexts/LanguageContext'
import { Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Mountain {
  id: string
  name: string
  location: string
  altitude: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  bestSeason: string
  image: string
  price: number
  rating: number
  totalReviews: number
  availableSlots: number
  category: 'seven-summits' | 'himalayas' | 'indian-peaks'
  description: string
}

export default function MountainsPage() {
  const { t } = useLanguage()
  const [mountains, setMountains] = useState<Mountain[]>([])
  const [filteredMountains, setFilteredMountains] = useState<Mountain[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    priceRange: 'all',
    season: 'all'
  })

  const allMountains: Mountain[] = [
    // Seven Summits
    {
      id: '1',
      name: 'Mount Everest',
      location: 'Nepal/Tibet',
      altitude: 8849,
      difficulty: 'Expert',
      bestSeason: 'April - May',
      image: '/mount-everest-summit.png',
      price: 65000,
      rating: 4.8,
      totalReviews: 234,
      availableSlots: 12,
      category: 'seven-summits',
      description: 'The world\'s highest peak, offering the ultimate mountaineering challenge.'
    },
    {
      id: '2',
      name: 'Kilimanjaro',
      location: 'Tanzania',
      altitude: 5895,
      difficulty: 'Intermediate',
      bestSeason: 'June - October',
      image: '/mount-kilimanjaro-acacia.png',
      price: 3500,
      rating: 4.9,
      totalReviews: 456,
      availableSlots: 24,
      category: 'seven-summits',
      description: 'Africa\'s highest peak, accessible to trekkers with good fitness.'
    },
    {
      id: '3',
      name: 'Denali',
      location: 'Alaska, USA',
      altitude: 6190,
      difficulty: 'Expert',
      bestSeason: 'May - July',
      image: '/denali-snowy-peak.png',
      price: 8500,
      rating: 4.5,
      totalReviews: 123,
      availableSlots: 15,
      category: 'seven-summits',
      description: 'North America\'s highest peak, known for extreme weather conditions.'
    },
    {
      id: '4',
      name: 'Aconcagua',
      location: 'Argentina',
      altitude: 6961,
      difficulty: 'Advanced',
      bestSeason: 'December - February',
      image: '/placeholder-8vwgx.png',
      price: 5500,
      rating: 4.6,
      totalReviews: 189,
      availableSlots: 20,
      category: 'seven-summits',
      description: 'The highest peak in South America and the Western Hemisphere.'
    },
    {
      id: '5',
      name: 'Mount Elbrus',
      location: 'Russia',
      altitude: 5642,
      difficulty: 'Advanced',
      bestSeason: 'June - September',
      image: '/placeholder.svg?height=400&width=600',
      price: 2800,
      rating: 4.4,
      totalReviews: 156,
      availableSlots: 18,
      category: 'seven-summits',
      description: 'Europe\'s highest peak, located in the Caucasus Mountains.'
    },
    {
      id: '6',
      name: 'Mount Vinson',
      location: 'Antarctica',
      altitude: 4892,
      difficulty: 'Expert',
      bestSeason: 'November - January',
      image: '/placeholder.svg?height=400&width=600',
      price: 45000,
      rating: 4.7,
      totalReviews: 67,
      availableSlots: 8,
      category: 'seven-summits',
      description: 'Antarctica\'s highest peak, the most remote of the Seven Summits.'
    },
    {
      id: '7',
      name: 'Mount Kosciuszko',
      location: 'Australia',
      altitude: 2228,
      difficulty: 'Beginner',
      bestSeason: 'October - April',
      image: '/placeholder.svg?height=400&width=600',
      price: 800,
      rating: 4.2,
      totalReviews: 298,
      availableSlots: 40,
      category: 'seven-summits',
      description: 'Australia\'s highest peak, perfect for beginners.'
    },
    // Himalayas
    {
      id: '8',
      name: 'Kanchenjunga',
      location: 'Nepal/India',
      altitude: 8586,
      difficulty: 'Expert',
      bestSeason: 'April - May, September - November',
      image: '/kanchenjunga-peak.png',
      price: 45000,
      rating: 4.7,
      totalReviews: 89,
      availableSlots: 8,
      category: 'himalayas',
      description: 'The third highest mountain in the world, sacred to local communities.'
    },
    {
      id: '9',
      name: 'Annapurna Base Camp',
      location: 'Nepal',
      altitude: 4130,
      difficulty: 'Intermediate',
      bestSeason: 'March - May, September - November',
      image: '/annapurna-base-camp-trek.png',
      price: 1800,
      rating: 4.8,
      totalReviews: 312,
      availableSlots: 32,
      category: 'himalayas',
      description: 'A spectacular trek to the base of the Annapurna massif.'
    },
    {
      id: '10',
      name: 'Everest Base Camp',
      location: 'Nepal',
      altitude: 5364,
      difficulty: 'Intermediate',
      bestSeason: 'March - May, September - November',
      image: '/placeholder.svg?height=400&width=600',
      price: 2500,
      rating: 4.9,
      totalReviews: 567,
      availableSlots: 28,
      category: 'himalayas',
      description: 'The classic trek to the base of the world\'s highest mountain.'
    },
    // Indian Peaks
    {
      id: '11',
      name: 'Stok Kangri',
      location: 'Ladakh, India',
      altitude: 6153,
      difficulty: 'Advanced',
      bestSeason: 'July - September',
      image: '/stok-kangri-ladakh.png',
      price: 1200,
      rating: 4.6,
      totalReviews: 167,
      availableSlots: 18,
      category: 'indian-peaks',
      description: 'The highest peak in the Stok Range, offering stunning views of Ladakh.'
    },
    {
      id: '12',
      name: 'Kedarnath Peak',
      location: 'Uttarakhand, India',
      altitude: 6940,
      difficulty: 'Expert',
      bestSeason: 'May - June, September - October',
      image: '/placeholder.svg?height=400&width=600',
      price: 3200,
      rating: 4.5,
      totalReviews: 94,
      availableSlots: 12,
      category: 'indian-peaks',
      description: 'A challenging peak in the Garhwal Himalayas.'
    }
  ]

  useEffect(() => {
    setMountains(allMountains)
    setFilteredMountains(allMountains)
  }, [])

  useEffect(() => {
    let filtered = mountains

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(mountain =>
        mountain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mountain.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(mountain => mountain.category === filters.category)
    }

    // Difficulty filter
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(mountain => mountain.difficulty === filters.difficulty)
    }

    // Price range filter
    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'budget':
          filtered = filtered.filter(mountain => mountain.price < 2000)
          break
        case 'mid':
          filtered = filtered.filter(mountain => mountain.price >= 2000 && mountain.price < 10000)
          break
        case 'premium':
          filtered = filtered.filter(mountain => mountain.price >= 10000)
          break
      }
    }

    setFilteredMountains(filtered)
  }, [searchTerm, filters, mountains])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('explore_mountains')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('mountains_page_description')}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder={t('search_mountains')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {t('filters')}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t">
              <MountainFilters filters={filters} setFilters={setFilters} />
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {t('showing_results', { count: filteredMountains.length, total: mountains.length })}
          </p>
        </div>

        {/* Mountains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMountains.map((mountain) => (
            <MountainCard key={mountain.id} mountain={mountain} />
          ))}
        </div>

        {filteredMountains.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('no_mountains_found')}</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setFilters({
                  category: 'all',
                  difficulty: 'all',
                  priceRange: 'all',
                  season: 'all'
                })
              }}
              className="mt-4"
            >
              {t('clear_filters')}
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
