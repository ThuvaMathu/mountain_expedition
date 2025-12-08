/**
 * Checkout page constants and configuration
 */

export const CHECKOUT_CONFIG = {
  DEFAULT_COUNTRY: "India",
  RAZORPAY_THEME_COLOR: "#0d9488",
  COMPANY_NAME: "Tamil Adventure Trekking Club",
  CURRENCIES: ["USD", "INR"] as const,
  DATE_FORMAT_OPTIONS: {
    day: "numeric",
    month: "short",
    year: "numeric",
  } as const,
} as const;

export const CHECKOUT_MESSAGES = {
  RAZORPAY_LOAD_ERROR: "Razorpay SDK failed to load. Please try again.",
  PAYMENT_VERIFICATION_FAILED:
    "Payment verification failed. Please contact support.",
  FORM_INCOMPLETE: "Please fix all form errors before proceeding",
  MOUNTAIN_LOAD_ERROR: "Error loading mountain details",
  TERMS_NOT_ACCEPTED:
    "Please acknowledge that you have read and agree to our Terms and Conditions.",
  LOGIN_REQUIRED: "Please log in to continue",
  PAYMENT_FAILED: "Payment failed. Please try again.",
} as const;

export const TERMS_CONDITIONS = [
  {
    id: "tcs1",
    label:
      "I agree to the expedition terms and conditions, including cancellation policy",
  },
  {
    id: "tcs2",
    label:
      "I understand the risks involved in mountaineering and have appropriate insurance",
  },
  {
    id: "tcs3",
    label:
      "I consent to receive booking confirmations and expedition updates via email",
  },
] as const;
