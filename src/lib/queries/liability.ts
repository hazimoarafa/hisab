"use server"
import { db } from '@/db'
import { liabilities } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

// Get user's liabilities
export async function getUserLiabilities(userId: number) {
  return await db
    .select()
    .from(liabilities)
    .where(eq(liabilities.userId, userId))
    .orderBy(desc(liabilities.currentBalance))
} 