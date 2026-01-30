import { generateHomeMetadata } from "@/seo/metadata/home";
import { organizationSchema } from "@/seo/schemas";
import HomePageV2 from "@/components/home/HomePageV2";

// Lazy load below-the-fold components for better performance

export const metadata = generateHomeMetadata();

// Enable ISR - Page will be statically generated at build time and revalidated every 5 minutes
export const revalidate = 300; // 5 minutes

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
