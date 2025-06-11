"use server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "..";
import { assetValuations } from "../schema";

export async function getLatestValuationsByAccount(accountId: number, limit = 10) {
  return await db
    .select()
    .from(assetValuations)
    .where(eq(assetValuations.accountId, accountId))
    .orderBy(desc(assetValuations.valuationDate))
    .limit(limit);
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