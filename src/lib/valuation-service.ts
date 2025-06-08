"use server";
import {
  getAllRealEstateAccountsWithProperties,
  getLatestAutomatedValuation,
  savePropertyValuation
} from "@/db/queries/valuations";
import { getPropertyValuations, PropertyAddress } from "./property-valuation";

export interface ValuationResult {
  accountId: number;
  accountName: string;
  address: string;
  previousValue?: number;
  newValue: number;
  valuationCount: number;
  success: boolean;
  error?: string;
}

export async function processMonthlyPropertyValuations(): Promise<{
  success: boolean;
  results: ValuationResult[];
  totalProcessed: number;
  successCount: number;
  errorCount: number;
}> {
  console.log("Starting monthly property valuation process...");
  
  try {
    // Get all real estate accounts with their properties
    const realEstateAccounts = await getAllRealEstateAccountsWithProperties();
    console.log(`Found ${realEstateAccounts.length} real estate accounts to process`);
    
    const results: ValuationResult[] = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (const account of realEstateAccounts) {
      try {
        console.log(`Processing valuations for account: ${account.accountName} (ID: ${account.accountId})`);
        
        // Get previous valuation for comparison
        const previousValuation = await getLatestAutomatedValuation(account.accountId);
        
        // Prepare address for API calls
        const address: PropertyAddress = {
          addressLine1: account.property.addressLine1,
          addressLine2: account.property.addressLine2 || undefined,
          city: account.property.city,
          stateProvince: account.property.stateProvince,
          postalCode: account.property.postalCode,
          country: account.property.country,
        };
        
        // Skip if auto-valuation is disabled for this property
        if (!account.property.autoValuationEnabled) {
          console.log(`Skipping ${account.accountName} - auto-valuation disabled`);
          results.push({
            accountId: account.accountId,
            accountName: account.accountName,
            address: `${address.addressLine1}, ${address.city}, ${address.stateProvince}`,
            previousValue: previousValuation ? Number(previousValuation.value) : undefined,
            newValue: 0,
            valuationCount: 0,
            success: false,
            error: "Auto-valuation disabled"
          });
          continue;
        }
        
        // Fetch valuations from all sources
        const { individual, average } = await getPropertyValuations(address);
        
        // Save individual valuations to database
        for (const valuation of individual) {
          await savePropertyValuation(account.accountId, valuation);
        }
        
        // Save average valuation if we have any data
        if (average) {
          await savePropertyValuation(account.accountId, average);
          
          results.push({
            accountId: account.accountId,
            accountName: account.accountName,
            address: `${address.addressLine1}, ${address.city}, ${address.stateProvince}`,
            previousValue: previousValuation ? Number(previousValuation.value) : undefined,
            newValue: average.value,
            valuationCount: individual.length,
            success: true
          });
          
          successCount++;
          console.log(`✓ Successfully processed ${account.accountName}: $${average.value.toLocaleString()}`);
        } else {
          results.push({
            accountId: account.accountId,
            accountName: account.accountName,
            address: `${address.addressLine1}, ${address.city}, ${address.stateProvince}`,
            previousValue: previousValuation ? Number(previousValuation.value) : undefined,
            newValue: 0,
            valuationCount: 0,
            success: false,
            error: "No valuations available from any source"
          });
          
          errorCount++;
          console.log(`✗ Failed to get valuations for ${account.accountName}`);
        }
        
      } catch (error) {
        console.error(`Error processing account ${account.accountName}:`, error);
        
        results.push({
          accountId: account.accountId,
          accountName: account.accountName,
          address: `${account.property.addressLine1}, ${account.property.city}`,
          previousValue: undefined,
          newValue: 0,
          valuationCount: 0,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        });
        
        errorCount++;
      }
      
      // Add a small delay between properties to be respectful to APIs
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`Monthly valuation process completed: ${successCount} success, ${errorCount} errors`);
    
    return {
      success: true,
      results,
      totalProcessed: realEstateAccounts.length,
      successCount,
      errorCount
    };
    
  } catch (error) {
    console.error("Error in monthly property valuation process:", error);
    return {
      success: false,
      results: [],
      totalProcessed: 0,
      successCount: 0,
      errorCount: 1
    };
  }
}

export async function processValuationForSingleProperty(accountId: number): Promise<ValuationResult> {
  try {
    const realEstateAccounts = await getAllRealEstateAccountsWithProperties();
    const account = realEstateAccounts.find(acc => acc.accountId === accountId);
    
    if (!account) {
      throw new Error("Real estate account not found");
    }
    
    const previousValuation = await getLatestAutomatedValuation(accountId);
    
    const address: PropertyAddress = {
      addressLine1: account.property.addressLine1,
      addressLine2: account.property.addressLine2 || undefined,
      city: account.property.city,
      stateProvince: account.property.stateProvince,
      postalCode: account.property.postalCode,
      country: account.property.country,
    };
    
    const { individual, average } = await getPropertyValuations(address);
    
    for (const valuation of individual) {
      await savePropertyValuation(accountId, valuation);
    }
    
    if (average) {
      await savePropertyValuation(accountId, average);
    }
    
    return {
      accountId,
      accountName: account.accountName,
      address: `${address.addressLine1}, ${address.city}, ${address.stateProvince}`,
      previousValue: previousValuation ? Number(previousValuation.value) : undefined,
      newValue: average?.value || 0,
      valuationCount: individual.length,
      success: !!average
    };
    
  } catch (error) {
    throw new Error(`Failed to process valuation: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
} 