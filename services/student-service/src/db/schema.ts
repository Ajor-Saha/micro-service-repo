import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  studentId: varchar('student_id', { length: 50 }).notNull().unique(),
  dateOfBirth: varchar('date_of_birth', { length: 10 }),
  address: text('address'),
  enrollmentDate: timestamp('enrollment_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
