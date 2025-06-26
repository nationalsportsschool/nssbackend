-- NSS Database Seed Data
-- Insert sample data based on mock data structure

-- Insert coaches first (referenced by other tables)
INSERT INTO coaches (name, sport, contact, email, experience_years) VALUES
('Suresh Kumar', 'Cricket', '+91 9876543210', 'suresh@nss.com', 8),
('Ramesh Sharma', 'Football', '+91 9876543211', 'ramesh@nss.com', 6),
('Priya Singh', 'Tennis', '+91 9876543212', 'priya@nss.com', 5),
('Amit Patel', 'Swimming', '+91 9876543213', 'amit@nss.com', 7),
('Neeta Reddy', 'Basketball', '+91 9876543214', 'neeta@nss.com', 4),
('Rajesh Verma', 'Athletics', '+91 9876543215', 'rajesh@nss.com', 9);

-- Insert students (40 students as per mock data)
INSERT INTO students (name, sport, group_level, fee_plan, fee_amount, payment_status, parent_contact, last_payment) VALUES
('Aarav Patel', 'Cricket', 'Beginners', '₹2700', 2700, 'paid', '+91 9812345678', '2025-01-15'),
('Vivaan Sharma', 'Football', 'Intermediate', '₹2500', 2500, 'not_paid', '+91 9823456789', '2025-01-10'),
('Aditya Kumar', 'Tennis', 'Advanced', '₹2800', 2800, 'upcoming', '+91 9834567890', '2025-01-20'),
('Vihaan Singh', 'Athletics', 'Professional', '₹2200', 2200, 'paid', '+91 9845678901', '2025-01-25'),
('Arjun Gupta', 'Swimming', 'Beginners', '₹2800', 2800, 'not_paid', '+91 9856789012', '2025-01-12'),
('Sai Reddy', 'Basketball', 'Intermediate', '₹2400', 2400, 'upcoming', '+91 9867890123', '2025-01-18'),
('Reyansh Verma', 'Cricket', 'Advanced', '₹2700', 2700, 'paid', '+91 9878901234', '2025-01-22'),
('Ayaan Das', 'Football', 'Professional', '₹2500', 2500, 'not_paid', '+91 9889012345', '2025-01-08'),
('Krishna Menon', 'Tennis', 'Beginners', '₹2800', 2800, 'upcoming', '+91 9890123456', '2025-01-30'),
('Ishaan Iyer', 'Athletics', 'Intermediate', '₹2200', 2200, 'paid', '+91 9801234567', '2025-01-14'),
('Ananya Joshi', 'Swimming', 'Advanced', '₹2800', 2800, 'not_paid', '+91 9812345679', '2025-01-16'),
('Diya Khan', 'Basketball', 'Professional', '₹2400', 2400, 'upcoming', '+91 9823456780', '2025-01-11'),
('Saanvi Mehta', 'Cricket', 'Beginners', '₹2700', 2700, 'paid', '+91 9834567891', '2025-01-26'),
('Gauri Shah', 'Football', 'Intermediate', '₹2500', 2500, 'not_paid', '+91 9845678902', '2025-01-09'),
('Aadhya Nair', 'Tennis', 'Advanced', '₹2800', 2800, 'upcoming', '+91 9856789013', '2025-01-21'),
('Myra Rao', 'Athletics', 'Professional', '₹2200', 2200, 'paid', '+91 9867890124', '2025-01-17'),
('Pari Pillai', 'Swimming', 'Beginners', '₹2800', 2800, 'not_paid', '+91 9878901235', '2025-01-13'),
('Riya Chopra', 'Basketball', 'Intermediate', '₹2400', 2400, 'upcoming', '+91 9889012346', '2025-01-28'),
('Aisha Bose', 'Cricket', 'Advanced', '₹2700', 2700, 'paid', '+91 9890123457', '2025-01-19'),
('Tara Malik', 'Football', 'Professional', '₹2500', 2500, 'not_paid', '+91 9801234568', '2025-01-07'),
('Aryan Gupta', 'Tennis', 'Beginners', '₹2800', 2800, 'upcoming', '+91 9812345680', '2025-01-29'),
('Kavya Singh', 'Athletics', 'Intermediate', '₹2200', 2200, 'paid', '+91 9823456781', '2025-01-24'),
('Rohan Patel', 'Swimming', 'Advanced', '₹2800', 2800, 'not_paid', '+91 9834567892', '2025-01-06'),
('Meera Sharma', 'Basketball', 'Professional', '₹2400', 2400, 'upcoming', '+91 9845678903', '2025-01-31'),
('Dev Kumar', 'Cricket', 'Beginners', '₹2700', 2700, 'paid', '+91 9856789014', '2025-01-23'),
('Sia Reddy', 'Football', 'Intermediate', '₹2500', 2500, 'not_paid', '+91 9867890125', '2025-01-05'),
('Rian Verma', 'Tennis', 'Advanced', '₹2800', 2800, 'upcoming', '+91 9878901236', '2025-01-27'),
('Kiara Das', 'Athletics', 'Professional', '₹2200', 2200, 'paid', '+91 9889012347', '2025-01-04'),
('Arnav Menon', 'Swimming', 'Beginners', '₹2800', 2800, 'not_paid', '+91 9890123458', '2025-01-03'),
('Zara Iyer', 'Basketball', 'Intermediate', '₹2400', 2400, 'upcoming', '+91 9801234569', '2025-01-02'),
('Kian Joshi', 'Cricket', 'Advanced', '₹2700', 2700, 'paid', '+91 9812345681', '2025-01-01'),
('Nira Khan', 'Football', 'Professional', '₹2500', 2500, 'not_paid', '+91 9823456782', '2025-01-15'),
('Veer Mehta', 'Tennis', 'Beginners', '₹2800', 2800, 'upcoming', '+91 9834567893', '2025-01-10'),
('Lara Shah', 'Athletics', 'Intermediate', '₹2200', 2200, 'paid', '+91 9845678904', '2025-01-20'),
('Yash Nair', 'Swimming', 'Advanced', '₹2800', 2800, 'not_paid', '+91 9856789015', '2025-01-25'),
('Reet Rao', 'Basketball', 'Professional', '₹2400', 2400, 'upcoming', '+91 9867890126', '2025-01-12'),
('Ahaan Pillai', 'Cricket', 'Beginners', '₹2700', 2700, 'paid', '+91 9878901237', '2025-01-18'),
('Mira Chopra', 'Football', 'Intermediate', '₹2500', 2500, 'not_paid', '+91 9889012348', '2025-01-22'),
('Neil Bose', 'Tennis', 'Advanced', '₹2800', 2800, 'upcoming', '+91 9890123459', '2025-01-08'),
('Sara Malik', 'Athletics', 'Professional', '₹2200', 2200, 'paid', '+91 9801234570', '2025-01-30');

