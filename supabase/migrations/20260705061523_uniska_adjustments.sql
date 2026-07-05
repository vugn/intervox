-- Add NPM column to student_profiles
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS npm VARCHAR(20);

-- Update users role check constraint to explicitly include lecturer
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'administrator', 'lecturer', 'head_of_program'));
