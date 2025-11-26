import { Router } from 'express';
import {
  getAllEnrollments,
  getEnrollmentById,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment
} from '../controllers/enrollmentController';

const router = Router();

router.get('/', getAllEnrollments);
router.get('/:id', getEnrollmentById);
router.get('/student/:studentId', getEnrollmentsByStudent);
router.get('/course/:courseId', getEnrollmentsByCourse);
router.post('/', createEnrollment);
router.put('/:id', updateEnrollment);
router.delete('/:id', deleteEnrollment);

export default router;
