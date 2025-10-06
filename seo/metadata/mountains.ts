import { Metadata } from "next";
import { buildMetadata, buildUrl, buildImageUrl } from "../utils";
import { ROUTES } from "../config";

export function generateMountainsMetadata(): Metadata {
  return buildMetadata({
    title: "Mountains & Peaks - Trekking Destinations | Tamil Adventures",
    description:
      "Explore our curated list of mountains and peaks for trekking expeditions. Discover Tamil Nadu peaks, Himalayan mountains, and adventure destinations with detailed information, difficulty levels, and expedition guides.",

    keywords: [
      "mountains tamil nadu",
      "trekking peaks india",
      "himalayan mountains",
      "mountain destinations",
      "trekking mountains",
      "peak climbing india",
      "mountain expedition destinations",
      "tamil nadu peaks list",
      "mountaineering destinations",
    ],

    openGraph: {
      title: "Mountains & Peaks - Trekking Destinations | Tamil Adventures",
      description:
        "Explore curated mountains and peaks for trekking. Tamil Nadu peaks, Himalayan mountains, difficulty levels, and guides.",
      type: "website",
      url: buildUrl(ROUTES.MOUNTAINS),
      images: [
        {
          url: buildImageUrl("/images/og-mountains.jpg"),
          width: 1200,
          height: 630,
          alt: "Mountains & Peaks - Tamil Adventures Trekking Destinations",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Mountains & Peaks - Trekking Destinations",
      description:
        "Explore curated mountains for trekking. Tamil Nadu peaks and Himalayan mountains.",
      images: [buildImageUrl("/images/og-mountains.jpg")],
    },

    alternates: {
      canonical: buildUrl(ROUTES.MOUNTAINS),
    },
  });
}
