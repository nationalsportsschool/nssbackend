import { Router } from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsBySport,
  getStudentsByPaymentStatus,
  createStudentWithParent,
  getStudentsByParentId,
  getStudentAttendance,
  getStudentPayments
} from '../controllers/studentController';

const router = Router();

// Student routes
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.get('/:id/attendance', getStudentAttendance); // Get student attendance
router.get('/:id/payments', getStudentPayments); // Get student payments
router.post('/', createStudent);
router.post('/with-parent', createStudentWithParent); // New route for creating student with parent
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.get('/sport/:sport', getStudentsBySport);
router.get('/payment-status/:status', getStudentsByPaymentStatus);

export default router;
