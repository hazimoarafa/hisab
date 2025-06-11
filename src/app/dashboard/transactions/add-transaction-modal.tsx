"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createTransaction } from "@/db/queries/transactions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	type: z.enum(["income", "expense", "transfer"], {
		required_error: "Please select a transaction type",
	}),
	amount: z.string().min(1, "Amount is required"),
	date: z.string().min(1, "Date is required"),
	fromAccount: z.string().optional(),
	toAccount: z.string().optional(),
}).refine((data) => {
	// Validate account requirements based on transaction type
	if (data.type === "expense" && !data.fromAccount) {
		return false;
	}
	if (data.type === "income" && !data.toAccount) {
		return false;
	}
	if (data.type === "transfer" && (!data.fromAccount || !data.toAccount)) {
		return false;
	}
	return true;
}, {
	message: "Please select the required accounts for this transaction type",
	path: ["fromAccount"],
});

type FormData = z.infer<typeof formSchema>;

interface Account {
	id: number;
	name: string;
	type: string;
}

interface TransactionModalProps {
	accounts: Account[];
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

// TODO: Replace with actual user authentication
const USER_ID = 1;

export function AddTransactionModal({ accounts, trigger, open: controlledOpen, onOpenChange }: TransactionModalProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	// Use controlled open state if provided, otherwise use internal state
	const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
	const setOpen = onOpenChange || setInternalOpen;

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			type: "expense",
			amount: "",
			date: new Date().toISOString().split("T")[0],
			fromAccount: undefined,
			toAccount: undefined,
		},
	});

	// Watch the transaction type to show/hide account fields
	const selectedType = form.watch("type");

	const onSubmit = async (data: FormData) => {
		setIsLoading(true);
		try {
			await createTransaction(USER_ID, data);
			setOpen(false);
			form.reset();
			
			// Refresh the page data
			router.refresh();
		} catch (error) {
			console.error("Error submitting form:", error);
			alert("Failed to create transaction. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const defaultTrigger = (
		<Button className="flex items-center gap-2">
			<Plus className="h-4 w-4" />
			Add Transaction
		</Button>
	);

	// If controlled externally (open prop provided), don't render trigger
	const isControlled = controlledOpen !== undefined;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{!isControlled && (
				<DialogTrigger asChild>
					{trigger || defaultTrigger}
				</DialogTrigger>
			)}
			<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add New Transaction</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Transaction Type</FormLabel>
									<Select
										onValueChange={field.onChange}
										value={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select transaction type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="income">Income</SelectItem>
											<SelectItem value="expense">Expense</SelectItem>
											<SelectItem value="transfer">Transfer</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Amount</FormLabel>
									<FormControl>
										<Input
											type="number"
											step="0.01"
											placeholder="0.00"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date</FormLabel>
									<FormControl>
										<Input
											type="date"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{(selectedType === "expense" || selectedType === "transfer") && (
							<FormField
								control={form.control}
								name="fromAccount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>From Account</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select account" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{accounts.map((account) => (
													<SelectItem key={account.id} value={account.id.toString()}>
														{account.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{(selectedType === "income" || selectedType === "transfer") && (
							<FormField
								control={form.control}
								name="toAccount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>To Account</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select account" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{accounts.map((account) => (
													<SelectItem key={account.id} value={account.id.toString()}>
														{account.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<div className="flex justify-end space-x-2 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Add Transaction
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
} 