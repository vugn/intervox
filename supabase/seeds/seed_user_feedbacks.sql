-- ==============================================================================
-- SEED: Umpan Balik Pengguna (user_feedbacks)
--
-- Isi     : 15 ulasan mahasiswa dengan rating 3-5 dan komentar realistis.
-- Syarat  : tabel users sudah berisi mahasiswa. Skrip ini mengambil user_id dari
--           pengguna berstatus student yang sudah ada di database.
-- Jalankan: SQL Editor Supabase (service role).
-- Aman diulang: memakai ID tetap dengan ON CONFLICT DO NOTHING.
-- ==============================================================================

-- Ambil sampel 15 mahasiswa acak yang ada di database
DROP TABLE IF EXISTS _students;
CREATE TEMP TABLE _students AS
SELECT id, full_name, email
FROM users
WHERE role = 'student' AND account_status = 'approved'
ORDER BY created_at
LIMIT 15;

-- Verifikasi ada cukup data
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM _students) = 0 THEN
    RAISE EXCEPTION 'Tidak ditemukan user student yang sudah approved. Jalankan seed users lebih dulu.';
  END IF;
END $$;

-- Bersihkan seed sebelumnya (ID berawalan 77777777)
DELETE FROM user_feedbacks WHERE id::text LIKE '77777777-7777-4777-a777-%';

-- Insert 15 ulasan
INSERT INTO user_feedbacks (id, user_id, session_id, rating, comments, submitted_at, created_at)
VALUES
(
  '77777777-7777-4777-a777-000000000001',
  (SELECT id FROM _students OFFSET 0 LIMIT 1),
  NULL,
  5,
  'Platform Intervox sangat membantu persiapan wawancara kerja saya. AI-nya terasa seperti pewawancara sungguhan dan feedback-nya sangat detail.',
  NOW() - INTERVAL '14 days',
  NOW() - INTERVAL '14 days'
),
(
  '77777777-7777-4777-a777-000000000002',
  (SELECT id FROM _students OFFSET 1 LIMIT 1),
  NULL,
  4,
  'Fitur transkrip percakapan memudahkan saya meninjau ulang jawaban. Saran: tambahkan timer countdown agar lebih terasa tekanan waktunya.',
  NOW() - INTERVAL '13 days',
  NOW() - INTERVAL '13 days'
),
(
  '77777777-7777-4777-a777-000000000003',
  (SELECT id FROM _students OFFSET 2 LIMIT 1),
  NULL,
  5,
  'Rekomendasi pengembangan dari AI sangat spesifik dan bisa langsung diterapkan. Berbeda dari feedback umum yang biasanya saya dapat dari teman.',
  NOW() - INTERVAL '12 days',
  NOW() - INTERVAL '12 days'
),
(
  '77777777-7777-4777-a777-000000000004',
  (SELECT id FROM _students OFFSET 3 LIMIT 1),
  NULL,
  3,
  'Secara keseluruhan bagus, tapi kadang respons AI agak lambat saat koneksi internet tidak stabil. Mungkin bisa ditambahkan mode offline untuk latihan mandiri.',
  NOW() - INTERVAL '11 days',
  NOW() - INTERVAL '11 days'
),
(
  '77777777-7777-4777-a777-000000000005',
  (SELECT id FROM _students OFFSET 4 LIMIT 1),
  NULL,
  5,
  'Sertifikat yang bisa diunduh setelah sesi sangat berguna untuk dilampirkan di CV dan portofolio lamaran kerja saya.',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '10 days'
),
(
  '77777777-7777-4777-a777-000000000006',
  (SELECT id FROM _students OFFSET 5 LIMIT 1),
  NULL,
  4,
  'Analisis ekspresi wajah via webcam cukup akurat. Saya jadi sadar bahwa ternyata ekspresi saya sering terlihat gugup padahal merasa biasa saja.',
  NOW() - INTERVAL '9 days',
  NOW() - INTERVAL '9 days'
),
(
  '77777777-7777-4777-a777-000000000007',
  (SELECT id FROM _students OFFSET 6 LIMIT 1),
  NULL,
  5,
  'Metode STAR yang diterapkan AI sangat membantu saya menyusun jawaban behavioral interview secara terstruktur. Sebelumnya jawaban saya selalu acak.',
  NOW() - INTERVAL '8 days',
  NOW() - INTERVAL '8 days'
),
(
  '77777777-7777-4777-a777-000000000008',
  (SELECT id FROM _students OFFSET 7 LIMIT 1),
  NULL,
  4,
  'Variasi pertanyaan antar sesi sudah bagus dan tidak terlalu repetitif. Harapannya bisa ditambah pertanyaan studi kasus yang lebih kompleks.',
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '7 days'
),
(
  '77777777-7777-4777-a777-000000000009',
  (SELECT id FROM _students OFFSET 8 LIMIT 1),
  NULL,
  3,
  'Untuk pertanyaan teknis, kadang AI memberikan pertanyaan lanjutan yang kurang nyambung dengan jawaban sebelumnya. Tapi secara umum sudah sangat memadai.',
  NOW() - INTERVAL '6 days',
  NOW() - INTERVAL '6 days'
),
(
  '77777777-7777-4777-a777-000000000010',
  (SELECT id FROM _students OFFSET 9 LIMIT 1),
  NULL,
  5,
  'Saya sudah melakukan 8 sesi latihan dan grafik perkembangan menunjukkan tren naik yang konsisten. Sangat memotivasi!',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
),
(
  '77777777-7777-4777-a777-000000000011',
  (SELECT id FROM _students OFFSET 10 LIMIT 1),
  NULL,
  4,
  'Dashboard mahasiswa sangat informatif. Bisa langsung lihat skor per sesi dan area mana yang perlu ditingkatkan.',
  NOW() - INTERVAL '4 days',
  NOW() - INTERVAL '4 days'
),
(
  '77777777-7777-4777-a777-000000000012',
  (SELECT id FROM _students OFFSET 11 LIMIT 1),
  NULL,
  5,
  'Setelah 3 kali berlatih di Intervox, saya akhirnya lolos wawancara kerja pertama saya di perusahaan teknologi. Terima kasih banyak!',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
),
(
  '77777777-7777-4777-a777-000000000013',
  (SELECT id FROM _students OFFSET 12 LIMIT 1),
  NULL,
  4,
  'Tingkat kesulitan pertanyaan bisa disesuaikan, cocok untuk pemula maupun yang sudah berpengalaman. Sangat fleksibel.',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
),
(
  '77777777-7777-4777-a777-000000000014',
  (SELECT id FROM _students OFFSET 13 LIMIT 1),
  NULL,
  5,
  'Laporan evaluasi yang dihasilkan sistem sangat lengkap dan profesional. Dosen saya pun terkesan saat melihat hasilnya.',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
),
(
  '77777777-7777-4777-a777-000000000015',
  (SELECT id FROM _students OFFSET 14 LIMIT 1),
  NULL,
  4,
  'Voice-to-voice interview terasa natural dan melatih kemampuan bicara spontan. Tidak ada platform lain yang bisa melakukan ini sebaik Intervox.',
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '6 hours'
)
ON CONFLICT (id) DO NOTHING;

-- Verifikasi
SELECT
  COUNT(*)                                                AS total_feedback,
  ROUND(AVG(rating)::numeric, 1)                          AS rata_rata_rating,
  COUNT(*) FILTER (WHERE rating = 5)                      AS rating_5,
  COUNT(*) FILTER (WHERE rating = 4)                      AS rating_4,
  COUNT(*) FILTER (WHERE rating = 3)                      AS rating_3
FROM user_feedbacks;
