import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "@/components/ui/toast";
import { ToastContainer, toast } from "react-toastify";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { buildMetadata } from "@/seo/utils";
import { defaultViewport } from "@/seo/viewport";
import { getContactDetails } from "@/services/get-contact";
import { StickyBookingCTA } from "@/components/landing-v2/social-trust";
import { AIChatWrapper } from "@/components/ai-bot/AIChatWrapper";

const inter = Inter({ subsets: ["latin"] });

const isDevelopment = process.env.NEXT_PUBLIC_ENVIRONMENT !== "production";

export const dynamic = "force-dynamic";
export const viewport = defaultViewport;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://tamiladventuretrekkingclub.com"
  ),
  title: "Tamil Adventure Treckking Club - Global Mountain Expedition Booking",
  description:
    "Book your next mountain adventure with Tamil Adventure Treckking Club. Explore the Seven Summits, Himalayas, and Indian peaks with expert guides.",
  keywords:
    "mountain climbing, expedition booking, Seven Summits, Himalayas, trekking, adventure travel",
  openGraph: {
    title:
      "Tamil Adventure Treckking Club - Global Mountain Expedition Booking",
    description:
      "Book your next mountain adventure with Tamil Adventure Treckking Club",
    images: ["/images/hero-mountain.jpg"],
  },
  generator: "v0.app",
  robots: isDevelopment
    ? {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    }
    : undefined,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contactDetails = await getContactDetails();
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            <div className="relative min-h-screen bg-gray-50">
              <Navbar
              />
              <StickyBookingCTA
                whatsappNumber={contactDetails?.socialMedia?.whatsapp?.replace(/\D/g, "") || "919876543210"}
                phoneNumber={contactDetails?.phone || "+919876543210"}
                offerText="Limited: 15% Off Season Bookings"
              />
              {children}
              <Footer />
              <AIChatWrapper />
            </div>
            <Toaster />
          </LanguageProvider>
        </AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        //transition={""}
        />
      </body>
    </html>
  );
}
