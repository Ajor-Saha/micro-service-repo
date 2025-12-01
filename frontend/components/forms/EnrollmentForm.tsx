'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Enrollment, Student, Course, CreateEnrollmentData, UpdateEnrollmentData } from '@/types';
import { studentApi, courseApi } from '@/lib/api';

type EnrollmentFormData = CreateEnrollmentData | UpdateEnrollmentData;

interface EnrollmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EnrollmentFormData) => Promise<void>;
  enrollment?: Enrollment;
  mode: 'create' | 'edit';
}

export function EnrollmentForm({ open, onOpenChange, onSubmit, enrollment, mode }: EnrollmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    studentId: enrollment?.studentId || 0,
    courseId: enrollment?.courseId || 0,
    status: enrollment?.status || 'active',
    semester: enrollment?.semester || '',
    academicYear: enrollment?.academicYear || '',
    grade: enrollment?.grade || '',
  });

  useEffect(() => {
    if (open) {
      fetchStudentsAndCourses();
    }
  }, [open]);

  const fetchStudentsAndCourses = async () => {
    try {
      const [studentsResponse, coursesResponse] = await Promise.all([
        studentApi.getAll(),
        courseApi.getAll()
      ]);
      setStudents(studentsResponse.data || studentsResponse || []);
      setCourses(coursesResponse.data || coursesResponse || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setStudents([]);
      setCourses([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = mode === 'create' 
        ? { studentId: formData.studentId, courseId: formData.courseId, status: formData.status, semester: formData.semester, academicYear: formData.academicYear }
        : { status: formData.status, grade: formData.grade, semester: formData.semester, academicYear: formData.academicYear };
      
      await onSubmit(submitData);
      onOpenChange(false);
      if (mode === 'create') {
        setFormData({
          studentId: 0,
          courseId: 0,
          status: 'active',
          semester: '',
          academicYear: '',
          grade: '',
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add New Enrollment' : 'Edit Enrollment'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Enroll a student in a course.'
              : 'Update the enrollment information below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {mode === 'create' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student *</Label>
                  <Select 
                    value={formData.studentId.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, studentId: parseInt(value) })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.firstName} {student.lastName} ({student.studentId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseId">Course *</Label>
                  <Select 
                    value={formData.courseId.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, courseId: parseInt(value) })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.courseCode} - {course.courseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'completed' | 'dropped' })}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {mode === 'edit' && (
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  placeholder="e.g., A, B+, C"
                  maxLength={5}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  placeholder="e.g., Fall 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic Year</Label>
                <Input
                  id="academicYear"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  placeholder="e.g., 2024-2025"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
              {loading ? 'Saving...' : mode === 'create' ? 'Create Enrollment' : 'Update Enrollment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
