import { Request, Response, NextFunction } from 'express';
import { DrillService, ImageService } from '../services/supabase';
import multer from 'multer';

/**
 * Get all drill activities
 * GET /api/drills
 */
export const getAllDrills = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const drills = await DrillService.getAllDrills();

    res.status(200).json({
      success: true,
      message: 'Drill activities retrieved successfully',
      data: drills
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new drill activity with image upload
 * POST /api/drills
 */
export const createDrill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const drillData = req.body;
    const imageFile = req.file;

    // Validation
    const requiredFields = ['title', 'date', 'sport', 'participants'];
    const missingFields = requiredFields.filter(field => !drillData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Handle image upload if provided
    let imageUrl = null;
    if (imageFile) {
      const fileName = `drill_${Date.now()}_${imageFile.originalname}`;
      imageUrl = await ImageService.uploadImage(imageFile.buffer, fileName);
    }

    // Create drill with image URL
    const drill = await DrillService.createDrill({
      ...drillData,
      image_url: imageUrl
    });

    res.status(201).json({
      success: true,
      message: 'Drill activity created successfully',
      data: drill
    });
  } catch (error) {
    next(error);
  }
};
