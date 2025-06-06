"use server"
import { db } from '@/db'
import { accounts, transactions } from '@/db/schema'
import { desc, eq, sql } from 'drizzle-orm'

// Get user's accounts
export async function getUserAccounts(userId: number) {
  return await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, userId))
    .orderBy(desc(accounts.balance))
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