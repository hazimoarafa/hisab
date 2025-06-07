import { sql } from 'drizzle-orm';
import { check, decimal, integer, pgEnum, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;

export const accountType = pgEnum("account_type", [
  "ASSET",
  "LIABILITY"
])

export const accounts = pgTable('accounts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => users.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  type: accountType().notNull(),
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export const transactions = pgTable("transactions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => users.id).notNull(),
  fromAccountId: integer().references(() => accounts.id),
  toAccountId: integer().references(() => accounts.id),
  amount: decimal().notNull(),
}, (table) => [
  check("positive_amount", sql`${table.amount} > 0`),
  check("at_least_one_account", sql`${table.fromAccountId} IS NOT NULL OR ${table.toAccountId} IS NOT NULL`),
]);
