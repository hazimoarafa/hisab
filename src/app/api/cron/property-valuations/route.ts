import { NextRequest, NextResponse } from "next/server";

// This API route will be called by the cron job
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  
  // If you have a CRON_SECRET environment variable, verify it
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// Allow GET requests for manual testing
export async function GET(request: NextRequest) {
  // This endpoint can be used for manual testing
  return POST(request);
} 