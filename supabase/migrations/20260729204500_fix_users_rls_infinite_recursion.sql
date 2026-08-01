-- ====================================================================
-- Migration: Fix Users RLS Infinite Recursion (42P17)
-- Jalankan migration baru ini di SQL Editor Supabase untuk mengatasi infinite recursion
-- ====================================================================

-- 1. Create a SECURITY DEFINER helper function to read user role WITHOUT triggering RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.users WHERE auth_id = auth.uid() LIMIT 1;
$$;

-- 2. Drop the recursive RLS policies on users table
DROP POLICY IF EXISTS "Users view own or admin views all" ON users;
DROP POLICY IF EXISTS "Users update own or admin update" ON users;

-- 3. Re-create non-recursive RLS policies using public.get_user_role()
CREATE POLICY "Users view own or admin views all" ON users
  FOR SELECT USING (
    auth_id = auth.uid() 
    OR public.get_user_role() IN ('administrator', 'lecturer', 'head_of_program')
  );

CREATE POLICY "Users update own or admin update" ON users
  FOR UPDATE USING (
    auth_id = auth.uid() 
    OR public.get_user_role() IN ('administrator', 'head_of_program')
  );

-- 4. Re-create policies for student_profiles and interview_sessions without recursive inline subqueries
DROP POLICY IF EXISTS "Profile select" ON student_profiles;
CREATE POLICY "Profile select" ON student_profiles
  FOR SELECT USING (
    user_id = get_user_id() 
    OR public.get_user_role() IN ('administrator', 'lecturer', 'head_of_program')
  );

DROP POLICY IF EXISTS "Session select" ON interview_sessions;
CREATE POLICY "Session select" ON interview_sessions
  FOR SELECT USING (
    user_id = get_user_id() 
    OR public.get_user_role() IN ('administrator', 'lecturer', 'head_of_program')
  );
