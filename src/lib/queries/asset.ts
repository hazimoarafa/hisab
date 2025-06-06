"use server"
import { db } from '@/db'
import { assets } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

// Get user's assets
export async function getUserAssets(userId: number) {
  return await db
    .select()
    .from(assets)
    .where(eq(assets.userId, userId))
    .orderBy(desc(assets.value))
} 