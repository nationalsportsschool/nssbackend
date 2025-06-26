-- Add secondary sport field to students table
ALTER TABLE students ADD COLUMN secondary_sport sport_type;

-- Add comment for clarity
COMMENT ON COLUMN students.secondary_sport IS 'Optional second sport that the student is interested in';
