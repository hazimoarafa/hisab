import NetWorthChart from "@/components/dashboard/net-worth-chart"
import OverviewCards from "@/components/dashboard/overview-cards"
import RecentTransactions from "@/components/dashboard/recent-transactions"
import { getFinancialOverview, getNetWorthTrend } from "@/lib/queries/overview"
import { getRecentTransactions } from "@/lib/queries/transaction"

// For now, we'll use a hardcoded user ID. In a real app, this would come from authentication
const USER_ID = 1

async function getDashboardData() {
  try {
    const [overview, recentTransactions, netWorthData] = await Promise.all([
      getFinancialOverview(USER_ID),
      getRecentTransactions(USER_ID, 5),
      getNetWorthTrend(USER_ID)
    ])

    return {
      overview,
      recentTransactions,
      netWorthData
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    // Return default values if database is not set up
    return {
      overview: {
        totalAssets: 0,
        totalLiabilities: 0,
        netWorth: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        totalCashBalance: 0,
      },
      recentTransactions: [],
      netWorthData: []
    }
  }
}

export default async function Dashboard() {
  const { overview, recentTransactions, netWorthData } = await getDashboardData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your financial health and recent activity
        </p>
      </div>
      
      <OverviewCards {...overview} />
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <NetWorthChart data={netWorthData} />
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  )
}