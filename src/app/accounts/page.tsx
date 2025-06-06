import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import {
    CreditCard,
    MoreVertical,
    PiggyBank,
    Plus,
    TrendingUp,
    Wallet
} from "lucide-react"

interface Account {
  id: number
  type: 'checking' | 'savings' | 'credit_card'
  institution: string
  balance: number
  name?: string
  lastTransaction?: string
}

const mockAccounts: Account[] = [
  {
    id: 1,
    type: 'checking',
    institution: 'Chase Bank',
    balance: 15420.50,
    name: 'Chase Total Checking',
    lastTransaction: '2024-01-15'
  },
  {
    id: 2,
    type: 'savings',
    institution: 'Chase Bank',
    balance: 8750.00,
    name: 'Chase Savings',
    lastTransaction: '2024-01-12'
  },
  {
    id: 3,
    type: 'credit_card',
    institution: 'American Express',
    balance: -2180.75,
    name: 'Amex Gold Card',
    lastTransaction: '2024-01-14'
  },
  {
    id: 4,
    type: 'savings',
    institution: 'Ally Bank',
    balance: 25000.00,
    name: 'Ally Online Savings',
    lastTransaction: '2024-01-10'
  }
]

function getAccountIcon(type: Account['type']) {
  switch (type) {
    case 'checking':
      return <Wallet className="h-5 w-5" />
    case 'savings':
      return <PiggyBank className="h-5 w-5" />
    case 'credit_card':
      return <CreditCard className="h-5 w-5" />
  }
}

function getAccountTypeLabel(type: Account['type']) {
  switch (type) {
    case 'checking':
      return 'Checking'
    case 'savings':
      return 'Savings'
    case 'credit_card':
      return 'Credit Card'
  }
}

function getAccountTypeColor(type: Account['type']) {
  switch (type) {
    case 'checking':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'savings':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'credit_card':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  }
}

export default function AccountsPage() {
  const totalBalance = mockAccounts.reduce((sum, account) => sum + account.balance, 0)
  const cashAccounts = mockAccounts.filter(acc => acc.type !== 'credit_card')
  const creditCards = mockAccounts.filter(acc => acc.type === 'credit_card')
  const totalCash = cashAccounts.reduce((sum, account) => sum + account.balance, 0)
  const totalCredit = Math.abs(creditCards.reduce((sum, account) => sum + account.balance, 0))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            Manage your bank accounts, credit cards, and balances
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cash</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCash)}</div>
            <p className="text-xs text-muted-foreground">
              Across {cashAccounts.length} accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Card Debt</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalCredit)}</div>
            <p className="text-xs text-muted-foreground">
              Across {creditCards.length} cards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-muted-foreground">
              Cash minus credit debt
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts List */}
      <div className="grid gap-4">
        {mockAccounts.map((account) => (
          <Card key={account.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    {getAccountIcon(account.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">
                        {account.name || `${account.institution} ${getAccountTypeLabel(account.type)}`}
                      </h3>
                      <Badge 
                        variant="secondary" 
                        className={getAccountTypeColor(account.type)}
                      >
                        {getAccountTypeLabel(account.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {account.institution}
                      {account.lastTransaction && (
                        <span> • Last transaction: {account.lastTransaction}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      account.balance < 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {formatCurrency(Math.abs(account.balance))}
                    </div>
                    {account.type === 'credit_card' && account.balance < 0 && (
                      <p className="text-xs text-muted-foreground">Outstanding balance</p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 