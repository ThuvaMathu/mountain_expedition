import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "@/components/ui/toast";
import { ToastContainer, toast } from "react-toastify";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Summit Quest - Global Mountain Expedition Booking",
  description:
    "Book your next mountain adventure with Summit Quest. Explore the Seven Summits, Himalayas, and Indian peaks with expert guides.",
  keywords:
    "mountain climbing, expedition booking, Seven Summits, Himalayas, trekking, adventure travel",
  openGraph: {
    title: "Summit Quest - Global Mountain Expedition Booking",
    description: "Book your next mountain adventure with Summit Quest",
    images: ["/images/hero-mountain.jpg"],
  },
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            {children}
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
