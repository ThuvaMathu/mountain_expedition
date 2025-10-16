import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coming Soon - Tamil Adventure Trekking Club",
  description:
    "Something epic is coming! Tamil Adventure Trekking Club is preparing an extraordinary platform for mountain enthusiasts. Be the first to know when we launch.",
  keywords:
    "mountain climbing, expedition booking, adventure travel, trekking, coming soon",
  openGraph: {
    title: "Coming Soon - Tamil Adventure Trekking Club",
    description:
      "Get ready for epic adventures. Tamil Adventure Trekking Club launching soon!",
    images: ["/images/hero-mountain.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
