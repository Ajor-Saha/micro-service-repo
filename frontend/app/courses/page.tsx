'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { courseApi } from '@/lib/api';
import { Course } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { CourseForm } from '@/components/forms/CourseForm';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type CourseFormData = {
  courseCode: string;
  courseName: string;
  description: string;
  credits: number;
  department: string;
  semester: string;
  maxStudents: number;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseApi.getAll();
      setCourses(response.data || response);
      setError('');
    } catch (err) {
      setError('Failed to fetch courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      await courseApi.delete(id);
      fetchCourses();
    } catch (err) {
      alert('Failed to delete course');
      console.error(err);
    }
  };

  const handleCreate = async (data: CourseFormData) => {
    try {
      await courseApi.create(data);
      fetchCourses();
    } catch (err) {
      alert('Failed to create course');
      throw err;
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleUpdate = async (data: CourseFormData) => {
    if (!editingCourse) return;
    try {
      await courseApi.update(editingCourse.id, data);
      fetchCourses();
      setEditingCourse(undefined);
    } catch (err) {
      alert('Failed to update course');
      throw err;
    }
  };

  const openCreateForm = () => {
    setEditingCourse(undefined);
    setFormMode('create');
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
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
            <h1 className="text-4xl font-bold text-gray-900">Courses</h1>
            <p className="text-gray-600 mt-2">{courses.length} total courses</p>
          </div>
          <Button onClick={openCreateForm} className="bg-green-600 hover:bg-green-700 gap-2">
            <Plus className="w-4 h-4" />
            Add New Course
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4 text-red-700">
              {error}
            </CardContent>
          </Card>
        )}

        {courses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
                <p className="text-gray-600 mb-4">Start building your course catalog.</p>
                <Button onClick={openCreateForm} className="bg-green-600 hover:bg-green-700">Add First Course</Button>
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
                      <TableHead>Course Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Max Students</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.courseCode}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="font-medium">{course.courseName}</div>
                          {course.description && (
                            <div className="text-sm text-gray-500 truncate">{course.description}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{course.credits} credits</Badge>
                        </TableCell>
                        <TableCell>{course.department || 'N/A'}</TableCell>
                        <TableCell>{course.semester || 'N/A'}</TableCell>
                        <TableCell>{course.maxStudents || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEdit(course)}
                              className="gap-1">
                              <Pencil className="w-3 h-3" />
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(course.id)}
                              className="gap-1 text-red-600 hover:text-red-900 hover:bg-red-50">
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        <CourseForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={formMode === 'create' ? handleCreate : handleUpdate}
          course={editingCourse}
          mode={formMode}
        />
      </div>
    </div>
  );
}
