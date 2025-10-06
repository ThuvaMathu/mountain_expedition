import { Metadata } from "next";
import { buildMetadata, buildUrl, buildImageUrl } from "../utils";
import { ROUTES } from "../config";

export function generateBookingMetadata(): Metadata {
  return buildMetadata({
    title: "Book Your Trek - Mountain Expedition Booking | Tamil Adventures",
    description:
      "Book your mountain trekking expedition with Tamil Adventures. Easy online booking, flexible dates, expert guides, and all-inclusive packages. Secure your spot for Tamil Nadu peaks and Himalayan adventures today!",

    keywords: [
      "book trekking expedition",
      "mountain trek booking",
      "adventure tour booking",
      "expedition reservation",
      "trek booking online",
      "mountain climbing booking",
      "adventure package booking",
      "guided trek reservation",
    ],

    openGraph: {
      title: "Book Your Mountain Trek - Tamil Adventures",
      description:
        "Book your mountain expedition with expert guides. Easy online booking, flexible dates, all-inclusive packages.",
      type: "website",
      url: buildUrl(ROUTES.BOOKING),
      images: [
        {
          url: buildImageUrl("/images/og-booking.jpg"),
          width: 1200,
          height: 630,
          alt: "Book Mountain Trek - Tamil Adventures",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Book Your Mountain Trek - Tamil Adventures",
      description:
        "Easy online booking, expert guides, all-inclusive packages. Secure your adventure today!",
      images: [buildImageUrl("/images/og-booking.jpg")],
    },

    alternates: {
      canonical: buildUrl(ROUTES.BOOKING),
    },

    robots: {
      index: true,
      follow: true,
    },
  });
}
