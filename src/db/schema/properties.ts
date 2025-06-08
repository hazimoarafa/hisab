import { boolean, integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';

// Property details table - only for real estate accounts
export const realEstateProperties = pgTable('real_estate_properties', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  accountId: integer().references(() => accounts.id).notNull().unique(), // one-to-one relationship
  autoValuationEnabled: boolean().default(true).notNull(),
  
  // Address fields
  addressLine1: varchar('address_line1', { length: 255 }).notNull(),
  addressLine2: varchar('address_line2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  stateProvince: varchar('state_province', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 20 }).notNull(),
  country: varchar('country', { length: 100 }).default('United States').notNull(),
});

export type RealEstateProperty = typeof realEstateProperties.$inferSelect;
export type NewRealEstateProperty = typeof realEstateProperties.$inferInsert; 