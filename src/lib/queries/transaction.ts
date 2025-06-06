"use server"
import { db } from '@/db'
import { accounts, transactions } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

// Get recent transactions
export async function getRecentTransactions(userId: number, limit: number = 5) {
  return await db
    .select({
      id: transactions.id,
      amount: transactions.amount,
      date: transactions.date,
      type: transactions.type,
      accountId: transactions.accountId,
      // Join with accounts to get account info
      accountName: accounts.institution,
    })
    .from(transactions)
    .leftJoin(accounts, eq(transactions.accountId, accounts.id))
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.date))
    .limit(limit)
}

// Get all transactions with filters
export async function getUserTransactions(
  userId: number, 
  filters?: {
    type?: 'income' | 'expense' | 'transfer'
    accountId?: number
    limit?: number
  }
) {
  let query = db
    .select({
      id: transactions.id,
      amount: transactions.amount,
      date: transactions.date,
      type: transactions.type,
      accountId: transactions.accountId,
      accountName: accounts.institution,
      accountType: accounts.type,
    })
    .from(transactions)
    .leftJoin(accounts, eq(transactions.accountId, accounts.id))
    .where(eq(transactions.userId, userId))

  if (filters?.type) {
    query = query.where(eq(transactions.type, filters.type))
  }

  if (filters?.accountId) {
    query = query.where(eq(transactions.accountId, filters.accountId))
  }

  query = query.orderBy(desc(transactions.date))

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  return await query
} 