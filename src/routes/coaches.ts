import { Router } from 'express';
import {
  getAllCoaches,
  getCoachById,
  createCoach,
  updateCoach,
  deleteCoach,
  getCoachesBySport
} from '../controllers/coachController';

const router = Router();

// Coach routes
router.get('/', getAllCoaches);
router.get('/:id', getCoachById);
router.post('/', createCoach);
router.put('/:id', updateCoach);
router.delete('/:id', deleteCoach);
router.get('/sport/:sport', getCoachesBySport);

export default router;
