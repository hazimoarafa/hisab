import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import {
	ArrowDownIcon,
	ArrowUpIcon,
	Building,
	CreditCard,
	TrendingUp,
	Wallet
} from "lucide-react"

interface OverviewCardsProps {
  totalAssets: number
  totalLiabilities: number
  netWorth: number
  monthlyIncome: number
  monthlyExpenses: number
  totalCashBalance: number
}

export default function OverviewCards({
  totalAssets,
  totalLiabilities,
  netWorth,
  monthlyIncome,
  monthlyExpenses,
  totalCashBalance,
}: OverviewCardsProps) {
  const netWorthChange = 5.2 // This would come from calculations
  const cashFlowChange = -2.1 // This would come from calculations
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(netWorth)}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {netWorthChange > 0 ? (
              <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
            )}
            <span className={netWorthChange > 0 ? "text-green-500" : "text-red-500"}>
              {Math.abs(netWorthChange)}%
            </span>
            <span className="ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalAssets)}</div>
          <p className="text-xs text-muted-foreground">
            Investments, cash, and property
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalLiabilities)}</div>
          <p className="text-xs text-muted-foreground">
            Loans, mortgages, and debt
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalCashBalance)}</div>
          <p className="text-xs text-muted-foreground">
            Checking and savings accounts
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(monthlyIncome)}</div>
          <p className="text-xs text-muted-foreground">
            Average monthly income
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(monthlyExpenses)}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {cashFlowChange > 0 ? (
              <ArrowUpIcon className="mr-1 h-3 w-3 text-red-500" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3 w-3 text-green-500" />
            )}
            <span className={cashFlowChange > 0 ? "text-red-500" : "text-green-500"}>
              {Math.abs(cashFlowChange)}%
            </span>
            <span className="ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 