import { adminDb } from "@/lib/firebase-admin";
import { defaultStats } from "./default-values";
import { withCache } from "@/lib/redis";

type StatSection = "landing" | "international" | "domestic" | "gallery";

type TStat = {
  id?: string;
  title: string;
  value: string;
  description?: string;
  icon?: string;
  order?: number;
};

export async function getStats(section: StatSection): Promise<TStat[]> {
  const cacheKey = `stats:${section}`;
  const TTL = 600; // 10 minutes

  // Use cache-aside pattern
  return withCache(cacheKey, async () => {
    // Return defaults immediately if Firebase is not configured
    if (!adminDb) {
      return defaultStats[section] || [];
    }

    try {
      // Check if the document exists first to avoid NOT_FOUND errors
      const docRef = adminDb.collection("stats").doc(section);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        // Document doesn't exist, use defaults silently
        return defaultStats[section] || [];
      }

      // Document exists, now get the items subcollection
      const statsRef = docRef.collection("items");
      const snapshot = await statsRef.get();

      if (snapshot.empty) {
        return defaultStats[section] || [];
      }

      const stats: TStat[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        stats.push({
          id: doc.id,
          title: data.title,
          value: data.value,
          description: data.description || "",
          icon: data.icon,
          order: data.order || 0,
        });
      });

      return stats.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error: any) {
      // Only log unexpected errors, NOT_FOUND is expected when collection doesn't exist
      if (error?.code !== 5 && !error?.message?.includes("NOT_FOUND")) {
        console.error(`Error fetching ${section} stats:`, error);
      }
      return defaultStats[section] || [];
    }
  }, TTL);
}

// Helper to get all sections
export async function getAllStats(): Promise<Record<StatSection, TStat[]>> {
  const [landing, international, domestic, gallery] = await Promise.all([
    getStats("landing"),
    getStats("international"),
    getStats("domestic"),
    getStats("gallery"),
  ]);

  return { landing, international, domestic, gallery };
}
