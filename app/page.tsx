import dynamicLoader from "next/dynamic";
import { getStats } from "@/services/get-stats";
import { defaultStats } from "@/services/default-values";
import { generateHomeMetadata } from "@/seo/metadata/home";
import { organizationSchema } from "@/seo/schemas";
import ComingSoonPage from "./sandbox/page";
import { HeroSection } from "@/components/home/HeroSection";
import { ExploreSection } from "@/components/home/ExploreSection";
import { AdventureHero } from "@/components/home/AdventureHero";
import { Navbar } from "@/components/layout/Navbar";

// Lazy load below-the-fold components
const FeaturedMountains = dynamicLoader(() => import("@/components/home/FeaturedMountains").then(mod => mod.FeaturedMountains));
const WhyChooseUs = dynamicLoader(() => import("@/components/home/WhyChooseUs").then(mod => mod.WhyChooseUs));
const HeroAboutSection = dynamicLoader(() => import("@/components/home/HeroAboutSection").then(mod => mod.HeroAboutSection));
const AwardsSection = dynamicLoader(() => import("@/components/home/AwardsSection").then(mod => mod.AwardsSection));
const HomeBlogSection = dynamicLoader(() => import("@/components/home/HomeBlogSection").then(mod => mod.HomeBlogSection));
const VideoGallerySection = dynamicLoader(() => import("@/components/home/VideoGallerySection").then(mod => mod.VideoGallerySection));
const TestimonialsCarousel = dynamicLoader(() => import("@/components/home/TestimonialsSection").then(mod => mod.TestimonialsCarousel));
const PosterCarousel = dynamicLoader(() => import("@/components/home/PosterCarousel"));
const Footer = dynamicLoader(() => import("@/components/layout/Footer").then(mod => mod.Footer));
export const metadata = generateHomeMetadata();

export const dynamic = "force-dynamic"; // Ensure dynamic rendering for stats/awards

const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === "production";

export default async function HomePage() {
  let stats: TStat[] = [];

  try {
    stats = await getStats("landing");
    //console.log("stats:", stats);
  } catch (error) {
    console.error("Failed to load stats:", error);
    // Use default stats
    stats = defaultStats.landing.map((stat) => ({
      title: stat.title,
      value: stat.value,
      description: stat.description,
    }));
  }

  // Render based on environment
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <div className="min-h-screen">
        {/* For now, show coming soon page regardless of environment */}
        {/* <ComingSoonPage /> */}

        {/* Uncomment when ready to launch in production */}
        {isProduction ? (
          <>
            <main>
              <HeroSection stats={stats} />
              <ExploreSection />
              <FeaturedMountains />
              <WhyChooseUs />
              <HeroAboutSection />
              <AwardsSection />
              <VideoGallerySection />
              <TestimonialsCarousel /><PosterCarousel />
              <HomeBlogSection />
              <AdventureHero />
            </main>
          </>
        ) : (
          <ComingSoonPage />
        )}
      </div>
    </>
  );
}
