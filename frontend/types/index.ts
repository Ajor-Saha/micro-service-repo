export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  studentId: string;
  dateOfBirth?: string;
  address?: string;
  enrollmentDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  description?: string;
  credits: number;
  department?: string;
  semester?: string;
  maxStudents?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Faculty {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  employeeId: string;
  department?: string;
  designation?: string;
  specialization?: string;
  hireDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'dropped';
  grade?: string;
  semester?: string;
  academicYear?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnrollmentData {
  studentId: number;
  courseId: number;
  status: string;
  semester?: string;
  academicYear?: string;
}

export interface UpdateEnrollmentData {
  status?: string;
  grade?: string;
  semester?: string;
  academicYear?: string;
}
