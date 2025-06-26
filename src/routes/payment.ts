import { Router } from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  getOrderDetails,
  getRazorpayKey,
  getPaymentLogs,
  createPaymentLog,
  updatePaymentLog,
  getPaymentLogsByStudent
} from '../controllers/paymentController';

const router = Router();

// Payment routes
router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);
router.get('/order/:orderId', getOrderDetails);
router.get('/key', getRazorpayKey);

// Payment log routes
router.get('/logs', getPaymentLogs);
router.post('/logs', createPaymentLog);
router.put('/logs/:id', updatePaymentLog);
router.get('/logs/student/:studentId', getPaymentLogsByStudent);

export default router;
