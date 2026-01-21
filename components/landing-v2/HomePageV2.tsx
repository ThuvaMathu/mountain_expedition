import dynamicLoader from "next/dynamic";
import { generateHomeMetadata } from "@/seo/metadata/home";
import { organizationSchema } from "@/seo/schemas";
import { getContactDetails } from "@/services/get-contact";
import { getStats } from "@/services/get-stats";
import { getTestimonials } from "@/services/get-testimonials";
import { getSuccessStories } from "@/services/get-success-stories";
import HeroSection from "./HeroSection";
import { FloatingSocialMedia } from "@/components/ui/floating-social-media";

// Social Trust Components - Client Components
import { TrustBadgeBar } from "./social-trust";
import { StickyBookingCTA } from "./social-trust";
import { SafetyGuarantees } from "./social-trust";
import { SuccessStories } from "./social-trust";
import { FAQSection } from "./social-trust";
import { PressMediaSection } from "./social-trust";
import { LiveBookingIndicator } from "./social-trust";
import { ComparisonTable } from "./social-trust";

// AI Chat Component
import { AIChatWidget } from "@/components/ai-bot";

// Lazy load below-the-fold components for better performance
const NextAdventure = dynamicLoader(() => import("./NextAdventure").then(mod => mod.NextAdventure));
const HeroAboutSection = dynamicLoader(() => import("./HeroAboutSection").then(mod => mod.HeroAboutSection));
const FeaturedMountains = dynamicLoader(() => import("./FeaturedMountains").then(mod => mod.FeaturedMountains));
const BookingSteps = dynamicLoader(() => import("./BookingSteps").then(mod => mod.default));
const PosterCarousel = dynamicLoader(() => import("./PosterCarousel").then(mod => mod.default));
const Destinations = dynamicLoader(() => import("./Destinations").then(mod => mod.default));
const MonthlyRecomendation = dynamicLoader(() => import("./MonthlyRecomendation").then(mod => mod.default));
const TestimonialsCarousel = dynamicLoader(() => import("./TestimonialsSection").then(mod => mod.TestimonialsCarousel));
const Blog = dynamicLoader(() => import("./Blog").then(mod => mod.default));
const Instagram = dynamicLoader(() => import("./Instagram").then(mod => mod.default));
const Footer = dynamicLoader(() => import("./Footer").then(mod => mod.default));

export const metadata = generateHomeMetadata();

export const dynamic = "force-dynamic"; // Ensure dynamic rendering for contact details

export default async function HomePageV2() {
  const contactDetails = await getContactDetails();
  const stats = await getStats("landing");
  const testimonials = await getTestimonials(5); // Get 5 testimonials for happy customers
  const successStories = await getSuccessStories(10); // Get success stories from Firebase

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <main className="min-h-screen">
        {/* Floating UI Components */}
        <FloatingSocialMedia contactDetails={contactDetails} />
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

          {/* <Destinations testimonials={testimonials} /> */}
          <BookingSteps />

          {/* Safety & Guarantees - Address Safety Concerns */}
          <SafetyGuarantees />

          <PosterCarousel />
          <MonthlyRecomendation testimonials={testimonials} />
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
    </>
  );
}


