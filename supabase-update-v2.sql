-- ============================================
-- SQL Update v2 untuk Skripsi (Menjalankan Perintah Dospem)
-- Jalankan di SQL Editor Supabase
-- ============================================

-- 1. Tambahkan status verifikasi ke tabel users
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(20) DEFAULT 'pending' CHECK (account_status IN ('pending', 'approved', 'rejected'));

-- Mengupdate role dari 'lecturer' menjadi 'administrator' untuk data yang sudah ada
UPDATE users SET role = 'administrator' WHERE role = 'lecturer';

-- Drop constraint lama dan buat baru untuk role
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'administrator', 'head_of_program'));

-- Akun admin dan kepala yang sudah ada otomatis di-approve
UPDATE users SET account_status = 'approved' WHERE role IN ('administrator', 'head_of_program');

-- 2. Buat tabel system_settings untuk data Kepala
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- Insert setting default untuk Kepala Program
INSERT INTO system_settings (setting_key, setting_value)
VALUES 
('head_of_program_signature', '{"name": "Prof. Dr. Hj. Silvia Ratna, S.Kom., M.Kom.", "nip": "19750913 200501 2 001", "signature_url": "", "qr_code_data": ""}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- 3. Buat tabel notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

