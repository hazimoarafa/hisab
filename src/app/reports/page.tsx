"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getFinancialOverview, getNetWorthTrend, getUserAssets, getUserTransactions } from "@/lib/queries"
import { formatCurrency } from "@/lib/utils"
import {
    BarChart3,
    Calendar,
    DollarSign,
    Download,
    TrendingUp
} from "lucide-react"
import { useEffect, useState } from 'react'
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'

// For now, we'll use a hardcoded user ID. In a real app, this would come from authentication
const USER_ID = 1

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#0088fe', '#ff0000']

interface ReportsData {
  overview: {
    totalAssets: number
    totalLiabilities: number
    netWorth: number
    monthlyIncome: number
    monthlyExpenses: number
    totalCashBalance: number
  }
  assets: Array<{
    id: number
    name: string
    type: 'stocks' | 'bonds' | 'real_estate' | 'vehicle' | 'crypto'
    value: string
  }>
  transactions: Array<{
    id: number
    amount: string
    date: string
    type: 'income' | 'expense' | 'transfer'
    accountName: string | null
  }>
  netWorthTrend: Array<{
    month: string
    netWorth: number
    assets: number
    liabilities: number
  }>
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [overview, assets, transactions, netWorthTrend] = await Promise.all([
          getFinancialOverview(USER_ID),
          getUserAssets(USER_ID),
          getUserTransactions(USER_ID, { limit: 100 }),
          getNetWorthTrend(USER_ID)
        ])

        setData({
          overview,
          assets,
          transactions,
          netWorthTrend
        })
      } catch (error) {
        console.error('Error fetching reports data:', error)
        // Set empty data on error
        setData({
          overview: {
            totalAssets: 0,
            totalLiabilities: 0,
            netWorth: 0,
            monthlyIncome: 0,
            monthlyExpenses: 0,
            totalCashBalance: 0
          },
          assets: [],
          transactions: [],
          netWorthTrend: []
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
            <p className="text-muted-foreground">Loading financial data...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return <div>Error loading data</div>
  }

  // Calculate derived metrics
  const currentNetWorth = data.netWorthTrend.length > 0 
    ? data.netWorthTrend[data.netWorthTrend.length - 1].netWorth 
    : data.overview.netWorth

  const previousNetWorth = data.netWorthTrend.length > 1 
    ? data.netWorthTrend[data.netWorthTrend.length - 2].netWorth 
    : currentNetWorth

  const netWorthChange = previousNetWorth !== 0 
    ? ((currentNetWorth - previousNetWorth) / previousNetWorth) * 100 
    : 0

  // Process asset allocation data
  const assetAllocationData = data.assets.reduce((acc, asset) => {
    const type = asset.type
    const existing = acc.find(item => item.name === type)
    if (existing) {
      existing.value += Number(asset.value)
    } else {
      acc.push({
        name: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: Number(asset.value)
      })
    }
    return acc
  }, [] as Array<{ name: string; value: number }>)

  // Process income vs expenses data (simplified for demo)
  const totalIncome = data.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpenses = Math.abs(data.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0))

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  // Create sample spending categories (in a real app, you'd categorize transactions)
  const categorySpendingData = [
    { category: 'Housing', amount: totalExpenses * 0.3 },
    { category: 'Food', amount: totalExpenses * 0.15 },
    { category: 'Transportation', amount: totalExpenses * 0.12 },
    { category: 'Utilities', amount: totalExpenses * 0.08 },
    { category: 'Entertainment', amount: totalExpenses * 0.10 },
    { category: 'Shopping', amount: totalExpenses * 0.15 },
    { category: 'Other', amount: totalExpenses * 0.10 },
  ].filter(item => item.amount > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of your financial health and trends
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentNetWorth)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className={netWorthChange >= 0 ? "text-green-500" : "text-red-500"}>
                {netWorthChange >= 0 ? "+" : ""}{netWorthChange.toFixed(2)}% change
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Income after expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.overview.totalAssets)}</div>
            <p className="text-xs text-muted-foreground">
              Current portfolio value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cash Flow</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.overview.monthlyIncome - data.overview.monthlyExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly income minus expenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            {assetAllocationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={assetAllocationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {assetAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No asset data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Spending */}
        <Card>
          <CardHeader>
            <CardTitle>Estimated Spending Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categorySpendingData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categorySpendingData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `$${value.toFixed(0)}`} />
                  <YAxis dataKey="category" type="category" width={80} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="amount" fill="#8884d8">
                    {categorySpendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No spending data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Net Worth Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Net Worth Progression</CardTitle>
        </CardHeader>
        <CardContent>
          {data.netWorthTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data.netWorthTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="assets"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Total Assets"
                />
                <Line
                  type="monotone"
                  dataKey="liabilities"
                  stroke="#ff7300"
                  strokeWidth={2}
                  name="Total Liabilities"
                />
                <Line
                  type="monotone"
                  dataKey="netWorth"
                  stroke="#8884d8"
                  strokeWidth={3}
                  name="Net Worth"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
              No historical data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financial Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">
                  {savingsRate > 20 ? 'Strong Savings Rate' : savingsRate > 10 ? 'Good Savings Rate' : 'Improve Savings Rate'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Your {savingsRate.toFixed(1)}% savings rate is {savingsRate > 20 ? 'excellent' : savingsRate > 10 ? 'good' : 'below recommended levels'}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Asset Diversification</p>
                <p className="text-sm text-muted-foreground">
                  You have {assetAllocationData.length} different asset types in your portfolio
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Transaction Activity</p>
                <p className="text-sm text-muted-foreground">
                  You have {data.transactions.length} recorded transactions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Health Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Savings Rate</span>
                <span>{Math.min(100, Math.max(0, savingsRate)).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Asset Diversification</span>
                <span>{Math.min(100, assetAllocationData.length * 20)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, assetAllocationData.length * 20)}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Net Worth Growth</span>
                <span>{Math.min(100, Math.max(0, 50 + netWorthChange))}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, 50 + netWorthChange))}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 