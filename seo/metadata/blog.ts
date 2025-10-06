import { Metadata } from "next";
import { buildMetadata, buildUrl, buildImageUrl } from "../utils";
import { ROUTES } from "../config";

export function generateBlogMetadata(): Metadata {
  return buildMetadata({
    title:
      "Adventure Blog - Trekking Stories, Mountain Guides & Tips | Tamil Adventures",
    description:
      "Explore our adventure blog featuring trekking stories, mountain climbing guides, expedition tips, gear reviews, and insights from Tamil Nadu peaks and Himalayan adventures. Expert advice for adventurers.",

    keywords: [
      "trekking blog",
      "mountain adventure stories",
      "expedition guides",
      "hiking tips india",
      "mountaineering blog",
      "adventure travel blog",
      "trekking gear reviews",
      "mountain climbing tips",
      "tamil nadu trekking blog",
    ],

    openGraph: {
      title: "Tamil Adventures Blog - Trekking Stories & Mountain Guides",
      description:
        "Trekking stories, mountain guides, expedition tips, and gear reviews from expert mountaineers.",
      type: "website",
      url: buildUrl(ROUTES.BLOG),
      images: [
        {
          url: buildImageUrl("/images/og-blog.jpg"),
          width: 1200,
          height: 630,
          alt: "Tamil Adventures Blog - Mountain Stories & Guides",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Tamil Adventures Blog - Mountain Stories & Guides",
      description:
        "Trekking stories, expedition tips, and expert advice for mountain adventurers.",
      images: [buildImageUrl("/images/og-blog.jpg")],
    },

    alternates: {
      canonical: buildUrl(ROUTES.BLOG),
    },
  });
}
