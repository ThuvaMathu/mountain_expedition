import { Metadata } from "next";
import { buildMetadata, buildUrl, buildImageUrl, truncateText } from "../utils";
import { ROUTES } from "../config";

export interface BlogPostData {
  title: string;
  description: string;
  slug: string;
  author?: string;
  publishDate?: string;
  category?: string;
  image?: string;
  keywords?: string[];
}

export function generateBlogDetailMetadata(post: BlogPostData): Metadata {
  const postUrl = `${ROUTES.BLOG}/${post.slug}`;
  const postImage = post.image || "/images/og-blog-default.jpg";

  return buildMetadata({
    title: `${post.title} | Tamil Adventures Blog`,
    description: truncateText(post.description, 160),

    keywords: post.keywords || [
      "trekking blog",
      "mountain adventure",
      "expedition story",
      "hiking guide",
      post.category || "adventure",
    ],

    openGraph: {
      title: post.title,
      description: truncateText(post.description, 160),
      type: "article",
      url: buildUrl(postUrl),
      images: [
        {
          url: buildImageUrl(postImage),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: truncateText(post.description, 160),
      images: [buildImageUrl(postImage)],
    },

    alternates: {
      canonical: buildUrl(postUrl),
    },
  });
}
