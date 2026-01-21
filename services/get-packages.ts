import { adminDb } from "@/lib/firebase-admin";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Upstash Redis configuration
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Cache TTL in seconds (5 minutes for packages)
const CACHE_TTL = 300;

/**
 * Fetch data from Upstash Redis cache
 */
async function getCachedData<T>(key: string): Promise<T | null> {
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
    console.log("[get-packages] Redis not configured (missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN)");
    return null;
  }

  try {
    const response = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${key}`, {
      headers: {
        Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      },
      next: { revalidate: 60 }, // Cache for 1 minute on edge
    });

    if (!response.ok) {
      console.warn(`[get-packages] Redis cache GET failed: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    if (data.result) {
      console.log(`[get-packages] Redis cache HIT for key: ${key}`);
      return JSON.parse(data.result) as T;
    }
    console.log(`[get-packages] Redis cache MISS for key: ${key}`);
    return null;
  } catch (error) {
    console.error("[get-packages] Redis cache GET error:", error);
    return null;
  }
}

/**
 * Set data in Upstash Redis cache
 */
async function setCachedData<T>(key: string, data: T, ttl: number = CACHE_TTL): Promise<void> {
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
    console.log("[get-packages] Redis not configured, skipping cache SET");
    return;
  }

  try {
    const response = await fetch(`${UPSTASH_REDIS_REST_URL}/set/${key}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: JSON.stringify(data),
        ex: ttl,
      }),
    });

    if (response.ok) {
      console.log(`[get-packages] Redis cache SET success for key: ${key} (TTL: ${ttl}s)`);
    } else {
      console.warn(`[get-packages] Redis cache SET failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("[get-packages] Redis cache SET error:", error);
  }
}

// Fallback packages when Firebase is unavailable
const FALLBACK_PACKAGES: TMountainType[] = [
  {
    id: "everest-base-camp",
    type: "trekking",
    name: "Everest Base Camp Trek",
    location: "Nepal",
    altitude: 5364,
    difficulty: "Advanced",
    bestSeason: "March - May, September - November",
    imageUrl: [],
    thumbnailUrl: "",
    price: 0,
    pricingType: "enquire",
    priceUSD: 2500,
    rating: 4.9,
    totalReviews: 150,
    availableSlots: 12,
    description: "The iconic journey to the foot of the world's highest peak.",
    longDescription: "Experience the legendary Everest Base Camp trek through the Khumbu Valley, following in the footsteps of mountaineering legends.",
    duration: "14-16 days",
    safetyRating: "Excellent",
    groupSize: "4-12",
    included: ["Accommodation", "Meals", "Guide", "Porter", "Permits"],
    notIncluded: ["Flight to Lukla", "Personal gear", "Insurance"],
    highlights: ["Kalapatthar Viewpoint", "Everest Base Camp", "Namche Bazaar"],
    availableDates: [],
    itinerary: [],
    category: "international",
    status: "active",
  },
  {
    id: "kedarkantha",
    type: "trekking",
    name: "Kedarkantha Winter Trek",
    location: "Uttarakhand, India",
    altitude: 3810,
    difficulty: "Beginner",
    bestSeason: "December - April",
    imageUrl: [],
    thumbnailUrl: "",
    price: 0,
    pricingType: "price",
    priceINR: 8500,
    rating: 4.8,
    totalReviews: 320,
    availableSlots: 25,
    description: "A perfect beginner-friendly winter trek with stunning Himalayan views.",
    longDescription: "Kedarkantha offers spectacular 360-degree views of famous peaks and is ideal for first-time trekkers.",
    duration: "4-5 days",
    safetyRating: "Good",
    groupSize: "6-15",
    included: ["Meals", "Guide", "Tents", "Safety equipment"],
    notIncluded: ["Personal expenses", "Travel to base camp"],
    highlights: ["Summit views", "Snow camping", "Juda Ka Talab"],
    availableDates: [],
    itinerary: [],
    category: "domestic",
    status: "active",
  },
  {
    id: "roopkund",
    type: "trekking",
    name: "Roopkund Mystery Lake Trek",
    location: "Uttarakhand, India",
    altitude: 5029,
    difficulty: "Intermediate",
    bestSeason: "May - June, September - October",
    imageUrl: [],
    thumbnailUrl: "",
    price: 0,
    pricingType: "price",
    priceINR: 12000,
    rating: 4.7,
    totalReviews: 280,
    availableSlots: 18,
    description: "Trek to the mysterious skeleton lake in the Himalayas.",
    longDescription: "Discover the enigmatic Roopkund Lake with ancient skeletal remains, surrounded by alpine meadows and snow-capped peaks.",
    duration: "7-8 days",
    safetyRating: "Good",
    groupSize: "6-12",
    included: ["Meals", "Guide", "Tents", "Permits", "Forest fees"],
    notIncluded: ["Personal expenses", "Travel to base camp"],
    highlights: ["Skeleton Lake", "Ali Bugyal", "Bedni Bugyal"],
    availableDates: [],
    itinerary: [],
    category: "domestic",
    status: "active",
  },
];

