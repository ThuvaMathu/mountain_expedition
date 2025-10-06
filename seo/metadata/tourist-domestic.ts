import { Metadata } from "next";
import { buildMetadata, buildUrl, buildImageUrl } from "../utils";
import { ROUTES } from "../config";

export function generateTouristDomesticMetadata(): Metadata {
  return buildMetadata({
    title: "Domestic Tour Packages - India Travel | Tamil Adventures",
    description:
      "Explore curated domestic tour packages across India. Discover Tamil Nadu, Kerala, Himalayan destinations, and more with expert guides. Customized itineraries, affordable pricing, unforgettable experiences.",

    keywords: [
      "domestic tour packages india",
      "india travel packages",
      "tamil nadu tours",
      "kerala tour packages",
      "himalayan tours",
      "india adventure tours",
      "domestic tourism",
      "guided tours india",
      "holiday packages india",
    ],

    openGraph: {
      title: "Domestic Tour Packages - Explore India",
      description:
        "Curated domestic tour packages across India. Tamil Nadu, Kerala, Himalayas, and more with expert guides.",
      type: "website",
      url: buildUrl(ROUTES.TOURIST_DOMESTIC),
      images: [
        {
          url: buildImageUrl("/og-domestic.jpg"),
          width: 1200,
          height: 630,
          alt: "Domestic Tour Packages - Tamil Adventures",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Domestic Tour Packages - Explore India",
      description:
        "Curated domestic tour packages with expert guides. Tamil Nadu, Kerala, Himalayas and more.",
      images: [buildImageUrl("/og-domestic.jpg")],
    },

    alternates: {
      canonical: buildUrl(ROUTES.TOURIST_DOMESTIC),
    },
  });
}
