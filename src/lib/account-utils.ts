import { accountType, assetAccountType, liabilityAccountType } from "@/db/schema";

// Get display name for account type
export function getAccountTypeDisplayName(type: typeof accountType.enumValues[number]): string {
  const displayNames: {[K in typeof accountType.enumValues[number]]: string} = {
    'CHECKING': 'Checking Account',
    'SAVINGS': 'Savings Account',
    'MONEY_MARKET': 'Money Market Account',
    'CD': 'Certificate of Deposit',
    'INVESTMENT': 'Investment Account',
    'REAL_ESTATE': 'Real Estate',
    'VEHICLE': 'Vehicle',
    'OTHER_ASSET': 'Other Asset',
    'CREDIT_CARD': 'Credit Card',
    'MORTGAGE': 'Mortgage',
    'AUTO_LOAN': 'Auto Loan',
    'LEASE': 'Lease',
    'STUDENT_LOAN': 'Student Loan',
    'PERSONAL_LOAN': 'Personal Loan',
    'LINE_OF_CREDIT': 'Line of Credit',
    'OTHER_LIABILITY': 'Other Liability'
  };
  
  return displayNames[type] || type;
}

// Determine if an account type is an asset
export function isAssetAccountType(type: typeof accountType.enumValues[number]): boolean {
  return assetAccountType.enumValues.includes(type as any);
}

// Determine if an account type is a liability
export function isLiabilityAccountType(type: typeof accountType.enumValues[number]): boolean {
  return liabilityAccountType.enumValues.includes(type as any);
}

// Get the general category for an account type
export function getAccountCategory(type: typeof accountType.enumValues[number]): "ASSET" | "LIABILITY" {
  return isAssetAccountType(type) ? "ASSET" : "LIABILITY";
}