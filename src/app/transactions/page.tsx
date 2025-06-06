import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
	ArrowDownIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	Plus,
	Search
} from "lucide-react"

interface Transaction {
  id: number
  amount: number
  date: string
  type: 'income' | 'expense' | 'transfer'
  account: string
  description: string
  category?: string
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    amount: 5000,
    date: "2024-01-15",
    type: "income",
    account: "Chase Checking",
    description: "Monthly Salary",
    category: "Salary"
  },
  {
    id: 2,
    amount: -1200,
    date: "2024-01-14",
    type: "expense",
    account: "Chase Checking",
    description: "Rent Payment",
    category: "Housing"
  },
  {
    id: 3,
    amount: -89.50,
    date: "2024-01-13",
    type: "expense",
    account: "Chase Credit Card",
    description: "Whole Foods",
    category: "Groceries"
  },
  {
    id: 4,
    amount: -500,
    date: "2024-01-12",
    type: "transfer",
    account: "Savings Account",
    description: "Transfer to Savings",
    category: "Transfer"
  },
  {
    id: 5,
    amount: -45.99,
    date: "2024-01-11",
    type: "expense",
    account: "Chase Checking",
    description: "Xfinity Internet",
    category: "Utilities"
  },
  {
    id: 6,
    amount: -75.20,
    date: "2024-01-10",
    type: "expense",
    account: "Chase Credit Card",
    description: "Shell Gas Station",
    category: "Transportation"
  },
  {
    id: 7,
    amount: 2500,
    date: "2024-01-09",
    type: "income",
    account: "Chase Checking",
    description: "Freelance Project",
    category: "Freelance"
  },
  {
    id: 8,
    amount: -150,
    date: "2024-01-08",
    type: "expense",
    account: "Chase Credit Card",
    description: "Amazon Purchase",
    category: "Shopping"
  }
]

function getTransactionIcon(type: Transaction['type']) {
  switch (type) {
    case 'income':
      return <ArrowUpIcon className="h-4 w-4 text-green-500" />
    case 'expense':
      return <ArrowDownIcon className="h-4 w-4 text-red-500" />
    case 'transfer':
      return <ArrowRightIcon className="h-4 w-4 text-blue-500" />
  }
}

function getBadgeVariant(type: Transaction['type']) {
  switch (type) {
    case 'income':
      return 'default' as const
    case 'expense':
      return 'destructive' as const
    case 'transfer':
      return 'secondary' as const
  }
}

export default function TransactionsPage() {
  const totalIncome = mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = Math.abs(mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0))
  
  const netCashFlow = totalIncome - totalExpenses

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage all your financial transactions
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
            <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netCashFlow)}
            </div>
            <p className="text-xs text-muted-foreground">
              Income minus expenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search transactions..." className="pl-8" />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                <SelectItem value="chase-checking">Chase Checking</SelectItem>
                <SelectItem value="chase-credit">Chase Credit Card</SelectItem>
                <SelectItem value="savings">Savings Account</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTransactionIcon(transaction.type)}
                      <span>{transaction.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell>{transaction.account}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(transaction.type)}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-medium ${
                      transaction.type === 'income' 
                        ? 'text-green-600' 
                        : transaction.type === 'expense'
                        ? 'text-red-600'
                        : 'text-blue-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : ''}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 