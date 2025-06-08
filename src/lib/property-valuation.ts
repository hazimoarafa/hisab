export interface PropertyValuation {
  value: number;
  source: "appraisal" | "market_estimate" | "manual" | "purchase";
  date: Date;
  confidence?: number;
}

export interface PropertyAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
}

// Zillow API service (mapped to market_estimate)
export async function getZillowValuation(address: PropertyAddress): Promise<PropertyValuation | null> {
  try {
    // Note: Zillow has discontinued their public API, but this is the structure
    // You might need to use alternatives like RentSpotter or RapidAPI's real estate endpoints
    
    const addressString = `${address.addressLine1}, ${address.city}, ${address.stateProvince} ${address.postalCode}`;
    
    // For demo purposes, I'll simulate an API call
    // In production, replace with actual API call
    const mockResponse = await simulateAPICall('zillow', addressString);
    
    if (mockResponse?.value) {
      return {
        value: mockResponse.value,
        source: 'market_estimate', // Map to existing enum
        date: new Date(),
        confidence: mockResponse.confidence
      };
    }
    
    return null;
  } catch (error) {
    console.error('Zillow API error:', error);
    return null;
  }
}

// Realtor.com API service (mapped to appraisal)
export async function getRealtorValuation(address: PropertyAddress): Promise<PropertyValuation | null> {
  try {
    const addressString = `${address.addressLine1}, ${address.city}, ${address.stateProvince} ${address.postalCode}`;
    
    // For demo purposes, I'll simulate an API call
    // In production, replace with actual API call to Realtor.com or RapidAPI
    const mockResponse = await simulateAPICall('realtor', addressString);
    
    if (mockResponse?.value) {
      return {
        value: mockResponse.value,
        source: 'appraisal', // Map to existing enum
        date: new Date(),
        confidence: mockResponse.confidence
      };
    }
    
    return null;
  } catch (error) {
    console.error('Realtor API error:', error);
    return null;
  }
}

// RentSpotter API service (mapped to market_estimate for variety)
export async function getRentSpotterValuation(address: PropertyAddress): Promise<PropertyValuation | null> {
  try {
    const addressString = `${address.addressLine1}, ${address.city}, ${address.stateProvince} ${address.postalCode}`;
    
    // For demo purposes, I'll simulate an API call
    // In production, replace with actual API call
    const mockResponse = await simulateAPICall('rentspotter', addressString);
    
    if (mockResponse?.value) {
      return {
        value: mockResponse.value,
        source: 'market_estimate', // Map to existing enum
        date: new Date(),
        confidence: mockResponse.confidence
      };
    }
    
    return null;
  } catch (error) {
    console.error('RentSpotter API error:', error);
    return null;
  }
}

// Calculate average valuation from multiple sources
export function calculateAverageValuation(valuations: PropertyValuation[]): PropertyValuation | null {
  if (valuations.length === 0) return null;
  
  const validValueations = valuations.filter(v => v.value > 0);
  if (validValueations.length === 0) return null;
  
  // Simple average - you could implement weighted average based on confidence
  const averageValue = validValueations.reduce((sum, v) => sum + v.value, 0) / validValueations.length;
  
  return {
    value: Math.round(averageValue),
    source: 'market_estimate', // Use market_estimate for averaged values
    date: new Date(),
    confidence: validValueations.reduce((sum, v) => sum + (v.confidence || 0.8), 0) / validValueations.length
  };
}

// Get all valuations for a property
export async function getPropertyValuations(address: PropertyAddress): Promise<{
  individual: PropertyValuation[];
  average: PropertyValuation | null;
}> {
  console.log(`Fetching valuations for: ${address.addressLine1}, ${address.city}, ${address.stateProvince}`);
  
  // Fetch from all sources in parallel
  const [zillowValuation, realtorValuation, rentSpotterValuation] = await Promise.all([
    getZillowValuation(address),
    getRealtorValuation(address),
    getRentSpotterValuation(address)
  ]);
  
  const individual = [zillowValuation, realtorValuation, rentSpotterValuation].filter(Boolean) as PropertyValuation[];
  const average = calculateAverageValuation(individual);
  
  return { individual, average };
}

// Mock API simulation for demo purposes
// In production, replace with actual API calls
async function simulateAPICall(source: string, address: string): Promise<{ value: number; confidence: number } | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
  
  // Generate realistic property values based on location
  const baseValue = getBaseValueByLocation(address);
  const variance = 0.1; // 10% variance between sources
  
  // Simulate some API failures
  if (Math.random() < 0.05) { // 5% failure rate
    throw new Error(`${source} API temporarily unavailable`);
  }
  
  // Generate value with some variance
  const multiplier = 1 + (Math.random() - 0.5) * variance * 2;
  const value = Math.round(baseValue * multiplier);
  
  return {
    value,
    confidence: 0.7 + Math.random() * 0.3 // 70-100% confidence
  };
}

function getBaseValueByLocation(address: string): number {
  // Simple heuristic based on location keywords
  const lowerAddress = address.toLowerCase();
  
  if (lowerAddress.includes('new york') || lowerAddress.includes('san francisco') || lowerAddress.includes('los angeles')) {
    return 800000 + Math.random() * 1200000; // $800k - $2M
  } else if (lowerAddress.includes('texas') || lowerAddress.includes('florida') || lowerAddress.includes('arizona')) {
    return 300000 + Math.random() * 500000; // $300k - $800k
  } else if (lowerAddress.includes('chicago') || lowerAddress.includes('boston') || lowerAddress.includes('seattle')) {
    return 500000 + Math.random() * 700000; // $500k - $1.2M
  } else {
    return 250000 + Math.random() * 400000; // $250k - $650k
  }
} 