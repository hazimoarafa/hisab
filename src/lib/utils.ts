import { accountType } from "@/db/schema";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num)
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}