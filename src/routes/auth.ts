import express from 'express';
import { coachLogin, verifyCoachAuth, adminLogin, verifyAdminAuth, parentLogin, verifyParentAuth } from '../controllers/authController';

const router = express.Router();

/**
 * Auth Routes
 * 
 * POST /api/auth/admin/login - Admin login
 * GET /api/auth/admin/verify - Verify admin authentication
 * POST /api/auth/coach/login - Coach login
 * GET /api/auth/coach/verify - Verify coach authentication
 * POST /api/auth/parent/login - Parent login
 * GET /api/auth/parent/verify - Verify parent authentication
 */

// Admin authentication
router.post('/admin/login', adminLogin);
router.get('/admin/verify', verifyAdminAuth);

// Coach authentication
router.post('/coach/login', coachLogin);
router.get('/coach/verify', verifyCoachAuth);

// Parent authentication
router.post('/parent/login', parentLogin);
router.get('/parent/verify', verifyParentAuth);

export default router;
