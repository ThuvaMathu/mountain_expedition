import { Metadata } from "next";
import { buildMetadata, buildUrl, buildImageUrl } from "../utils";
import { ROUTES } from "../config";

export function generateAboutMetadata(): Metadata {
  return buildMetadata({
    title: "About Us - Tamil Adventures | Expert Mountain Guides Since 2010",
    description:
      "Learn about Tamil Adventures - A trusted mountain trekking company with 10+ years of experience. Meet our expert guides, discover our safety protocols, and understand our commitment to sustainable adventure tourism.",

    keywords: [
      "about tamil adventures",
      "mountain guides tamil nadu",
      "trekking company chennai",
      "adventure tourism experts",
      "experienced trek leaders",
      "mountaineering professionals",
      "expedition team",
      "adventure company history",
    ],

    openGraph: {
      title:
        "About Tamil Adventures - Expert Mountain Guides & Expedition Leaders",
      description:
        "Trusted mountain trekking company with 10+ years of experience. Expert guides, safety-first approach, sustainable adventure tourism.",
      type: "website",
      url: buildUrl(ROUTES.ABOUT),
      images: [
        {
          url: buildImageUrl("/images/og-about.jpg"),
          width: 1200,
          height: 630,
          alt: "Tamil Adventures Team - Expert Mountain Guides",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "About Tamil Adventures - Expert Mountain Guides",
      description:
        "10+ years of experience. Expert guides, safety-first approach, sustainable adventure tourism.",
      images: [buildImageUrl("/images/og-about.jpg")],
    },

    alternates: {
      canonical: buildUrl(ROUTES.ABOUT),
    },
  });
}
