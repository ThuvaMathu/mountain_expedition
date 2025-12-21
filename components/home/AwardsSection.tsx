import { adminDb } from "@/lib/firebase-admin";
import { Award } from "lucide-react";

type AwardItem = {
  id: string;
  title: string;
  description: string;
  image: string;
};

async function getAwards(): Promise<AwardItem[]> {
  try {
    const snap = await adminDb.collection("awards").get();
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AwardItem[];
  } catch (error) {
    console.warn("Failed to fetch awards:", error);
    return [];
  }
}

export async function AwardsSection() {
  const awards = await getAwards();

  if (awards.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Award className="h-8 w-8 text-teal-600" />
            Awards & Recognition
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We are proud to be recognized for our commitment to excellence and safety in mountaineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {awards.map((award) => (
            <div
              key={award.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48 bg-gray-200">
                <img
                  src={award.image || "/placeholder.svg"}
                  alt={award.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {award.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {award.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
