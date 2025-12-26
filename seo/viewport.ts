import { Viewport } from "next";
import { DEFAULT_SEO } from "./config";

// ==================== VIEWPORT CONFIGURATION ====================
export const defaultViewport: Viewport = {
  themeColor: DEFAULT_SEO.themeColor || "#0d9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "light",
};

// ==================== VIEWPORT BUILDER ====================
export function buildViewport(overrides?: Partial<Viewport>): Viewport {
  return {
    ...defaultViewport,
    ...overrides,
  };
}
