import { Router } from 'express';
import { testConnection, checkTables } from '../controllers/testController';

const router = Router();

// Test routes
router.get('/connection', testConnection);
router.get('/tables', checkTables);

export default router;
