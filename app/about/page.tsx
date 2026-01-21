import { localBusinessSchema, organizationSchema } from "@/seo/schemas";
import { generateAboutMetadata } from "@/seo/metadata/about";
import { AboutPageContent } from "@/components/about/AboutPageContent";

export const metadata = generateAboutMetadata();

export default function AboutPage() {
  return (
    <>
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      <AboutPageContent />
    </>
  );
}
