import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from '../services/supabase';

/**
 * Get student attendance
 * GET /api/attendance/students
 */
export const getStudentAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('=== GET STUDENT ATTENDANCE REQUEST ===');
    console.log('Query params:', req.query);
    const { startDate, endDate } = req.query;
    console.log('Parsed dates - Start:', startDate, 'End:', endDate);

    console.log('Calling AttendanceService.getStudentAttendance...');
    const attendance = await AttendanceService.getStudentAttendance(
      startDate as string,
      endDate as string
    );

    console.log('Student attendance result count:', attendance?.length || 0);
    console.log('First few records:', attendance?.slice(0, 2));

    res.status(200).json({
      success: true,
      message: 'Student attendance retrieved successfully',
      data: attendance
    });
  } catch (error) {
    console.error('Error in getStudentAttendance controller:', error);
    next(error);
  }
};

/**
 * Get coach attendance
 * GET /api/attendance/coaches
 */
export const getCoachAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('=== GET COACH ATTENDANCE REQUEST ===');
    console.log('Query params:', req.query);
    const { startDate, endDate } = req.query;
    console.log('Parsed dates - Start:', startDate, 'End:', endDate);

    console.log('Calling AttendanceService.getCoachAttendance...');
    const attendance = await AttendanceService.getCoachAttendance(
      startDate as string,
      endDate as string
    );

    console.log('Coach attendance result count:', attendance?.length || 0);
    console.log('First few records:', attendance?.slice(0, 2));

    res.status(200).json({
      success: true,
      message: 'Coach attendance retrieved successfully',
      data: attendance
    });
  } catch (error) {
    console.error('Error in getCoachAttendance controller:', error);
    next(error);
  }
};

/**
 * Mark student attendance
 * POST /api/attendance/students
 */
export const markStudentAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentId, date, status, batch, notes } = req.body;

    // Validation
    if (!studentId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: 'studentId, date, and status are required'
      });
    }

    if (!['Present', 'Absent', 'Late', 'Excused'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid attendance status'
      });
    }

    const attendance = await AttendanceService.markStudentAttendance(
      studentId,
      date,
      status,
      batch,
      notes
    );

    res.status(201).json({
      success: true,
      message: 'Student attendance marked successfully',
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark coach attendance
 * POST /api/attendance/coaches
 */
export const markCoachAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { 
      coachId, 
      date, 
      status, 
      entryLocation, 
      exitLocation, 
      totalHours, 
      notes 
    } = req.body;

    // Validation
    if (!coachId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: 'coachId, date, and status are required'
      });
    }

    if (!['Present', 'Absent', 'Late', 'Excused'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid attendance status'
      });
    }

    const attendance = await AttendanceService.markCoachAttendance(
      coachId,
      date,
      status,
      entryLocation,
      exitLocation,
      totalHours,
      notes
    );

    res.status(201).json({
      success: true,
      message: 'Coach attendance marked successfully',
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};