/**
 * Convert Firestore document to TMountainType
 */
function convertToPackage(docId: string, data: any): TMountainType {
  return {
    id: docId,
    type: data.type || "trekking",
    name: data.name || "",
    location: data.location || "",
    altitude: data.altitude || 0,
    difficulty: data.difficulty || "Beginner",
    bestSeason: data.bestSeason || "",
    imageUrl: data.imageUrl || [],
    thumbnailUrl: data.thumbnailUrl || "",
    price: data.price || 0,
    pricingType: data.pricingType,
    priceUSD: data.priceUSD,
    priceINR: data.priceINR,
    rating: data.rating || 0,
    totalReviews: data.totalReviews || 0,
    availableSlots: data.availableSlots || 0,
    description: data.description || "",
    longDescription: data.longDescription || data.description || "",
    duration: data.duration || "",
    safetyRating: data.safetyRating || "Good",
    groupSize: data.groupSize || "",
    included: data.included || [],
    notIncluded: data.notIncluded || [],
    highlights: data.highlights || [],
    availableDates: data.availableDates || [],
    itinerary: data.itinerary || [],
    category: data.category || "domestic",
    status: data.status || "active",
    disabledReason: data.disabledReason,
    lastUpdated: data.lastUpdated,
  } as TMountainType;
}

/**
 * Fetch packages from 'mountains' collection using client Firestore
 * Matches the approach used in /trekking page - fetch all, filter by status
 */
async function fetchMountainsCollection(): Promise<TMountainType[]> {
  if (!db) {
    console.warn("[get-packages] Client Firestore db not available");
    return [];
  }

  try {
    console.log("[get-packages] Fetching ALL from 'mountains' collection with client Firestore...");
    // Fetch ALL documents first (no where clause), then filter
    const snapshot = await getDocs(collection(db, "mountains"));

    console.log(`[get-packages] Total documents in 'mountains': ${snapshot.docs.length}`);

    // Filter by status in JavaScript (like /trekking page does)
    const activeDocs = snapshot.docs.filter((doc) => {
      const data = doc.data();
      return data.status !== "disabled" && data.status !== "outdated";
    });

    console.log(`[get-packages] After filtering status != 'disabled'/'outdated': ${activeDocs.length} documents`);
    if (activeDocs.length > 0) {
      console.log(`[get-packages] Sample mountain ID: ${activeDocs[0].id}, name: ${activeDocs[0].data().name}`);
    }

    return activeDocs.map((doc) =>
      convertToPackage(doc.id, doc.data())
    );
  } catch (error) {
    console.error("[get-packages] Error fetching from mountains collection:", error);
    return [];
  }
}

/**
 * Fetch packages from 'tourist-packages' collection using client Firestore
 * Matches the approach used in /tours page - fetch all, filter by status
 */
