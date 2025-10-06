import { COMPANY_INFO, SITE_CONFIG, BreadcrumbItem } from "./config";

// ==================== ORGANIZATION SCHEMA ====================
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: COMPANY_INFO.legalName,
  alternateName: COMPANY_INFO.name,
  description: COMPANY_INFO.description,
  url: SITE_CONFIG.url,
  logo: `${SITE_CONFIG.url}/logo.png`,
  image: `${SITE_CONFIG.url}/images/og-image.jpg`,

  contactPoint: {
    "@type": "ContactPoint",
    telephone: COMPANY_INFO.contact.phone,
    contactType: "Customer Service",
    email: COMPANY_INFO.contact.email,
    availableLanguage: ["English", "Tamil"],
    areaServed: "IN",
  },

  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY_INFO.contact.address.split(",")[0],
    addressLocality: COMPANY_INFO.location.city,
    addressRegion: COMPANY_INFO.location.state,
    postalCode: COMPANY_INFO.location.postalCode,
    addressCountry: COMPANY_INFO.location.country,
  },

  geo: {
    "@type": "GeoCoordinates",
    latitude: COMPANY_INFO.location.coordinates.latitude,
    longitude: COMPANY_INFO.location.coordinates.longitude,
  },

  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "16:00",
    },
  ],

  sameAs: [
    COMPANY_INFO.social.facebook,
    COMPANY_INFO.social.instagram,
    COMPANY_INFO.social.twitter,
    COMPANY_INFO.social.youtube,
    COMPANY_INFO.social.linkedin,
  ],

  priceRange: "₹₹-₹₹₹",
  areaServed: {
    "@type": "Country",
    name: "India",
  },
};

// ==================== BREADCRUMB SCHEMA ====================
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

// ==================== FAQ SCHEMA ====================
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ==================== TOURIST ATTRACTION SCHEMA ====================
export interface TouristAttractionData {
  name: string;
  description: string;
  image: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviewCount?: number;
}

export function generateTouristAttractionSchema(data: TouristAttractionData) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: data.name,
    description: data.description,
    image: data.image,
    ...(data.address && {
      address: {
        "@type": "PostalAddress",
        addressLocality: data.address,
        addressCountry: "India",
      },
    }),
    ...(data.latitude &&
      data.longitude && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: data.latitude,
          longitude: data.longitude,
        },
      }),
    ...(data.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: data.rating,
        reviewCount: data.reviewCount || 0,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

// ==================== TOUR PACKAGE SCHEMA ====================
export interface TourPackageData {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  duration: string;
  startDate?: string;
  endDate?: string;
  location: string;
  provider?: string;
}

export function generateTourPackageSchema(data: TourPackageData) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: data.name,
    description: data.description,
    image: data.image,
    touristType: "Adventure Seekers",

    offers: {
      "@type": "Offer",
      price: data.price,
      priceCurrency: data.currency || "INR",
      availability: "https://schema.org/InStock",
      validFrom: data.startDate || new Date().toISOString(),
      ...(data.endDate && { validThrough: data.endDate }),
      seller: {
        "@type": "Organization",
        name: data.provider || COMPANY_INFO.name,
      },
    },

    itinerary: {
      "@type": "ItemList",
      name: `${data.name} Itinerary`,
      description: `${data.duration} expedition to ${data.location}`,
    },

    provider: {
      "@type": "Organization",
      name: data.provider || COMPANY_INFO.name,
      url: SITE_CONFIG.url,
    },
  };
}

// ==================== BLOG ARTICLE SCHEMA ====================
export interface BlogArticleData {
  title: string;
  description: string;
  author: string;
  publishDate: string;
  modifiedDate?: string;
  image: string;
  url: string;
  keywords?: string[];
}

export function generateBlogArticleSchema(data: BlogArticleData) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description,
    image: data.image,
    datePublished: data.publishDate,
    dateModified: data.modifiedDate || data.publishDate,
    author: {
      "@type": "Person",
      name: data.author,
    },
    publisher: {
      "@type": "Organization",
      name: COMPANY_INFO.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": data.url,
    },
    ...(data.keywords && { keywords: data.keywords.join(", ") }),
  };
}

// ==================== REVIEW SCHEMA ====================
export interface ReviewData {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  itemReviewed: string;
}

export function generateReviewSchema(data: ReviewData) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: data.author,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: data.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: data.reviewBody,
    datePublished: data.datePublished,
    itemReviewed: {
      "@type": "Service",
      name: data.itemReviewed,
      provider: {
        "@type": "Organization",
        name: COMPANY_INFO.name,
      },
    },
  };
}

// ==================== LOCAL BUSINESS SCHEMA ====================
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": SITE_CONFIG.url,
  name: COMPANY_INFO.name,
  description: COMPANY_INFO.description,
  url: SITE_CONFIG.url,
  telephone: COMPANY_INFO.contact.phone,
  email: COMPANY_INFO.contact.email,

  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY_INFO.contact.address.split(",")[0],
    addressLocality: COMPANY_INFO.location.city,
    addressRegion: COMPANY_INFO.location.state,
    postalCode: COMPANY_INFO.location.postalCode,
    addressCountry: COMPANY_INFO.location.country,
  },

  geo: {
    "@type": "GeoCoordinates",
    latitude: COMPANY_INFO.location.coordinates.latitude,
    longitude: COMPANY_INFO.location.coordinates.longitude,
  },

  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "16:00",
    },
  ],

  image: `${SITE_CONFIG.url}/images/og-image.jpg`,
  priceRange: "₹₹-₹₹₹",
};
