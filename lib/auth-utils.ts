import { type NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "./firebase-admin";

/**
 * Extract Firebase ID token from Authorization header
 */
export function extractAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.substring(7); // Remove "Bearer " prefix
}

/**
 * Verify Firebase ID token and return decoded token
 * This ensures the request is from an authenticated user
 */
export async function verifyAuthToken(
  token: string
): Promise<import("firebase-admin/auth").DecodedIdToken | null> {
  try {
    const auth = getAuth(adminApp);
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Get user ID from request by verifying auth token
 * Returns null if token is invalid or missing
 */
export async function getUserIdFromRequest(
  request: NextRequest
): Promise<string | null> {
  const token = extractAuthToken(request);

  if (!token) {
    return null;
  }

  const decodedToken = await verifyAuthToken(token);
  return decodedToken?.uid || null;
}

/**
 * Extract client IP address from request
 * Useful for rate limiting and fraud detection
 */
export function getClientIp(request: NextRequest): string {
  // Check various headers that might contain the real IP
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip"); // Cloudflare

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return "unknown";
}

/**
 * Get user agent from request
 * Useful for fraud detection and analytics
 */
export function getUserAgent(request: NextRequest): string {
  return request.headers.get("user-agent") || "unknown";
}

/**
 * Create metadata object for storing with orders/bookings
 */
export function createRequestMetadata(request: NextRequest) {
  return {
    ipAddress: getClientIp(request),
    userAgent: getUserAgent(request),
    timestamp: new Date().toISOString(),
  };
}
