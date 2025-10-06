import { organizationSchema } from "@/seo/schemas";
import { generateTouristDomesticMetadata } from "@/seo/metadata/tourist-domestic";
import DomesticTouristMain from "@/components/tourist/tourist-domestic";
export const metadata = generateTouristDomesticMetadata();

export default function DomesticTouristPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <DomesticTouristMain />
    </>
  );
}
