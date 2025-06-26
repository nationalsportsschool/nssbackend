import { Router } from 'express';
import {
  getStudentAttendance,
  getCoachAttendance,
  markStudentAttendance,
  markCoachAttendance
} from '../controllers/attendanceController';

const router = Router();

// Attendance routes
router.get('/students', getStudentAttendance);
router.get('/coaches', getCoachAttendance);
router.post('/students', markStudentAttendance);
router.post('/coaches', markCoachAttendance);

export default router;
