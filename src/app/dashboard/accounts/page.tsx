import { AccountCard } from "@/app/dashboard/accounts/account-card";
import { AddAccountModal } from "@/app/dashboard/accounts/add-account-modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAccounts } from "@/db/queries/accounts";
import { cn, formatCurrency } from "@/lib/utils";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Wallet
} from "lucide-react";

// TODO: Replace with actual user authentication
const USER_ID = 1;

export default async function AccountsPage() {
  try {
    const accounts = await getAccounts(USER_ID);
    
    const assetAccounts = accounts.filter(a => a.category === "ASSET");
    const liabilityAccounts = accounts.filter(a => a.category === "LIABILITY");

    // Calculate totals with proper number handling
    const assets = assetAccounts.reduce((total, account) => total + Number(account.balance), 0);
    const liabilities = liabilityAccounts.reduce((total, account) => total + Number(account.balance), 0);
    const netWorth = assets - liabilities;

    return (
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold text-foreground">Financial Overview</h1>
            <p className="text-muted-foreground">Track your assets, liabilities, and net worth</p>
          </div>
          <AddAccountModal />
        </div>

        {/* Net Worth Summary Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2">
          <CardHeader className="text-center pb-3">
            <CardTitle className="text-2xl font-semibold flex items-center justify-center gap-2">
              <DollarSign className="h-8 w-8 text-blue-600" />
              Net Worth
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className={cn(
              "text-5xl font-bold mb-4",
              netWorth >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {formatCurrency(netWorth)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ArrowUpCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-700 dark:text-green-400">Total Assets</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(assets)}</div>
              </div>
              <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ArrowDownCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-700 dark:text-red-400">Total Liabilities</span>
                </div>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(liabilities)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assets Section */}
        {assetAccounts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-foreground">Assets</h2>
              <Badge variant="secondary" className="ml-2">
                {assetAccounts.length} {assetAccounts.length === 1 ? 'Account' : 'Accounts'}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assetAccounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          </div>
        )}

        {/* Liabilities Section */}
        {liabilityAccounts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-bold text-foreground">Liabilities</h2>
              <Badge variant="secondary" className="ml-2">
                {liabilityAccounts.length} {liabilityAccounts.length === 1 ? 'Account' : 'Accounts'}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liabilityAccounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {accounts.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Accounts Found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first account to track your finances.
              </p>
              <AddAccountModal />
            </CardContent>
          </Card>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading accounts:", error);
    return (
      <div className="container mx-auto p-6">
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-red-500 mb-4">
              <TrendingDown className="h-16 w-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Error Loading Accounts</h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading your accounts. Please refresh the page or try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}
