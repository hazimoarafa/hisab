"use server";
import { desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "..";
import { accounts, transactions } from "../schema";

export type TransactionWithAccounts = {
  id: number;
  date: Date;
  amount: string;
  fromAccount: {
    id: number;
    name: string;
    type: string;
  } | null;
  toAccount: {
    id: number;
    name: string;
    type: string;
  } | null;
};

export async function getTransactions(userId: number): Promise<TransactionWithAccounts[]> {
  const result = await db
    .select({
      id: transactions.id,
      date: sql<Date>`${transactions.date}::date`,
      amount: transactions.amount,
      fromAccountId: transactions.fromAccountId,
      toAccountId: transactions.toAccountId,
    })
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.date));

  // Get all unique account IDs
  const accountIds = new Set<number>();
  result.forEach(t => {
    if (t.fromAccountId) accountIds.add(t.fromAccountId);
    if (t.toAccountId) accountIds.add(t.toAccountId);
  });

  // If no accounts to fetch, return early
  if (accountIds.size === 0) {
    return result.map(transaction => ({
      ...transaction,
      fromAccount: null,
      toAccount: null,
    }));
  }

  // Fetch all relevant accounts in one query
  const accountsData = await db
    .select({
      id: accounts.id,
      name: accounts.name,
      type: accounts.type,
    })
    .from(accounts)
    .where(inArray(accounts.id, Array.from(accountIds)));

  // Create a map for quick account lookup
  const accountsMap = new Map(
    accountsData.map(account => [account.id, account])
  );

  // Combine the data
  return result.map(transaction => ({
    id: transaction.id,
    date: transaction.date,
    amount: transaction.amount,
    fromAccount: transaction.fromAccountId ? accountsMap.get(transaction.fromAccountId) || null : null,
    toAccount: transaction.toAccountId ? accountsMap.get(transaction.toAccountId) || null : null,
  }));
} 