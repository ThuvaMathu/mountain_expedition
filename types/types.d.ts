type TBlogPost = {
  id?: string;
  slug: string;
  title: string;
  desc: string;
  author: string;
  content: string;
  tags: string[];
  published: boolean;
  mainImageUrl?: string;
  createdAt?: any;
};

type TBlogPostForm = {
  slug: string;
  title: string;
  desc: string;
  author: string;
  tags: string[];
  date: string;
  published: boolean;
  mainImageUrl?: string;
};

type Mountain = {
  id: string;
  name: string;
  location: string;
  altitude: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  bestSeason: string;
  image: string;
  price: number;
  rating: number;
  totalReviews: number;
  availableSlots: number;
  category: "seven-summits" | "himalayas" | "indian-peaks";
  description: string;
};

type TTimeSlot = {
  id: string;
  time: string;
  maxParticipants: number;
  bookedParticipants: number;
  priceMultiplier: number;
};

type TMountainType = {
  id: string;
  name: string;
  location: string;
  altitude: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  bestSeason: string;
  imageUrl: string[];
  price: number;
  rating: number;
  totalReviews: number;
  availableSlots: number;
  description: string;
  longDescription: string;
  duration: string;
  safetyRating: "Excellent" | "Good" | "Average" | "Poor";

  groupSize: string;
  included: string[];
  notIncluded: string[];
  availableDates: Array<{
    date: string;
    slots: TTimeSlot[];
  }>;
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
    altitude: number;
  }>;
  createdAt?: string;
};

type ItineraryItem = {
  day: number;
  title: string;
  description: string;
  altitude: number;
};
