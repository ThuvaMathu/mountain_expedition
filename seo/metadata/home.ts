import { Metadata } from "next";
import { buildMetadata, buildUrl, buildImageUrl } from "../utils";
import { ROUTES } from "../config";

export function generateHomeMetadata(): Metadata {
  return buildMetadata({
    title:
      "Tamil Adventures - Mountain Trekking & Expedition Company in Tamil Nadu",
    description:
      "Premier mountain trekking and expedition company specializing in Tamil Nadu peaks and Himalayan adventures. Expert guides, safety-first approach, unforgettable mountain experiences. Book your adventure today!",

    keywords: [
      "tamil nadu trekking",
      "mountain expeditions india",
      "himalayan adventures",
      "trekking tours chennai",
      "adventure tourism tamil nadu",
      "mountain climbing india",
      "expedition company",
      "guided treks",
      "adventure travel",
      "tamil nadu peaks",
    ],

    openGraph: {
      title: "Tamil Adventures - Your Gateway to Mountain Expeditions",
      description:
        "Premier mountain trekking and expedition company. Explore Tamil Nadu peaks and Himalayan adventures with expert guides.",
      type: "website",
      url: buildUrl(ROUTES.HOME),
      images: [
        {
          url: buildImageUrl("/images/og-home.jpg"),
          width: 1200,
          height: 630,
          alt: "Tamil Adventures - Mountain Trekking Expeditions",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Tamil Adventures - Mountain Trekking & Expeditions",
      description:
        "Premier mountain trekking company. Expert guides, safety-first approach, unforgettable experiences.",
      images: [buildImageUrl("/images/og-home.jpg")],
    },

    alternates: {
      canonical: buildUrl(ROUTES.HOME),
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  });
}
