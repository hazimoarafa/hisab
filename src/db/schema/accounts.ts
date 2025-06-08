import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';

import { pgEnum } from 'drizzle-orm/pg-core';

export const assetAccountType = pgEnum("asset_account_type", [
  "CHECKING",
  "SAVINGS", 
  "MONEY_MARKET",
  "CD", // Certificate of Deposit
  "INVESTMENT", // Brokerage, 401k, IRA, etc.
  "REAL_ESTATE",
  "VEHICLE",
  "OTHER_ASSET"
]);

export const liabilityAccountType = pgEnum("liability_account_type", [
  "CREDIT_CARD",
  "MORTGAGE",
  "AUTO_LOAN",
  "LEASE",
  "STUDENT_LOAN",
  "PERSONAL_LOAN",
  "LINE_OF_CREDIT",
  "OTHER_LIABILITY"
]);

// Combined enum for storage - this is what you'll actually use in your tables
export const accountType = pgEnum("account_type", [
  ...assetAccountType.enumValues,
  ...liabilityAccountType.enumValues
]);

export const accounts = pgTable('accounts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => users.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  type: accountType().notNull(),
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert; 