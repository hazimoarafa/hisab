import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react"

interface Transaction {
  id: number
  amount: number
  date: string
  type: 'income' | 'expense' | 'transfer'
  account: string
  description?: string
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    amount: 5000,
    date: "2024-01-15",
    type: "income",
    account: "Chase Checking",
    description: "Salary"
  },
  {
    id: 2,
    amount: -1200,
    date: "2024-01-14",
    type: "expense",
    account: "Chase Checking",
    description: "Rent Payment"
  },
  {
    id: 3,
    amount: -89.50,
    date: "2024-01-13",
    type: "expense",
    account: "Chase Credit Card",
    description: "Grocery Store"
  },
  {
    id: 4,
    amount: -500,
    date: "2024-01-12",
    type: "transfer",
    account: "Savings Account",
    description: "Transfer to Savings"
  },
  {
    id: 5,
    amount: -45.99,
    date: "2024-01-11",
    type: "expense",
    account: "Chase Checking",
    description: "Internet Bill"
  }
]

interface RecentTransactionsProps {
  transactions?: Transaction[]
  limit?: number
}

export default function RecentTransactions({ 
  transactions = mockTransactions, 
  limit = 5 
}: RecentTransactionsProps) {
  const displayTransactions = transactions.slice(0, limit)

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return <ArrowUpIcon className="h-4 w-4 text-green-500" />
      case 'expense':
        return <ArrowDownIcon className="h-4 w-4 text-red-500" />
      case 'transfer':
        return <ArrowRightIcon className="h-4 w-4 text-blue-500" />
    }
  }

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return 'text-green-600'
      case 'expense':
        return 'text-red-600'
      case 'transfer':
        return 'text-blue-600'
    }
  }

  const getBadgeVariant = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return 'default' as const
      case 'expense':
        return 'destructive' as const
      case 'transfer':
        return 'secondary' as const
    }
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium leading-none">
                    {transaction.description || 'Transaction'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.account} • {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getBadgeVariant(transaction.type)} className="text-xs">
                  {transaction.type}
                </Badge>
                <div className={`text-right ${getTransactionColor(transaction.type)}`}>
                  <p className="text-sm font-medium">
                    {transaction.type === 'income' ? '+' : ''}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 