import { organizationSchema } from "@/seo/schemas";
import InternationalTouristMain from "@/components/tourist/tourist-international";
export default function InternationalTouristPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <InternationalTouristMain />
    </>
  );
}
