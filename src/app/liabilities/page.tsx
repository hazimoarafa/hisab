import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

interface Liability {
  id: number
  name: string
  type: 'mortgage' | 'student_loan' | 'personal_loan'
  currentBalance: number
  originalAmount: number
  interestRate: number
  monthlyPayment?: number
  remainingMonths?: number
  nextPaymentDate?: string
}

const mockLiabilities: Liability[] = [
  {
    id: 1,
    name: '123 Main St Mortgage',
    type: 'mortgage',
    currentBalance: 285000,
    originalAmount: 350000,
    interestRate: 3.25,
    monthlyPayment: 1847,
    remainingMonths: 312,
    nextPaymentDate: '2024-02-01'
  },
  {
    id: 2,
    name: 'Stanford MBA Student Loan',
    type: 'student_loan',
    currentBalance: 45000,
    originalAmount: 65000,
    interestRate: 4.5,
    monthlyPayment: 512,
    remainingMonths: 96,
    nextPaymentDate: '2024-02-15'
  },
  {
    id: 3,
    name: 'Personal Loan - Home Renovation',
    type: 'personal_loan',
    currentBalance: 12000,
    originalAmount: 20000,
    interestRate: 6.75,
    monthlyPayment: 395,
    remainingMonths: 36,
    nextPaymentDate: '2024-02-10'
  }
]

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

export default function LiabilitiesPage() {
  const totalCurrentBalance = mockLiabilities.reduce((sum, liability) => sum + liability.currentBalance, 0)
  const totalOriginalAmount = mockLiabilities.reduce((sum, liability) => sum + liability.originalAmount, 0)
  const totalPaidOff = totalOriginalAmount - totalCurrentBalance
  const totalMonthlyPayments = mockLiabilities.reduce((sum, liability) => sum + (liability.monthlyPayment || 0), 0)

  // Group liabilities by type for summary
  const liabilitiesByType = mockLiabilities.reduce((acc, liability) => {
    if (!acc[liability.type]) {
      acc[liability.type] = { balance: 0, count: 0 }
    }
    acc[liability.type].balance += liability.currentBalance
    acc[liability.type].count += 1
    return acc
  }, {} as Record<Liability['type'], { balance: number; count: number }>)

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
              {formatPercent((totalPaidOff / totalOriginalAmount) * 100)} of original debt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalMonthlyPayments)}</div>
            <p className="text-xs text-muted-foreground">
              Total monthly obligation
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
              {formatPercent(
                mockLiabilities.reduce((sum, l) => sum + (l.interestRate * l.currentBalance), 0) / 
                totalCurrentBalance
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Weighted by balance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Liability Type Summary */}
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

      {/* Liabilities List */}
      <div className="grid gap-4">
        {mockLiabilities.map((liability) => {
          const payoffProgress = ((liability.originalAmount - liability.currentBalance) / liability.originalAmount) * 100
          
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
                        <span>Interest Rate: {formatPercent(liability.interestRate)}</span>
                        {liability.nextPaymentDate && (
                          <span>Next Payment: {liability.nextPaymentDate}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(liability.currentBalance)}
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
                      style={{ width: `${payoffProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Paid: {formatCurrency(liability.originalAmount - liability.currentBalance)}</span>
                    <span>Original: {formatCurrency(liability.originalAmount)}</span>
                  </div>
                </div>

                {/* Payment Details */}
                {liability.monthlyPayment && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Monthly Payment</p>
                      <p className="font-semibold">{formatCurrency(liability.monthlyPayment)}</p>
                    </div>
                    {liability.remainingMonths && (
                      <>
                        <div>
                          <p className="text-muted-foreground">Remaining Months</p>
                          <p className="font-semibold">{liability.remainingMonths} months</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Payoff Date</p>
                          <p className="font-semibold">
                            {new Date(Date.now() + liability.remainingMonths * 30 * 24 * 60 * 60 * 1000)
                              .toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 