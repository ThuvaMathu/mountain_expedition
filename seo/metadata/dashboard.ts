import { Metadata } from "next";
import { buildMetadata, buildUrl } from "../utils";
import { ROUTES } from "../config";

export function generateDashboardMetadata(): Metadata {
  return buildMetadata({
    title: "My Dashboard - Manage Bookings & Profile | Tamil Adventures",
    description:
      "Access your Tamil Adventures dashboard to manage bookings, view expedition history, update profile, track upcoming treks, and communicate with our expedition team.",

    keywords: [
      "user dashboard",
      "manage bookings",
      "expedition history",
      "trek bookings",
      "user profile",
      "booking management",
    ],

    openGraph: {
      title: "My Dashboard - Tamil Adventures",
      description:
        "Manage your bookings, view expedition history, and update your profile.",
      type: "website",
      url: buildUrl(ROUTES.DASHBOARD),
    },

    twitter: {
      card: "summary",
      title: "My Dashboard - Tamil Adventures",
      description: "Manage your bookings and expedition history.",
    },

    alternates: {
      canonical: buildUrl(ROUTES.DASHBOARD),
    },

    robots: {
      index: false, // Dashboard pages should not be indexed
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  });
}
