type StudentFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentId: string;
  dateOfBirth: string;
  address: string;
};

type CourseFormData = {
  courseCode: string;
  courseName: string;
  description: string;
  credits: number;
  department: string;
  semester: string;
  maxStudents: number;
};

type FacultyFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  department: string;
  designation: string;
  specialization: string;
  hireDate: string;
};

type CreateEnrollmentData = {
  studentId: number;
  courseId: number;
  status: string;
  semester?: string;
  academicYear?: string;
};

type UpdateEnrollmentData = {
  status?: string;
  grade?: string;
  semester?: string;
  academicYear?: string;
};

const API_URLS = {
  student: process.env.NEXT_PUBLIC_STUDENT_API_URL || 'http://localhost:3001/api',
  course: process.env.NEXT_PUBLIC_COURSE_API_URL || 'http://localhost:3002/api',
  faculty: process.env.NEXT_PUBLIC_FACULTY_API_URL || 'http://localhost:3003/api',
  enrollment: process.env.NEXT_PUBLIC_ENROLLMENT_API_URL || 'http://localhost:3004/api',
};

export const studentApi = {
  getAll: async () => {
    const res = await fetch(`${API_URLS.student}/students`);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },
  
  getById: async (id: number) => {
    const res = await fetch(`${API_URLS.student}/students/${id}`);
    if (!res.ok) throw new Error('Failed to fetch student');
    return res.json();
  },
  
  create: async (data: StudentFormData) => {
    const res = await fetch(`${API_URLS.student}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create student');
    return res.json();
  },
  
  update: async (id: number, data: StudentFormData) => {
    const res = await fetch(`${API_URLS.student}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update student');
    return res.json();
  },
  
  delete: async (id: number) => {
    const res = await fetch(`${API_URLS.student}/students/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete student');
    return res.json();
  },
};

export const courseApi = {
  getAll: async () => {
    const res = await fetch(`${API_URLS.course}/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  },
  
  getById: async (id: number) => {
    const res = await fetch(`${API_URLS.course}/courses/${id}`);
    if (!res.ok) throw new Error('Failed to fetch course');
    return res.json();
  },
  
  create: async (data: CourseFormData) => {
    const res = await fetch(`${API_URLS.course}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create course');
    return res.json();
  },
  
  update: async (id: number, data: CourseFormData) => {
    const res = await fetch(`${API_URLS.course}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update course');
    return res.json();
  },
  
  delete: async (id: number) => {
    const res = await fetch(`${API_URLS.course}/courses/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete course');
    return res.json();
  },
};

export const facultyApi = {
  getAll: async () => {
    const res = await fetch(`${API_URLS.faculty}/faculty`);
    if (!res.ok) throw new Error('Failed to fetch faculty');
    return res.json();
  },
  
  getById: async (id: number) => {
    const res = await fetch(`${API_URLS.faculty}/faculty/${id}`);
    if (!res.ok) throw new Error('Failed to fetch faculty member');
    return res.json();
  },
  
  create: async (data: FacultyFormData) => {
    const res = await fetch(`${API_URLS.faculty}/faculty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create faculty member');
    return res.json();
  },
  
  update: async (id: number, data: FacultyFormData) => {
    const res = await fetch(`${API_URLS.faculty}/faculty/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update faculty member');
    return res.json();
  },
  
  delete: async (id: number) => {
    const res = await fetch(`${API_URLS.faculty}/faculty/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete faculty member');
    return res.json();
  },
};

export const enrollmentApi = {
  getAll: async () => {
    const res = await fetch(`${API_URLS.enrollment}/enrollments`);
    if (!res.ok) throw new Error('Failed to fetch enrollments');
    return res.json();
  },
  
  getById: async (id: number) => {
    const res = await fetch(`${API_URLS.enrollment}/enrollments/${id}`);
    if (!res.ok) throw new Error('Failed to fetch enrollment');
    return res.json();
  },
  
  getByStudent: async (studentId: number) => {
    const res = await fetch(`${API_URLS.enrollment}/enrollments/student/${studentId}`);
    if (!res.ok) throw new Error('Failed to fetch student enrollments');
    return res.json();
  },
  
  getByCourse: async (courseId: number) => {
    const res = await fetch(`${API_URLS.enrollment}/enrollments/course/${courseId}`);
    if (!res.ok) throw new Error('Failed to fetch course enrollments');
    return res.json();
  },
  
  create: async (data: CreateEnrollmentData) => {
    const res = await fetch(`${API_URLS.enrollment}/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create enrollment');
    return res.json();
  },
  
  update: async (id: number, data: UpdateEnrollmentData) => {
    const res = await fetch(`${API_URLS.enrollment}/enrollments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update enrollment');
    return res.json();
  },
  
  delete: async (id: number) => {
    const res = await fetch(`${API_URLS.enrollment}/enrollments/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete enrollment');
    return res.json();
  },
};
