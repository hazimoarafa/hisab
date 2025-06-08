"use server";
import { PropertyValuation } from "@/lib/property-valuation";
import { and, desc, eq } from "drizzle-orm";
import { db } from "..";
import { accounts, assetValuations, realEstateProperties } from "../schema";

export async function savePropertyValuation(
  accountId: number,
  valuation: PropertyValuation
) {
  const [savedValuation] = await db
    .insert(assetValuations)
    .values({
      accountId,
      value: valuation.value.toString(),
      source: valuation.source as any,
      valuationDate: valuation.date.toISOString().split('T')[0], // Convert to date string
    })
    .returning();

  return savedValuation;
}

export async function getLatestValuationsByAccount(accountId: number, limit = 10) {
  return await db
    .select()
    .from(assetValuations)
    .where(eq(assetValuations.accountId, accountId))
    .orderBy(desc(assetValuations.valuationDate))
    .limit(limit);
}

export async function getAllRealEstateAccountsWithProperties() {
  return await db
    .select({
      accountId: accounts.id,
      accountName: accounts.name,
      userId: accounts.userId,
      property: realEstateProperties,
    })
    .from(accounts)
    .innerJoin(realEstateProperties, eq(accounts.id, realEstateProperties.accountId))
    .where(eq(accounts.type, "REAL_ESTATE"));
}

export async function getValuationsForDateRange(
  accountId: number,
  startDate: Date,
  endDate: Date
) {
  // For now, just get all valuations for the account
  // TODO: Implement proper date range filtering
  return await db
    .select()
    .from(assetValuations)
    .where(eq(assetValuations.accountId, accountId))
    .orderBy(desc(assetValuations.valuationDate));
}

export async function getLatestAutomatedValuation(accountId: number) {
  const [latestValuation] = await db
    .select()
    .from(assetValuations)
    .where(
      and(
        eq(assetValuations.accountId, accountId),
        eq(assetValuations.source, "market_estimate")
      )
    )
    .orderBy(desc(assetValuations.valuationDate))
    .limit(1);

  return latestValuation;
} 