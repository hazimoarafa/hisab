"use server"
import { db } from '@/db'
import { accounts, assets, liabilities, transactions } from '@/db/schema'
import { eq, sql, sum } from 'drizzle-orm'

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