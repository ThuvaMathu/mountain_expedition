import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://dev.tamiladventuretrekkingclub.com";

  if (isProduction) {
    // Production: Allow all bots to crawl
    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/dashboard/", "/api/"],
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  } else {
    // Development/Staging: Block all bots
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }
}
