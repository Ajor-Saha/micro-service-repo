import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { faculty } from '../db/schema';
import { eq } from 'drizzle-orm';
import { createFacultySchema, updateFacultySchema } from '../validators/facultyValidator';
import { AppError } from '@university/shared';

export const getAllFaculty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allFaculty = await db.select().from(faculty);
    res.json({
      status: 'success',
      data: allFaculty
    });
  } catch (error) {
    next(error);
  }
};

export const getFacultyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const facultyMember = await db.select().from(faculty).where(eq(faculty.id, parseInt(id)));

    if (facultyMember.length === 0) {
      throw new AppError(404, 'Faculty member not found');
    }

    res.json({
      status: 'success',
      data: facultyMember[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createFaculty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createFacultySchema.parse(req.body);

    const insertData = {
      ...validatedData,
      hireDate: validatedData.hireDate ? new Date(validatedData.hireDate) : undefined
    };

    const newFaculty = await db.insert(faculty).values(insertData).returning();

    res.status(201).json({
      status: 'success',
      data: newFaculty[0]
    });
  } catch (error) {
    next(error);
  }
};

export const updateFaculty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = updateFacultySchema.parse(req.body);

    const updateData = {
      ...validatedData,
      hireDate: validatedData.hireDate ? new Date(validatedData.hireDate) : undefined,
      updatedAt: new Date()
    };

    const updatedFaculty = await db
      .update(faculty)
      .set(updateData)
      .where(eq(faculty.id, parseInt(id)))
      .returning();

    if (updatedFaculty.length === 0) {
      throw new AppError(404, 'Faculty member not found');
    }

    res.json({
      status: 'success',
      data: updatedFaculty[0]
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFaculty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deletedFaculty = await db
      .delete(faculty)
      .where(eq(faculty.id, parseInt(id)))
      .returning();

    if (deletedFaculty.length === 0) {
      throw new AppError(404, 'Faculty member not found');
    }

    res.json({
      status: 'success',
      message: 'Faculty member deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
