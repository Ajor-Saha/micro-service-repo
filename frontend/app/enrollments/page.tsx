'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { enrollmentApi, studentApi, courseApi } from '@/lib/api';
import { Enrollment, Student, Course } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { EnrollmentForm } from '@/components/forms/EnrollmentForm';
import { Plus, Pencil, Trash2, ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Record<number, Student>>({});
  const [courses, setCourses] = useState<Record<number, Course>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [enrollmentsRes, studentsRes, coursesRes] = await Promise.all([
        enrollmentApi.getAll(),
        studentApi.getAll(),
        courseApi.getAll()
      ]);
      
      setEnrollments(enrollmentsRes.data || enrollmentsRes);
      
      const studentsMap: Record<number, Student> = {};
      (studentsRes.data || studentsRes).forEach((s: Student) => {
        studentsMap[s.id] = s;
      });
      setStudents(studentsMap);
      
      const coursesMap: Record<number, Course> = {};
      (coursesRes.data || coursesRes).forEach((c: Course) => {
        coursesMap[c.id] = c;
      });
      setCourses(coursesMap);
      
      setError('');
    } catch (err) {
      setError('Failed to fetch enrollments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enrollment?')) return;

    try {
      await enrollmentApi.delete(id);
      fetchData();
    } catch (err) {
      alert('Failed to delete enrollment');
      console.error(err);
    }
  };

  const handleCreate = async (data: Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await enrollmentApi.create(data);
      fetchData();
    } catch (err) {
      alert('Failed to create enrollment');
      throw err;
    }
  };

  const handleEdit = (enrollment: Enrollment) => {
    setEditingEnrollment(enrollment);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleUpdate = async (data: Partial<Enrollment>) => {
    if (!editingEnrollment) return;
    try {
      await enrollmentApi.update(editingEnrollment.id, data);
      fetchData();
      setEditingEnrollment(undefined);
    } catch (err) {
      alert('Failed to update enrollment');
      throw err;
    }
  };

  const openCreateForm = () => {
    setEditingEnrollment(undefined);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'dropped':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading enrollments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/">
              <Button variant="ghost" className="mb-2">
                ← Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">Enrollments</h1>
            <p className="text-gray-600 mt-2">{enrollments.length} total enrollments</p>
          </div>
          <Button onClick={openCreateForm} className="bg-orange-600 hover:bg-orange-700 gap-2">
            <Plus className="w-4 h-4" />
            Add New Enrollment
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4 text-red-700">
              {error}
            </CardContent>
          </Card>
        )}

        {enrollments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No enrollments yet</h3>
                <p className="text-gray-600 mb-4">Start enrolling students in courses.</p>
                <Button onClick={openCreateForm} className="bg-orange-600 hover:bg-orange-700">Add First Enrollment</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Enrollment Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Academic Year</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enrollment) => {
                      const student = students[enrollment.studentId];
                      const course = courses[enrollment.courseId];
                      return (
                        <TableRow key={enrollment.id}>
                          <TableCell className="font-medium">
                            {student ? (
                              <div>
                                <div>{student.firstName} {student.lastName}</div>
                                <div className="text-sm text-gray-500">{student.studentId}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400">Student #{enrollment.studentId}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {course ? (
                              <div>
                                <div className="font-medium">{course.courseCode}</div>
                                <div className="text-sm text-gray-500">{course.courseName}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400">Course #{enrollment.courseId}</span>
                            )}
                          </TableCell>
                          <TableCell>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(enrollment.status)}>
                              {enrollment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {enrollment.grade ? (
                              <Badge variant="outline">{enrollment.grade}</Badge>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>{enrollment.semester || 'N/A'}</TableCell>
                          <TableCell>{enrollment.academicYear || 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEdit(enrollment)}
                                className="gap-1">
                                <Pencil className="w-3 h-3" />
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDelete(enrollment.id)}
                                className="gap-1 text-red-600 hover:text-red-900 hover:bg-red-50">
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        <EnrollmentForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={formMode === 'create' ? handleCreate : handleUpdate}
          enrollment={editingEnrollment}
          mode={formMode}
        />
      </div>
    </div>
  );
}