-- Insert payment logs
INSERT INTO payment_logs (student_id, amount, status, payment_date, method) VALUES
(1, 270000, 'paid', '2025-01-15', 'UPI'),
(2, 250000, 'not_paid', '2025-01-10', 'UPI'),
(3, 280000, 'upcoming', '2025-01-20', 'UPI'),
(4, 220000, 'paid', '2025-01-25', 'UPI'),
(5, 280000, 'not_paid', '2025-01-12', 'UPI'),
(6, 240000, 'upcoming', '2025-01-18', 'UPI'),
(7, 270000, 'paid', '2025-01-22', 'UPI'),
(8, 250000, 'not_paid', '2025-01-08', 'UPI'),
(9, 280000, 'upcoming', '2025-01-30', 'UPI'),
(10, 220000, 'paid', '2025-01-14', 'UPI');

-- Insert student attendance (sample data for recent dates)
INSERT INTO student_attendance (student_id, date, status, batch) VALUES
(1, '2025-06-10', 'Present', 'Cricket Training'),
(2, '2025-06-10', 'Absent', 'Football Training'),
(3, '2025-06-10', 'Present', 'Tennis Training'),
(4, '2025-06-10', 'Late', 'Athletics Training'),
(5, '2025-06-10', 'Present', 'Swimming Training'),
(6, '2025-06-10', 'Present', 'Basketball Training'),
(7, '2025-06-11', 'Present', 'Cricket Training'),
(8, '2025-06-11', 'Present', 'Football Training'),
(9, '2025-06-11', 'Absent', 'Tennis Training'),
(10, '2025-06-11', 'Present', 'Athletics Training');

