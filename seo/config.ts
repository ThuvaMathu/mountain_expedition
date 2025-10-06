import { Metadata } from "next";

// ==================== TYPES ====================
export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: OpenGraphConfig;
  twitter?: TwitterConfig;
  alternates?: AlternatesConfig;
  robots?: RobotsConfig;
  icons?: IconsConfig;
  manifest?: string;
  themeColor?: string;
  appleWebApp?: AppleWebAppConfig;
}

export interface IconsConfig {
  icon?: string | IconDescriptor[];
  shortcut?: string;
  apple?: string | IconDescriptor[];
  other?: IconDescriptor[];
}

export interface IconDescriptor {
  url: string;
  sizes?: string;
  type?: string;
}

export interface AppleWebAppConfig {
  capable?: boolean;
  title?: string;
  statusBarStyle?: "default" | "black" | "black-translucent";
}

export interface OpenGraphConfig {
  title?: string;
  description?: string;
  type?: string;
  url?: string;
  siteName?: string;
  images?: OpenGraphImage[];
  locale?: string;
}

export interface OpenGraphImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface TwitterConfig {
  card?: "summary" | "summary_large_image" | "app" | "player";
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  images?: string[];
}

export interface AlternatesConfig {
  canonical?: string;
  languages?: Record<string, string>;
}

export interface RobotsConfig {
  index?: boolean;
  follow?: boolean;
  googleBot?: {
    index?: boolean;
    follow?: boolean;
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// ==================== COMPANY INFO ====================
export const COMPANY_INFO = {
  name: "Tamil Adventures",
  legalName: "Tamil Adventure Trekking Club",
  tagline: "Your Gateway to Mountain Expeditions",
  description:
    "Premier mountain trekking and expedition company specializing in Tamil Nadu peaks and Himalayan adventures. Expert guides, safety-first approach, unforgettable experiences.",

  contact: {
    email: "info@tamiladventures.com",
    phone: "+91 98765 43210",
    emergencyPhone: "+91 98765 43211",
    address: "123 Adventure Street, Chennai, Tamil Nadu 600001, India",
  },

  location: {
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "600001",
    coordinates: {
      latitude: 13.0827,
      longitude: 80.2707,
    },
  },

  hours: {
    weekday: "9:00 AM - 6:00 PM",
    saturday: "9:00 AM - 4:00 PM",
    sunday: "Closed",
  },

  social: {
    facebook: "https://facebook.com/tamiladventures",
    instagram: "https://instagram.com/tamiladventures",
    twitter: "https://twitter.com/tamiladventures",
    youtube: "https://youtube.com/@tamiladventures",
    linkedin: "https://linkedin.com/company/tamiladventures",
  },
} as const;

// ==================== DEFAULT SEO CONFIG ====================
export const DEFAULT_SEO: SEOConfig = {
  title: `${COMPANY_INFO.name} - ${COMPANY_INFO.tagline}`,
  description: COMPANY_INFO.description,
  keywords: [
    "tamil nadu trekking",
    "mountain expeditions india",
    "himalayan adventures",
    "trekking tours chennai",
    "adventure tourism tamil nadu",
    "mountain climbing india",
    "expedition company",
    "guided treks",
    "adventure travel",
  ],

  openGraph: {
    type: "website",
    siteName: COMPANY_INFO.name,
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${COMPANY_INFO.name} - Mountain Expeditions`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@tamiladventures",
    creator: "@tamiladventures",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  // Icons & Favicons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [{ url: "/safari-pinned-tab.svg", type: "image/svg+xml" }],
  },

  // PWA Settings
  manifest: "/manifest.json",
  themeColor: "#0d9488", // Teal brand color

  appleWebApp: {
    capable: true,
    title: COMPANY_INFO.name,
    statusBarStyle: "default",
  },
};

// ==================== SITE CONFIG ====================
export const SITE_CONFIG = {
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://tamiladventuretrekkingclub.com",
  name: COMPANY_INFO.name,
  locale: "en_IN",
  defaultImage: "/og-image.jpg",
  twitterHandle: "@tamiladventures",
} as const;

// ==================== ROUTE NAMES ====================
export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  BLOG: "/blog",
  BOOKING: "/booking",
  CONTACT: "/contact",
  GALLERY: "/gallery",
  MOUNTAINS: "/mountains",
  TOURIST: "/tourist",
  TOURIST_DOMESTIC: "/tourist/domestic",
  TOURIST_INTERNATIONAL: "/tourist/international",
  REVIEW: "/review",
  DASHBOARD: "/dashboard",
} as const;