async function fetchTouristPackagesCollection(): Promise<TMountainType[]> {
  if (!db) {
    console.warn("[get-packages] Client Firestore db not available");
    return [];
  }

  try {
    console.log("[get-packages] Fetching ALL from 'tourist-packages' collection with client Firestore...");
    // Fetch ALL documents first (no where clause), then filter
    const snapshot = await getDocs(collection(db, "tourist-packages"));

    console.log(`[get-packages] Total documents in 'tourist-packages': ${snapshot.docs.length}`);

    // Filter by status in JavaScript (like /tours page does)
    const activeDocs = snapshot.docs.filter((doc) => {
      const data = doc.data();
      return data.status !== "disabled" && data.status !== "outdated";
    });

    console.log(`[get-packages] After filtering status != 'disabled'/'outdated': ${activeDocs.length} documents`);
    if (activeDocs.length > 0) {
      console.log(`[get-packages] Sample tour ID: ${activeDocs[0].id}, name: ${activeDocs[0].data().name || activeDocs[0].data().packageName}`);
    }

    return activeDocs.map((doc) => {
      const data = doc.data();
      // Map tourist-packages fields to TMountainType structure
      return {
        id: doc.id,
        type: data.type || "tour",
        name: data.name || data.packageName || "",
        location: data.location || data.destination || "",
        altitude: data.altitude || 0,
        difficulty: data.difficulty || "Beginner",
        bestSeason: data.bestSeason || data.season || "",
        imageUrl: data.images || data.imageUrl || [],
        thumbnailUrl: data.thumbnail || data.thumbnailUrl || "",
        price: data.price || 0,
        pricingType: data.pricingType,
        priceUSD: data.priceUSD,
        priceINR: data.priceINR,
        rating: data.rating || 0,
        totalReviews: data.reviews || data.totalReviews || 0,
        availableSlots: data.slots || data.availableSlots || 0,
        description: data.description || data.summary || "",
        longDescription: data.longDescription || data.description || "",
        duration: data.duration || "",
        safetyRating: data.safetyRating || "Good",
        groupSize: data.groupSize || data.groupSize?.toString() || "",
        included: data.included || [],
        notIncluded: data.excluded || data.notIncluded || [],
        highlights: data.highlights || [],
        availableDates: data.availableDates || [],
        itinerary: data.itinerary || [],
        category: data.category || "domestic",
        status: data.status || "active",
      } as TMountainType;
    });
  } catch (error) {
    console.error("[get-packages] Error fetching from tourist-packages collection:", error);
    return [];
  }
}

/**
 * Fetch packages from Firestore using Admin SDK (server-side only)
 * Fetches ALL documents, filters by status in JavaScript (matches client approach)
 */
async function fetchPackagesAdmin(): Promise<TMountainType[]> {
  if (!adminDb) {
    console.warn("[get-packages] Admin Firestore not available");
    return [];
  }

  try {
    // Fetch ALL from 'mountains' collection (no where clause)
    console.log("[get-packages] Fetching ALL from 'mountains' collection with Admin SDK...");
    const mountainsSnapshot = await adminDb
      .collection("mountains")
      .get();

    console.log(`[get-packages] Admin SDK: Total ${mountainsSnapshot.docs.length} documents in 'mountains'`);

    // Filter by status in JavaScript
    const mountains = mountainsSnapshot.docs
      .filter((doc) => {
        const data = doc.data();
        return data.status !== "disabled" && data.status !== "outdated";
      })
      .map((doc) => convertToPackage(doc.id, doc.data()));

    console.log(`[get-packages] Admin SDK: ${mountains.length} active mountains`);

    // Fetch ALL from 'tourist-packages' collection (no where clause)
    console.log("[get-packages] Fetching ALL from 'tourist-packages' collection with Admin SDK...");
    const toursSnapshot = await adminDb
      .collection("tourist-packages")
      .get();

    console.log(`[get-packages] Admin SDK: Total ${toursSnapshot.docs.length} documents in 'tourist-packages'`);

    // Filter by status in JavaScript
    const tours = toursSnapshot.docs
      .filter((doc) => {
        const data = doc.data();
        return data.status !== "disabled" && data.status !== "outdated";
      })
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type || "tour",
          name: data.name || data.packageName || "",
          location: data.location || data.destination || "",
          altitude: data.altitude || 0,
          difficulty: data.difficulty || "Beginner",
          bestSeason: data.bestSeason || data.season || "",
          imageUrl: data.images || data.imageUrl || [],
          thumbnailUrl: data.thumbnail || data.thumbnailUrl || "",
          price: data.price || 0,
          pricingType: data.pricingType,
          priceUSD: data.priceUSD,
          priceINR: data.priceINR,
          rating: data.rating || 0,
          totalReviews: data.reviews || data.totalReviews || 0,
          availableSlots: data.slots || data.availableSlots || 0,
          description: data.description || data.summary || "",
          longDescription: data.longDescription || data.description || "",
          duration: data.duration || "",
          safetyRating: data.safetyRating || "Good",
          groupSize: data.groupSize || data.groupSize?.toString() || "",
          included: data.included || [],
          notIncluded: data.excluded || data.notIncluded || [],
          highlights: data.highlights || [],
          availableDates: data.availableDates || [],
          itinerary: data.itinerary || [],
          category: data.category || "domestic",
          status: data.status || "active",
        } as TMountainType;
      });

    console.log(`[get-packages] Admin SDK: ${tours.length} active tours`);

    const total = mountains.length + tours.length;
    console.log(`[get-packages] Admin SDK total: ${total} packages (${mountains.length} mountains + ${tours.length} tours)`);
    return [...mountains, ...tours];
  } catch (error) {
    console.error("[get-packages] Error fetching packages with Admin SDK:", error);
    return [];
  }
}

