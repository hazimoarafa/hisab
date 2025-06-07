"use server";
import { eq, or, sql } from 'drizzle-orm';
import { db } from "..";
import { accounts, transactions } from "../schema";

export async function getAccounts(userId: number) {
  return await db
    .select({
      id: accounts.id,
      userId: accounts.userId,
      name: accounts.name,
      type: accounts.type,
      balance: sql<number>`
        COALESCE(SUM(
          CASE 
            WHEN ${transactions.toAccountId} = ${accounts.id} THEN ${transactions.amount}
            WHEN ${transactions.fromAccountId} = ${accounts.id} THEN -${transactions.amount}
            ELSE 0
          END
        ), 0)
      `.as('balance')
    })
    .from(accounts)
    .leftJoin(
      transactions, 
      or(
        eq(transactions.toAccountId, accounts.id),
        eq(transactions.fromAccountId, accounts.id)
      )
    )
    .where(eq(accounts.userId, userId))
    .groupBy(accounts.id, accounts.userId, accounts.name, accounts.type);
}