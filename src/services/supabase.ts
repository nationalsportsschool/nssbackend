import supabase from '../config/supabase';

// Image Upload Service
export class ImageService {
  static async uploadImage(file: Buffer, fileName: string, bucket: string = 'drill-images'): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  }

  static async deleteImage(fileName: string, bucket: string = 'drill-images'): Promise<boolean> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  }
}

// Student interfaces
export interface Student {
  id: number;
  name: string;
  sport: string;
  secondary_sport?: string;
  group_level: string;
  fee_plan: string;
  fee_amount: number;
  payment_status: 'paid' | 'not_paid' | 'upcoming';
  pending_amount: number;
  parent_contact: string;
  last_payment: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateStudentData {
  name: string;
  sport: string;
  // secondary_sport?: string; // Commented out until DB migration is applied
  group_level: string;
  fee_plan: string;
  fee_amount: number;
  parent_contact: string;
  parent_id?: number;
  payment_status?: 'paid' | 'not_paid' | 'upcoming';
}

// Coach interfaces
export interface Coach {
  id: number;
  name: string;
  email: string;
  phone?: string;
  sports: string[];
  experience_years?: number;
  qualifications?: string;
  salary?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCoachData {
  name: string;
  email: string;
  phone?: string;
  sports: string[];
  experience_years?: number;
  qualifications?: string;
  salary?: number;
  status?: string;
  username: string;
  password: string;
}

export interface UpdateCoachData {
  name?: string;
  email?: string;
  phone?: string;
  sports?: string[];
  experience_years?: number;
  qualifications?: string;
  salary?: number;
  status?: string;
}

// Parent interfaces
export interface Parent {
  id: number;
  username: string;
  password: string;
  full_name: string;
  email?: string;
  phone: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateParentData {
  username: string;
  password: string;
  full_name: string;
  email?: string;
  phone: string;
  status?: string;
}

// Student service functions
export class StudentService {
  static async getAllStudents(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching students:', error);
      throw new Error('Failed to fetch students');
    }

    return data || [];
  }

  static async getStudentById(id: number): Promise<Student | null> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching student:', error);
      return null;
    }

    return data;
  }

  static async createStudent(studentData: CreateStudentData): Promise<Student> {
    console.log('Creating student with data:', studentData); // Debug log
    
    const { data, error } = await supabase
      .from('students')
      .insert([studentData])
      .select()
      .single();

    if (error) {
      console.error('Error creating student:', error);
      console.error('Student data that failed:', studentData); // Debug log
      throw new Error(`Failed to create student: ${error.message}`);
    }

    return data;
  }

  static async updateStudent(id: number, updateData: Partial<CreateStudentData>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating student:', error);
      throw new Error('Failed to update student');
    }

    return data;
  }

  static async deleteStudent(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting student:', error);
      throw new Error('Failed to delete student');
    }

    return true;
  }

  static async getStudentsBySport(sport: string): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('sport', sport)
      .order('name');

    if (error) {
      console.error('Error fetching students by sport:', error);
      throw new Error('Failed to fetch students by sport');
    }

    return data || [];
  }

  static async getStudentsByPaymentStatus(status: 'paid' | 'not_paid' | 'upcoming'): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('payment_status', status)
      .order('name');

    if (error) {
      console.error('Error fetching students by payment status:', error);
      throw new Error('Failed to fetch students by payment status');
    }

    return data || [];
  }
}

// Payment Log interfaces and services
export interface PaymentLog {
  id: number;
  student_id: number;
  amount: number;
  status: 'paid' | 'not_paid' | 'upcoming';
  payment_date: string;
  method: string;
  receipt_id?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
  updated_at: string;
  student?: {
    name: string;
  };
}

export interface CreatePaymentLogData {
  student_id: number;
  amount: number;
  status: 'paid' | 'not_paid' | 'upcoming';
  payment_date: string;
  method?: string;
  receipt_id?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
}

