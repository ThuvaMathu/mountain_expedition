import { generateReviewMetadata } from "@/seo/metadata/review";
import { organizationSchema } from "@/seo/schemas";
import ReviewMain from "@/components/contact/review";
export const metadata = generateReviewMetadata();
export default function ReviewPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <ReviewMain />
    </>
  );
}
