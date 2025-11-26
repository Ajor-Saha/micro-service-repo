import { z } from 'zod';

export const createEnrollmentSchema = z.object({
  studentId: z.number().min(1, 'Student ID is required'),
  courseId: z.number().min(1, 'Course ID is required'),
  status: z.enum(['active', 'completed', 'dropped']).default('active'),
  semester: z.string().optional(),
  academicYear: z.string().optional()
});

export const updateEnrollmentSchema = z.object({
  status: z.enum(['active', 'completed', 'dropped']).optional(),
  grade: z.string().optional(),
  semester: z.string().optional(),
  academicYear: z.string().optional()
});

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollmentInput = z.infer<typeof updateEnrollmentSchema>;
