import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { courses } from '../db/schema';
import { eq } from 'drizzle-orm';
import { createCourseSchema, updateCourseSchema } from '../validators/courseValidator';
import { AppError } from '@university/shared';

export const getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allCourses = await db.select().from(courses);
    res.json({
      status: 'success',
      data: allCourses
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const course = await db.select().from(courses).where(eq(courses.id, parseInt(id)));

    if (course.length === 0) {
      throw new AppError(404, 'Course not found');
    }

    res.json({
      status: 'success',
      data: course[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createCourseSchema.parse(req.body);

    const newCourse = await db.insert(courses).values(validatedData).returning();

    res.status(201).json({
      status: 'success',
      data: newCourse[0]
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = updateCourseSchema.parse(req.body);

    const updatedCourse = await db
      .update(courses)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(courses.id, parseInt(id)))
      .returning();

    if (updatedCourse.length === 0) {
      throw new AppError(404, 'Course not found');
    }

    res.json({
      status: 'success',
      data: updatedCourse[0]
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deletedCourse = await db
      .delete(courses)
      .where(eq(courses.id, parseInt(id)))
      .returning();

    if (deletedCourse.length === 0) {
      throw new AppError(404, 'Course not found');
    }

    res.json({
      status: 'success',
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
