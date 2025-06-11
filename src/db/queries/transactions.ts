"use server";
import { desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "..";
import { accounts, transactions } from "../schema";


export async function getTransactions(userId: number) {
  return await db
    .select({
      id: transactions.id,
      date: sql<Date>`${transactions.date}::date`,
      amount: transactions.amount,
      fromAccount: sql<{ id: string; name: string; type: string; } | null>`
        CASE 
          WHEN "fromAccount".id IS NOT NULL THEN 
            json_build_object(
              'id', "fromAccount".id,
              'name', "fromAccount".name,
              'type', "fromAccount".type
            )
          ELSE NULL
        END
      `,
      toAccount: sql<{ id: string; name: string; type: string; } | null>`
        CASE 
          WHEN "toAccount".id IS NOT NULL THEN 
            json_build_object(
              'id', "toAccount".id,
              'name', "toAccount".name,
              'type', "toAccount".type
            )
          ELSE NULL
        END
      `,
    })
    .from(transactions)
    .leftJoin(sql`${accounts} as "fromAccount"`, eq(transactions.fromAccountId, sql`"fromAccount".id`))
    .leftJoin(sql`${accounts} as "toAccount"`, eq(transactions.toAccountId, sql`"toAccount".id`))
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.date));
}

export async function createTransaction(
  userId: number,
  data: {
    type: "income" | "expense" | "transfer";
    amount: string;
    date: string;
    fromAccount?: string;
    toAccount?: string;
  }
) {
  // Validate account requirements based on transaction type
  if (data.type === "expense" && !data.fromAccount) {
    throw new Error("From account is required for expenses");
  }
  if (data.type === "income" && !data.toAccount) {
    throw new Error("To account is required for income");
  }
  if (data.type === "transfer" && (!data.fromAccount || !data.toAccount)) {
    throw new Error("Both from and to accounts are required for transfers");
  }

  // Insert the transaction
  const [transaction] = await db
    .insert(transactions)
    .values({
      userId,
      amount: data.amount,
      date: data.date,
      fromAccountId: data.fromAccount ? parseInt(data.fromAccount) : null,
      toAccountId: data.toAccount ? parseInt(data.toAccount) : null,
    })
    .returning();

	revalidatePath("/dashboard/transactions");
  return transaction;
} 