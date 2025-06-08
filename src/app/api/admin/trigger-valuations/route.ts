import { processMonthlyPropertyValuations, processValuationForSingleProperty } from "@/lib/valuation-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId, action = "all" } = body;
    
    console.log("🔧 Manual property valuation trigger initiated...");
    
    if (action === "single" && accountId) {
      // Process single property
      console.log(`Processing single property for account ID: ${accountId}`);
      const result = await processValuationForSingleProperty(accountId);
      
      return NextResponse.json({
        success: result.success,
        message: `Processed property valuation for account ${accountId}`,
        result: result
      });
      
    } else {
      // Process all properties
      console.log("Processing all properties...");
      const result = await processMonthlyPropertyValuations();
      
      return NextResponse.json({
        success: result.success,
        message: `Processed ${result.totalProcessed} properties: ${result.successCount} success, ${result.errorCount} errors`,
        results: result.results,
        summary: {
          totalProcessed: result.totalProcessed,
          successCount: result.successCount,
          errorCount: result.errorCount
        }
      });
    }
    
  } catch (error) {
    console.error("❌ Error in manual valuation trigger:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Property Valuation Admin Endpoint",
    usage: {
      "POST /api/admin/trigger-valuations": "Trigger valuations for all properties",
      "POST /api/admin/trigger-valuations with body { accountId: 123, action: 'single' }": "Trigger valuation for single property"
    }
  });
} 