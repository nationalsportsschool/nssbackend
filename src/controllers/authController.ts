import { Request, Response } from 'express';
import { CoachService } from '../services/supabase';
import supabase from '../config/supabase';

/**
 * Coach Authentication - Direct from coaches table
 * POST /api/auth/coach/login
 */
export const coachLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
      return;
    }

    console.log('=== COACH LOGIN ATTEMPT ===');
    console.log('Username:', username);
    console.log('============================');

    // Find coach by username directly from coaches table
    const { data: coach, error: coachError } = await supabase
      .from('coaches')
      .select('*')
      .eq('username', username)
      .eq('status', 'active')
      .single();

    if (coachError || !coach) {
      console.log('Coach not found or error:', coachError);
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your username and password.'
      });
      return;
    }

    // Verify password (direct comparison for now - can be enhanced with hashing)
    if (coach.password !== password) {
      console.log('Password mismatch');
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your username and password.'
      });
      return;
    }

    console.log('Coach login successful:', coach.name);

    // Return coach profile without sensitive data
    const coachProfile = {
      id: coach.id,
      name: coach.name,
      email: coach.email,
      phone: coach.phone,
      sports: coach.sports,
      experience_years: coach.experience_years,
      qualifications: coach.qualifications,
      status: coach.status,
      username: coach.username
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        coach: coachProfile,
        token: `coach_${coach.id}_${Date.now()}` // Simple token for demo
      }
    });

  } catch (error) {
    console.error('Error during coach login:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Verify coach authentication
 * GET /api/auth/coach/verify
 */
export const verifyCoachAuth = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No valid authentication token provided'
      });
      return;
    }

    const token = authHeader.substring(7);
    
    // Simple token verification (in production, use JWT)
    const tokenParts = token.split('_');
    if (tokenParts.length !== 3 || tokenParts[0] !== 'coach') {
      res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
      return;
    }

    const coachId = parseInt(tokenParts[1]);
    
    // Get coach data from coaches table
    const { data: coach, error } = await supabase
      .from('coaches')
      .select('id, name, email, phone, sports, experience_years, status')
      .eq('id', coachId)
      .eq('status', 'active')
      .single();

    if (error || !coach) {
      res.status(401).json({
        success: false,
        message: 'Coach not found or inactive'
      });
      return;
    }

    // Return coach profile
    const coachProfile = {
      id: coach.id,
      name: coach.name,
      email: coach.email,
      phone: coach.phone,
      sports: coach.sports,
      experience_years: coach.experience_years,
      status: coach.status
    };

    res.status(200).json({
      success: true,
      message: 'Authentication verified',
      data: {
        coach: coachProfile
      }
    });

  } catch (error) {
    console.error('Error verifying coach auth:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication verification failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Admin Authentication - From admins table
 * POST /api/auth/admin/login
 */
export const adminLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
      return;
    }

    console.log('=== ADMIN LOGIN ATTEMPT ===');
    console.log('Username:', username);
    console.log('============================');

    // Find admin by username from admins table
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .eq('status', 'active')
      .single();

    if (adminError || !admin) {
      console.log('Admin not found or error:', adminError);
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your username and password.'
      });
      return;
    }

    // Verify password (direct comparison for now - can be enhanced with hashing)
    if (admin.password !== password) {
      console.log('Password mismatch');
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your username and password.'
      });
      return;
    }

    console.log('Admin login successful:', admin.full_name || admin.username);

    // Return admin profile without sensitive data
    const adminProfile = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      full_name: admin.full_name,
      status: admin.status
    };

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        admin: adminProfile,
        token: `admin_${admin.id}_${Date.now()}` // Simple token for demo
      }
    });

  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({
      success: false,
      message: 'Admin login failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Verify admin authentication
 * GET /api/auth/admin/verify
 */
export const verifyAdminAuth = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No valid authentication token provided'
      });
      return;
    }

    const token = authHeader.substring(7);
    
    // Simple token verification (in production, use JWT)
    const tokenParts = token.split('_');
    if (tokenParts.length !== 3 || tokenParts[0] !== 'admin') {
      res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
      return;
    }

    const adminId = parseInt(tokenParts[1]);
    
    // Get admin data from admins table
    const { data: admin, error } = await supabase
      .from('admins')
      .select('id, username, email, full_name, status')
      .eq('id', adminId)
      .eq('status', 'active')
      .single();

    if (error || !admin) {
      res.status(401).json({
        success: false,
        message: 'Admin not found or inactive'
      });
      return;
    }

    // Return admin profile
    const adminProfile = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      full_name: admin.full_name,
      status: admin.status
    };

    res.status(200).json({
      success: true,
      message: 'Admin authentication verified',
      data: {
        admin: adminProfile
      }
    });

  } catch (error) {
    console.error('Error verifying admin auth:', error);
    res.status(500).json({
      success: false,
      message: 'Admin authentication verification failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Parent Authentication - Direct from parents table
 * POST /api/auth/parent/login
 */
export const parentLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
      return;
    }

    console.log('=== PARENT LOGIN ATTEMPT ===');
    console.log('Username:', username);
    console.log('============================');

    // Find parent by username directly from parents table
    const { data: parent, error: parentError } = await supabase
      .from('parents')
      .select('*')
      .eq('username', username)
      .eq('status', 'active')
      .single();

    if (parentError || !parent) {
      console.log('Parent not found or error:', parentError);
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your username and password.'
      });
      return;
    }

    // Verify password (direct comparison for now - can be enhanced with hashing)
    if (parent.password !== password) {
      console.log('Password mismatch');
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your username and password.'
      });
      return;
    }

    // Generate simple token (parent_id_timestamp)
    const token = `parent_${parent.id}_${Date.now()}`;

    console.log('Parent login successful:', parent.full_name);

    // Return success with parent data and token
    res.status(200).json({
      success: true,
      message: 'Parent login successful',
      data: {
        parent: {
          id: parent.id,
          username: parent.username,
          full_name: parent.full_name,
          email: parent.email,
          phone: parent.phone,
          status: parent.status
        },
        token
      }
    });

  } catch (error) {
    console.error('Parent login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during parent login'
    });
  }
};

/**
 * Verify Parent Authentication Token
 * GET /api/auth/parent/verify
 */
export const verifyParentAuth = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No token provided'
      });
      return;
    }

    const token = authHeader.substring(7);
    
    // Parse token (parent_id_timestamp)
    const tokenParts = token.split('_');
    if (tokenParts.length !== 3 || tokenParts[0] !== 'parent') {
      res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
      return;
    }

    const parentId = parseInt(tokenParts[1]);
    if (isNaN(parentId)) {
      res.status(401).json({
        success: false,
        message: 'Invalid parent ID in token'
      });
      return;
    }

    // Verify parent exists and is active
    const { data: parent, error: parentError } = await supabase
      .from('parents')
      .select('*')
      .eq('id', parentId)
      .eq('status', 'active')
      .single();

    if (parentError || !parent) {
      res.status(401).json({
        success: false,
        message: 'Invalid token or parent not found'
      });
      return;
    }

    // Return parent data
    res.status(200).json({
      success: true,
      message: 'Parent authentication verified',
      data: {
        parent: {
          id: parent.id,
          username: parent.username,
          full_name: parent.full_name,
          email: parent.email,
          phone: parent.phone,
          status: parent.status
        }
      }
    });

  } catch (error) {
    console.error('Parent auth verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during parent authentication verification'
    });
  }
};
