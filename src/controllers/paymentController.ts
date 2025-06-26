import { Request, Response, NextFunction } from 'express';
import { createOrder, verifyPaymentSignature, getOrderById } from '../services/razorpay';
import { PaymentService, CreatePaymentLogData } from '../services/supabase';

/**
 * Create a new payment order
 * POST /api/payment/create-order
 */
export const createPaymentOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, receiptId, notes } = req.body;

    // Validation
    if (!amount || !receiptId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and receiptId are required'
      });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    // Create order
    const order = await createOrder({
      amount: Math.round(amount * 100), // Convert to paise
      receipt: receiptId,
      notes: notes || {}
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify payment signature
 * POST /api/payment/verify
 */
export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    // Validation
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: 'orderId, paymentId, and signature are required'
      });
    }

    // Verify signature
    const isValid = verifyPaymentSignature(orderId, paymentId, signature);

    if (isValid) {
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          orderId,
          paymentId,
          verified: true
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
        data: {
          orderId,
          paymentId,
          verified: false
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get order details
 * GET /api/payment/order/:orderId
 */
export const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const order = await getOrderById(orderId);

    res.status(200).json({
      success: true,
      message: 'Order details retrieved successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Razorpay key for frontend
 * GET /api/payment/key
 */
export const getRazorpayKey = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      key: process.env.RAZORPAY_KEY_ID
    }
  });
};

/**
 * Get all payment logs
 * GET /api/payment/logs
 */
export const getPaymentLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paymentLogs = await PaymentService.getAllPaymentLogs();

    res.status(200).json({
      success: true,
      message: 'Payment logs retrieved successfully',
      data: paymentLogs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create payment log
 * POST /api/payment/logs
 */
export const createPaymentLog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paymentData: CreatePaymentLogData = req.body;

    // Validation
    const requiredFields = ['student_id', 'amount', 'status', 'payment_date'];
    const missingFields = requiredFields.filter(field => !paymentData[field as keyof CreatePaymentLogData]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const paymentLog = await PaymentService.createPaymentLog(paymentData);

    res.status(201).json({
      success: true,
      message: 'Payment log created successfully',
      data: paymentLog
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update payment log
 * PUT /api/payment/logs/:id
 */
export const updatePaymentLog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const paymentId = parseInt(id);
    const updateData = req.body;

    if (isNaN(paymentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment log ID'
      });
    }

    const paymentLog = await PaymentService.updatePaymentLog(paymentId, updateData);

    res.status(200).json({
      success: true,
      message: 'Payment log updated successfully',
      data: paymentLog
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get payment logs by student
 * GET /api/payment/logs/student/:studentId
 */
export const getPaymentLogsByStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentId } = req.params;
    const id = parseInt(studentId);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID'
      });
    }

    const paymentLogs = await PaymentService.getPaymentLogsByStudent(id);

    res.status(200).json({
      success: true,
      message: 'Payment logs retrieved successfully',
      data: paymentLogs
    });
  } catch (error) {
    next(error);
  }
};
