import { adminDb } from "@/lib/firebase-admin";
import { defaultStats } from "./default-values";

type StatSection = "landing" | "international" | "domestic";

type TStat = {
  id?: string;
  title: string;
  value: string;
  description?: string;
  icon?: string;
  order?: number;
};

export async function getStats(section: StatSection): Promise<TStat[]> {
  try {
    const statsRef = adminDb
      .collection("stats")
      .doc(section)
      .collection("items");

    const snapshot = await statsRef.get();

    if (snapshot.empty) {
      console.log(`No ${section} stats found, using defaults`);
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
  } catch (error) {
    console.error(`Error fetching ${section} stats:`, error);
    return defaultStats[section] || [];
  }
}

// Helper to get all sections
export async function getAllStats(): Promise<Record<StatSection, TStat[]>> {
  const [landing, international, domestic] = await Promise.all([
    getStats("landing"),
    getStats("international"),
    getStats("domestic"),
  ]);

  return { landing, international, domestic };
}
