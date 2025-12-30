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
  thumbnailUrl?: string; // Optimized thumbnail for blog cards
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
  thumbnailUrl?: string; // Optimized thumbnail for blog cards
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
  type: "trekking" | "tour";
  name: string;
  location: string;
  altitude: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  bestSeason: string;
  imageUrl: string[];
  thumbnailUrl?: string; // Optimized thumbnail
  price: number;
  priceUSD: number;
  priceINR: number;
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
  highlights?: string[];
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
  category?: "domestic" | "international";
  status?: "active" | "disabled" | "outdated";
  disabledReason?: string;
  lastUpdated?: string;
};

type ItineraryItem = {
  day: number;
  title: string;
  description: string;
  altitude: number;
};

type TOrderData = {
  amount: number;
  currency: string;
  mountainId: string;
  mountainName: string;
  date: string;
  participants: number;
  participantsInfo: TParticipantGroup;
  type?: string;  // ✅ Add type field (trekking/tour)
};

type TParticipantInfo = {
  name: string;
  email: string;
  country: string;
  passport: string;
  phone: string;
  emergencyContact: string;
  medicalInfo: string;
};

type TParticipantGroup = {
  organizer: TParticipantInfo;
  members: ParticTipantInfo[];
};
type TSlotDetails = {
  date: string; // formatted date like "5 Aug 2025"
  originalDate?: string; // original database date format for validation
  id: string;
  time: string;
  maxParticipants: number;
  bookedParticipants: number;
  priceMultiplier: number;
} | null;

type BookingProductType = {
  id: string;
  type: "trekking" | "tour";
};
type TBooking = {
  id: string;
  booking: BookingProductType;
  amount: number;
  baseAmount?: number; // Base price without service fee
  serviceFee?: number; // Service fee charged
  bookingId: string;
  createdAt: string; // timestamp → use Date type
  currency: string;
  customerInfo: TParticipantGroup;
  slotDetails: TSlotDetails;
  //mountainId: string;
  mountainName: string;
  participants: number;
  paymentMethod: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  status: string; // can extend later
  userEmail?: string;  // ✅ Optional
  pdfUrl?: string;
  pdfPath?: string;
};

type TJourneyImage = {
  id: string;
  url: string;
  thumbnailUrl?: string; // Optimized thumbnail for gallery grid
  title: string;
  uploadedAt: any;
};

type TExperienceSubmission = {
  id: string;
  title: string;
  description: string;
  mountainName: string;
  rating: number;
  images: string[];
  thumbnails?: string[]; // Optimized thumbnails for each image
  videoUrl?: string; // Video download URL
  videoStoragePath?: string; // Storage path for deletion
  status: "pending" | "approved" | "rejected";
  submittedAt: any;
  userName: string;
  userEmail: string;
};

type TStatSection = "landing" | "international" | "domestic" | "gallery";

type TStat = {
  id?: string;
  title: string;
  value: string;
  description?: string;
  icon?: string;
  order?: number;
};

type OfficeHours = {
  day: string;
  hours: string;
};

type FAQ = {
  question: string;
  answer: string;
};

type TContactDetails = {
  email: string;
  phone: string;
  address: string;
  emergencyPhone: string;
  officeHours: OfficeHours[];
  faqs: FAQ[];
  socialMedia?: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    whatsapp?: string;
  };
};
