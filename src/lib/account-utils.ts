import { accountType } from "@/db/schema";

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