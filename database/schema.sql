-- NSS (National Sports School) Database Schema
-- Generated from mock data analysis

-- Create enum types
CREATE TYPE sport_type AS ENUM ('Cricket', 'Football', 'Tennis', 'Athletics', 'Swimming', 'Basketball');
CREATE TYPE group_type AS ENUM ('Beginners', 'Intermediate', 'Advanced', 'Professional');
CREATE TYPE payment_status AS ENUM ('paid', 'not_paid', 'upcoming');
CREATE TYPE attendance_status AS ENUM ('Present', 'Absent', 'Late', 'Excused');
CREATE TYPE whatsapp_status AS ENUM ('delivered', 'pending', 'failed');
CREATE TYPE user_role AS ENUM ('admin', 'coach', 'parent', 'student');

-- Students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sport sport_type NOT NULL,
    group_level group_type NOT NULL,
    fee_plan VARCHAR(50) NOT NULL,
    fee_amount INTEGER NOT NULL,
    payment_status payment_status DEFAULT 'not_paid',
    pending_amount INTEGER DEFAULT 0,
    parent_contact VARCHAR(20) NOT NULL,
    last_payment DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coaches table
CREATE TABLE coaches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sport sport_type NOT NULL,
    contact VARCHAR(20),
    email VARCHAR(255),
    experience_years INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment logs table
CREATE TABLE payment_logs (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    status payment_status NOT NULL,
    payment_date DATE NOT NULL,
    method VARCHAR(50) DEFAULT 'UPI',
    receipt_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student attendance table
CREATE TABLE student_attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL,
    batch VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, date)
);

-- Coach attendance table
CREATE TABLE coach_attendance (
    id SERIAL PRIMARY KEY,
    coach_id INTEGER REFERENCES coaches(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL,
    entry_location JSONB,
    exit_location JSONB,
    total_hours DECIMAL(4,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(coach_id, date)
);

-- Drill activities table
CREATE TABLE drill_activities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    date DATE NOT NULL,
    sport sport_type NOT NULL,
    participants INTEGER DEFAULT 0,
    duration VARCHAR(50),
    instructor_id INTEGER REFERENCES coaches(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp logs table
CREATE TABLE whatsapp_logs (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status whatsapp_status DEFAULT 'pending',
    sent_date DATE NOT NULL,
    phone_number VARCHAR(20),
    message_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    coach_id INTEGER REFERENCES coaches(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_students_sport ON students(sport);
CREATE INDEX idx_students_group ON students(group_level);
CREATE INDEX idx_students_payment_status ON students(payment_status);
CREATE INDEX idx_payment_logs_student_id ON payment_logs(student_id);
CREATE INDEX idx_payment_logs_date ON payment_logs(payment_date);
CREATE INDEX idx_student_attendance_student_id ON student_attendance(student_id);
CREATE INDEX idx_student_attendance_date ON student_attendance(date);
CREATE INDEX idx_coach_attendance_coach_id ON coach_attendance(coach_id);
CREATE INDEX idx_coach_attendance_date ON coach_attendance(date);
CREATE INDEX idx_drill_activities_sport ON drill_activities(sport);
CREATE INDEX idx_drill_activities_date ON drill_activities(date);
CREATE INDEX idx_whatsapp_logs_student_id ON whatsapp_logs(student_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON coaches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_logs_updated_at BEFORE UPDATE ON payment_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_attendance_updated_at BEFORE UPDATE ON student_attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coach_attendance_updated_at BEFORE UPDATE ON coach_attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drill_activities_updated_at BEFORE UPDATE ON drill_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whatsapp_logs_updated_at BEFORE UPDATE ON whatsapp_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE drill_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be customized based on authentication requirements)
CREATE POLICY "Enable read access for all users" ON students FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON coaches FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON payment_logs FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON student_attendance FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON coach_attendance FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON drill_activities FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON whatsapp_logs FOR SELECT USING (true);

-- Insert policies for service role
CREATE POLICY "Enable insert for service role" ON students FOR INSERT USING (true);
CREATE POLICY "Enable insert for service role" ON coaches FOR INSERT USING (true);
CREATE POLICY "Enable insert for service role" ON payment_logs FOR INSERT USING (true);
CREATE POLICY "Enable insert for service role" ON student_attendance FOR INSERT USING (true);
CREATE POLICY "Enable insert for service role" ON coach_attendance FOR INSERT USING (true);
CREATE POLICY "Enable insert for service role" ON drill_activities FOR INSERT USING (true);
CREATE POLICY "Enable insert for service role" ON whatsapp_logs FOR INSERT USING (true);
CREATE POLICY "Enable insert for service role" ON users FOR INSERT USING (true);

-- Update policies for service role
CREATE POLICY "Enable update for service role" ON students FOR UPDATE USING (true);
CREATE POLICY "Enable update for service role" ON coaches FOR UPDATE USING (true);
CREATE POLICY "Enable update for service role" ON payment_logs FOR UPDATE USING (true);
CREATE POLICY "Enable update for service role" ON student_attendance FOR UPDATE USING (true);
CREATE POLICY "Enable update for service role" ON coach_attendance FOR UPDATE USING (true);
CREATE POLICY "Enable update for service role" ON drill_activities FOR UPDATE USING (true);
CREATE POLICY "Enable update for service role" ON whatsapp_logs FOR UPDATE USING (true);
CREATE POLICY "Enable update for service role" ON users FOR UPDATE USING (true);

-- Delete policies for service role
CREATE POLICY "Enable delete for service role" ON students FOR DELETE USING (true);
CREATE POLICY "Enable delete for service role" ON coaches FOR DELETE USING (true);
CREATE POLICY "Enable delete for service role" ON payment_logs FOR DELETE USING (true);
CREATE POLICY "Enable delete for service role" ON student_attendance FOR DELETE USING (true);
CREATE POLICY "Enable delete for service role" ON coach_attendance FOR DELETE USING (true);
CREATE POLICY "Enable delete for service role" ON drill_activities FOR DELETE USING (true);
CREATE POLICY "Enable delete for service role" ON whatsapp_logs FOR DELETE USING (true);
CREATE POLICY "Enable delete for service role" ON users FOR DELETE USING (true);