export class PaymentService {
  static async getAllPaymentLogs(): Promise<PaymentLog[]> {
    const { data, error } = await supabase
      .from('payment_logs')
      .select(`
        *,
        student:students(name)
      `)
      .order('payment_date', { ascending: false });

    if (error) {
      console.error('Error fetching payment logs:', error);
      throw new Error('Failed to fetch payment logs');
    }

    return data || [];
  }

  static async createPaymentLog(paymentData: CreatePaymentLogData): Promise<PaymentLog> {
    const { data, error } = await supabase
      .from('payment_logs')
      .insert([paymentData])
      .select(`
        *,
        student:students(name)
      `)
      .single();

    if (error) {
      console.error('Error creating payment log:', error);
      throw new Error('Failed to create payment log');
    }

    return data;
  }

  static async updatePaymentLog(id: number, updateData: Partial<CreatePaymentLogData>): Promise<PaymentLog> {
    const { data, error } = await supabase
      .from('payment_logs')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        student:students(name)
      `)
      .single();

    if (error) {
      console.error('Error updating payment log:', error);
      throw new Error('Failed to update payment log');
    }

    return data;
  }

  static async getPaymentLogsByStudent(studentId: number): Promise<PaymentLog[]> {
    const { data, error } = await supabase
      .from('payment_logs')
      .select(`
        *,
        student:students(name)
      `)
      .eq('student_id', studentId)
      .order('payment_date', { ascending: false });

    if (error) {
      console.error('Error fetching payment logs by student:', error);
      throw new Error('Failed to fetch payment logs by student');
    }

    return data || [];
  }
}

// Attendance interfaces and services
export interface StudentAttendance {
  id: number;
  student_id: number;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  batch?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  student?: {
    name: string;
    sport: string;
  };
}

export interface CoachAttendance {
  id: number;
  coach_id: number;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  entry_location?: any;
  exit_location?: any;
  total_hours?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  coach?: {
    name: string;
    sports: string[];
  };
}

export class AttendanceService {
  static async getStudentAttendance(startDate?: string, endDate?: string): Promise<StudentAttendance[]> {
    console.log('🔍 AttendanceService.getStudentAttendance called');
    console.log('📅 Date filters - Start:', startDate || 'No filter', 'End:', endDate || 'No filter');
    
    let query = supabase
      .from('student_attendance')
      .select(`
        *,
        student:students(name, sport)
      `)
      .order('date', { ascending: false });

    console.log('🏗️ Base query constructed for student_attendance');

    if (startDate) {
      query = query.gte('date', startDate);
      console.log('🗓️ Added startDate filter:', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
      console.log('🗓️ Added endDate filter:', endDate);
    }

    console.log('⚡ Executing student attendance query...');
    const { data, error } = await query;

    if (error) {
      console.error('❌ Student attendance query failed:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw new Error('Failed to fetch student attendance');
    }

    console.log('✅ Student attendance query successful');
    console.log('📊 Result summary:', {
      total_records: data?.length || 0,
      sample_dates: data?.slice(0, 3).map(d => d.date) || [],
      sample_students: data?.slice(0, 3).map(d => d.student?.name || 'Unknown') || []
    });

    return data || [];
  }

  static async getCoachAttendance(startDate?: string, endDate?: string): Promise<CoachAttendance[]> {
    console.log('🔍 AttendanceService.getCoachAttendance called');
    console.log('📅 Date filters - Start:', startDate || 'No filter', 'End:', endDate || 'No filter');
    
    let query = supabase
      .from('coach_attendance')
      .select(`
        *,
        coach:coaches(name, sports)
      `)
      .order('date', { ascending: false });

    console.log('🏗️ Base query constructed for coach_attendance');

    if (startDate) {
      query = query.gte('date', startDate);
      console.log('🗓️ Added startDate filter:', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
      console.log('🗓️ Added endDate filter:', endDate);
    }

    console.log('⚡ Executing coach attendance query...');
    const { data, error } = await query;

    if (error) {
      console.error('❌ Coach attendance query failed:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw new Error('Failed to fetch coach attendance');
    }

    console.log('✅ Coach attendance query successful');
    console.log('📊 Result summary:', {
      total_records: data?.length || 0,
      sample_dates: data?.slice(0, 3).map(d => d.date) || [],
      sample_coaches: data?.slice(0, 3).map(d => d.coach?.name || 'Unknown') || [],
      sample_sports: data?.slice(0, 3).map(d => d.coach?.sports || []) || []
    });

    return data || [];
  }

  static async markStudentAttendance(
    studentId: number,
    date: string,
    status: 'Present' | 'Absent' | 'Late' | 'Excused',
    batch?: string,
    notes?: string
  ): Promise<StudentAttendance> {
    // First, check if attendance already exists for this student and date
    const { data: existingAttendance } = await supabase
      .from('student_attendance')
      .select('id')
      .eq('student_id', studentId)
      .eq('date', date)
      .single();

    let data, error;

    if (existingAttendance) {
      // Update existing record
      const result = await supabase
        .from('student_attendance')
        .update({
          status,
          batch,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('student_id', studentId)
        .eq('date', date)
        .select(`
          *,
          student:students(name, sport)
        `)
        .single();
      
      data = result.data;
      error = result.error;
    } else {
      // Insert new record
      const result = await supabase
        .from('student_attendance')
        .insert([
          {
            student_id: studentId,
            date,
            status,
            batch,
            notes
          }
        ])
        .select(`
          *,
          student:students(name, sport)
        `)
        .single();
      
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Error marking student attendance:', error);
      throw new Error('Failed to mark student attendance');
    }

    return data;
  }

  static async markCoachAttendance(
    coachId: number,
    date: string,
    status: 'Present' | 'Absent' | 'Late' | 'Excused',
    entryLocation?: any,
    exitLocation?: any,
    totalHours?: number,
    notes?: string
  ): Promise<CoachAttendance> {
    // First, check if attendance already exists for this coach and date
    const { data: existingAttendance } = await supabase
      .from('coach_attendance')
      .select('id')
      .eq('coach_id', coachId)
      .eq('date', date)
      .single();

    let data, error;

    if (existingAttendance) {
      // Update existing record
      const result = await supabase
        .from('coach_attendance')
        .update({
          status,
          entry_location: entryLocation,
          exit_location: exitLocation,
          total_hours: totalHours,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('coach_id', coachId)
        .eq('date', date)
        .select(`
          *,
          coach:coaches(name, sports)
        `)
        .single();
      
      data = result.data;
      error = result.error;
    } else {
      // Insert new record
      const result = await supabase
        .from('coach_attendance')
        .insert([
          {
            coach_id: coachId,
            date,
            status,
            entry_location: entryLocation,
            exit_location: exitLocation,
            total_hours: totalHours,
            notes
          }
        ])
        .select(`
          *,
          coach:coaches(name, sports)
        `)
        .single();
      
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Error marking coach attendance:', error);
      throw new Error('Failed to mark coach attendance');
    }

    return data;
  }
}

// Coach interfaces and services
export interface Coach {
  id: number;
  name: string;
  email: string;
  phone?: string;
  sports: string[];
  experience_years?: number;
  qualifications?: string;
  salary?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export class CoachService {
  static async getAllCoaches(): Promise<Coach[]> {
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching coaches:', error);
      throw new Error('Failed to fetch coaches');
    }

    return data || [];
  }

  static async getCoachById(id: number): Promise<Coach | null> {
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching coach:', error);
      return null;
    }

    return data;
  }

  static async createCoach(coachData: CreateCoachData): Promise<Coach> {
    try {
      // Validate required fields
      if (!coachData.username || !coachData.password) {
        throw new Error('Username and password are required');
      }

      // Check if username already exists in coaches table
      const { data: existingCoach, error: coachCheckError } = await supabase
        .from('coaches')
        .select('username')
        .eq('username', coachData.username)
        .single();

      if (existingCoach) {
        throw new Error(`Username '${coachData.username}' already exists. Please choose a different username.`);
      }

      // If coachCheckError is not "no rows returned", it's a real error
      if (coachCheckError && coachCheckError.code !== 'PGRST116') {
        console.error('Error checking existing username:', coachCheckError);
        throw new Error('Failed to validate username uniqueness');
      }

      // Create the coach record with credentials
      const { data: coach, error: coachError } = await supabase
        .from('coaches')
        .insert([{
          name: coachData.name,
          email: coachData.email,
          phone: coachData.phone,
          sports: coachData.sports,
          experience_years: coachData.experience_years,
          qualifications: coachData.qualifications,
          salary: coachData.salary,
          status: coachData.status || 'active',
          username: coachData.username,
          password: coachData.password // Store password directly (can be enhanced with hashing later)
        }])
        .select()
        .single();

      if (coachError) {
        console.error('Error creating coach:', coachError);
        if (coachError.code === '23505') { // Unique constraint violation
          throw new Error(`Username '${coachData.username}' already exists. Please choose a different username.`);
        }
        throw new Error('Failed to create coach profile');
      }

      console.log(`Coach created successfully: ${coach.name} with username: ${coachData.username}`);
      return coach;
        
    } catch (error) {
      console.error('Error in createCoach:', error);
      throw error;
    }
  }

  static async updateCoach(id: number, updateData: UpdateCoachData): Promise<Coach | null> {
    const { data, error } = await supabase
      .from('coaches')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating coach:', error);
      throw new Error('Failed to update coach');
    }

    return data;
  }

  static async deleteCoach(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('coaches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting coach:', error);
      throw new Error('Failed to delete coach');
    }

    return true;
  }

  static async getCoachesBySport(sport: string): Promise<Coach[]> {
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .contains('sports', [sport])
      .order('name');

    if (error) {
      console.error('Error fetching coaches by sport:', error);
      throw new Error('Failed to fetch coaches by sport');
    }

    return data || [];
  }
}

// Drill Activity interfaces and services
export interface DrillActivity {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  date: string;
  sport: string;
  participants: number;
  duration?: string;
  instructor_id?: number;
  created_at: string;
  updated_at: string;
  instructor?: {
    name: string;
  };
}

export class DrillService {
  static async getAllDrills(): Promise<DrillActivity[]> {
    const { data, error } = await supabase
      .from('drill_activities')
      .select(`
        *,
        instructor:coaches(name)
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching drill activities:', error);
      throw new Error('Failed to fetch drill activities');
    }

