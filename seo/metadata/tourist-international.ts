import { Metadata } from "next";
import { buildMetadata, buildUrl, buildImageUrl } from "../utils";
import { ROUTES } from "../config";

export function generateTouristInternationalMetadata(): Metadata {
  return buildMetadata({
    title: "International Tour Packages - Overseas Travel | Tamil Adventures",
    description:
      "Explore international tour packages to exciting destinations worldwide. Southeast Asia, Europe, Middle East, and more. Customized itineraries, visa assistance, expert travel planners for overseas adventures.",

    keywords: [
      "international tour packages",
      "overseas tour packages india",
      "international travel",
      "europe tour packages",
      "thailand tours",
      "dubai packages",
      "singapore tours",
      "bali packages",
      "international travel packages",
    ],

    openGraph: {
      title: "International Tour Packages - Overseas Travel",
      description:
        "International tour packages to exciting destinations worldwide. Southeast Asia, Europe, Middle East with expert planners.",
      type: "website",
      url: buildUrl(ROUTES.TOURIST_INTERNATIONAL),
      images: [
        {
          url: buildImageUrl("/og-international.jpg"),
          width: 1200,
          height: 630,
          alt: "International Tour Packages - Tamil Adventures",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "International Tour Packages - Overseas Travel",
      description:
        "International tour packages with expert planners. Visa assistance and customized itineraries.",
      images: [buildImageUrl("/og-international.jpg")],
    },

    alternates: {
      canonical: buildUrl(ROUTES.TOURIST_INTERNATIONAL),
    },
  });
}
