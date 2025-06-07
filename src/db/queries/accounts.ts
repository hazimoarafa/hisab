"use server";
import { eq, sql } from 'drizzle-orm';
import { db } from "..";
import { accounts } from "../schema";

export async function getAccounts(userId: number) {
  return await db
    .select({
      id: accounts.id,
      userId: accounts.userId,
      name: accounts.name,
      type: accounts.type,
      balance: sql<number>`
        COALESCE((
          SELECT SUM(
            CASE 
              WHEN t."toAccountId" = "accounts"."id" THEN t."amount"
              WHEN t."fromAccountId" = "accounts"."id" THEN -t."amount"
              ELSE 0
            END
          )
          FROM "transactions" t
          WHERE t."toAccountId" = "accounts"."id" 
             OR t."fromAccountId" = "accounts"."id"
        ), 0)
      `.as('balance')
    })
    .from(accounts)
    .where(eq(accounts.userId, userId));
}