/**
 * Fetch all active packages/tours from Firestore
 * Uses Upstash Redis cache to prevent Firestore overload
 * Fetches from both 'mountains' and 'tourist-packages' collections
 */
export async function getAllPackages(): Promise<TMountainType[]> {
  const cacheKey = "packages:all";

  // Try to get from cache first
  const cached = await getCachedData<TMountainType[]>(cacheKey);
  if (cached && cached.length > 0) {
    console.log(`[get-packages] Cache HIT: returning ${cached.length} cached packages`);
    return cached;
  }
  console.log("[get-packages] Cache MISS: fetching from Firestore...");

  let packages: TMountainType[] = [];

  // Try Admin SDK first (server-side)
  if (adminDb) {
    console.log("[get-packages] Using Admin SDK (server-side)...");
    packages = await fetchPackagesAdmin();
  } else {
    console.warn("[get-packages] Admin SDK not available");
  }

  // Fallback to client Firestore if Admin returns nothing
  if (packages.length === 0) {
    console.log("[get-packages] Admin returned empty, trying client Firestore...");
    const [mountains, tours] = await Promise.all([
      fetchMountainsCollection(),
      fetchTouristPackagesCollection(),
    ]);
    packages = [...mountains, ...tours];
    console.log(`[get-packages] Client Firestore returned ${packages.length} total packages`);
  }

  // If still empty, use fallback
  if (packages.length === 0) {
    console.warn("[get-packages] No packages found from any source, using FALLBACK packages");
    packages = FALLBACK_PACKAGES;
  }

  console.log(`[get-packages] Final result: ${packages.length} packages`);
  console.log(`[get-packages] Package names: ${packages.map(p => p.name).join(", ")}`);

  // Cache the results
  await setCachedData(cacheKey, packages, CACHE_TTL);
  console.log(`[get-packages] Cached ${packages.length} packages with TTL ${CACHE_TTL}s`);

  return packages;
}

/**
 * Get packages by category (domestic/international)
 */
export async function getPackagesByCategory(
  category: "domestic" | "international"
): Promise<TMountainType[]> {
  const cacheKey = `packages:category:${category}`;

  // Try cache first
  const cached = await getCachedData<TMountainType[]>(cacheKey);
  if (cached) return cached;

  const allPackages = await getAllPackages();
  const filtered = allPackages.filter((p) => p.category === category);

  // Cache filtered results
  await setCachedData(cacheKey, filtered, CACHE_TTL);

  return filtered;
}

/**
 * Get packages by type (trekking/tour)
 */
export async function getPackagesByType(
  type: "trekking" | "tour"
): Promise<TMountainType[]> {
  const cacheKey = `packages:type:${type}`;

  // Try cache first
  const cached = await getCachedData<TMountainType[]>(cacheKey);
  if (cached) return cached;

  const allPackages = await getAllPackages();
  const filtered = allPackages.filter((p) => p.type === type);

  // Cache filtered results
  await setCachedData(cacheKey, filtered, CACHE_TTL);

  return filtered;
}

/**
 * Get packages by difficulty level
 */
export async function getPackagesByDifficulty(
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert"
): Promise<TMountainType[]> {
  const cacheKey = `packages:difficulty:${difficulty}`;

  // Try cache first
  const cached = await getCachedData<TMountainType[]>(cacheKey);
  if (cached) return cached;

  const allPackages = await getAllPackages();
  const filtered = allPackages.filter((p) => p.difficulty === difficulty);

  // Cache filtered results
  await setCachedData(cacheKey, filtered, CACHE_TTL);

  return filtered;
}

/**
 * Get a single package by ID
 */
export async function getPackageById(id: string): Promise<TMountainType | null> {
  const cacheKey = `package:id:${id}`;

  // Try cache first
  const cached = await getCachedData<TMountainType>(cacheKey);
  if (cached) return cached;

  const allPackages = await getAllPackages();
  const found = allPackages.find((p) => p.id === id) || null;

  if (found) {
    await setCachedData(cacheKey, found, CACHE_TTL);
  }

  return found;
}

/**
 * Search packages by keyword
 */
export async function searchPackages(keyword: string): Promise<TMountainType[]> {
  const allPackages = await getAllPackages();
  const lowerKeyword = keyword.toLowerCase();

  return allPackages.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerKeyword) ||
      p.location.toLowerCase().includes(lowerKeyword) ||
      p.description.toLowerCase().includes(lowerKeyword) ||
      p.difficulty.toLowerCase().includes(lowerKeyword)
  );
}

