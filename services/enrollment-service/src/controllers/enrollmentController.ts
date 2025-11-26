import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { enrollments } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { createEnrollmentSchema, updateEnrollmentSchema } from '../validators/enrollmentValidator';
import { AppError } from '@university/shared';
import axios from 'axios';

const STUDENT_SERVICE_URL = process.env.STUDENT_SERVICE_URL || 'http://localhost:3001';
const COURSE_SERVICE_URL = process.env.COURSE_SERVICE_URL || 'http://localhost:3002';

export const getAllEnrollments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allEnrollments = await db.select().from(enrollments);
    res.json({
      status: 'success',
      data: allEnrollments
    });
  } catch (error) {
    next(error);
  }
};

export const getEnrollmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const enrollment = await db.select().from(enrollments).where(eq(enrollments.id, parseInt(id)));

    if (enrollment.length === 0) {
      throw new AppError(404, 'Enrollment not found');
    }

    res.json({
      status: 'success',
      data: enrollment[0]
    });
  } catch (error) {
    next(error);
  }
};

export const getEnrollmentsByStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;
    const studentEnrollments = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.studentId, parseInt(studentId)));

    res.json({
      status: 'success',
      data: studentEnrollments
    });
  } catch (error) {
    next(error);
  }
};

export const getEnrollmentsByCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const courseEnrollments = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.courseId, parseInt(courseId)));

    res.json({
      status: 'success',
      data: courseEnrollments
    });
  } catch (error) {
    next(error);
  }
};

export const createEnrollment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createEnrollmentSchema.parse(req.body);

    // Verify student exists
    try {
      await axios.get(`${STUDENT_SERVICE_URL}/api/students/${validatedData.studentId}`);
    } catch (error) {
      throw new AppError(404, 'Student not found');
    }

    // Verify course exists
    try {
      await axios.get(`${COURSE_SERVICE_URL}/api/courses/${validatedData.courseId}`);
    } catch (error) {
      throw new AppError(404, 'Course not found');
    }

    // Check if enrollment already exists
    const existingEnrollment = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.studentId, validatedData.studentId),
          eq(enrollments.courseId, validatedData.courseId),
          eq(enrollments.status, 'active')
        )
      );

    if (existingEnrollment.length > 0) {
      throw new AppError(400, 'Student is already enrolled in this course');
    }

    const newEnrollment = await db.insert(enrollments).values(validatedData).returning();

    res.status(201).json({
      status: 'success',
      data: newEnrollment[0]
    });
  } catch (error) {
    next(error);
  }
};

export const updateEnrollment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = updateEnrollmentSchema.parse(req.body);

    const updatedEnrollment = await db
      .update(enrollments)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(enrollments.id, parseInt(id)))
      .returning();

    if (updatedEnrollment.length === 0) {
      throw new AppError(404, 'Enrollment not found');
    }

    res.json({
      status: 'success',
      data: updatedEnrollment[0]
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEnrollment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deletedEnrollment = await db
      .delete(enrollments)
      .where(eq(enrollments.id, parseInt(id)))
      .returning();

    if (deletedEnrollment.length === 0) {
      throw new AppError(404, 'Enrollment not found');
    }

    res.json({
      status: 'success',
      message: 'Enrollment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
