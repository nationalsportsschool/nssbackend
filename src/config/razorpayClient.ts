import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Missing Razorpay configuration. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file');
}

// Create Razorpay instance
const razorpayClient = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpayClient;
