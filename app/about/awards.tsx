import React from "react";
import { Trophy, Award, Mountain, Medal } from "lucide-react";
import { ImageLoader } from "@/components/ui/image-loader";
type AwardRecord = {
  title: string;
  description: string;
  date: string;
  category?: string;
  organization?: string;
  image: string;
};
const awardsData = {
  records: [
    {
      title: "Fastest Indian Woman (Seven Summits Record)",
      description:
        "National record for fastest completion of Seven Summits—highest peaks on all seven continents—in just 2 years and 25 days",
      date: "June 2025",
      category: "National Record",
      image: "/images/awards/summit-celebration.jpg",
    },
    {
      title: "First Tamil Woman to Conquer Mount Everest",
      description:
        "First woman from Tamil Nadu to successfully summit the world's highest peak, Mount Everest (8848m)",
      date: "May 23, 2023",
      category: "Historic Achievement",
      image: "/images/awards/everest-achievement.jpg",
    },
  ],

  government: [
    {
      title: "Kalpana Chawla Award",
      organization: "Tamil Nadu State Government",
      description: "Prestigious award for courage and daring enterprise",
      date: "2023",
      image: "/images/awards/govt-award.jpg",
    },
    {
      title: "State Government Recognition & Support",
      organization: "Government of Tamil Nadu",
      description:
        "Honored and provided financial aid by Chief Minister M.K. Stalin and Deputy Chief Minister Udhayanidhi Stalin",
      date: "2023",
      image: "/images/awards/cm-recognition.jpg",
    },
  ],

  media: [
    {
      title: "Singa Pen Award",
      organization: "Aval Vikatan",
      description:
        "Recognized as 'Lioness Woman' for extraordinary courage and achievements in mountaineering",
      date: "2023",
      image: "/images/awards/media-award-1.jpg",
    },
    {
      title: "Sakthi Award (Thunivu / Courage Category)",
      organization: "Puthiya Thalaimurai",
      description:
        "Awarded in 'Thunivu' (Courage) category for fear-breaking mission and determination",
      date: "2025",
      image: "/images/awards/media-award-2.jpg",
    },
  ],

  international: [
    {
      title: "Trailblazing Mountaineer & Inspirational Icon",
      organization: "FETNA (North America Federation of Tamil Sangams)",
      description:
        "Highest recognition for inspiring diaspora and representing Tamil global excellence",
      date: "2025",
      image: "/images/awards/international-fetna.jpg",
    },
    {
      title: "Princess of Himalayas",
      organization: "Indian Icon International Women's Award",
      description:
        "Recognition for unique achievements across world's major mountain ranges",
      date: "2024",
      image: "/images/awards/international-princess.jpg",
    },
  ],

  community: [
    {
      title: "SRM Mangayar Thragai Award",
      organization: "SRM Institution",
      description:
        "Distinguished honor as exemplary woman of substance and courage",
      date: "2025",
      image: "/images/awards/university-srm.jpg",
    },
    {
      title: "Rotary Club Recognition",
      organization: "Rotary Club 3212, Virudhunagar",
      description: "Honored for bringing global pride to home district",
      date: "2023",
      image: "/images/awards/rotary-recognition.jpg",
    },
    {
      title: "Raindrops Award",
      organization: "Raindrops Foundation",
      description:
        "Recognition for inspirational journey and dedication to extreme sports and social causes",
      date: "2024",
      image: "/images/awards/raindrops-award.jpg",
    },
    {
      title: "MAA Awards",
      organization: "Gandhi World Foundations",
      description:
        "Recognition for accomplishments and commitment to inspirational leadership",
      date: "2024",
      image: "/images/awards/gandhi-foundation.jpg",
    },
  ],
};

export function Awards2() {
  const renderAwardCard = (award: AwardRecord, index: number) => (
    <div
      key={index}
      className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative md:w-2/5 h-48 md:h-auto overflow-hidden">
          <ImageLoader
            src={award.image}
            alt={award.title}
            height="h-56"
            className=" object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-transparent" />

          {/* Date Badge */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-teal-700">
              {award.date}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6">
          {award.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 mb-3">
              {award.category}
            </span>
          )}

          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
            {award.title}
          </h3>

          {award.organization && (
            <p className="text-sm font-medium text-teal-600 mb-2">
              {award.organization}
            </p>
          )}

          <p className="text-gray-600 text-sm leading-relaxed">
            {award.description}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
            <Trophy className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Awards & Recognition
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Recognition from national and international organizations for
            mountaineering achievements and leadership in adventure sports
          </p>
        </div>

        {/* National Records - Full Width Spotlight */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Mountain className="w-6 h-6 text-teal-600" />
            <h3 className="text-2xl font-bold text-gray-900">
              National Records
            </h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {awardsData.records.map(renderAwardCard)}
          </div>
        </div>

        {/* Government Recognition */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-teal-600" />
            <h3 className="text-2xl font-bold text-gray-900">
              Government Recognition
            </h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {awardsData.government.map(renderAwardCard)}
          </div>
        </div>

        {/* Media Awards */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Medal className="w-6 h-6 text-teal-600" />
            <h3 className="text-2xl font-bold text-gray-900">Media Awards</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {awardsData.media.map(renderAwardCard)}
          </div>
        </div>

        {/* International Recognition */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-teal-600" />
            <h3 className="text-2xl font-bold text-gray-900">
              International Recognition
            </h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {awardsData.international.map(renderAwardCard)}
          </div>
        </div>

        {/* Community & Foundation Awards */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-teal-600" />
            <h3 className="text-2xl font-bold text-gray-900">
              Community & Foundation Awards
            </h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {awardsData.community.map(renderAwardCard)}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-gray-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-600 mb-2">12+</div>
            <div className="text-sm text-gray-600">Total Awards</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-600 mb-2">2</div>
            <div className="text-sm text-gray-600">National Records</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-600 mb-2">2</div>
            <div className="text-sm text-gray-600">Govt Honors</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-600 mb-2">2</div>
            <div className="text-sm text-gray-600">International</div>
          </div>
        </div>
      </div>
    </section>
  );
}
