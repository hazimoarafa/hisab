import { NextRequest, NextResponse } from "next/server";
import { processMonthlyPropertyValuations } from "@/lib/valuation-service";

// This API route will be called by the cron job
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from an authorized source
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    // If you have a CRON_SECRET environment variable, verify it
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    console.log("🏠 Starting monthly property valuation cron job...");
    const startTime = Date.now();
    
    // Process all property valuations
    const result = await processMonthlyPropertyValuations();
    
    const duration = Date.now() - startTime;
    
    // Log summary
    console.log(`✅ Monthly property valuation cron job completed in ${duration}ms`);
    console.log(`📊 Summary: ${result.successCount} success, ${result.errorCount} errors out of ${result.totalProcessed} properties`);
    
    // Return detailed results
    return NextResponse.json({
      success: result.success,
      message: `Processed ${result.totalProcessed} properties: ${result.successCount} success, ${result.errorCount} errors`,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      results: result.results,
      summary: {
        totalProcessed: result.totalProcessed,
        successCount: result.successCount,
        errorCount: result.errorCount
      }
    });
    
  } catch (error) {
    console.error("❌ Error in property valuation cron job:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Allow GET requests for manual testing
export async function GET(request: NextRequest) {
  // This endpoint can be used for manual testing
  return POST(request);
} 