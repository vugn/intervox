-- ====================================================================
-- Migration: Fix RLS write policies for system_settings & reference data
--
-- Root cause: the administrator policy on system_settings compared
--   users.id = auth.uid()
-- but auth.uid() is the Supabase Auth id, which maps to users.auth_id.
-- users.id is the internal primary key, so the check never matched and
-- every write was rejected by RLS (PostgREST returned an error with no
-- usable body, surfacing in the app as "Gagal menyimpan pengaturan.").
--
-- The reference data tables had a second problem: their write policies only
-- allowed 'lecturer' and 'head_of_program'. The 'head_of_program' role was
-- removed in 20260705063529 and replaced by 'administrator', so the admin
-- pages for kategori, bank soal, and kriteria penilaian could not write.
-- ====================================================================

-- 1. system_settings ------------------------------------------------------
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for system_settings" ON system_settings;
DROP POLICY IF EXISTS "Administrator full access to system_settings" ON system_settings;

CREATE POLICY "Read system_settings" ON system_settings
  FOR SELECT USING (true);

CREATE POLICY "Staff manage system_settings" ON system_settings
  FOR ALL
  USING (public.get_user_role() IN ('administrator', 'head_of_program'))
  WITH CHECK (public.get_user_role() IN ('administrator', 'head_of_program'));

-- 2. interview_categories -------------------------------------------------
DROP POLICY IF EXISTS "Manage categories" ON interview_categories;
DROP POLICY IF EXISTS "Update categories" ON interview_categories;
DROP POLICY IF EXISTS "Delete categories" ON interview_categories;

CREATE POLICY "Manage categories" ON interview_categories
  FOR INSERT WITH CHECK (public.get_user_role() IN ('administrator', 'lecturer', 'head_of_program'));
CREATE POLICY "Update categories" ON interview_categories
  FOR UPDATE USING (public.get_user_role() IN ('administrator', 'lecturer', 'head_of_program'));
CREATE POLICY "Delete categories" ON interview_categories
  FOR DELETE USING (public.get_user_role() IN ('administrator', 'head_of_program'));

-- 3. question_banks -------------------------------------------------------
DROP POLICY IF EXISTS "Manage questions" ON question_banks;
DROP POLICY IF EXISTS "Update questions" ON question_banks;
DROP POLICY IF EXISTS "Delete questions" ON question_banks;

CREATE POLICY "Manage questions" ON question_banks
  FOR INSERT WITH CHECK (public.get_user_role() IN ('administrator', 'lecturer', 'head_of_program'));
CREATE POLICY "Update questions" ON question_banks
  FOR UPDATE USING (public.get_user_role() IN ('administrator', 'lecturer', 'head_of_program'));
CREATE POLICY "Delete questions" ON question_banks
  FOR DELETE USING (public.get_user_role() IN ('administrator', 'lecturer', 'head_of_program'));

-- 4. scoring_criteria -----------------------------------------------------
DROP POLICY IF EXISTS "Manage criteria" ON scoring_criteria;
DROP POLICY IF EXISTS "Update criteria" ON scoring_criteria;
DROP POLICY IF EXISTS "Delete criteria" ON scoring_criteria;

CREATE POLICY "Manage criteria" ON scoring_criteria
  FOR INSERT WITH CHECK (public.get_user_role() IN ('administrator', 'head_of_program'));
CREATE POLICY "Update criteria" ON scoring_criteria
  FOR UPDATE USING (public.get_user_role() IN ('administrator', 'head_of_program'));
CREATE POLICY "Delete criteria" ON scoring_criteria
  FOR DELETE USING (public.get_user_role() IN ('administrator', 'head_of_program'));

-- 5. users: let an administrator register lecturer accounts ---------------
-- "Users insert own" only allows auth_id = auth.uid(), which blocks the
-- admin "Data Dosen" form because that row has no auth_id yet.
DROP POLICY IF EXISTS "Admin insert users" ON users;
CREATE POLICY "Admin insert users" ON users
  FOR INSERT WITH CHECK (public.get_user_role() IN ('administrator', 'head_of_program'));
