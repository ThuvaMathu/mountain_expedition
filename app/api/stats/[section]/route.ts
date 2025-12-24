import { NextRequest, NextResponse } from "next/server";
import { getStats } from "@/services/get-stats";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    
    // Validate section
    const validSections = ["landing", "international", "domestic", "gallery"];
    if (!validSections.includes(section)) {
      return NextResponse.json(
        { error: "Invalid section" },
        { status: 400 }
      );
    }

    const stats = await getStats(section as "landing" | "international" | "domestic" | "gallery");
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
