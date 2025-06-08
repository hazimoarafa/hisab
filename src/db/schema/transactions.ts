import { sql } from 'drizzle-orm';
import { check, date, decimal, integer, pgTable } from 'drizzle-orm/pg-core';
import { users } from './users';
import { accounts } from './accounts';

/**
 * PostgreSQL function for transaction validation
 * 
 * This function is used in the CHECK constraint below to prevent
 * real estate accounts from being used in transactions.
 * 
 * Function definition (already created in database):
 * 
 * CREATE OR REPLACE FUNCTION is_account_transactable(account_id INTEGER)
 * RETURNS BOOLEAN AS $$
 * BEGIN
 *     IF account_id IS NULL THEN
 *         RETURN TRUE;
 *     END IF;
 *     
 *     RETURN (
 *         SELECT type != 'REAL_ESTATE' 
 *         FROM accounts 
 *         WHERE id = account_id
 *     );
 * END;
 * $$ LANGUAGE plpgsql IMMUTABLE;
 */

export const transactions = pgTable("transactions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => users.id).notNull(),
  fromAccountId: integer().references(() => accounts.id),
  toAccountId: integer().references(() => accounts.id),
  amount: decimal().notNull(),
  date: date().defaultNow().notNull(),
}, (table) => [
  check("positive_amount", sql`${table.amount} > 0`),
  check("at_least_one_account", sql`${table.fromAccountId} IS NOT NULL OR ${table.toAccountId} IS NOT NULL`),
  check("no_real_estate_accounts", sql`
    is_account_transactable(${table.fromAccountId}) AND
    is_account_transactable(${table.toAccountId})
  `),
]);

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert; 