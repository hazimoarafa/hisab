"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getAccounts } from "@/db/queries/accounts";
import { getTransactions } from "@/db/queries/transactions";
import { cn, formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { AddTransactionModal } from "./add-transaction-modal";

interface Account {
	id: number;
	name: string;
	type: string;
}

// TODO: Replace with actual user authentication
const USER_ID = 1;

export default function TransactionsPage() {
	const [transactions, setTransactions] = useState<Awaited<ReturnType<typeof getTransactions>>>([]);
	const [accounts, setAccounts] = useState<Awaited<ReturnType<typeof getAccounts>>>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch transactions
				const fetchedTransactions = await getTransactions(USER_ID);
				setTransactions(fetchedTransactions);

				// Fetch accounts using server function
				const fetchedAccounts = await getAccounts(USER_ID);
				setAccounts(fetchedAccounts);
			} catch (error) {
				console.error("Error fetching data:", error);
				// TODO: Show error toast
			}
		};
		fetchData();
	}, []);

	// Get unique account names for the filter
	const accountNames = Array.from(
		new Set(
			transactions.flatMap((t) => [
				t.fromAccount?.name,
				t.toAccount?.name,
			]).filter((name): name is string => name !== null && name !== undefined)
		)
	);

	return (
		<div className="container mx-auto p-6 space-y-8">
			{/* Header Section */}
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
				<div className="text-center sm:text-left">
					<h1 className="text-4xl font-bold text-foreground">Transactions</h1>
					<p className="text-muted-foreground">View and manage your financial transactions</p>
				</div>
				<AddTransactionModal accounts={accounts} />
			</div>

			{/* Filters Section */}
			<Card>
				<CardHeader>
					<CardTitle>Filters</CardTitle>
					<CardDescription>Filter your transactions by various criteria</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input placeholder="Search transactions..." className="pl-8" />
						</div>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Account" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Accounts</SelectItem>
								{accountNames.map((accountName) => (
									<SelectItem key={accountName} value={accountName}>
										{accountName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value="income">Income</SelectItem>
								<SelectItem value="expense">Expense</SelectItem>
								<SelectItem value="transfer">Transfer</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Transactions Table */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Transactions</CardTitle>
					<CardDescription>Your latest financial transactions</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>Description</TableHead>
								<TableHead>From Account</TableHead>
								<TableHead>To Account</TableHead>
								<TableHead className="text-right">Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{transactions.map((transaction) => {
								const isTransfer = transaction.fromAccount && transaction.toAccount;
								const isIncome = !transaction.fromAccount && transaction.toAccount;
								const isExpense = transaction.fromAccount && !transaction.toAccount;
								
								return (
									<TableRow key={transaction.id}>
										<TableCell>{format(transaction.date, "MMM d, yyyy")}</TableCell>
										<TableCell>
											{isTransfer ? "Transfer" : isIncome ? "Income" : "Expense"}
										</TableCell>
										<TableCell>{transaction.fromAccount?.name || "-"}</TableCell>
										<TableCell>{transaction.toAccount?.name || "-"}</TableCell>
										<TableCell className={cn("text-right", isIncome && "text-green-600", isExpense && "text-red-600", isTransfer && "text-blue-600")}>
											{formatCurrency(Number(transaction.amount))}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}