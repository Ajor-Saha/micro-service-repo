import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const faculty = pgTable('faculty', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  employeeId: varchar('employee_id', { length: 50 }).notNull().unique(),
  department: varchar('department', { length: 100 }),
  designation: varchar('designation', { length: 100 }),
  specialization: text('specialization'),
  hireDate: timestamp('hire_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export type Faculty = typeof faculty.$inferSelect;
export type NewFaculty = typeof faculty.$inferInsert;
