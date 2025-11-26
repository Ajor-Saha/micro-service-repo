import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { students } from '../db/schema';
import { eq } from 'drizzle-orm';
import { createStudentSchema, updateStudentSchema } from '../validators/studentValidator';
import { AppError } from '@university/shared';

export const getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allStudents = await db.select().from(students);
    res.json({
      status: 'success',
      data: allStudents
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const student = await db.select().from(students).where(eq(students.id, parseInt(id)));

    if (student.length === 0) {
      throw new AppError(404, 'Student not found');
    }

    res.json({
      status: 'success',
      data: student[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createStudentSchema.parse(req.body);

    const newStudent = await db.insert(students).values(validatedData).returning();

    res.status(201).json({
      status: 'success',
      data: newStudent[0]
    });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = updateStudentSchema.parse(req.body);

    const updatedStudent = await db
      .update(students)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(students.id, parseInt(id)))
      .returning();

    if (updatedStudent.length === 0) {
      throw new AppError(404, 'Student not found');
    }

    res.json({
      status: 'success',
      data: updatedStudent[0]
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deletedStudent = await db
      .delete(students)
      .where(eq(students.id, parseInt(id)))
      .returning();

    if (deletedStudent.length === 0) {
      throw new AppError(404, 'Student not found');
    }

    res.json({
      status: 'success',
      message: 'Student deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
