import GalleryMain from "@/components/gallery/gallery-main";
import { organizationSchema } from "@/seo/schemas";
import { generateGalleryMetadata } from "@/seo/metadata/gallery";
export const metadata = generateGalleryMetadata();
export default function GalleryPage() {
  return (
    <>
      {" "}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <GalleryMain />
    </>
  );
}
