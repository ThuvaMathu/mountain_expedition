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

type TOrderData = {
  amount: number;
  currency: string;
  mountainId: string;
  mountainName: string;
  date: string;
  participants: number;
  participantsInfo: TParticipantGroup;
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
  id: string;
  time: string;
  maxParticipants: number;
  bookedParticipants: number;
  priceMultiplier: number;
} | null;

type TBooking = {
  id: string;
  amount: number;
  bookingId: string;
  createdAt: string; // timestamp → use Date type
  currency: string;
  customerInfo: TParticipantGroup;
  slotDetails: TSlotDetails;
  mountainId: string;
  mountainName: string;
  participants: number;
  paymentMethod: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  status: string; // can extend later
  userEmail: string;
};

type TJourneyImage = {
  id: string;
  url: string;
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
  status: "pending" | "approved" | "rejected";
  submittedAt: Timestamp | Date;
  userName: string;
  userEmail: string;
};
