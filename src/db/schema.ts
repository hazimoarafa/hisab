import { date, decimal, integer, pgEnum, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Account type enum
export const accountTypeEnum = pgEnum('account_type', [
  'checking',
  'savings', 
  'credit_card',
]);
// Account types: checking, savings, credit_card, investment, etc.
export const accounts = pgTable('accounts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => users.id).notNull(),
  type: accountTypeEnum().notNull(),
  institution: varchar({ length: 255 }), // "Chase Bank", "American Express"
  balance: decimal({ precision: 15, scale: 2 }).default('0.00').notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const transactionTypeEnum = pgEnum('transaction_type', [
  'income',
  'expense',
  'transfer',
]);
// Main transactions table
export const transactions = pgTable('transactions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => users.id).notNull(),
  accountId: integer().references(() => accounts.id).notNull(),
  amount: decimal({ precision: 15, scale: 2 }).notNull(), // positive for inflow, negative for outflow
  date: date().notNull(),
  type: transactionTypeEnum().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const assetTypeEnum = pgEnum('asset_type', [
  'stocks',
  'bonds',
  'real_estate',
  'vehicle',
  'crypto',
]);
// Assets (investments, real estate, vehicles, etc.)
export const assets = pgTable('assets', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => users.id).notNull(),
  name: varchar({ length: 255 }).notNull(), // "Primary Residence", "AAPL Stock"
  type: assetTypeEnum().notNull(),
  value: decimal({ precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Liabilities (loans, mortgages, credit card debt, etc.)
export const liabilityTypeEnum = pgEnum('liability_type', [
  'mortgage',
  'student_loan',
  'personal_loan',
]);
export const liabilities = pgTable('liabilities', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => users.id).notNull(),
  name: varchar({ length: 255 }).notNull(), // "123 Main St Mortgage", "Stanford Student Loan"
  type: liabilityTypeEnum().notNull(), // mortgage, student_loan, personal_loan
  currentBalance: decimal({ precision: 15, scale: 2 }).notNull(),
  originalAmount: decimal({ precision: 15, scale: 2 }).notNull(),
  interestRate: decimal({ precision: 5, scale: 5 }), // 5.25% stored as 0.05250
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});