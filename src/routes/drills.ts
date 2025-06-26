import { Router } from 'express';
import multer from 'multer';
import {
  getAllDrills,
  createDrill
} from '../controllers/drillController';

const router = Router();

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Drill activity routes
router.get('/', getAllDrills);
router.post('/', upload.single('image'), createDrill);

export default router;
