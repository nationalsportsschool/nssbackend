import { Router } from 'express';
import {
  getStudentsByParentId
} from '../controllers/studentController';

const router = Router();

// Parent routes
router.get('/:parentId/children', getStudentsByParentId); // Get parent's children

export default router;
