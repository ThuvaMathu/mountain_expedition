import { Metadata } from "next";
import { buildMetadata, buildUrl, buildImageUrl } from "../utils";
import { ROUTES, COMPANY_INFO } from "../config";

export function generateContactMetadata(): Metadata {
  return buildMetadata({
    title: "Contact Us - Get in Touch | Tamil Adventures Trekking Company",
    description: `Contact Tamil Adventures for mountain trekking inquiries. Call ${COMPANY_INFO.contact.phone} or visit our office in ${COMPANY_INFO.location.city}. Expert expedition consultants ready to help plan your adventure.`,

    keywords: [
      "contact tamil adventures",
      "trekking inquiry",
      "expedition consultation",
      "mountain trek inquiry",
      "adventure tour contact",
      "chennai trekking company",
      "mountain guide contact",
      "expedition booking inquiry",
    ],

    openGraph: {
      title: "Contact Tamil Adventures - Mountain Trekking Inquiry",
      description:
        "Get in touch with our expedition experts. Plan your mountain adventure with personalized consultation.",
      type: "website",
      url: buildUrl(ROUTES.CONTACT),
      images: [
        {
          url: buildImageUrl("/images/og-contact.jpg"),
          width: 1200,
          height: 630,
          alt: "Contact Tamil Adventures",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Contact Tamil Adventures",
      description:
        "Get in touch with our expedition experts. Plan your mountain adventure today!",
      images: [buildImageUrl("/images/og-contact.jpg")],
    },

    alternates: {
      canonical: buildUrl(ROUTES.CONTACT),
    },
  });
}
