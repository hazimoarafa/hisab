import NetWorthChart from "@/components/dashboard/net-worth-chart"
import OverviewCards from "@/components/dashboard/overview-cards"
import RecentTransactions from "@/components/dashboard/recent-transactions"

// Mock data - in a real app, this would come from your database
const mockFinancialData = {
  totalAssets: 230000,
  totalLiabilities: 55000,
  netWorth: 175000,
  monthlyIncome: 8500,
  monthlyExpenses: 4200,
  totalCashBalance: 25000,
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your financial health and recent activity
        </p>
      </div>
      
      <OverviewCards {...mockFinancialData} />
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <NetWorthChart />
        <RecentTransactions />
      </div>
    </div>
  )
}