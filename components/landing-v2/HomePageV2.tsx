import dynamicLoader from "next/dynamic";
import { generateHomeMetadata } from "@/seo/metadata/home";
import { organizationSchema } from "@/seo/schemas";
import { getContactDetails } from "@/services/get-contact";
import { getStats } from "@/services/get-stats";
import { getTestimonials } from "@/services/get-testimonials";
import HeroSection from "./HeroSection";
import { FloatingSocialMedia } from "@/components/ui/floating-social-media";

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <main className="min-h-screen">
        <FloatingSocialMedia contactDetails={contactDetails} />
        <HeroSection stats={stats} />
        <div id="next-section">

          <HeroAboutSection />
          <NextAdventure /> <FeaturedMountains />
          <Destinations testimonials={testimonials} />
          <BookingSteps />
          <PosterCarousel />

          <MonthlyRecomendation testimonials={testimonials} />
          <TestimonialsCarousel />
          <Blog />
          <Instagram />
          <Footer contactDetails={contactDetails} />
        </div>
      </main>
    </>
  );
}


