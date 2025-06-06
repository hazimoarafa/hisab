"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import {
    BarChart3,
    Calendar,
    DollarSign,
    Download,
    TrendingUp
} from "lucide-react"
import {
    Area,
    AreaChart,
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

// Mock data for charts
const incomeExpenseData = [
  { month: 'Jan', income: 8500, expenses: 4200, savings: 4300 },
  { month: 'Feb', income: 8500, expenses: 3800, savings: 4700 },
  { month: 'Mar', income: 9200, expenses: 4100, savings: 5100 },
  { month: 'Apr', income: 8500, expenses: 4500, savings: 4000 },
  { month: 'May', income: 8500, expenses: 3900, savings: 4600 },
  { month: 'Jun', income: 10000, expenses: 4200, savings: 5800 },
]

const assetAllocationData = [
  { name: 'Real Estate', value: 450000, color: '#8884d8' },
  { name: 'Stocks', value: 85000, color: '#82ca9d' },
  { name: 'Cash', value: 25000, color: '#ffc658' },
  { name: 'Vehicles', value: 42000, color: '#ff7300' },
  { name: 'Crypto', value: 15000, color: '#00ff00' },
  { name: 'Bonds', value: 25000, color: '#0088fe' },
]

const categorySpendingData = [
  { category: 'Housing', amount: 1200, color: '#8884d8' },
  { category: 'Food', amount: 650, color: '#82ca9d' },
  { category: 'Transportation', amount: 400, color: '#ffc658' },
  { category: 'Utilities', amount: 350, color: '#ff7300' },
  { category: 'Entertainment', amount: 300, color: '#00ff00' },
  { category: 'Shopping', amount: 450, color: '#0088fe' },
  { category: 'Healthcare', amount: 200, color: '#ff0000' },
]

const netWorthTrendData = [
  { month: 'Jan', netWorth: 150000, assets: 200000, liabilities: 50000 },
  { month: 'Feb', netWorth: 155000, assets: 205000, liabilities: 50000 },
  { month: 'Mar', netWorth: 158000, assets: 210000, liabilities: 52000 },
  { month: 'Apr', netWorth: 162000, assets: 215000, liabilities: 53000 },
  { month: 'May', netWorth: 168000, assets: 223000, liabilities: 55000 },
  { month: 'Jun', netWorth: 175000, assets: 230000, liabilities: 55000 },
]

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#0088fe', '#ff0000']

export default function ReportsPage() {
  const totalAssets = assetAllocationData.reduce((sum, item) => sum + item.value, 0)
  const currentNetWorth = netWorthTrendData[netWorthTrendData.length - 1].netWorth
  const previousNetWorth = netWorthTrendData[netWorthTrendData.length - 2].netWorth
  const netWorthChange = ((currentNetWorth - previousNetWorth) / previousNetWorth) * 100

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
            <CardTitle className="text-sm font-medium">Net Worth Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentNetWorth)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className={netWorthChange >= 0 ? "text-green-500" : "text-red-500"}>
                {netWorthChange >= 0 ? "+" : ""}{netWorthChange.toFixed(2)}% from last month
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
            <div className="text-2xl font-bold">54.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investment Return</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+8.7%</div>
            <p className="text-xs text-muted-foreground">
              YTD portfolio performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Debt to Income</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.5%</div>
            <p className="text-xs text-muted-foreground">
              -1.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Income vs Expenses Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Income vs Expenses Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={incomeExpenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Area
                type="monotone"
                dataKey="income"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stackId="2"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
                name="Expenses"
              />
              <Area
                type="monotone"
                dataKey="savings"
                stackId="3"
                stroke="#ffc658"
                fill="#ffc658"
                fillOpacity={0.6}
                name="Savings"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Asset Allocation and Category Spending */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categorySpendingData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                <YAxis dataKey="category" type="category" width={80} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="amount" fill="#8884d8">
                  {categorySpendingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Net Worth Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Net Worth Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={netWorthTrendData}>
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
                <p className="font-medium">Strong Savings Rate</p>
                <p className="text-sm text-muted-foreground">
                  Your 54.2% savings rate is excellent and above the recommended 20%
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Asset Growth</p>
                <p className="text-sm text-muted-foreground">
                  Your investment portfolio has grown 8.7% this year, outpacing inflation
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Debt Management</p>
                <p className="text-sm text-muted-foreground">
                  Your debt-to-income ratio of 28.5% is healthy and trending downward
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Diversify Crypto Holdings</p>
                <p className="text-sm text-muted-foreground">
                  Consider reducing crypto allocation from current levels for better risk management
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Emergency Fund</p>
                <p className="text-sm text-muted-foreground">
                  Your cash reserves cover 6 months of expenses - consider investing excess
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Student Loan</p>
                <p className="text-sm text-muted-foreground">
                  Consider extra payments on your 4.5% student loan to save on interest
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 