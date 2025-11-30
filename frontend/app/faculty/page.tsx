'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { facultyApi } from '@/lib/api';
import { Faculty } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { FacultyForm } from '@/components/forms/FacultyForm';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const response = await facultyApi.getAll();
      setFaculty(response.data || response);
      setError('');
    } catch (err) {
      setError('Failed to fetch faculty members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;

    try {
      await facultyApi.delete(id);
      fetchFaculty();
    } catch (err) {
      alert('Failed to delete faculty member');
      console.error(err);
    }
  };

  const handleCreate = async (data: FacultyFormData) => {
    try {
      await facultyApi.create(data);
      fetchFaculty();
    } catch (err) {
      alert('Failed to create faculty member');
      throw err;
    }
  };

  const handleEdit = (member: Faculty) => {
    setEditingFaculty(member);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleUpdate = async (data: FacultyFormData) => {
    if (!editingFaculty) return;
    try {
      await facultyApi.update(editingFaculty.id, data);
      fetchFaculty();
      setEditingFaculty(undefined);
    } catch (err) {
      alert('Failed to update faculty member');
      throw err;
    }
  };

  const openCreateForm = () => {
    setEditingFaculty(undefined);
    setFormMode('create');
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading faculty...</p>
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
            <h1 className="text-4xl font-bold text-gray-900">Faculty</h1>
            <p className="text-gray-600 mt-2">{faculty.length} total faculty members</p>
          </div>
          <Button onClick={openCreateForm} className="bg-purple-600 hover:bg-purple-700 gap-2">
            <Plus className="w-4 h-4" />
            Add New Faculty
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4 text-red-700">
              {error}
            </CardContent>
          </Card>
        )}

        {faculty.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No faculty members yet</h3>
                <p className="text-gray-600 mb-4">Add faculty members to your institution.</p>
                <Button onClick={openCreateForm} className="bg-purple-600 hover:bg-purple-700">Add First Faculty Member</Button>
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
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {faculty.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.employeeId}</TableCell>
                        <TableCell>
                          <div className="font-medium">{member.firstName} {member.lastName}</div>
                          {member.specialization && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{member.specialization}</div>
                          )}
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.phone || 'N/A'}</TableCell>
                        <TableCell>{member.department || 'N/A'}</TableCell>
                        <TableCell>
                          {member.designation ? (
                            <Badge variant="outline">{member.designation}</Badge>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEdit(member)}
                              className="gap-1">
                              <Pencil className="w-3 h-3" />
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(member.id)}
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

        <FacultyForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={formMode === 'create' ? handleCreate : handleUpdate}
          faculty={editingFaculty}
          mode={formMode}
        />
      </div>
    </div>
  );
}
