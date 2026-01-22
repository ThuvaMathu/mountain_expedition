import dynamicLoader from "next/dynamic";
import { getStats } from "@/services/get-stats";
import { getTestimonials } from "@/services/get-testimonials";
import { getSuccessStories } from "@/services/get-success-stories";
import HeroSection from "./HeroSection";
// Note: FloatingSocialMedia is now only rendered in layout.tsx via FloatingSocialMediaWrapper

// AI Chat Component
import { AIChatWidget } from "@/components/ai-bot";

// Lazy load below-the-fold components for better performance
const NextAdventure = dynamicLoader(() => import("./NextAdventure").then(mod => mod.NextAdventure));
const HeroAboutSection = dynamicLoader(() => import("./HeroAboutSection").then(mod => mod.HeroAboutSection));
const FeaturedMountains = dynamicLoader(() => import("./FeaturedMountains").then(mod => mod.FeaturedMountains));
const PosterCarousel = dynamicLoader(() => import("./PosterCarousel").then(mod => mod.default));
const SafetyGuarantees = dynamicLoader(() => import("./social-trust").then(mod => mod.SafetyGuarantees));
const SuccessStories = dynamicLoader(() => import("./social-trust").then(mod => mod.SuccessStories));
const Blog = dynamicLoader(() => import("./Blog").then(mod => mod.default));
const FAQSection = dynamicLoader(() => import("./social-trust").then(mod => mod.FAQSection));
const Instagram = dynamicLoader(() => import("./Instagram").then(mod => mod.default));

export const dynamic = "force-dynamic"; // Ensure dynamic rendering for contact details

export default async function HomePageV2() {
  const stats = await getStats("landing");
  const testimonials = await getTestimonials(5); // Get 5 testimonials for happy customers
  const successStories = await getSuccessStories(10); // Get success stories from Firebase

  return (
    <main className="min-h-screen">
      {/* Floating UI Components */}
      {/* Note: FloatingSocialMedia is now rendered in layout.tsx */}
      <AIChatWidget enabled={true} />

      {/* <LiveBookingIndicator enabled={true} startPosition="bottom-right" /> */}

      {/* Hero Section */}
      <HeroSection stats={stats} />

        {/* Trust Badge Bar - Instant Credibility */}
        {/* <TrustBadgeBar /> */}

        <div id="next-section">
          <HeroAboutSection />

          {/* Next Adventure + Featured Mountains */}
          <NextAdventure />
          <FeaturedMountains />
          <PosterCarousel />
          {/* <Destinations testimonials={testimonials} /> */}
          {/* <BookingSteps /> */}

          {/* Safety & Guarantees - Address Safety Concerns */}
          <SafetyGuarantees />


          {/* <MonthlyRecomendation testimonials={testimonials} /> */}
          {/* <TestimonialsCarousel /> */}

          {/* Success Stories - Real Expedition Results */}
          <SuccessStories stories={successStories} />

          <Blog />


          {/* Press & Media Coverage - Third Party Validation */}
          {/* <PressMediaSection /> */}

          {/* FAQ Section - Address Objections */}
          <FAQSection />
          <Instagram />
          {/* Comparison Table - Competitive Advantages */}
          {/* <ComparisonTable /> */}

        </div>
      </main>
    );
}

