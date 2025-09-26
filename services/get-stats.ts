import { adminDb } from "@/lib/firebase-admin";
import { collection, getDocs } from "firebase/firestore";
import { defaultStats } from "./default-values";

export async function getStats(): Promise<TStat[]> {
  try {
    // Fetch stats from Firebase Admin
    const statsCollection = adminDb.collection("stats");
    const statsSnapshot = await statsCollection.get();

    if (statsSnapshot.empty) {
      console.log("No stats found in Firebase, using default stats");
      return defaultStats.map((stat) => ({
        title: stat.title,
        value: stat.value,
        description: stat.description,
        isEnabled: stat.isEnabled,
      }));
    }

    const stats: TStat[] = [];
    statsSnapshot.forEach((doc) => {
      const data = doc.data();
      stats.push({
        id: doc.id,
        title: data.title,
        value: data.value,
        description: data.description,
        isEnabled: data.isEnabled,
      });
    });

    return stats;
  } catch (error) {
    console.error("Error fetching stats from Firebase:", error);
    // Return default stats as fallback
    return defaultStats.map((stat) => ({
      title: stat.title,
      value: stat.value,
      description: stat.description,
    }));
  }
}
