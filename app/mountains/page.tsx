import { organizationSchema } from "@/seo/schemas";
import MountainsMain from "@/components/mountains/MountainsMain";
import { generateMountainsMetadata } from "@/seo/metadata/mountains";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
export const metadata = generateMountainsMetadata();
export default function MountainsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <MountainsMain />
    </>
  );
}
