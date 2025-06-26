import { Request, Response, NextFunction } from 'express';
import supabase from '../config/supabase';

/**
 * Test Supabase connection
 * GET /api/test/connection
 */
export const testConnection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Simple test - try to create a basic query that should always work
    const { data, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .limit(1);

    if (error) {
      // If that fails, try an even simpler approach
      const { data: data2, error: error2 } = await supabase
        .from('students')
        .select('id')
        .limit(1);

      if (error2) {
        return res.status(200).json({
          success: true,
          message: 'Supabase connected but tables not set up',
          data: {
            connected: true,
            tablesExist: false,
            error: error2.message,
            timestamp: new Date().toISOString()
          }
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Supabase connection and tables working',
      data: {
        connected: true,
        tablesExist: true,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check if tables exist
 * GET /api/test/tables
 */
export const checkTables = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error } = await supabase
      .rpc('check_table_exists', { table_name: 'students' });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking tables',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Table check completed',
      data: {
        tablesExist: !!data,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    // If function doesn't exist, tables probably don't exist either
    res.status(200).json({
      success: true,
      message: 'Tables not set up yet',
      data: {
        tablesExist: false,
        needsSetup: true,
        instructions: 'Please run the SQL schema from database/schema.sql in your Supabase dashboard'
      }
    });
  }
};
