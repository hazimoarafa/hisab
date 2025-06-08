import { date, decimal, integer, pgEnum, pgTable } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';

export const assetValuationSource = pgEnum("asset_valuation_source", [
  "appraisal", 
  "market_estimate", 
  "manual", 
  "purchase"
]);

export const assetValuations = pgTable('asset_valuations', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  accountId: integer().references(() => accounts.id).notNull(),
  value: decimal().notNull(),
  source: assetValuationSource().notNull(),
  valuationDate: date().defaultNow().notNull(),
});

export type AssetValuation = typeof assetValuations.$inferSelect;
export type NewAssetValuation = typeof assetValuations.$inferInsert; 