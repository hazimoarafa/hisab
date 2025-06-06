import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserLiabilities } from "@/lib/queries"
import { formatCurrency, formatPercent } from "@/lib/utils"
import {
	Calculator,
	Calendar,
	CreditCard,
	GraduationCap,
	Home,
	MoreVertical,
	Plus,
	TrendingDown
} from "lucide-react"

// For now, we'll use a hardcoded user ID. In a real app, this would come from authentication
const USER_ID = 1

interface Liability {
  id: number
  name: string
  type: 'mortgage' | 'student_loan' | 'personal_loan'
  currentBalance: string
  originalAmount: string
  interestRate: string | null
  createdAt: Date
  updatedAt: Date
}

function getLiabilityIcon(type: Liability['type']) {
  switch (type) {
    case 'mortgage':
      return <Home className="h-5 w-5" />
    case 'student_loan':
      return <GraduationCap className="h-5 w-5" />
    case 'personal_loan':
      return <CreditCard className="h-5 w-5" />
  }
}

function getLiabilityTypeLabel(type: Liability['type']) {
  switch (type) {
    case 'mortgage':
      return 'Mortgage'
    case 'student_loan':
      return 'Student Loan'
    case 'personal_loan':
      return 'Personal Loan'
  }
}

function getLiabilityTypeColor(type: Liability['type']) {
  switch (type) {
    case 'mortgage':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'student_loan':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'personal_loan':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  }
}

async function getLiabilitiesData() {
  try {
    const liabilities = await getUserLiabilities(USER_ID)
    return liabilities
  } catch (error) {
    console.error('Error fetching liabilities:', error)
    return []
  }
}

export default async function LiabilitiesPage() {
  const liabilities = await getLiabilitiesData()
  
  const totalCurrentBalance = liabilities.reduce((sum, liability) => sum + Number(liability.currentBalance), 0)
  const totalOriginalAmount = liabilities.reduce((sum, liability) => sum + Number(liability.originalAmount), 0)
  const totalPaidOff = totalOriginalAmount - totalCurrentBalance

  // Group liabilities by type for summary
  const liabilitiesByType = liabilities.reduce((acc, liability) => {
    if (!acc[liability.type]) {
      acc[liability.type] = { balance: 0, count: 0 }
    }
    acc[liability.type].balance += Number(liability.currentBalance)
    acc[liability.type].count += 1
    return acc
  }, {} as Record<Liability['type'], { balance: number; count: number }>)

  // Calculate weighted average interest rate
  const weightedInterestRate = liabilities.length > 0 
    ? liabilities.reduce((sum, l) => {
        const rate = Number(l.interestRate || 0)
        const balance = Number(l.currentBalance)
        return sum + (rate * balance)
      }, 0) / totalCurrentBalance
    : 0

  // Show empty state if no liabilities
  if (liabilities.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Liabilities</h1>
            <p className="text-muted-foreground">
              Manage your debts, loans, and payment schedules
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Liability
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-6">
              <TrendingDown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No liabilities found</h3>
              <p className="text-muted-foreground mb-4">
                Great news! You don't have any tracked debts or loans yet.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add a Liability
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Liabilities</h1>
          <p className="text-muted-foreground">
            Manage your debts, loans, and payment schedules
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Liability
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalCurrentBalance)}</div>
            <p className="text-xs text-muted-foreground">
              Current outstanding balance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid Off</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaidOff)}</div>
            <p className="text-xs text-muted-foreground">
              {totalOriginalAmount > 0 ? formatPercent((totalPaidOff / totalOriginalAmount) * 100) : '0%'} of original debt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Interest</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercent(weightedInterestRate)}
            </div>
            <p className="text-xs text-muted-foreground">
              Weighted by balance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liabilities.length}</div>
            <p className="text-xs text-muted-foreground">
              Active liability accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Liability Type Summary */}
      {Object.keys(liabilitiesByType).length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(liabilitiesByType).map(([type, data]) => (
            <Card key={type}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{getLiabilityTypeLabel(type as Liability['type'])}</CardTitle>
                {getLiabilityIcon(type as Liability['type'])}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.balance)}</div>
                <p className="text-xs text-muted-foreground">
                  {data.count} {data.count === 1 ? 'loan' : 'loans'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Liabilities List */}
      <div className="grid gap-4">
        {liabilities.map((liability) => {
          const payoffProgress = ((Number(liability.originalAmount) - Number(liability.currentBalance)) / Number(liability.originalAmount)) * 100
          
          return (
            <Card key={liability.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      {getLiabilityIcon(liability.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{liability.name}</h3>
                        <Badge 
                          variant="secondary" 
                          className={getLiabilityTypeColor(liability.type)}
                        >
                          {getLiabilityTypeLabel(liability.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Interest Rate: {liability.interestRate ? formatPercent(Number(liability.interestRate)) : 'N/A'}</span>
                        <span>Last updated: {liability.updatedAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(Number(liability.currentBalance))}
                      </div>
                      <p className="text-xs text-muted-foreground">Outstanding balance</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Payoff Progress</span>
                    <span>{payoffProgress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(0, Math.min(100, payoffProgress))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Paid: {formatCurrency(Number(liability.originalAmount) - Number(liability.currentBalance))}</span>
                    <span>Original: {formatCurrency(Number(liability.originalAmount))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 