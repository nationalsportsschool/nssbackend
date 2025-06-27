import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment';
import studentRoutes from './routes/students';
import coachRoutes from './routes/coaches';
import attendanceRoutes from './routes/attendance';
import drillRoutes from './routes/drills';
import testRoutes from './routes/test';
import authRoutes from './routes/auth';
import parentRoutes from './routes/parents';
import { errorHandler } from './middlewares/errorHandler';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
// Add CORS support to allow frontend deployed on Vercel to access this backend.
// Use the 'cors' package and allow only specific origins like https://app.nationalsportsschool.in
// Also handle preflight requests for all routes
app.use(cors({
  origin: ['https://app.nationalsportsschool.in'], // Vercel frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'NSS Backend Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/drills', drillRoutes);
app.use('/api/test', testRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

export default app;
