import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getUserTransactions } from "@/lib/queries"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
	ArrowDownIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	Plus,
	Search
} from "lucide-react"

// For now, we'll use a hardcoded user ID. In a real app, this would come from authentication
const USER_ID = 1

interface Transaction {
	id: number
	amount: string
	date: string
	type: 'income' | 'expense' | 'transfer'
	accountId: number
	accountName: string | null
	accountType: 'checking' | 'savings' | 'credit_card' | null
}

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

async function getTransactionsData() {
	try {
		const transactions = await getUserTransactions(USER_ID, { limit: 100 })
		return transactions
	} catch (error) {
		console.error('Error fetching transactions:', error)
		return []
	}
}

export default async function TransactionsPage() {
	const transactions = await getTransactionsData()
	
	const totalIncome = transactions
		.filter(t => t.type === 'income')
		.reduce((sum, t) => sum + Number(t.amount), 0)
	
	const totalExpenses = Math.abs(transactions
		.filter(t => t.type === 'expense')
		.reduce((sum, t) => sum + Number(t.amount), 0))
	
	const netCashFlow = totalIncome - totalExpenses

	// Show empty state if no transactions
	if (transactions.length === 0) {
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
				
				<Card>
					<CardContent className="p-6">
						<div className="text-center py-6">
							<ArrowUpIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
							<h3 className="text-lg font-semibold mb-2">No transactions found</h3>
							<p className="text-muted-foreground mb-4">
								Start tracking your finances by adding your first transaction.
							</p>
							<Button>
								<Plus className="h-4 w-4 mr-2" />
								Add Your First Transaction
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
							All time
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
							All time
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
								<SelectItem value="checking">Checking Accounts</SelectItem>
								<SelectItem value="savings">Savings Accounts</SelectItem>
								<SelectItem value="credit_card">Credit Cards</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Transactions Table */}
			<Card>
				<CardHeader>
					<CardTitle>All Transactions ({transactions.length})</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Account</TableHead>
								<TableHead>Account Type</TableHead>
								<TableHead className="text-right">Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{transactions.map((transaction) => (
								<TableRow key={transaction.id}>
									<TableCell className="font-medium">
										{formatDate(transaction.date)}
									</TableCell>
									<TableCell>
										<div className="flex items-center space-x-2">
											{getTransactionIcon(transaction.type)}
											<Badge variant={getBadgeVariant(transaction.type)}>
												{transaction.type}
											</Badge>
										</div>
									</TableCell>
									<TableCell>
										{transaction.accountName || 'Unknown Account'}
									</TableCell>
									<TableCell>
										{transaction.accountType ? (
											<Badge variant="outline">
												{transaction.accountType.replace('_', ' ')}
											</Badge>
										) : (
											'-'
										)}
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
											{formatCurrency(Math.abs(Number(transaction.amount)))}
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