    return data || [];
  }

  static async createDrill(drillData: Omit<DrillActivity, 'id' | 'created_at' | 'updated_at' | 'instructor'>): Promise<DrillActivity> {
    const { data, error } = await supabase
      .from('drill_activities')
      .insert([drillData])
      .select(`
        *,
        instructor:coaches(name)
      `)
      .single();

    if (error) {
      console.error('Error creating drill activity:', error);
      throw new Error('Failed to create drill activity');
    }

    return data;
  }
}

// Parent service functions
export class ParentService {
  static async getAllParents(): Promise<Parent[]> {
    const { data, error } = await supabase
      .from('parents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching parents:', error);
      throw new Error('Failed to fetch parents');
    }

    return data || [];
  }

  static async getParentById(id: number): Promise<Parent | null> {
    const { data, error } = await supabase
      .from('parents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching parent:', error);
      return null;
    }

    return data;
  }

  static async getParentByUsername(username: string): Promise<Parent | null> {
    const { data, error } = await supabase
      .from('parents')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Error fetching parent by username:', error);
      return null;
    }

    return data;
  }

  static async createParent(parentData: CreateParentData): Promise<Parent> {
    const { data, error } = await supabase
      .from('parents')
      .insert([parentData])
      .select()
      .single();

    if (error) {
      console.error('Error creating parent:', error);
      throw new Error('Failed to create parent');
    }

    return data;
  }

  static async updateParent(id: number, updateData: Partial<CreateParentData>): Promise<Parent> {
    const { data, error } = await supabase
      .from('parents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating parent:', error);
      throw new Error('Failed to update parent');
    }

    return data;
  }

  static async deleteParent(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('parents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting parent:', error);
      throw new Error('Failed to delete parent');
    }

    return true;
  }

  static async getStudentsByParentId(parentId: number): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching students by parent ID:', error);
      throw new Error('Failed to fetch students');
    }

    return data || [];
  }
}
