import { Metadata } from "next";
import { SEOConfig, SITE_CONFIG, DEFAULT_SEO } from "./config";

// ==================== METADATA BUILDER ====================
export function buildMetadata(config: Partial<SEOConfig>): Metadata {
  const {
    title = DEFAULT_SEO.title,
    description = DEFAULT_SEO.description,
    keywords = DEFAULT_SEO.keywords,
    openGraph,
    twitter,
    alternates,
    robots = DEFAULT_SEO.robots,
    icons = DEFAULT_SEO.icons,
    manifest = DEFAULT_SEO.manifest,
    themeColor = DEFAULT_SEO.themeColor,
    appleWebApp = DEFAULT_SEO.appleWebApp,
  } = config;

  // Build canonical URL
  const canonicalUrl = alternates?.canonical
    ? buildUrl(alternates.canonical)
    : undefined;

  // Merge OpenGraph config with defaults
  const ogConfig = {
    ...DEFAULT_SEO.openGraph,
    ...openGraph,
    url: openGraph?.url ? buildUrl(openGraph.url) : canonicalUrl,
    images: openGraph?.images || DEFAULT_SEO.openGraph?.images,
  };

  // Merge Twitter config with defaults
  const twitterConfig = {
    ...DEFAULT_SEO.twitter,
    ...twitter,
  };

  return {
    title,
    description,
    keywords: keywords?.join(", "),

    openGraph: {
      title: ogConfig.title || title,
      description: ogConfig.description || description,
      type: ogConfig.type as any,
      url: ogConfig.url,
      siteName: ogConfig.siteName,
      images: ogConfig.images,
      locale: ogConfig.locale,
    },

    twitter: {
      card: twitterConfig.card,
      site: twitterConfig.site,
      creator: twitterConfig.creator,
      title: twitterConfig.title || title,
      description: twitterConfig.description || description,
      images: twitterConfig.images,
    },

    alternates: {
      canonical: canonicalUrl,
      languages: alternates?.languages,
    },

    robots,

    // Icons & Favicons
    icons,

    // PWA
    manifest,
    themeColor,
    appleWebApp: {
      capable: appleWebApp?.capable,
      title: appleWebApp?.title,
      statusBarStyle: appleWebApp?.statusBarStyle,
    },

    // Additional metadata
    metadataBase: new URL(SITE_CONFIG.url),
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,

    // Format detection
    formatDetection: {
      telephone: true,
      date: true,
      address: true,
      email: true,
    },
  };
}

// ==================== URL BUILDER ====================
export function buildUrl(path: string): string {
  // Remove trailing slash from base URL
  const baseUrl = SITE_CONFIG.url.replace(/\/$/, "");

  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

// ==================== IMAGE URL BUILDER ====================
export function buildImageUrl(imagePath: string): string {
  // If already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  return buildUrl(imagePath);
}

// ==================== TITLE FORMATTER ====================
export function formatPageTitle(
  pageTitle: string,
  includeSiteName = true
): string {
  if (!includeSiteName) {
    return pageTitle;
  }

  return `${pageTitle} | ${SITE_CONFIG.name}`;
}

// ==================== SLUG GENERATOR ====================
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// ==================== TRUNCATE TEXT ====================
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - 3).trim() + "...";
}

// ==================== VALIDATION ====================
export function validateSEOConfig(config: Partial<SEOConfig>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check title length
  if (config.title) {
    if (config.title.length < 10) {
      errors.push("Title should be at least 10 characters");
    }
    if (config.title.length > 60) {
      errors.push("Title should not exceed 60 characters");
    }
  }

  // Check description length
  if (config.description) {
    if (config.description.length < 50) {
      errors.push("Description should be at least 50 characters");
    }
    if (config.description.length > 160) {
      errors.push("Description should not exceed 160 characters");
    }
  }

  // Check keywords count
  if (config.keywords && config.keywords.length > 10) {
    errors.push("Should not exceed 10 keywords");
  }

  // Check OpenGraph images
  if (config.openGraph?.images) {
    config.openGraph.images.forEach((img, index) => {
      if (!img.url) {
        errors.push(`OpenGraph image ${index + 1} missing URL`);
      }
      // Recommended OG image size is 1200x630
      if (img.width && img.height) {
        const aspectRatio = img.width / img.height;
        if (Math.abs(aspectRatio - 1.91) > 0.1) {
          errors.push(
            `OpenGraph image ${
              index + 1
            } aspect ratio should be close to 1.91:1 (1200x630)`
          );
        }
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ==================== SCHEMA HELPERS ====================
export function stringifySchema(schema: any): string {
  return JSON.stringify(schema);
}

export function createSchemaScript(schema: any): string {
  return `<script type="application/ld+json">${stringifySchema(
    schema
  )}</script>`;
}

// ==================== MERGE CONFIGS ====================
export function mergeMetadata(
  base: Partial<SEOConfig>,
  override: Partial<SEOConfig>
): SEOConfig {
  return {
    title: override.title || base.title || DEFAULT_SEO.title,
    description:
      override.description || base.description || DEFAULT_SEO.description,
    keywords: override.keywords || base.keywords || DEFAULT_SEO.keywords,

    openGraph: {
      ...base.openGraph,
      ...override.openGraph,
    },

    twitter: {
      ...base.twitter,
      ...override.twitter,
    },

    alternates: {
      ...base.alternates,
      ...override.alternates,
    },

    robots: {
      ...base.robots,
      ...override.robots,
    },
  };
}

// ==================== EXTRACT KEYWORDS ====================
export function extractKeywords(text: string, count: number = 5): string[] {
  // Simple keyword extraction (in production, use a proper NLP library)
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 4); // Filter short words

  // Count word frequency
  const frequency: Record<string, number> = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Sort by frequency and get top keywords
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([word]) => word);
}
