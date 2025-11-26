import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  courseCode: varchar('course_code', { length: 20 }).notNull().unique(),
  courseName: varchar('course_name', { length: 255 }).notNull(),
  description: text('description'),
  credits: integer('credits').notNull(),
  department: varchar('department', { length: 100 }),
  semester: varchar('semester', { length: 50 }),
  maxStudents: integer('max_students'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
