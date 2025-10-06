import { Metadata } from "next";
import { buildMetadata, buildUrl, buildImageUrl, truncateText } from "../utils";
import { ROUTES } from "../config";

export interface MountainData {
  id: string;
  name: string;
  description: string;
  altitude?: number;
  location?: string;
  difficulty?: string;
  duration?: string;
  image?: string;
  keywords?: string[];
}

export function generateMountainDetailMetadata(
  mountain: MountainData
): Metadata {
  const mountainUrl = `${ROUTES.MOUNTAINS}/${mountain.id}`;
  const mountainImage = mountain.image || "/images/og-mountain-default.jpg";

  const altitudeText = mountain.altitude ? ` (${mountain.altitude}m)` : "";
  const locationText = mountain.location ? ` in ${mountain.location}` : "";

  return buildMetadata({
    title: `${mountain.name} Trek${altitudeText} - Mountain Expedition | Tamil Adventures`,
    description: truncateText(
      `${mountain.description} ${
        mountain.difficulty ? `Difficulty: ${mountain.difficulty}.` : ""
      } ${
        mountain.duration ? `Duration: ${mountain.duration}.` : ""
      } Book your ${mountain.name} expedition with expert guides.`,
      160
    ),

    keywords: mountain.keywords || [
      `${mountain.name} trek`,
      `${mountain.name} expedition`,
      mountain.location || "mountain trekking",
      "mountain climbing",
      "guided trek",
      mountain.difficulty || "trekking",
    ],

    openGraph: {
      title: `${mountain.name} Trek - Mountain Expedition`,
      description: truncateText(mountain.description, 160),
      type: "website",
      url: buildUrl(mountainUrl),
      images: [
        {
          url: buildImageUrl(mountainImage),
          width: 1200,
          height: 630,
          alt: `${mountain.name} - Mountain Trekking Expedition`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${mountain.name} Trek${altitudeText}`,
      description: truncateText(mountain.description, 160),
      images: [buildImageUrl(mountainImage)],
    },

    alternates: {
      canonical: buildUrl(mountainUrl),
    },
  });
}
