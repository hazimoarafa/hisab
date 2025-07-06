"use server";
import { desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "..";
import { Account, accounts, accountTypeCategory, NewRealEstateProperty, realEstateProperties, transactions } from "../schema";

export type AccountDetails = Account & {
  balance: number;
  category: "ASSET" | "LIABILITY" | null;
}

export async function getAccounts(userId: number): Promise<AccountDetails[]> {
  return await db
    .select({
      id: accounts.id,
      userId: accounts.userId,
      name: accounts.name,
      type: accounts.type,
      category: accountTypeCategory.category,
      balance: sql<number>`
        COALESCE((
          SELECT SUM(
            CASE 
              WHEN a.type IN (SELECT type FROM "account_type_category" WHERE category = 'ASSET') THEN
                CASE 
                  WHEN t."toAccountId" = "accounts"."id" THEN t."amount"
                  WHEN t."fromAccountId" = "accounts"."id" THEN -t."amount"
                  ELSE 0
                END
              ELSE -- For liability accounts (CREDIT_CARD, MORTGAGE, etc.)
                CASE 
                  WHEN t."toAccountId" = "accounts"."id" THEN -t."amount"
                  WHEN t."fromAccountId" = "accounts"."id" THEN t."amount"
                  ELSE 0
                END
            END
          )
          FROM "transactions" t
          JOIN "accounts" a ON a.id = "accounts"."id"
          WHERE t."toAccountId" = "accounts"."id" 
             OR t."fromAccountId" = "accounts"."id"
        ), 0)
      `.as("balance"),
    })
    .from(accounts)
    .leftJoin(accountTypeCategory, eq(accounts.type, accountTypeCategory.type))
    .where(eq(accounts.userId, userId))
    .orderBy(desc(sql`balance`));
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

  revalidatePath("/dashboard/accounts");
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
      // Get the category for the account type
      const [typeCategory] = await tx
        .select({ category: accountTypeCategory.category })
        .from(accountTypeCategory)
        .where(eq(accountTypeCategory.type, type));
      const category = typeCategory?.category;

      let toAccountId = null;
      let fromAccountId = null;
      if (category === "ASSET") {
        toAccountId = initialBalance > 0 ? newAccount.id : null;
        fromAccountId = initialBalance < 0 ? newAccount.id : null;
      } else if (category === "LIABILITY") {
        toAccountId = initialBalance < 0 ? newAccount.id : null;
        fromAccountId = initialBalance > 0 ? newAccount.id : null;
      }

      await tx.insert(transactions).values({
        userId,
        toAccountId,
        fromAccountId,
        amount: Math.abs(initialBalance).toString(),
      });
    }

    // If this is a real estate account, create a property record
    if (type === "REAL_ESTATE") {
      await tx.insert(realEstateProperties).values({
        accountId: newAccount.id,
        autoValuationEnabled: true,
        // Placeholder address values - these should be updated later
        addressLine1: "Address to be updated",
        city: "City to be updated",
        stateProvince: "State/Province to be updated",
        postalCode: "00000",
        country: "United States",
      });
    }

    return newAccount;
  });

  revalidatePath("/dashboard/accounts");
  return result;
}

export async function getRealEstateProperty(accountId: number) {
  const [property] = await db
    .select()
    .from(realEstateProperties)
    .where(eq(realEstateProperties.accountId, accountId))
    .limit(1);
  
  return property;
}

export async function updateRealEstateProperty(
  accountId: number,
  propertyData: Partial<NewRealEstateProperty>
) {
  const [updatedProperty] = await db
    .update(realEstateProperties)
    .set(propertyData)
    .where(eq(realEstateProperties.accountId, accountId))
    .returning();

  revalidatePath("/dashboard/accounts");
  return updatedProperty;
}

export async function createRealEstateAccountWithProperty(
  userId: number,
  name: string,
  initialBalance: number,
  propertyData: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country?: string;
    autoValuationEnabled?: boolean;
  }
) {
  const result = await db.transaction(async (tx) => {
    // Create the account
    const [newAccount] = await tx
      .insert(accounts)
      .values({
        userId,
        name,
        type: "REAL_ESTATE",
      })
      .returning();

    // If there's an initial balance, create an initial transaction
    if (initialBalance !== 0) {
      await tx.insert(transactions).values({
        userId,
        toAccountId: initialBalance > 0 ? newAccount.id : null,
        fromAccountId: initialBalance < 0 ? newAccount.id : null,
        amount: Math.abs(initialBalance).toString(),
      });
    }

    // Create the real estate property record with actual address data
    const [newProperty] = await tx.insert(realEstateProperties).values({
      accountId: newAccount.id,
      autoValuationEnabled: propertyData.autoValuationEnabled ?? true,
      addressLine1: propertyData.addressLine1,
      addressLine2: propertyData.addressLine2,
      city: propertyData.city,
      stateProvince: propertyData.stateProvince,
      postalCode: propertyData.postalCode,
      country: propertyData.country ?? "United States",
    }).returning();

    return { account: newAccount, property: newProperty };
  });

  revalidatePath("/dashboard/accounts");
  return result;
}

export async function createPropertyForExistingAccount(
  accountId: number,
  propertyData: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country?: string;
    autoValuationEnabled?: boolean;
  }
) {
  const [newProperty] = await db.insert(realEstateProperties).values({
    accountId: accountId,
    autoValuationEnabled: propertyData.autoValuationEnabled ?? true,
    addressLine1: propertyData.addressLine1,
    addressLine2: propertyData.addressLine2,
    city: propertyData.city,
    stateProvince: propertyData.stateProvince,
    postalCode: propertyData.postalCode,
    country: propertyData.country ?? "United States",
  }).returning();

  revalidatePath("/dashboard/accounts");
  return newProperty;
}
