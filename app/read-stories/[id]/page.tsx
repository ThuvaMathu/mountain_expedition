import { adminDb } from "@/lib/firebase-admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Star,
  Mountain,
  Users,
  CheckCircle2,
  Mail,
  Instagram,
} from "lucide-react";
import { type Metadata } from "next";
import Image from "next/image";
import { getSuccessStoryById, getSuccessStories } from "@/services/get-success-stories";
import { StoryMediaGallery } from "@/components/read-stories/StoryMediaGallery";
import { StoryCTA } from "@/components/read-stories/StoryCTA";
import { RelatedStories } from "@/components/read-stories/RelatedStories";
import { ShareButtons } from "@/components/read-stories/ShareButtons";
import type { SuccessStory } from "@/services/get-success-stories";
import { cn } from "@/lib/utils";

interface ReadStoryPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ReadStoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const story = await getSuccessStoryById(id);

  if (!story) {
    return {
      title: "Story Not Found",
      description: "The requested story could not be found.",
    };
  }

  return {
    title: `${story.title} | Mountain Expeditions Success Story`,
    description: story.description?.substring(0, 160) || `Read about ${story.title} adventure by ${story.userName} in ${story.mountainName}.`,
    openGraph: {
      title: story.title,
      description: story.description?.substring(0, 160),
      images: story.images?.length ? [story.images[0]] : [],
    },
  };
}

export default async function ReadStoryPage({ params }: ReadStoryPageProps) {
  const { id } = await params;
  const story = await getSuccessStoryById(id);

  if (!story) {
    notFound();
  }

  // Fetch related stories (excluding current)
  const allStories = await getSuccessStories(10);
  const relatedStories = allStories.filter(s => s.id !== id);

  // Format date
  const formatDate = (date: string | any) => {
    if (!date) return "Recent";
    // Handle Firestore timestamp if somehow still passed (fallback)
    if (date?.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Breadcrumbs
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Success Stories", url: "/read-stories" },
    { name: story.title, url: `/read-stories/${id}` },
  ];

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: story.title,
            description: story.description,
            image: story.images?.[0] || "",
            author: {
              "@type": "Person",
              name: story.userName,
            },
            datePublished: story.submittedAt || new Date().toISOString(),
            publisher: {
              "@type": "Organization",
              name: "Mountain Expeditions",
              logo: "/logo.png",
            },
          }),
        }}
      />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:py-12">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>

          {/* Breadcrumbs */}
          {/* <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.url} className="flex items-center gap-2">
                {index > 0 && <span className="text-slate-300">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-slate-900 font-medium truncate">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.url}
                    className="hover:text-teal-600 transition-colors"
                  >
                    {crumb.name}
                  </Link>
                )}
              </span>
            ))}
          </nav> */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Section */}
              <article className="bg-white rounded-2xl shadow-xl overflow-hidden sm:rounded-3xl">
                {/* Cover Image */}
                {story.images && story.images.length > 0 ? (
                  <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-teal-500 to-cyan-600">
                    <Image
                      src={story.images[0]}
                      alt={story.title}
                      fill
                      className="w-full h-full object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-teal-500 to-cyan-600">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Mountain className="h-20 w-20 text-white/80" />
                    </div>
                  </div>
                )}

                {/* Title Section */}
                <div className="p-6 sm:p-8">
                  {/* Title */}
                  <h1 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
                    {story.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Mountain className="h-4 w-4 text-teal-600" />
                      <span className="font-medium text-slate-700">{story.mountainName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-teal-600" />
                      <span>{story.userName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-teal-600" />
                      <span>{formatDate(story.submittedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-500" />
                      <span className="font-semibold text-amber-600">{story.rating}.0</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap">
                      {story.description}
                    </p>
                  </div>
                </div>
              </article>

              {/* Media Gallery */}
              {(story.images?.length > 0 || story.videoUrl) && (
                <StoryMediaGallery
                  images={story.images || []}
                  videoUrl={story.videoUrl}
                  title={story.title}
                />
              )}

              {/* Story Details Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Expedition Details */}
                <div className="bg-white rounded-2xl p-6 shadow-lg sm:rounded-3xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Mountain className="h-5 w-5 text-teal-600" />
                    <h3 className="text-lg font-bold text-slate-900">Expedition Details</h3>
                  </div>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Destination</dt>
                      <dd className="font-semibold text-slate-900">{story.mountainName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Traveler</dt>
                      <dd className="font-semibold text-slate-900">{story.userName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Rating</dt>
                      <dd className="font-semibold text-slate-900">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < story.rating ? "fill-amber-500" : "text-slate-300"
                              )}
                            />
                          ))}
                        </div>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Photos</dt>
                      <dd className="font-semibold text-slate-900">
                        {story.images?.length || 0} Photos
                      </dd>
                    </div>
                    {story.videoUrl && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Video</dt>
                        <dd className="font-semibold text-teal-600">Available</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Trust Badges */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-lg text-white sm:rounded-3xl">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-teal-400" />
                    <h3 className="text-lg font-bold">Verified Experience</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span>Verified submission</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span>{story.mountainName} expedition</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span>Approved by Mountain Expeditions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Share Section */}
              <ShareButtons
                title={story.title}
                description={story.description}
              />

              {/* Story CTA */}
              <StoryCTA />

              {/* Related Stories */}
              <RelatedStories currentStoryId={id} stories={allStories} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
