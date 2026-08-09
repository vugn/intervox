-- ==============================================================================
-- Migration: Perbaiki view system_usage_stats
--
-- Masalah:
-- 1. View asli mengembalikan banyak baris (satu per bulan) dan kode JS memakai
--    .maybeSingle() yang melempar error jika ada lebih dari satu baris.
-- 2. Kolom avg_duration_minutes dan most_popular_module yang dibutuhkan UI
--    halaman /reports/system-stats belum ada di view.
-- 3. Supabase client membutuhkan akses GRANT pada view agar authenticated role
--    bisa membaca datanya tanpa terblokir RLS tabel yang mendasari.
--
-- Solusi: buat ulang view sebagai agregat keseluruhan (satu baris saja) yang
-- menyertakan seluruh kolom yang dipakai halaman, dan berikan izin akses. Jika
-- halaman tetap memfilter berdasarkan bulan di masa depan, cukup ubah JS
-- untuk mengambil banyak baris dan hilangkan limit(1).
-- ==============================================================================

-- Drop view lama
DROP VIEW IF EXISTS system_usage_stats;

-- Buat ulang view dengan kolom yang lengkap
CREATE OR REPLACE VIEW system_usage_stats AS
SELECT
  DATE_TRUNC('month', NOW())                                           AS month_period,
  COUNT(s.id)                                                          AS total_sessions,
  COUNT(DISTINCT s.user_id)                                            AS total_active_users,
  ROUND(AVG(s.score)::numeric, 2)                                      AS average_score,
  COUNT(CASE WHEN s.status = 'completed' THEN 1 END)                   AS completed_sessions,
  COUNT(CASE WHEN s.is_verified_by_expert = TRUE THEN 1 END)           AS verified_sessions,
  ROUND(AVG(EXTRACT(EPOCH FROM (s.end_time - s.start_time)) / 60)::numeric, 1) AS avg_duration_minutes,
  (
    SELECT c.category_name
    FROM interview_sessions ss
    JOIN interview_categories c ON c.id = ss.category_id
    GROUP BY c.category_name
    ORDER BY COUNT(*) DESC
    LIMIT 1
  )                                                                     AS most_popular_module
FROM interview_sessions s;

-- Berikan akses read
GRANT SELECT ON system_usage_stats TO authenticated;
GRANT SELECT ON system_usage_stats TO anon;
