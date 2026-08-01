-- ====================================================================
-- Migration: Fix Row Level Security (RLS) policies for Administrator role
-- ====================================================================

-- 1. Ensure account_status column exists on users table with default 'pending'
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(20) DEFAULT 'pending' CHECK (account_status IN ('pending', 'approved', 'rejected'));

-- 2. Fill default account_status if any row has NULL status
UPDATE users SET account_status = 'pending' WHERE account_status IS NULL AND role = 'student';
UPDATE users SET account_status = 'approved' WHERE account_status IS NULL AND role IN ('administrator', 'head_of_program');

-- 3. Drop existing RLS policies on users table that restrict view/update
DROP POLICY IF EXISTS "Users view own or staff views all" ON users;
DROP POLICY IF EXISTS "Users update own" ON users;
DROP POLICY IF EXISTS "Users view own or admin views all" ON users;
DROP POLICY IF EXISTS "Users update own or admin update" ON users;

-- 4. Create new RLS policies allowing 'administrator', 'lecturer', and 'head_of_program' full view and status update access
CREATE POLICY "Users view own or admin views all" ON users
  FOR SELECT USING (
    auth_id = auth.uid() 
    OR get_user_role() IN ('administrator', 'lecturer', 'head_of_program')
    OR (SELECT role FROM users WHERE auth_id = auth.uid()) IN ('administrator', 'lecturer', 'head_of_program')
  );

CREATE POLICY "Users update own or admin update" ON users
  FOR UPDATE USING (
    auth_id = auth.uid() 
    OR get_user_role() IN ('administrator', 'head_of_program')
    OR (SELECT role FROM users WHERE auth_id = auth.uid()) IN ('administrator', 'head_of_program')
  );

-- 5. Update policies for student_profiles and interview_sessions so administrators can view candidate profiles and interviews
DROP POLICY IF EXISTS "Profile select" ON student_profiles;
CREATE POLICY "Profile select" ON student_profiles
  FOR SELECT USING (
    user_id = get_user_id() 
    OR get_user_role() IN ('administrator', 'lecturer', 'head_of_program')
    OR (SELECT role FROM users WHERE auth_id = auth.uid()) IN ('administrator', 'lecturer', 'head_of_program')
  );

DROP POLICY IF EXISTS "Session select" ON interview_sessions;
CREATE POLICY "Session select" ON interview_sessions
  FOR SELECT USING (
    user_id = get_user_id() 
    OR get_user_role() IN ('administrator', 'lecturer', 'head_of_program')
    OR (SELECT role FROM users WHERE auth_id = auth.uid()) IN ('administrator', 'lecturer', 'head_of_program')
  );
