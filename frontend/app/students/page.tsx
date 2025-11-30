'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { studentApi } from '@/lib/api';
import { Student } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, } from '@/components/ui/card';
import { StudentForm } from '@/components/forms/StudentForm';
import { Plus, Pencil, Trash2 } from 'lucide-react';

type StudentFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentId: string;
  dateOfBirth: string;
  address: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getAll();
      setStudents(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch students. Make sure the student service is running on port 3001.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      await studentApi.delete(id);
      fetchStudents();
    } catch (err) {
        console.log(err);
        
      alert('Failed to delete student');
    }
  };

  const handleCreate = async (data: StudentFormData) => {
    try {
      await studentApi.create(data);
      fetchStudents();
    } catch (err) {
      alert('Failed to create student');
      throw err;
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleUpdate = async (data: StudentFormData) => {
    if (!editingStudent) return;
    try {
      await studentApi.update(editingStudent.id, data);
      fetchStudents();
      setEditingStudent(undefined);
    } catch (err) {
      alert('Failed to update student');
      throw err;
    }
  };

  const openCreateForm = () => {
    setEditingStudent(undefined);
    setFormMode('create');
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
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
            <h1 className="text-4xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600 mt-2">{students.length} total students</p>
          </div>
          <Button onClick={openCreateForm} className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Student
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4 text-red-700">
              {error}
            </CardContent>
          </Card>
        )}

        {students.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No students yet</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first student to the system.</p>
                <Button onClick={openCreateForm}>Add First Student</Button>
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
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Date of Birth</TableHead>
                      <TableHead>Enrollment Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.studentId}</TableCell>
                        <TableCell>{student.firstName} {student.lastName}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.phone || 'N/A'}</TableCell>
                        <TableCell>{student.dateOfBirth || 'N/A'}</TableCell>
                        <TableCell>{new Date(student.enrollmentDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEdit(student)}
                              className="gap-1">
                              <Pencil className="w-3 h-3" />
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(student.id)}
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

        <StudentForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={formMode === 'create' ? handleCreate : handleUpdate}
          student={editingStudent}
          mode={formMode}
        />
      </div>
    </div>
  );
}
