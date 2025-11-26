import { Router } from 'express';
import {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty
} from '../controllers/facultyController';

const router = Router();

router.get('/', getAllFaculty);
router.get('/:id', getFacultyById);
router.post('/', createFaculty);
router.put('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);

export default router;
