import { Metadata } from "next";
import { buildMetadata, buildUrl, buildImageUrl } from "../utils";
import { ROUTES } from "../config";

export function generateGalleryMetadata(): Metadata {
  return buildMetadata({
    title: "Photo Gallery - Mountain Trekking Adventures | Tamil Adventures",
    description:
      "Explore stunning photos from our mountain expeditions across Tamil Nadu peaks and Himalayan adventures. Browse expedition galleries, summit photos, and breathtaking mountain landscapes captured by our trekkers.",

    keywords: [
      "mountain trekking photos",
      "expedition gallery",
      "himalayan photos",
      "tamil nadu peaks photos",
      "summit photos",
      "mountain photography",
      "trekking gallery",
      "adventure photos india",
      "mountaineering pictures",
    ],

    openGraph: {
      title: "Mountain Trekking Photo Gallery - Tamil Adventures",
      description:
        "Stunning photos from mountain expeditions. Summit photos, landscapes, and adventure moments.",
      type: "website",
      url: buildUrl(ROUTES.GALLERY),
      images: [
        {
          url: buildImageUrl("/images/og-gallery.jpg"),
          width: 1200,
          height: 630,
          alt: "Tamil Adventures Photo Gallery - Mountain Expeditions",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Mountain Trekking Photo Gallery - Tamil Adventures",
      description:
        "Stunning photos from mountain expeditions. Summit photos and breathtaking landscapes.",
      images: [buildImageUrl("/images/og-gallery.jpg")],
    },

    alternates: {
      canonical: buildUrl(ROUTES.GALLERY),
    },
  });
}