-- Insert coach attendance
INSERT INTO coach_attendance (coach_id, date, status, entry_location, exit_location, total_hours) VALUES
(1, '2025-06-10', 'Present', 
 '{"lat": 19.0760, "lng": 72.8777, "address": "Andheri Sports Complex", "timestamp": "2025-06-10T08:30:00Z"}',
 '{"lat": 19.0760, "lng": 72.8777, "address": "Andheri Sports Complex", "timestamp": "2025-06-10T16:30:00Z"}',
 8.0),
(2, '2025-06-10', 'Present',
 '{"lat": 19.0176, "lng": 72.8562, "address": "Marine Drive Ground", "timestamp": "2025-06-10T09:00:00Z"}',
 '{"lat": 19.0176, "lng": 72.8562, "address": "Marine Drive Ground", "timestamp": "2025-06-10T17:00:00Z"}',
 8.0),
(3, '2025-06-11', 'Present',
 '{"lat": 19.1335, "lng": 72.8266, "address": "Kandivali Sports Center", "timestamp": "2025-06-11T08:00:00Z"}',
 '{"lat": 19.1335, "lng": 72.8266, "address": "Kandivali Sports Center", "timestamp": "2025-06-11T16:00:00Z"}',
 8.0),
(4, '2025-06-11', 'Late',
 '{"lat": 19.0545, "lng": 72.8326, "address": "Bandra Academy", "timestamp": "2025-06-11T09:30:00Z"}',
 '{"lat": 19.0545, "lng": 72.8326, "address": "Bandra Academy", "timestamp": "2025-06-11T17:30:00Z"}',
 8.0);

-- Insert drill activities
INSERT INTO drill_activities (title, description, image_url, date, sport, participants, duration, instructor_id) VALUES
('Advanced Batting Techniques', 'A session focusing on improving batting skills against fast bowlers, led by our top coach.', 'photo-1593341646782-e01c95c78a1a', '2025-06-20', 'Cricket', 12, '90 mins', 1),
('Football Dribbling Mastery', 'Learn advanced dribbling techniques to outmaneuver opponents.', 'photo-1574680096145-d05b474e2155', '2025-06-21', 'Football', 15, '75 mins', 2),
('Tennis Serve Power Training', 'Develop powerful and accurate serves with proper technique.', 'photo-1622279457486-62dcc4a431d6', '2025-06-22', 'Tennis', 8, '60 mins', 3),
('Swimming Stroke Technique', 'Perfect your freestyle and backstroke techniques.', 'photo-1530549387789-4c1017266635', '2025-06-23', 'Swimming', 10, '90 mins', 4),
('Basketball Shooting Drills', 'Improve shooting accuracy and form with targeted exercises.', 'photo-1546519638-68e109498ffc', '2025-06-24', 'Basketball', 12, '80 mins', 5);

-- Insert WhatsApp logs
INSERT INTO whatsapp_logs (student_id, message, status, sent_date, phone_number, message_type) VALUES
(1, 'Payment reminder sent', 'delivered', '2025-06-10', '+91 9812345678', 'Payment reminder'),
(2, 'Session reminder sent', 'delivered', '2025-06-10', '+91 9823456789', 'Session reminder'),
(3, 'Schedule update notification', 'pending', '2025-06-11', '+91 9834567890', 'Schedule update'),
(4, 'Welcome message sent', 'delivered', '2025-06-11', '+91 9845678901', 'Welcome message'),
(5, 'Attendance notification', 'delivered', '2025-06-12', '+91 9856789012', 'Attendance notification'),
(6, 'Monthly report sent', 'pending', '2025-06-12', '+91 9867890123', 'Monthly report');

-- Insert users (for authentication)
INSERT INTO users (username, password_hash, role, student_id, coach_id) VALUES
('admin', '$2b$10$hashedpassword', 'admin', NULL, NULL),
('coach_suresh', '$2b$10$hashedpassword', 'coach', NULL, 1),
('coach_ramesh', '$2b$10$hashedpassword', 'coach', NULL, 2),
('parent_aarav', '$2b$10$hashedpassword', 'parent', 1, NULL),
('parent_vivaan', '$2b$10$hashedpassword', 'parent', 2, NULL);
