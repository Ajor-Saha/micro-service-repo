'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Course } from '@/types';

interface CourseFormData {
  courseCode: string;
  courseName: string;
  description: string;
  credits: number;
  department: string;
  semester: string;
  maxStudents: number;
}

interface CourseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CourseFormData) => Promise<void>;
  course?: Course;
  mode: 'create' | 'edit';
}

export function CourseForm({ open, onOpenChange, onSubmit, course, mode }: CourseFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    courseCode: course?.courseCode || '',
    courseName: course?.courseName || '',
    description: course?.description || '',
    credits: course?.credits || 3,
    department: course?.department || '',
    semester: course?.semester || '',
    maxStudents: course?.maxStudents || 30,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
      if (mode === 'create') {
        setFormData({
          courseCode: '',
          courseName: '',
          description: '',
          credits: 3,
          department: '',
          semester: '',
          maxStudents: 30,
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
          <DialogTitle>{mode === 'create' ? 'Add New Course' : 'Edit Course'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Fill in the details to create a new course.'
              : 'Update the course information below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code *</Label>
                <Input
                  id="courseCode"
                  value={formData.courseCode}
                  onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                  required
                  disabled={mode === 'edit'}
                  placeholder="e.g., CS101"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits">Credits *</Label>
                <Input
                  id="credits"
                  type="number"
                  min="1"
                  max="12"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name *</Label>
              <Input
                id="courseName"
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                required
                placeholder="e.g., Introduction to Computer Science"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Course description and objectives"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  placeholder="e.g., Fall 2024"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxStudents">Max Students</Label>
              <Input
                id="maxStudents"
                type="number"
                min="1"
                value={formData.maxStudents}
                onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? 'Saving...' : mode === 'create' ? 'Create Course' : 'Update Course'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
