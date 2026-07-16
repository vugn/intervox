-- ============================================
-- SQL Update v3 untuk Skripsi (Revisi Dospem & Panelis)
-- Penambahan Fitur Verifikasi Pakar & Analisis STAR
-- ============================================

-- 1. Penambahan Kolom Verifikasi dan Analisis STAR di tabel interview_sessions
ALTER TABLE interview_sessions 
ADD COLUMN IF NOT EXISTS is_verified_by_expert BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS expert_feedback TEXT,
ADD COLUMN IF NOT EXISTS expert_id UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS star_analysis JSONB DEFAULT '{}'::jsonb;

-- 2. Memperbarui status yang diizinkan pada interview_sessions (menambahkan 'pending-verification')
-- Drop constraint lama (jika ada) dan buat baru
ALTER TABLE interview_sessions DROP CONSTRAINT IF EXISTS interview_sessions_status_check;
ALTER TABLE interview_sessions ADD CONSTRAINT interview_sessions_status_check 
CHECK (status IN ('in-progress', 'analyzing', 'pending-verification', 'completed'));

-- 3. Pastikan tabel user_feedbacks ada (untuk Laporan Feedback Pengguna)
CREATE TABLE IF NOT EXISTS user_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES interview_sessions(id) ON DELETE SET NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comments TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mengaktifkan RLS untuk tabel user_feedbacks jika belum
ALTER TABLE user_feedbacks ENABLE ROW LEVEL SECURITY;

-- Tambah policy untuk user_feedbacks jika belum ada
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_feedbacks' AND policyname = 'Read own feedback') THEN
        CREATE POLICY "Read own feedback" ON user_feedbacks
          FOR SELECT USING (user_id = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) IN ('administrator', 'head_of_program'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_feedbacks' AND policyname = 'Insert own feedback') THEN
        CREATE POLICY "Insert own feedback" ON user_feedbacks
          FOR INSERT WITH CHECK (user_id = auth.uid());
    END IF;
END
$$;

-- 4. View untuk Laporan Statistik Penggunaan Sistem (Membantu Panelis 1)
-- View ini akan merangkum jumlah sesi, rata-rata skor, dll per bulan
CREATE OR REPLACE VIEW system_usage_stats AS
SELECT 
    DATE_TRUNC('month', created_at) AS month_period,
    COUNT(id) AS total_sessions,
    COUNT(DISTINCT user_id) AS total_active_users,
    AVG(score) AS average_score,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_sessions,
    COUNT(CASE WHEN is_verified_by_expert = TRUE THEN 1 END) AS verified_sessions
FROM interview_sessions
GROUP BY DATE_TRUNC('month', created_at);

-- Berikan akses read pada view
GRANT SELECT ON system_usage_stats TO authenticated;
GRANT SELECT ON system_usage_stats TO anon;

-- 5. Menambahkan default Kriteria Penilaian Dimensi Ilmiah (Catatan Panelis)
-- Catatan: Eksekusi manual jika id auto-increment atau hindari duplikasi
INSERT INTO scoring_criteria (criteria_name, description, weight_score, ideal_keywords)
VALUES 
('Struktur Jawaban (Metode STAR)', 'Menilai kemampuan merangkai jawaban berdasar Situation, Task, Action, Result', 30.00, 'situation, context, task, challenge, action, steps, result, outcome'),
('Relevansi Konten & Kompetensi', 'Kesesuaian jawaban dengan posisi yang dilamar dan pengalaman (CV)', 30.00, 'experience, skills, technical, relevant, matched'),
('Kepercayaan Diri & Ekspresi', 'Evaluasi dominasi emosi positif, netralitas, dan kepercayaan diri dari webcam', 20.00, 'confident, calm, professional, clear, articulate'),
('Diksi & Komunikasi Profesional', 'Pemilihan kata yang jelas, sopan, dan struktur kalimat yang baik', 20.00, 'vocabulary, structure, polite, clear, fluent')
ON CONFLICT DO NOTHING;
