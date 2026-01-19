import { generateHomeMetadata } from "@/seo/metadata/home";
import { organizationSchema } from "@/seo/schemas";
import HomePageV2 from "@/components/landing-v2/HomePageV2";
import HomePageV1 from "@/components/new-home/HomePage";

// Lazy load below-the-fold components for better performance

export const metadata = generateHomeMetadata();

export const dynamic = "force-dynamic"; // Ensure dynamic rendering for contact details

export default async function HomePage() {

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <main className="min-h-screen">
        <HomePageV2 />
      </main>
    </>
  );
}
