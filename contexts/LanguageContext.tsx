'use client'

import { createContext, useContext, useState } from 'react'

type Language = 'en' | 'ta'

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  t: (key: string, params?: Record<string, any>) => string
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    mountains: 'Mountains',
    gallery: 'Gallery',
    blog: 'Blog',
    about: 'About',
    dashboard: 'Dashboard',
    admin: 'Admin',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    
    // Home page
    explore_mountains: 'Explore Mountains',
    watch_video: 'Watch Video',
    featured_expeditions: 'Featured Expeditions',
    featured_expeditions_description: 'Discover our most popular mountain expeditions, from the Seven Summits to the majestic Himalayas.',
    view_details: 'View Details',
    view_all_mountains: 'View All Mountains',
    years_experience: 'Years Experience',
    climbers: 'Happy Climbers',
    days_year: 'Days a Year',
    
    // Categories
    all_mountains: 'All Mountains',
    seven_summits: 'Seven Summits',
    himalayas: 'Himalayas',
    indian_peaks: 'Indian Peaks',
    
    // Filters
    filters: 'Filters',
    category: 'Category',
    difficulty: 'Difficulty',
    price_range: 'Price Range',
    season: 'Season',
    all_categories: 'All Categories',
    all_difficulties: 'All Difficulties',
    all_prices: 'All Prices',
    all_seasons: 'All Seasons',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
    budget: 'Budget',
    mid_range: 'Mid Range',
    premium: 'Premium',
    spring: 'Spring',
    summer: 'Summer',
    autumn: 'Autumn',
    winter: 'Winter',
    
    // Search and results
    search_mountains: 'Search mountains...',
    showing_results: 'Showing {{count}} of {{total}} mountains',
    no_mountains_found: 'No mountains found matching your criteria',
    clear_filters: 'Clear Filters',
    mountains_page_description: 'Choose from our carefully curated selection of world-class mountain expeditions. From beginner-friendly peaks to expert-level challenges.',
  },
  ta: {
    // Navigation
    home: 'முகப்பு',
    mountains: 'மலைகள்',
    gallery: 'படக்காட்சி',
    blog: 'வலைப்பதிவு',
    about: 'எங்களைப் பற்றி',
    dashboard: 'கட்டுப்பாட்டு பலகை',
    admin: 'நிர்வாகம்',
    login: 'உள்நுழைய',
    register: 'பதிவு செய்ய',
    logout: 'வெளியேறு',
    
    // Home page
    explore_mountains: 'மலைகளை ஆராயுங்கள்',
    watch_video: 'வீடியோ பார்க்க',
    featured_expeditions: 'சிறப்பு பயணங்கள்',
    featured_expeditions_description: 'ஏழு உச்சிகள் முதல் மகத்தான இமயமலை வரை எங்கள் மிகவும் பிரபலமான மலை பயணங்களை கண்டறியுங்கள்.',
    view_details: 'விவரங்களைப் பார்க்க',
    view_all_mountains: 'அனைத்து மலைகளையும் பார்க்க',
    years_experience: 'ஆண்டுகள் அனுபவம்',
    climbers: 'மகிழ்ச்சியான ஏறுபவர்கள்',
    days_year: 'ஆண்டில் நாட்கள்',
    
    // Categories
    all_mountains: 'அனைத்து மலைகள்',
    seven_summits: 'ஏழு உச்சிகள்',
    himalayas: 'இமயமலை',
    indian_peaks: 'இந்திய சிகரங்கள்',
    
    // Filters
    filters: 'வடிகட்டிகள்',
    category: 'வகை',
    difficulty: 'கடினத்தன்மை',
    price_range: 'விலை வரம்பு',
    season: 'பருவம்',
    all_categories: 'அனைத்து வகைகள்',
    all_difficulties: 'அனைத்து கடினத்தன்மைகள்',
    all_prices: 'அனைத்து விலைகள்',
    all_seasons: 'அனைத்து பருவங்கள்',
    beginner: 'தொடக்கநிலை',
    intermediate: 'இடைநிலை',
    advanced: 'மேம்பட்ட',
    expert: 'நிபுணர்',
    budget: 'பட்ஜெட்',
    mid_range: 'நடுத்தர வரம்பு',
    premium: 'பிரீமியம்',
    spring: 'வசந்தம்',
    summer: 'கோடை',
    autumn: 'இலையுதிர்',
    winter: 'குளிர்',
    
    // Search and results
    search_mountains: 'மலைகளைத் தேடுங்கள்...',
    showing_results: '{{total}} மலைகளில் {{count}} காட்டப்படுகிறது',
    no_mountains_found: 'உங்கள் அளவுகோல்களுக்கு பொருந்தும் மலைகள் எதுவும் கிடைக்கவில்லை',
    clear_filters: 'வடிகட்டிகளை அழிக்க',
    mountains_page_description: 'உலகத்தரம் வாய்ந்த மலை பயணங்களின் எங்கள் கவனமாக தேர்ந்தெடுக்கப்பட்ட தேர்வில் இருந்து தேர்ந்தெடுக்கவும். தொடக்கநிலை-நட்பு சிகரங்கள் முதல் நிபுணர் நிலை சவால்கள் வரை.',
  }
}

const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType)

export function useLanguage() {
  return useContext(LanguageContext)
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ta' : 'en')
  }

  const t = (key: string, params?: Record<string, any>) => {
    let translation = translations[language][key as keyof typeof translations[typeof language]] || key
    
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, params[param])
      })
    }
    
    return translation
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
