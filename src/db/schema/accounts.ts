import { integer, pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';

// Combined enum for all account types
export const accountType = pgEnum("account_type", [
  // Asset
  "CHECKING",
  "SAVINGS",
  "CRYPTO",
  "REAL_ESTATE",
  "VEHICLE",
  "OTHER_ASSET",
  // Liability
  "CREDIT_CARD",
  "MORTGAGE",
  "AUTO_LOAN",
  "LEASE",
  "OTHER_LIABILITY"
]);

// Enum for account category
export const accountCategory = pgEnum("account_category", ["ASSET", "LIABILITY"]);

// Mapping table: account_type -> category
export const accountTypeCategory = pgTable("account_type_category", {
  type: accountType().primaryKey(),
  category: accountCategory().notNull(),
});

export const accounts = pgTable('accounts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => users.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  type: accountType().notNull(),
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert; 