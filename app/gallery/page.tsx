import GalleryMain from "@/components/gallery/gallery-main";
import { organizationSchema } from "@/seo/schemas";
import { generateGalleryMetadata } from "@/seo/metadata/gallery";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
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
