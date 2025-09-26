import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedMountains } from "@/components/home/FeaturedMountains";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TestimonialsCarousel } from "@/components/home/TestimonialsSection";
import { StatsSection } from "@/components/home/StatsSection";
import { getStats } from "@/services/get-stats";
import { defaultStats } from "@/services/default-values";
export default async function HomePage() {
  let stats: TStat[] = [];

  try {
    stats = await getStats();
    console.log("stats:", stats);
  } catch (error) {
    console.error("Failed to load stats:", error);
    // Use default stats
    stats = defaultStats.map((stat) => ({
      title: stat.title,
      value: stat.value,
      description: stat.description,
    }));
  }
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection stats={stats} />
        <FeaturedMountains />
        <WhyChooseUs />
        <StatsSection stats={stats} />
        <TestimonialsCarousel />
      </main>
      <Footer />
    </div>
  );
}
