import { Request, Response, NextFunction } from 'express';
import { StudentService, CreateStudentData, ParentService, CreateParentData } from '../services/supabase';
import supabase from '../config/supabase';

/**
 * Get all students
 * GET /api/students
 */
export const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const students = await StudentService.getAllStudents();
    
    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      data: students
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get student by ID
 * GET /api/students/:id
 */
export const getStudentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID'
      });
    }

    const student = await StudentService.getStudentById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student retrieved successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new student
 * POST /api/students
 */
export const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentData: CreateStudentData = req.body;

    // Validation
    const requiredFields = ['name', 'sport', 'group_level', 'fee_plan', 'fee_amount', 'parent_contact'];
    const missingFields = requiredFields.filter(field => !studentData[field as keyof CreateStudentData]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const student = await StudentService.createStudent(studentData);

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update student
 * PUT /api/students/:id
 */
export const updateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const studentId = parseInt(id);
    const updateData = req.body;

    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID'
      });
    }

    const student = await StudentService.updateStudent(studentId, updateData);

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete student
 * DELETE /api/students/:id
 */
export const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID'
      });
    }

    await StudentService.deleteStudent(studentId);

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get students by sport
 * GET /api/students/sport/:sport
 */
export const getStudentsBySport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sport } = req.params;
    const students = await StudentService.getStudentsBySport(sport);

    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      data: students
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get students by payment status
 * GET /api/students/payment-status/:status
 */
export const getStudentsByPaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.params;
    
    if (!['paid', 'not_paid', 'upcoming'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status'
      });
    }

    const students = await StudentService.getStudentsByPaymentStatus(status as 'paid' | 'not_paid' | 'upcoming');

    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      data: students
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new student with parent credentials
 * POST /api/students/with-parent
 */
export const createStudentWithParent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      // Student data
      studentName,
      sport,
      secondarySport,
      groupLevel,
      feePlan,
      feeAmount,
      // Parent data
      parentName,
      parentContact,
      parentEmail,
      parentUsername,
      parentPassword,
      // Additional student data
      ...additionalStudentData
    } = req.body;

    // Validation
    const requiredFields = ['studentName', 'sport', 'groupLevel', 'feePlan', 'feeAmount', 'parentName', 'parentContact', 'parentUsername', 'parentPassword'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Check if parent username already exists
    const existingParent = await ParentService.getParentByUsername(parentUsername);
    if (existingParent) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists. Please choose a different username.'
      });
    }

    // Create parent first
    const parentData: CreateParentData = {
      username: parentUsername,
      password: parentPassword, // In production, this should be hashed
      full_name: parentName,
      email: parentEmail,
      phone: parentContact,
      status: 'active'
    };

    const parent = await ParentService.createParent(parentData);

    // Create student with parent ID
    const studentData: CreateStudentData & { parent_id: number } = {
      name: studentName,
      sport: sport,
      // secondary_sport: secondarySport || null, // Commented out until DB migration is applied
      group_level: groupLevel,
      fee_plan: feePlan,
      fee_amount: parseInt(feeAmount),
      parent_contact: parentContact,
      parent_id: parent.id,
      payment_status: 'not_paid'
    };

    const student = await StudentService.createStudent(studentData);

    res.status(201).json({
      success: true,
      message: 'Student and parent created successfully',
      data: {
        student: student,
        parent: {
          id: parent.id,
          username: parent.username,
          full_name: parent.full_name,
          email: parent.email,
          phone: parent.phone
        },
        parentCredentials: {
          username: parentUsername,
          password: parentPassword
        }
      }
    });

  } catch (error) {
    console.error('Error creating student with parent:', error);
    next(error);
  }
};

/**
 * Get students by parent ID
 * GET /api/parents/:parentId/children
 */
export const getStudentsByParentId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { parentId } = req.params;
    const parentIdNum = parseInt(parentId);

    if (isNaN(parentIdNum)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid parent ID'
      });
    }

    const students = await ParentService.getStudentsByParentId(parentIdNum);

    res.status(200).json({
      success: true,
      message: 'Parent children retrieved successfully',
      data: students
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get student attendance records
 * GET /api/students/:id/attendance
 */
export const getStudentAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const studentId = parseInt(id);
    const { start, end } = req.query;

    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID'
      });
    }

    // Build query
    let query = supabase
      .from('student_attendance')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (start) query = query.gte('date', start);
    if (end) query = query.lte('date', end);

    const { data, error } = await query;

    if (error) {
      throw new Error('Failed to fetch student attendance');
    }

    res.status(200).json({
      success: true,
      message: 'Student attendance retrieved successfully',
      data: data || []
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get student payment records
 * GET /api/students/:id/payments
 */
export const getStudentPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID'
      });
    }

    const { data, error } = await supabase
      .from('payment_logs')
      .select('*')
      .eq('student_id', studentId)
      .order('payment_date', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch student payments');
    }

    res.status(200).json({
      success: true,
      message: 'Student payments retrieved successfully',
      data: data || []
    });
  } catch (error) {
    next(error);
  }
};
