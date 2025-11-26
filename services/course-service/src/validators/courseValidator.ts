import { z } from 'zod';

export const createCourseSchema = z.object({
  courseCode: z.string().min(1, 'Course code is required'),
  courseName: z.string().min(1, 'Course name is required'),
  description: z.string().optional(),
  credits: z.number().min(1, 'Credits must be at least 1'),
  department: z.string().optional(),
  semester: z.string().optional(),
  maxStudents: z.number().optional()
});

export const updateCourseSchema = z.object({
  courseCode: z.string().min(1).optional(),
  courseName: z.string().min(1).optional(),
  description: z.string().optional(),
  credits: z.number().min(1).optional(),
  department: z.string().optional(),
  semester: z.string().optional(),
  maxStudents: z.number().optional()
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
