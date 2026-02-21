import dynamicLoader from "next/dynamic";
import { getStats } from "@/services/get-stats";
import { getTestimonials } from "@/services/get-testimonials";
import { getSuccessStories } from "@/services/get-success-stories";
import {
  SkeletonNextAdventure,
  SkeletonFeaturedMountains,
  SkeletonPosterCarousel,
  SkeletonBlog,
  SkeletonSection
} from "./LoadingSkeletons";
// Note: FloatingSocialMedia and AIChatWidget are now rendered in layout.tsx via DeferredLayoutWrappers

// Lazy load below-the-fold components for better performance with loading states
const NextAdventure = dynamicLoader(() => import("./NextAdventure").then(mod => mod.NextAdventure), {
  loading: () => <SkeletonNextAdventure />
});
import { HeroAboutSection } from "./HeroAboutSection";
const FeaturedMountains = dynamicLoader(() => import("./FeaturedMountains").then(mod => mod.FeaturedMountains), {
  loading: () => <SkeletonFeaturedMountains />
});
const PosterCarousel = dynamicLoader(() => import("./PosterCarousel").then(mod => mod.default), {
  loading: () => <SkeletonPosterCarousel />
});
const SuccessStories = dynamicLoader(() => import("./social-trust").then(mod => mod.SuccessStories), {
  loading: () => <SkeletonSection />
});
const Blog = dynamicLoader(() => import("./Blog").then(mod => mod.default), {
  loading: () => <SkeletonBlog />
});
const FAQSection = dynamicLoader(() => import("./social-trust").then(mod => mod.FAQSection), {
  loading: () => <SkeletonSection />
});
const Instagram = dynamicLoader(() => import("./Instagram").then(mod => mod.default), {
  loading: () => <SkeletonSection />
});

// Enable ISR - Components will be statically generated at build time and revalidated
export const revalidate = 300; // 5 minutes

export default async function HomePageV2() {
  // Parallel data fetching for faster performance
  const [stats, testimonials, successStories] = await Promise.all([
    getStats("landing"),
    getTestimonials(5), // Get 5 testimonials for happy customers
    getSuccessStories(10) // Get success stories from Firebase
  ]);

  return (
    <main className="min-h-screen">
      {/* Muthamilselvi Highlighted at Top */}
      <HeroAboutSection />

      <div id="next-section">
        {/* Next Adventure + Featured Mountains */}
        <NextAdventure />
        <FeaturedMountains />
        <PosterCarousel />
        {/* Success Stories - Real Expedition Results */}
        <SuccessStories stories={successStories} />
        <Blog />
        {/* FAQ Section - Address Objections */}
        <FAQSection />
        <Instagram />
      </div>
    </main>
  );
}

