import TouristPackagesMain from "@/components/tourist/tourist-main";
import { generateTouristMetadata } from "@/seo/metadata/tourist";
import { organizationSchema } from "@/seo/schemas";
export const metadata = generateTouristMetadata();
export default function TouristPackagesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <TouristPackagesMain />
    </>
  );
}
