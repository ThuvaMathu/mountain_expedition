import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { withCache } from "@/lib/redis";

export interface SuccessStory {
  id: string;
  title: string;
  description: string;
  mountainName: string;
  rating: number;
  images: string[];
  thumbnails?: string[];
  videoUrl?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  userName: string;
  userEmail: string;
}

// Helper to serialize Firestore timestamps
const serializeTimestamp = (val: any): string => {
  if (!val) return new Date().toISOString();
  if (typeof val === "string") return val;
  if (val instanceof Timestamp || (val.seconds && typeof val.toDate === "function")) {
    return val.toDate().toISOString();
  }
  if (val.seconds) {
    return new Date(val.seconds * 1000).toISOString();
  }
  if (val instanceof Date) {
    return val.toISOString();
  }
  return String(val);
};

// Helper to process story data
const processStoryData = (id: string, data: any): SuccessStory => {
  return {
    id,
    title: data.title || "",
    description: data.description || "",
    mountainName: data.mountainName || "",
    rating: data.rating || 5,
    images: data.images || [],
    thumbnails: data.thumbnails || [],
    videoUrl: data.videoUrl || "",
    status: data.status || "approved",
    submittedAt: serializeTimestamp(data.submittedAt),
    reviewedAt: data.reviewedAt ? serializeTimestamp(data.reviewedAt) : undefined,
    userName: data.userName || "Anonymous",
    userEmail: data.userEmail || "",
  };
};

/**
 * Fetch approved success stories from Firebase
 * Falls back to static data if Firebase is unavailable
 */
export async function getSuccessStories(count: number = 10): Promise<SuccessStory[]> {
  const cacheKey = `success-stories:limit:${count}`;
  const TTL = 3600; // 1 hour

  return withCache(cacheKey, async () => {
    if (!db) {
      return getFallbackStories();
    }

    try {
      const q = query(
        collection(db, "experienceSubmissions"),
        where("status", "==", "approved"),
        orderBy("submittedAt", "desc"),
        limit(count)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return getFallbackStories();
      }

      return snapshot.docs.map((doc) => processStoryData(doc.id, doc.data()));
    } catch (error) {
      console.error("Error fetching success stories:", error);
      return getFallbackStories();
    }
  }, TTL);
}

/**
 * Fetch a single success story by ID
 */
export async function getSuccessStoryById(id: string): Promise<SuccessStory | null> {
  if (!db) {
    return null;
  }

  try {
    const docRef = doc(db, "experienceSubmissions", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return processStoryData(docSnap.id, docSnap.data());
  } catch (error) {
    console.error("Error fetching success story by ID:", error);
    return null;
  }
}

/**
 * Fallback static stories when Firebase is unavailable
 */
function getFallbackStories(): SuccessStory[] {
  return [
    {
      id: "fallback-1",
      title: "Everest Base Camp Adventure",
      description: "An absolutely life-changing experience. Muthamilselvi and her team made what seemed impossible feel achievable. The support throughout was incredible!",
      mountainName: "Everest Base Camp",
      rating: 5,
      images: [],
      videoUrl: "",
      status: "approved",
      submittedAt: new Date().toISOString(),
      userName: "Rahul Sharma",
      userEmail: "rahul@example.com",
    },
    {
      id: "fallback-2",
      title: "Kedarkantha Winter Trek",
      description: "My first high-altitude trek and I couldn't have asked for better guides. Every detail was taken care of. Already planning my next adventure!",
      mountainName: "Kedarkantha",
      rating: 5,
      images: [],
      videoUrl: "",
      status: "approved",
      submittedAt: new Date().toISOString(),
      userName: "Priya Patel",
      userEmail: "priya@example.com",
    },
    {
      id: "fallback-3",
      title: "Roopkund Mystery Lake",
      description: "The mysterious lake trek was magical. Our guide's knowledge of the terrain and local stories made it so much more than just a trek.",
      mountainName: "Roopkund Lake",
      rating: 5,
      images: [],
      videoUrl: "",
      status: "approved",
      submittedAt: new Date().toISOString(),
      userName: "Arjun Menon",
      userEmail: "arjun@example.com",
    },
  ];
}
