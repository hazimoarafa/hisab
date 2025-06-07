import { sql } from 'drizzle-orm';
import { check, decimal, integer, pgEnum, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;

const accountType = pgEnum("account_type", [
  "ASSET",
  "LIABILITY"
])

export const accounts = pgTable('accounts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => users.id).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  type: accountType().notNull(),
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export const transactions = pgTable("transactions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => users.id).notNull(),
  fromAccountId: integer().references(() => accounts.id).notNull(),
  toAccountId: integer().references(() => accounts.id).notNull(),
  amount: decimal().notNull(),
}, (table) => [
  check("positive_amount", sql`${table.amount} > 0`),
]);
