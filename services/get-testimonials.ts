import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  text: string;
  rating: number;
  date: string;
  mountain: string;
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Everest Trekker",
    image: "/placeholder-nwzb1.png",
    text: "Tamil Adventure Trekking Club made my dream of climbing Kilimanjaro come true.",
    rating: 5,
    date: "28 OCT",
    mountain: "Kilimanjaro"
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Mountain Enthusiast",
    image: "/placeholder.svg",
    text: "The Everest Base Camp trek was life-changing.",
    rating: 5,
    date: "15 NOV",
    mountain: "Everest Base Camp"
  },
  {
    id: "3",
    name: "Emma Williams",
    role: "Adventure Seeker",
    image: "/placeholder.svg",
    text: "Professional guides and amazing experience!",
    rating: 5,
    date: "10 DEC",
    mountain: "Annapurna"
  }
];

export async function getTestimonials(maxCount?: number): Promise<Testimonial[]> {
  try {
    if (!db) {
      console.warn("Firestore not initialized, using fallback testimonials");
      return FALLBACK_TESTIMONIALS.slice(0, maxCount);
    }

    let q = query(
      collection(db, "testimonials"),
      where("status", "==", "approved")
    );

    if (maxCount) {
      q = query(q, limit(maxCount));
    }

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No approved testimonials found, using fallback");
      return FALLBACK_TESTIMONIALS.slice(0, maxCount);
    }

    const testimonials: Testimonial[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "Anonymous",
        role: data.location || "Adventurer",
        image: data.image || "/placeholder-user.jpg",
        text: data.text || "",
        rating: data.rating || 5,
        date: data.createdAt 
          ? new Date(data.createdAt.seconds * 1000).toLocaleDateString(undefined, { 
              day: 'numeric', 
              month: 'short' 
            })
          : "Recently",
        mountain: data.mountain || "Mountain Expedition"
      };
    });

    return testimonials;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return FALLBACK_TESTIMONIALS.slice(0, maxCount);
  }
}