/**
 * Invalidate cache for all packages
 * Call this after updating packages in Firestore
 */
export async function invalidatePackageCache(): Promise<void> {
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
    return;
  }

  try {
    // Delete all package-related cache keys
    await fetch(`${UPSTASH_REDIS_REST_URL}/keys/packages:*/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      },
    });
  } catch (error) {
    console.error("Error invalidating cache:", error);
  }
}

// ============================================================
// CHAT-SPECIFIC: In-memory session storage for packages
// Stores packages per chat session to avoid repeated Firebase/Redis calls
// ============================================================

/**
 * In-memory storage for packages per chat session
 * Key: sessionId, Value: { packages, timestamp }
 */
const chatSessionPackages = new Map<string, { packages: TMountainType[]; timestamp: number }>();

// Session packages expire after 10 minutes
const SESSION_TTL = 10 * 60 * 1000;

/**
 * Clean up expired session packages every 5 minutes
 */
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const [sessionId, data] of chatSessionPackages.entries()) {
    if (now - data.timestamp > SESSION_TTL) {
      chatSessionPackages.delete(sessionId);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    console.log(`[get-packages] Cleaned up ${cleaned} expired chat session package caches`);
  }
}, 5 * 60 * 1000);

/**
 * Get packages for chat - prioritizes session storage
 * Strategy:
 * 1. Check in-memory session cache (fastest)
 * 2. Check Upstash Redis (fast)
 * 3. Fetch from Firestore (slowest, then caches to both)
 *
 * @param sessionId - The chat session ID
 * @returns Promise<TMountainType[]>
 */
export async function getPackagesForChat(sessionId: string): Promise<TMountainType[]> {
  const now = Date.now();

  // 1. Check in-memory session cache first (fastest)
  const sessionData = chatSessionPackages.get(sessionId);
  if (sessionData && (now - sessionData.timestamp < SESSION_TTL)) {
    console.log(`[get-packages] CHAT SESSION HIT: Returning ${sessionData.packages.length} packages from in-memory session cache`);
    return sessionData.packages;
  }

  if (sessionData) {
    console.log(`[get-packages] CHAT SESSION EXPIRED: Removing stale cache for session ${sessionId}`);
    chatSessionPackages.delete(sessionId);
  }

  // 2. Check Upstash Redis cache
  const redisKey = "packages:all";
  const redisCached = await getCachedData<TMountainType[]>(redisKey);
  if (redisCached && redisCached.length > 0) {
    console.log(`[get-packages] CHAT REDIS HIT: Returning ${redisCached.length} packages from Redis, storing to session cache`);
    // Store to session cache for next time
    chatSessionPackages.set(sessionId, { packages: redisCached, timestamp: now });
    return redisCached;
  }

  // 3. Fetch from Firestore (first time for this session)
  console.log(`[get-packages] CHAT FETCH: Fetching from Firestore for session ${sessionId}...`);

  let packages: TMountainType[] = [];

  // Try Admin SDK first (server-side)
  if (adminDb) {
    console.log("[get-packages] CHAT: Using Admin SDK (server-side)...");
    packages = await fetchPackagesAdmin();
  } else {
    console.warn("[get-packages] CHAT: Admin SDK not available");
  }

  // Fallback to client Firestore if Admin returns nothing
  if (packages.length === 0) {
    console.log("[get-packages] CHAT: Admin returned empty, trying client Firestore...");
    const [mountains, tours] = await Promise.all([
      fetchMountainsCollection(),
      fetchTouristPackagesCollection(),
    ]);
    packages = [...mountains, ...tours];
    console.log(`[get-packages] CHAT: Client Firestore returned ${packages.length} total packages`);
  }

  // If still empty, use fallback
  if (packages.length === 0) {
    console.warn("[get-packages] CHAT: No packages found from any source, using FALLBACK packages");
    packages = FALLBACK_PACKAGES;
  }

  console.log(`[get-packages] CHAT: Final result: ${packages.length} packages`);
  console.log(`[get-packages] CHAT: Source: Firestore → Session Cache`);

  // Store to in-memory session cache (don't use Redis for chat-specific cache)
  chatSessionPackages.set(sessionId, { packages, timestamp: now });

  // Also update Redis cache for other consumers
  await setCachedData(redisKey, packages, CACHE_TTL);

  return packages;
}

/**
 * Clear packages for a specific chat session
 * Call this when a chat session ends
 */
export function clearChatSessionPackages(sessionId: string): void {
  chatSessionPackages.delete(sessionId);
  console.log(`[get-packages] Cleared chat session cache for: ${sessionId}`);
}
