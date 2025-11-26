import { z } from 'zod';

export const createFacultySchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  employeeId: z.string().min(1, 'Employee ID is required'),
  department: z.string().optional(),
  designation: z.string().optional(),
  specialization: z.string().optional(),
  hireDate: z.string().optional()
});

export const updateFacultySchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  specialization: z.string().optional(),
  hireDate: z.string().optional()
});

export type CreateFacultyInput = z.infer<typeof createFacultySchema>;
export type UpdateFacultyInput = z.infer<typeof updateFacultySchema>;
