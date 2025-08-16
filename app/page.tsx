import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedMountains } from '@/components/home/FeaturedMountains'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { StatsSection } from '@/components/home/StatsSection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedMountains />
        <WhyChooseUs />
        <StatsSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}
