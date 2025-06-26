import { Request, Response } from 'express';
import { CoachService } from '../services/supabase';

/**
 * Get all coaches
 * GET /api/coaches
 */
export const getAllCoaches = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const coaches = await CoachService.getAllCoaches();
    
    res.status(200).json({
      success: true,
      message: 'Coaches retrieved successfully',
      data: coaches
    });
  } catch (error) {
    console.error('Error fetching coaches:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coaches',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get coach by ID
 * GET /api/coaches/:id
 */
export const getCoachById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const coach = await CoachService.getCoachById(parseInt(id));
    
    if (!coach) {
      res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Coach retrieved successfully',
      data: coach
    });
  } catch (error) {
    console.error('Error fetching coach:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coach',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Create new coach
 * POST /api/coaches
 */
export const createCoach = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, phone, sports, experience, qualifications, salary, username, password } = req.body;
    
    // Debug logging
    console.log('=== CREATE COACH REQUEST ===');
    console.log('Request body:', req.body);
    console.log('Username received:', username);
    console.log('Password received:', password ? '[PROVIDED]' : '[NOT PROVIDED]');
    console.log('Sports received:', sports);
    console.log('============================');
    
    // Validation
    if (!name || !email || !sports || !Array.isArray(sports) || sports.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Name, email, and at least one sport are required'
      });
      return;
    }

    // Validation for authentication credentials
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Username and password are required for coach login'
      });
      return;
    }

    if (username.length < 3) {
      res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long'
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
      return;
    }
    
    const coachData = {
      name,
      email,
      phone: phone || undefined,
      sports,
      experience_years: experience ? parseInt(experience) : undefined,
      qualifications: qualifications || undefined,
      salary: salary ? parseInt(salary) : undefined,
      status: 'active',
      username,
      password
    };
    
    const coach = await CoachService.createCoach(coachData);
    
    res.status(201).json({
      success: true,
      message: 'Coach created successfully with login credentials',
      data: {
        ...coach,
        // Don't return password in response
        password: undefined
      }
    });
  } catch (error) {
    console.error('Error creating coach:', error);
    
    // Handle specific errors
    if (error instanceof Error && error.message.includes('username')) {
      res.status(400).json({
        success: false,
        message: 'Username already exists. Please choose a different username.',
        error: error.message
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create coach',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update coach
 * PUT /api/coaches/:id
 */
export const updateCoach = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone, sports, experience, qualifications, salary, status } = req.body;
    
    const updateData = {
      name,
      email,
      phone,
      sports,
      experience_years: experience ? parseInt(experience) : undefined,
      qualifications,
      salary: salary ? parseInt(salary) : undefined,
      status: status || 'active'
    };
    
    const coach = await CoachService.updateCoach(parseInt(id), updateData);
    
    if (!coach) {
      res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Coach updated successfully',
      data: coach
    });
  } catch (error) {
    console.error('Error updating coach:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update coach',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Delete coach
 * DELETE /api/coaches/:id
 */
export const deleteCoach = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await CoachService.deleteCoach(parseInt(id));
    
    if (!success) {
      res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Coach deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting coach:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete coach',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get coaches by sport
 * GET /api/coaches/sport/:sport
 */
export const getCoachesBySport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sport } = req.params;
    const coaches = await CoachService.getCoachesBySport(sport);
    
    res.status(200).json({
      success: true,
      message: `Coaches for ${sport} retrieved successfully`,
      data: coaches
    });
  } catch (error) {
    console.error('Error fetching coaches by sport:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coaches by sport',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
