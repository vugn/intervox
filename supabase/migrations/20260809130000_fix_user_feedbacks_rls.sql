-- ==============================================================================
-- Migration: Fix RLS policy untuk tabel user_feedbacks
--
-- Masalah:
-- 1. Policy "Read own feedback" menggunakan get_user_id() ATAU memeriksa role
--    yang hanya berisi 'lecturer' dan 'head_of_program'. Role 'administrator'
--    tidak termasuk sehingga admin tidak bisa membaca feedback siapa pun.
-- 2. Policy alternatif di migrasi 20260709 membandingkan user_id = auth.uid()
--    yang salah konteks (user_id adalah internal PK, bukan auth uid).
-- 3. Dean sudah punya policy terpisah, tapi sebaiknya digabung supaya konsisten.
--
-- Solusi: drop semua policy SELECT lama pada user_feedbacks, lalu buat satu
-- policy yang mencakup keempat skenario:
--   - Student bisa baca feedback miliknya sendiri
--   - Administrator, Lecturer, Head of Program, dan Dean bisa baca semua
-- ==============================================================================

-- Drop policy lama
DROP POLICY IF EXISTS "Read own feedback" ON user_feedbacks;
DROP POLICY IF EXISTS "Dean read access to user_feedbacks" ON user_feedbacks;

-- Buat policy baru yang benar
CREATE POLICY "Read feedback" ON user_feedbacks
  FOR SELECT USING (
    user_id = public.get_user_id()
    OR public.get_user_role() IN ('administrator', 'lecturer', 'dean', 'head_of_program')
  );
