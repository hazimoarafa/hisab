import { Account } from "@/db/schema";
import { Bitcoin, Briefcase, Building, Car, CreditCard, DollarSign, Home, LandPlot, PiggyBank, Wallet } from "lucide-react";

export const accountTypeDisplayNames: Record<Account["type"], string> = {
  'CHECKING': 'Checking Account',
  'SAVINGS': 'Savings Account',
  'CRYPTO': 'Crypto Account',
  'REAL_ESTATE': 'Real Estate',
  'VEHICLE': 'Vehicle',
  'OTHER_ASSET': 'Other Asset', 
  'CREDIT_CARD': 'Credit Card',
  'MORTGAGE': 'Mortgage',
  'AUTO_LOAN': 'Auto Loan',
  'LEASE': 'Lease',
  'OTHER_LIABILITY': 'Other Liability'
}

export const accountIcons: Record<Account["type"], React.ReactNode> = {
  CHECKING: <Wallet className="h-5 w-5" />,
  SAVINGS: <PiggyBank className="h-5 w-5" />,
  CRYPTO: <Bitcoin className="h-5 w-5" />,
  REAL_ESTATE: <LandPlot className="h-5 w-5" />,
  VEHICLE: <Car className="h-5 w-5" />,
  OTHER_ASSET: <Briefcase className="h-5 w-5" />,
  CREDIT_CARD: <CreditCard className="h-5 w-5" />,
  MORTGAGE: <Home className="h-5 w-5" />,
  AUTO_LOAN: <Car className="h-5 w-5" />,
  LEASE: <Building className="h-5 w-5" />,
  OTHER_LIABILITY: <DollarSign className="h-5 w-5" />,
};
