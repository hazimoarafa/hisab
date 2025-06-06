"use server"
import { db } from '@/db'
import { accounts, assets, liabilities, transactions } from '@/db/schema'
import { desc, eq, sql, sum } from 'drizzle-orm'

// Get user's financial overview
export async function getFinancialOverview(userId: number) {
  // Get total assets
  const assetsResult = await db
    .select({ total: sum(assets.value) })
    .from(assets)
    .where(eq(assets.userId, userId))
  
  const totalAssets = Number(assetsResult[0]?.total || 0)

  // Get total liabilities
  const liabilitiesResult = await db
    .select({ total: sum(liabilities.currentBalance) })
    .from(liabilities)
    .where(eq(liabilities.userId, userId))
  
  const totalLiabilities = Number(liabilitiesResult[0]?.total || 0)

  // Get total cash balance (checking + savings accounts)
  const cashResult = await db
    .select({ total: sum(accounts.balance) })
    .from(accounts)
    .where(eq(accounts.userId, userId))
  
  const totalCashBalance = Number(cashResult[0]?.total || 0)

  // Get monthly income (this month)
  const monthlyIncomeResult = await db
    .select({ total: sum(transactions.amount) })
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .where(eq(transactions.type, 'income'))
    .where(sql`date_trunc('month', ${transactions.date}) = date_trunc('month', CURRENT_DATE)`)
  
  const monthlyIncome = Number(monthlyIncomeResult[0]?.total || 0)

  // Get monthly expenses (this month) 
  const monthlyExpensesResult = await db
    .select({ total: sum(sql`ABS(${transactions.amount})`) })
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .where(eq(transactions.type, 'expense'))
    .where(sql`date_trunc('month', ${transactions.date}) = date_trunc('month', CURRENT_DATE)`)
  
  const monthlyExpenses = Number(monthlyExpensesResult[0]?.total || 0)

  const netWorth = totalAssets - totalLiabilities

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    monthlyIncome,
    monthlyExpenses,
    totalCashBalance
  }
}

// Get user's accounts
export async function getUserAccounts(userId: number) {
  return await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, userId))
    .orderBy(desc(accounts.balance))
}

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

// Get user's assets
export async function getUserAssets(userId: number) {
  return await db
    .select()
    .from(assets)
    .where(eq(assets.userId, userId))
    .orderBy(desc(assets.value))
}

// Get user's liabilities
export async function getUserLiabilities(userId: number) {
  return await db
    .select()
    .from(liabilities)
    .where(eq(liabilities.userId, userId))
    .orderBy(desc(liabilities.currentBalance))
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

// Create a new account
export async function createAccount(data: typeof accounts.$inferInsert) {
  const result = await db
    .insert(accounts)
    .values(data)
    .returning()
  
  return result[0]
}

// Update an existing account
export async function updateAccount(id: number, data: Partial<typeof accounts.$inferInsert>) {
  const result = await db
    .update(accounts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(accounts.id, id))
    .returning()
  
  return result[0]
}

// Delete an account
export async function deleteAccount(id: number) {
  // First, check if there are any transactions associated with this account
  const transactionsExist = await db
    .select({ count: sql`COUNT(*)`.as('count') })
    .from(transactions)
    .where(eq(transactions.accountId, id))
  
  const transactionCount = Number(transactionsExist[0]?.count || 0)
  
  if (transactionCount > 0) {
    throw new Error(`Cannot delete account. It has ${transactionCount} associated transactions. Please delete or reassign transactions first.`)
  }
  
  const result = await db
    .delete(accounts)
    .where(eq(accounts.id, id))
    .returning()
  
  return result[0]
}

// Get a single account by ID
export async function getAccountById(id: number) {
  const result = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, id))
    .limit(1)
  
  return result[0]
}

// Get net worth trend data (last 6 months)
export async function getNetWorthTrend(userId: number) {
  // This is a simplified version - in a real app you'd want to store monthly snapshots
  // For now, we'll return current values
  const overview = await getFinancialOverview(userId)
  
  // Generate mock trend data based on current values
  // In production, you'd want to store historical data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const baseNetWorth = overview.netWorth
  
  return months.map((month, index) => ({
    month,
    netWorth: Math.round(baseNetWorth * (0.85 + (index * 0.03))),
    assets: Math.round(overview.totalAssets * (0.85 + (index * 0.03))),
    liabilities: overview.totalLiabilities
  }))
} 