/**
 * Firebase collection names and constants
 */

export const FIREBASE_COLLECTIONS = {
  ORDERS: "orders",
  BOOKINGS: "bookings",
  SETTINGS: "settings",
  MOUNTAINS: "mountains",
  TOURIST_PACKAGES: "tourist-packages",
} as const;

export type FirebaseCollection =
  (typeof FIREBASE_COLLECTIONS)[keyof typeof FIREBASE_COLLECTIONS];
