"use server";
import { desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
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
      `.as("balance"),
    })
    .from(accounts)
    .where(eq(accounts.userId, userId))
    .orderBy(b => desc(b.balance));
}

export async function updateAccount(
  accountId: number,
  name: string,
  type: (typeof accounts.type.enumValues)[number],
) {
  const [updatedAccount] = await db
    .update(accounts)
    .set({
      name,
      type,
    })
    .where(eq(accounts.id, accountId))
    .returning();

  revalidatePath("/accounts");
  return updatedAccount;
}

export async function createAccountWithInitialBalance(
  userId: number,
  name: string,
  type: (typeof accounts.type.enumValues)[number],
  initialBalance: number,
) {
  // Start a transaction to ensure both account and initial transaction are created
  const result = await db.transaction(async (tx) => {
    // Create the account
    const [newAccount] = await tx
      .insert(accounts)
      .values({
        userId,
        name,
        type,
      })
      .returning();

    // If there's an initial balance, create an initial transaction
    if (initialBalance !== 0) {
      await tx.insert(transactions).values({
        userId,
        // For assets, money comes "to" the account (positive balance)
        // For liabilities, money goes "from" the account (represents debt owed)
        toAccountId: initialBalance > 0 ? newAccount.id : null,
        fromAccountId: initialBalance < 0 ? newAccount.id : null,
        amount: Math.abs(initialBalance).toString(),
      });
    }

    return newAccount;
  });

  revalidatePath("/dashboard/accounts");
  return result;
}
