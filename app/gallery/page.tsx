import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import GalleryMain from "@/components/gallery/gallery-main";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <GalleryMain />
      <Footer />
    </div>
  );
}
