import { Metadata } from "next";
import { buildMetadata, buildUrl, buildImageUrl } from "../utils";
import { ROUTES } from "../config";

export function generateTouristMetadata(): Metadata {
  return buildMetadata({
    title:
      "Tourist Packages - Domestic & International Tours | Tamil Adventures",
    description:
      "Explore our curated tourist packages for domestic and international destinations. Customized tours, adventure packages, cultural experiences, and guided expeditions with expert travel planners.",

    keywords: [
      "tourist packages india",
      "domestic tour packages",
      "international tours",
      "adventure tourism",
      "customized tours",
      "travel packages",
      "guided tours india",
      "holiday packages",
      "adventure tour packages",
    ],

    openGraph: {
      title: "Tourist Packages - Domestic & International Tours",
      description:
        "Curated tourist packages for domestic and international destinations. Adventure packages and cultural experiences.",
      type: "website",
      url: buildUrl(ROUTES.TOURIST),
      images: [
        {
          url: buildImageUrl("/images/og-tourist.jpg"),
          width: 1200,
          height: 630,
          alt: "Tourist Packages - Tamil Adventures",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Tourist Packages - Domestic & International Tours",
      description:
        "Curated tourist packages with expert travel planners. Adventure and cultural experiences.",
      images: [buildImageUrl("/images/og-tourist.jpg")],
    },

    alternates: {
      canonical: buildUrl(ROUTES.TOURIST),
    },
  });
}
