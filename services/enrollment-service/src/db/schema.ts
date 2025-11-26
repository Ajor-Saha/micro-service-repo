import { pgTable, serial, integer, varchar, timestamp } from 'drizzle-orm/pg-core';

export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull(),
  courseId: integer('course_id').notNull(),
  enrollmentDate: timestamp('enrollment_date').defaultNow(),
  status: varchar('status', { length: 50 }).notNull().default('active'), // active, completed, dropped
  grade: varchar('grade', { length: 5 }),
  semester: varchar('semester', { length: 50 }),
  academicYear: varchar('academic_year', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export type Enrollment = typeof enrollments.$inferSelect;
export type NewEnrollment = typeof enrollments.$inferInsert;
