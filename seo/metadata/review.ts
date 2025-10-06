import { Metadata } from "next";
import { buildMetadata, buildUrl, buildImageUrl } from "../utils";
import { ROUTES } from "../config";

export function generateReviewMetadata(): Metadata {
  return buildMetadata({
    title:
      "Customer Reviews & Testimonials - Mountain Trekking | Tamil Adventures",
    description:
      "Read genuine reviews and testimonials from our trekkers. Discover why adventurers choose Tamil Adventures for mountain expeditions. Real experiences, ratings, and feedback from satisfied customers.",

    keywords: [
      "tamil adventures reviews",
      "trekking company reviews",
      "mountain expedition testimonials",
      "customer feedback",
      "adventure tour reviews",
      "trekking testimonials india",
      "mountaineering reviews",
      "expedition company ratings",
    ],

    openGraph: {
      title: "Customer Reviews & Testimonials - Tamil Adventures",
      description:
        "Read genuine reviews from our trekkers. Real experiences and feedback from satisfied customers.",
      type: "website",
      url: buildUrl(ROUTES.REVIEW),
      images: [
        {
          url: buildImageUrl("/images/og-reviews.jpg"),
          width: 1200,
          height: 630,
          alt: "Tamil Adventures Customer Reviews & Testimonials",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Customer Reviews - Tamil Adventures",
      description:
        "Genuine reviews and testimonials from our trekkers. Real mountain adventure experiences.",
      images: [buildImageUrl("/images/og-reviews.jpg")],
    },

    alternates: {
      canonical: buildUrl(ROUTES.REVIEW),
    },
  });
}
