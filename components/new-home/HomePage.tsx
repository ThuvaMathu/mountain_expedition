import dynamicLoader from "next/dynamic";
import { generateHomeMetadata } from "@/seo/metadata/home";
import { organizationSchema } from "@/seo/schemas";
import { getContactDetails } from "@/services/get-contact";
import Hero from "@/components/new-home/Hero";
import { FloatingSocialMedia } from "@/components/ui/floating-social-media";

// Lazy load below-the-fold components for better performance
const HeroAboutSection = dynamicLoader(() => import("@/components/new-home/HeroAboutSection").then(mod => mod.HeroAboutSection));
const FeaturedMountains = dynamicLoader(() => import("@/components/new-home/FeaturedMountains").then(mod => mod.FeaturedMountains));
const BookingSteps = dynamicLoader(() => import("@/components/new-home/BookingSteps").then(mod => mod.default));
const PosterCarousel = dynamicLoader(() => import("@/components/home/PosterCarousel").then(mod => mod.default));
const Destinations = dynamicLoader(() => import("@/components/new-home/Destinations").then(mod => mod.default));
const About = dynamicLoader(() => import("@/components/new-home/About").then(mod => mod.default));
const TestimonialsCarousel = dynamicLoader(() => import("@/components/home/TestimonialsSection").then(mod => mod.TestimonialsCarousel));
const Video = dynamicLoader(() => import("@/components/new-home/Video").then(mod => mod.default));
const Stats = dynamicLoader(() => import("@/components/new-home/Stats").then(mod => mod.default));
const Blog = dynamicLoader(() => import("@/components/new-home/Blog").then(mod => mod.default));
const Instagram = dynamicLoader(() => import("@/components/new-home/Instagram").then(mod => mod.default));
const Footer = dynamicLoader(() => import("@/components/new-home/Footer").then(mod => mod.default));

export const metadata = generateHomeMetadata();

export const dynamic = "force-dynamic"; // Ensure dynamic rendering for contact details

export default async function HomePageV1() {
  const contactDetails = await getContactDetails();

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
        <Hero />
        <HeroAboutSection />
        <FeaturedMountains />
        <BookingSteps />
        <PosterCarousel />
        <Destinations />
        <About />
        <TestimonialsCarousel />
        <Video />
        <Stats />
        <Blog />
        <Instagram />
        <Footer contactDetails={contactDetails} />
      </main>
    </>
  );
}
