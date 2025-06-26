import razorpayClient from '../config/razorpayClient';

export interface CreateOrderOptions {
  amount: number; // Amount in paise (e.g., 100 for ₹1)
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: string | null;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

/**
 * Create a new Razorpay order
 */
export const createOrder = async (options: CreateOrderOptions): Promise<RazorpayOrder> => {
  try {
    const orderOptions = {
      amount: options.amount,
      currency: options.currency || 'INR',
      receipt: options.receipt,
      notes: options.notes || {},
    };

    const order = await razorpayClient.orders.create(orderOptions);
    return order as RazorpayOrder;
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    throw new Error('Failed to create payment order');
  }
};

/**
 * Verify Razorpay payment signature
 */
export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  try {
    const crypto = require('crypto');
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Payment signature verification failed:', error);
    return false;
  }
};

/**
 * Get order details by ID
 */
export const getOrderById = async (orderId: string): Promise<RazorpayOrder> => {
  try {
    const order = await razorpayClient.orders.fetch(orderId);
    return order as RazorpayOrder;
  } catch (error) {
    console.error('Failed to fetch order:', error);
    throw new Error('Failed to retrieve order details');
  }
};
