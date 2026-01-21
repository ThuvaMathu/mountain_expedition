import { NextRequest, NextResponse } from "next/server";
import { checkChatContextRateLimit } from "@/lib/rate-limit";
import { getAllPackages } from "@/services/get-packages";
import { getContactDetails } from "@/services/get-contact";
import { getStats } from "@/services/get-stats";

// Simple cache for context (5 minute TTL)
const contextCache = new Map<string, { data: any; expiresAt: number }>();

/**
 * Extract IP address from request
 */
function getIpAddress(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || realIp || "unknown";
  return ip;
}

/**
 * GET /api/chat/context - Fetch context data for the AI
 * Returns packages, contact info, FAQs, and stats
 */
export async function GET(request: NextRequest) {
  try {
    const ipAddress = getIpAddress(request);

    // Rate limit
    const rateLimit = checkChatContextRateLimit(ipAddress);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please wait a moment.",
          error: "rate_limit_exceeded",
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    // Check cache
    const cached = contextCache.get("context");
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json({
        success: true,
        ...cached.data,
      });
    }

    // Fetch all data in parallel
    const [packages, contact, stats] = await Promise.all([
      getAllPackages(),
      getContactDetails(),
      getStats("landing").catch(() => null),
    ]);

    const contextData = {
      packages,
      contact,
      faqs: contact.faqs || [],
      stats: stats || undefined,
    };

    // Cache for 5 minutes
    contextCache.set("context", {
      data: contextData,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    return NextResponse.json({
      success: true,
      ...contextData,
    });

  } catch (error) {
    console.error("Context API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch context data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
