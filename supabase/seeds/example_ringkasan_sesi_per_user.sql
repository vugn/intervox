-- ==============================================================================
-- SEED: Example data ringkasan sesi interview untuk SATU user spesifik
--
-- Tujuan  : menyiapkan 5 sesi wawancara lengkap (transkrip, skor, analisis STAR,
--           ekspresi wajah, rekomendasi AI, log percakapan, dan penilaian diri)
--           supaya halaman Ringkasan Sesi dan seluruh laporan bisa di-screenshot.
-- Jalankan: SQL Editor Supabase (memakai service role, jadi tidak terhalang RLS).
-- Aman diulang: baris lama dengan ID contoh yang sama dihapus lebih dulu.
--
-- >>> UBAH NILAI target_email DI BAGIAN 1 SESUAI AKUN YANG MAU DIPAKAI <<<
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TENTUKAN USER TARGET
--    Skrip ini memakai users.id (primary key internal), BUKAN auth.uid().
--    Kalau lebih suka memakai auth id, ganti klausa WHERE menjadi:
--        WHERE auth_id = '00000000-0000-0000-0000-000000000000'
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS _target;

CREATE TEMP TABLE _target AS
SELECT id AS user_id, full_name, email
FROM users
WHERE lower(email) = lower('ganti.dengan@email-kamu.ac.id')
LIMIT 1;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM _target) THEN
    RAISE EXCEPTION 'User tidak ditemukan. Cek ulang email pada bagian 1, atau jalankan: SELECT id, email, role FROM users ORDER BY created_at DESC;';
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. PASTIKAN ADA KATEGORI MODUL (dipakai sebagai category_id sesi)
-- ------------------------------------------------------------------------------
INSERT INTO interview_categories (id, category_name, description, module_type, difficulty_level, is_active, created_at, updated_at)
VALUES ('22222222-2222-4222-a222-0000000000e1', 'Technical Interview', 'Modul wawancara teknis bidang teknologi informasi', 'Kerja', 'medium', TRUE, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 3. BERSIHKAN DATA CONTOH SEBELUMNYA (biar skrip bisa dijalankan berulang)
-- ------------------------------------------------------------------------------
DELETE FROM conversation_logs   WHERE session_id::text LIKE '55555555-5555-4555-a555-%';
DELETE FROM ai_recommendations  WHERE session_id::text LIKE '55555555-5555-4555-a555-%';
DELETE FROM analysis_results    WHERE session_id::text LIKE '55555555-5555-4555-a555-%';
DELETE FROM user_feedbacks      WHERE session_id::text LIKE '55555555-5555-4555-a555-%';
DELETE FROM interview_sessions  WHERE id::text         LIKE '55555555-5555-4555-a555-%';

-- ------------------------------------------------------------------------------
-- 4. INSERT 5 SESI INTERVIEW
--    Skor dibuat menanjak (68 → 91) agar laporan Grafik Perkembangan terlihat tren naik.
-- ------------------------------------------------------------------------------
INSERT INTO interview_sessions (
  id, user_id, category_id, module_type, role_target, company, language, personality, difficulty,
  status, score, candidate_name, candidate_email, education, years_experience,
  job_description, focus_areas, start_time, end_time,
  transcript, analysis, star_analysis, expression_data, self_assessment,
  is_verified_by_expert, created_at, updated_at
)
VALUES
-- ── Sesi 1 (paling lama, skor terendah) ───────────────────────────────────────
(
  '55555555-5555-4555-a555-000000000001',
  (SELECT user_id FROM _target),
  '22222222-2222-4222-a222-0000000000e1',
  'Kerja', 'Frontend Developer', 'PT Tokopedia', 'Indonesian', 'technical', 'easy',
  'completed', 68.00,
  (SELECT full_name FROM _target), (SELECT email FROM _target), 'S1', 'Fresh Graduate',
  'Membangun antarmuka web dengan React dan memastikan performa halaman tetap optimal.',
  'React, JavaScript, CSS',
  NOW() - INTERVAL '28 days',
  NOW() - INTERVAL '28 days' + INTERVAL '18 minutes',
  '[
    {"role": "ai", "text": "Selamat pagi! Bisa jelaskan perbedaan antara props dan state pada React?"},
    {"role": "user", "text": "Props itu data dari komponen induk dan sifatnya read-only, sedangkan state data internal komponen yang bisa berubah dan memicu render ulang."},
    {"role": "ai", "text": "Baik. Bagaimana cara kamu menangani halaman yang terasa lambat saat menampilkan daftar data yang panjang?"},
    {"role": "user", "text": "Biasanya saya pakai pagination. Mungkin bisa juga dengan virtual scrolling, tapi saya belum pernah menerapkannya langsung."}
  ]'::jsonb,
  '{
    "scores": {"communication": 72, "technical": 66, "problemSolving": 64, "cultureFit": 70},
    "strengths": ["Penjelasan konsep dasar React sudah tepat", "Bersedia mengakui keterbatasan pengalaman secara jujur"],
    "weaknesses": ["Jawaban optimasi masih terlalu umum dan tanpa contoh nyata", "Belum menyertakan angka atau hasil terukur dari pengalaman proyek"],
    "overallFeedback": "Pemahaman dasar sudah ada, namun jawaban perlu diperkuat dengan pengalaman konkret dan hasil yang terukur.",
    "expressionAnalysis": {"confidenceLevel": "rendah", "expressionFeedback": "Ekspresi cenderung tegang dan kontak mata sering teralih dari kamera.", "dominantExpression": "fearful"}
  }'::jsonb,
  '{
    "situation": "Kandidat menceritakan proyek kuliah pembuatan dashboard sederhana.",
    "task": "Diminta menampilkan daftar data yang cukup panjang tanpa membuat halaman lambat.",
    "action": "Menerapkan pagination bawaan tabel tanpa optimasi tambahan.",
    "result": "Halaman berjalan, namun kandidat belum dapat menyebutkan peningkatan performa secara kuantitatif."
  }'::jsonb,
  '{"dominantExpression": "fearful", "confidenceScore": 54, "nervousnessIndicator": 71, "totalFramesAnalyzed": 2160, "expressionDistribution": {"neutral": 41, "fearful": 33, "happy": 12, "sad": 9, "surprised": 5}}'::jsonb,
  '{"selfScore": 2, "confidenceLevel": "Sangat Gugup", "difficultyRating": 4, "whatWentWell": "Saya bisa menjawab pertanyaan konsep dasar dengan lancar.", "whatToImprove": "Saya perlu menyiapkan contoh proyek yang lebih spesifik.", "platformRating": 4, "platformFeedback": "Simulasinya terasa mirip wawancara sungguhan.", "wouldUseAgain": "Ya, pasti!", "submittedAt": "2026-07-12T09:20:00.000Z"}'::jsonb,
  FALSE,
  NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days'
),
-- ── Sesi 2 ────────────────────────────────────────────────────────────────────
(
  '55555555-5555-4555-a555-000000000002',
  (SELECT user_id FROM _target),
  '22222222-2222-4222-a222-0000000000e1',
  'Kerja', 'Frontend Developer', 'PT Bukalapak', 'Indonesian', 'hr', 'medium',
  'completed', 74.00,
  (SELECT full_name FROM _target), (SELECT email FROM _target), 'S1', 'Fresh Graduate',
  'Mencari kandidat yang mampu bekerja dalam tim lintas fungsi dan komunikatif.',
  'Teamwork, Komunikasi, Manajemen Waktu',
  NOW() - INTERVAL '21 days',
  NOW() - INTERVAL '21 days' + INTERVAL '23 minutes',
  '[
    {"role": "ai", "text": "Ceritakan pengalaman kamu saat harus bekerja dengan anggota tim yang sulit diajak berkoordinasi."},
    {"role": "user", "text": "Saat proyek akhir, satu anggota tim sering terlambat mengumpulkan bagiannya. Saya mengajaknya bicara empat mata, lalu kami sepakat memecah tugasnya menjadi target mingguan yang lebih kecil."},
    {"role": "ai", "text": "Bagaimana hasilnya setelah kesepakatan itu dijalankan?"},
    {"role": "user", "text": "Dia mulai menyelesaikan bagiannya tepat waktu dan proyek kami akhirnya selesai sesuai jadwal presentasi."}
  ]'::jsonb,
  '{
    "scores": {"communication": 79, "technical": 68, "problemSolving": 74, "cultureFit": 78},
    "strengths": ["Menyampaikan cerita dengan alur yang mudah diikuti", "Menunjukkan inisiatif menyelesaikan konflik secara langsung"],
    "weaknesses": ["Bagian hasil belum disertai ukuran keberhasilan yang jelas", "Belum menjelaskan pelajaran yang diambil dari situasi tersebut"],
    "overallFeedback": "Kemampuan komunikasi interpersonal cukup baik, tinggal melengkapi bagian hasil dengan data pendukung.",
    "expressionAnalysis": {"confidenceLevel": "sedang", "expressionFeedback": "Ekspresi mulai lebih tenang meski masih terlihat ragu di awal sesi.", "dominantExpression": "neutral"}
  }'::jsonb,
  '{
    "situation": "Proyek akhir perkuliahan dengan tim beranggotakan lima orang.",
    "task": "Menjaga jadwal proyek ketika satu anggota tim terus terlambat.",
    "action": "Melakukan diskusi empat mata dan memecah pekerjaan menjadi target mingguan.",
    "result": "Anggota tim kembali tepat waktu dan proyek selesai sesuai jadwal presentasi."
  }'::jsonb,
  '{"dominantExpression": "neutral", "confidenceScore": 66, "nervousnessIndicator": 52, "totalFramesAnalyzed": 2760, "expressionDistribution": {"neutral": 58, "happy": 19, "fearful": 14, "sad": 6, "surprised": 3}}'::jsonb,
  '{"selfScore": 3, "confidenceLevel": "Agak Gugup", "difficultyRating": 3, "whatWentWell": "Cerita pengalaman tim saya tersampaikan dengan runtut.", "whatToImprove": "Saya harus belajar menutup jawaban dengan hasil yang terukur.", "platformRating": 5, "platformFeedback": "Pertanyaan lanjutannya terasa natural.", "wouldUseAgain": "Ya, pasti!", "submittedAt": "2026-07-19T13:05:00.000Z"}'::jsonb,
  FALSE,
  NOW() - INTERVAL '21 days', NOW() - INTERVAL '21 days'
),
-- ── Sesi 3 ────────────────────────────────────────────────────────────────────
(
  '55555555-5555-4555-a555-000000000003',
  (SELECT user_id FROM _target),
  '22222222-2222-4222-a222-0000000000e1',
  'Kerja', 'Fullstack Developer', 'PT Gojek Indonesia', 'Indonesian', 'technical', 'medium',
  'completed', 79.00,
  (SELECT full_name FROM _target), (SELECT email FROM _target), 'S1', '1-2 tahun',
  'Mengembangkan fitur end-to-end mulai dari antarmuka hingga basis data.',
  'React, Node.js, PostgreSQL',
  NOW() - INTERVAL '14 days',
  NOW() - INTERVAL '14 days' + INTERVAL '27 minutes',
  '[
    {"role": "ai", "text": "Bagaimana kamu merancang skema basis data untuk fitur riwayat transaksi yang datanya tumbuh cepat?"},
    {"role": "user", "text": "Saya memisahkan tabel transaksi dan detailnya, menambahkan indeks pada kolom tanggal dan user_id, lalu menerapkan partisi bulanan agar query rentang tanggal tetap cepat."},
    {"role": "ai", "text": "Apa dampak partisi itu terhadap performa yang kamu ukur?"},
    {"role": "user", "text": "Waktu query laporan bulanan turun dari sekitar 4 detik menjadi di bawah 600 milidetik setelah partisi dan indeks diterapkan."}
  ]'::jsonb,
  '{
    "scores": {"communication": 80, "technical": 82, "problemSolving": 78, "cultureFit": 76},
    "strengths": ["Menyertakan angka hasil pengukuran performa yang konkret", "Alur penjelasan teknis tersusun dari masalah menuju solusi"],
    "weaknesses": ["Belum membahas risiko atau trade-off dari strategi partisi", "Aspek kolaborasi dengan tim belum banyak disinggung"],
    "overallFeedback": "Peningkatan terlihat jelas, terutama pada kemampuan menyajikan hasil kerja secara terukur.",
    "expressionAnalysis": {"confidenceLevel": "sedang", "expressionFeedback": "Kontak mata sudah stabil dan ekspresi terlihat lebih rileks.", "dominantExpression": "neutral"}
  }'::jsonb,
  '{
    "situation": "Fitur riwayat transaksi pada aplikasi magang dengan data yang tumbuh cepat.",
    "task": "Menjaga performa query laporan bulanan agar tetap responsif.",
    "action": "Normalisasi tabel, penambahan indeks pada kolom tanggal dan user_id, serta partisi bulanan.",
    "result": "Waktu query laporan turun dari sekitar 4 detik menjadi di bawah 600 milidetik."
  }'::jsonb,
  '{"dominantExpression": "neutral", "confidenceScore": 73, "nervousnessIndicator": 41, "totalFramesAnalyzed": 3240, "expressionDistribution": {"neutral": 62, "happy": 24, "fearful": 8, "surprised": 4, "sad": 2}}'::jsonb,
  '{"selfScore": 4, "confidenceLevel": "Cukup Percaya Diri", "difficultyRating": 3, "whatWentWell": "Saya berhasil menyebutkan angka hasil optimasi.", "whatToImprove": "Saya perlu menjelaskan trade-off dari keputusan teknis.", "platformRating": 5, "platformFeedback": "Analisis STAR-nya membantu saya paham struktur jawaban.", "wouldUseAgain": "Ya, pasti!", "submittedAt": "2026-07-26T10:40:00.000Z"}'::jsonb,
  TRUE,
  NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'
),
-- ── Sesi 4 ────────────────────────────────────────────────────────────────────
(
  '55555555-5555-4555-a555-000000000004',
  (SELECT user_id FROM _target),
  '22222222-2222-4222-a222-0000000000e1',
  'Magang', 'Backend Engineer Intern', 'PT Traveloka Indonesia', 'Indonesian', 'behavioral', 'hard',
  'completed', 85.00,
  (SELECT full_name FROM _target), (SELECT email FROM _target), 'S1', '1-2 tahun',
  'Program magang backend dengan fokus pada keandalan layanan dan pemecahan insiden.',
  'System Design, Debugging, Ownership',
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '7 days' + INTERVAL '31 minutes',
  '[
    {"role": "ai", "text": "Ceritakan momen ketika layanan yang kamu kembangkan mengalami gangguan di lingkungan produksi."},
    {"role": "user", "text": "Endpoint pencarian pernah melambat drastis saat trafik naik. Saya menelusuri log, menemukan query tanpa indeks, lalu menambahkan indeks komposit dan cache Redis untuk hasil yang sering diakses."},
    {"role": "ai", "text": "Apa yang kamu lakukan supaya masalah serupa tidak terulang?"},
    {"role": "user", "text": "Saya menambahkan alert pada metrik latensi dan membuat catatan post-mortem singkat, lalu memasukkan pengecekan indeks ke dalam daftar review sebelum rilis."}
  ]'::jsonb,
  '{
    "scores": {"communication": 86, "technical": 85, "problemSolving": 88, "cultureFit": 82},
    "strengths": ["Menunjukkan rasa tanggung jawab dengan tindakan pencegahan setelah insiden", "Proses diagnosis masalah dijelaskan secara sistematis", "Terbiasa memakai metrik sebagai dasar keputusan"],
    "weaknesses": ["Peran rekan tim dalam penyelesaian insiden belum disebutkan"],
    "overallFeedback": "Jawaban sudah mendekati standar kandidat siap kerja, lengkap dengan langkah pencegahan setelah masalah teratasi.",
    "expressionAnalysis": {"confidenceLevel": "tinggi", "expressionFeedback": "Ekspresi tenang dan konsisten, kontak mata terjaga sepanjang sesi.", "dominantExpression": "happy"}
  }'::jsonb,
  '{
    "situation": "Endpoint pencarian melambat drastis ketika trafik pengguna meningkat.",
    "task": "Memulihkan waktu respons layanan dan mencegah insiden terulang.",
    "action": "Menelusuri log, menambahkan indeks komposit, menerapkan cache Redis, lalu memasang alert latensi.",
    "result": "Waktu respons kembali normal dan tidak ada insiden serupa pada rilis berikutnya."
  }'::jsonb,
  '{"dominantExpression": "happy", "confidenceScore": 84, "nervousnessIndicator": 27, "totalFramesAnalyzed": 3720, "expressionDistribution": {"neutral": 49, "happy": 38, "surprised": 7, "fearful": 4, "sad": 2}}'::jsonb,
  '{"selfScore": 4, "confidenceLevel": "Percaya Diri", "difficultyRating": 4, "whatWentWell": "Saya menjelaskan proses debugging dengan runtut.", "whatToImprove": "Saya lupa menyebut kontribusi rekan tim.", "platformRating": 5, "platformFeedback": "Feedback ekspresi wajahnya sangat membantu.", "wouldUseAgain": "Ya, pasti!", "submittedAt": "2026-08-02T15:15:00.000Z"}'::jsonb,
  TRUE,
  NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'
),
-- ── Sesi 5 (paling baru, skor tertinggi) ──────────────────────────────────────
(
  '55555555-5555-4555-a555-000000000005',
  (SELECT user_id FROM _target),
  '22222222-2222-4222-a222-0000000000e1',
  'Kerja', 'Software Engineer', 'PT Bank Central Asia Tbk', 'Indonesian', 'technical', 'hard',
  'completed', 91.00,
  (SELECT full_name FROM _target), (SELECT email FROM _target), 'S1', '1-2 tahun',
  'Membangun layanan perbankan digital dengan standar keamanan dan keandalan tinggi.',
  'System Design, Security, Clean Code',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days' + INTERVAL '34 minutes',
  '[
    {"role": "ai", "text": "Bagaimana kamu memastikan sebuah transaksi tidak terproses ganda ketika permintaan dikirim ulang oleh klien?"},
    {"role": "user", "text": "Saya menerapkan idempotency key pada setiap permintaan, disimpan bersama status prosesnya, sehingga permintaan berulang dengan kunci sama mengembalikan hasil pertama tanpa memproses ulang."},
    {"role": "ai", "text": "Bagaimana kamu menguji bahwa mekanisme itu benar-benar bekerja?"},
    {"role": "user", "text": "Saya menulis pengujian integrasi yang mengirim permintaan serentak dengan kunci sama, lalu memverifikasi hanya satu baris transaksi terbentuk. Pengujian ini saya jalankan otomatis di pipeline CI."}
  ]'::jsonb,
  '{
    "scores": {"communication": 90, "technical": 93, "problemSolving": 92, "cultureFit": 88},
    "strengths": ["Menguasai pola idempotency dan mampu menjelaskannya dengan lugas", "Menyertakan strategi pengujian sebagai bukti solusi bekerja", "Kesadaran terhadap keamanan dan keandalan sistem sangat baik"],
    "weaknesses": ["Dapat ditambahkan pembahasan mengenai penanganan kegagalan jaringan pada sisi klien"],
    "overallFeedback": "Performa wawancara sangat solid dan layak direkomendasikan untuk tahap berikutnya.",
    "expressionAnalysis": {"confidenceLevel": "tinggi", "expressionFeedback": "Ekspresi percaya diri dengan intonasi stabil dan kontak mata konsisten.", "dominantExpression": "happy"}
  }'::jsonb,
  '{
    "situation": "Layanan pembayaran yang berpotensi menerima permintaan ganda dari klien.",
    "task": "Menjamin satu transaksi hanya diproses satu kali meski permintaan dikirim berulang.",
    "action": "Menerapkan idempotency key beserta penyimpanan status proses dan pengujian integrasi serentak di pipeline CI.",
    "result": "Tidak ditemukan transaksi ganda dan mekanisme terverifikasi otomatis pada setiap rilis."
  }'::jsonb,
  '{"dominantExpression": "happy", "confidenceScore": 91, "nervousnessIndicator": 18, "totalFramesAnalyzed": 4080, "expressionDistribution": {"happy": 47, "neutral": 44, "surprised": 5, "fearful": 3, "sad": 1}}'::jsonb,
  '{"selfScore": 5, "confidenceLevel": "Sangat Percaya Diri", "difficultyRating": 4, "whatWentWell": "Saya bisa menjelaskan solusi teknis sekaligus cara mengujinya.", "whatToImprove": "Menambah pembahasan penanganan kegagalan jaringan.", "platformRating": 5, "platformFeedback": "Sangat membantu untuk persiapan wawancara nyata.", "wouldUseAgain": "Ya, pasti!", "submittedAt": "2026-08-07T11:30:00.000Z"}'::jsonb,
  TRUE,
  NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'
);

-- ------------------------------------------------------------------------------
-- 5. INSERT ANALYSIS_RESULTS (diturunkan dari kolom analysis pada tiap sesi)
--    expression_score dihitung dari confidenceScore pada expression_data.
-- ------------------------------------------------------------------------------
INSERT INTO analysis_results (
  id, session_id, communication_score, technical_score, problem_solving_score, culture_fit_score,
  expression_score, strengths, weaknesses, overall_feedback,
  confidence_level, expression_feedback, dominant_expression, analyzed_at, created_at
)
SELECT
  gen_random_uuid(),
  s.id,
  (s.analysis->'scores'->>'communication')::numeric,
  (s.analysis->'scores'->>'technical')::numeric,
  (s.analysis->'scores'->>'problemSolving')::numeric,
  (s.analysis->'scores'->>'cultureFit')::numeric,
  (s.expression_data->>'confidenceScore')::numeric,
  s.analysis->'strengths',
  s.analysis->'weaknesses',
  s.analysis->>'overallFeedback',
  s.analysis->'expressionAnalysis'->>'confidenceLevel',
  s.analysis->'expressionAnalysis'->>'expressionFeedback',
  s.analysis->'expressionAnalysis'->>'dominantExpression',
  s.end_time,
  s.end_time
FROM interview_sessions s
WHERE s.id::text LIKE '55555555-5555-4555-a555-%';

-- ------------------------------------------------------------------------------
-- 6. INSERT AI_RECOMMENDATIONS (3 butir per sesi, dipakai laporan Rekomendasi)
-- ------------------------------------------------------------------------------
INSERT INTO ai_recommendations (session_id, priority, recommendation_type, recommendation_text, created_at)
VALUES
  ('55555555-5555-4555-a555-000000000001', 1, 'improvement', 'Susun tiga cerita pengalaman proyek memakai kerangka STAR agar jawaban tidak berhenti pada teori.', NOW() - INTERVAL '28 days'),
  ('55555555-5555-4555-a555-000000000001', 2, 'improvement', 'Latih penyebutan angka hasil kerja, misalnya waktu muat halaman sebelum dan sesudah perbaikan.', NOW() - INTERVAL '28 days'),
  ('55555555-5555-4555-a555-000000000001', 3, 'practice',    'Rekam latihan mandiri dan perhatikan arah pandangan agar kontak mata ke kamera lebih terjaga.', NOW() - INTERVAL '28 days'),

  ('55555555-5555-4555-a555-000000000002', 1, 'improvement', 'Tutup setiap cerita perilaku dengan bagian Result yang memuat ukuran keberhasilan.', NOW() - INTERVAL '21 days'),
  ('55555555-5555-4555-a555-000000000002', 2, 'improvement', 'Tambahkan satu kalimat pelajaran yang diambil di akhir jawaban pengalaman konflik tim.', NOW() - INTERVAL '21 days'),
  ('55555555-5555-4555-a555-000000000002', 3, 'strength',    'Pertahankan gaya bercerita yang runtut karena memudahkan pewawancara mengikuti alur.', NOW() - INTERVAL '21 days'),

  ('55555555-5555-4555-a555-000000000003', 1, 'improvement', 'Jelaskan trade-off dari keputusan teknis, misalnya biaya pemeliharaan tabel terpartisi.', NOW() - INTERVAL '14 days'),
  ('55555555-5555-4555-a555-000000000003', 2, 'improvement', 'Sisipkan peran kolaborasi dengan tim saat menceritakan penyelesaian masalah teknis.', NOW() - INTERVAL '14 days'),
  ('55555555-5555-4555-a555-000000000003', 3, 'strength',    'Kebiasaan menyertakan angka hasil pengukuran sudah tepat, lanjutkan pada sesi berikutnya.', NOW() - INTERVAL '14 days'),

  ('55555555-5555-4555-a555-000000000004', 1, 'improvement', 'Sebutkan kontribusi rekan tim agar jawaban tidak terkesan hasil kerja sendiri sepenuhnya.', NOW() - INTERVAL '7 days'),
  ('55555555-5555-4555-a555-000000000004', 2, 'practice',    'Siapkan versi ringkas jawaban insiden produksi dalam durasi maksimal dua menit.', NOW() - INTERVAL '7 days'),
  ('55555555-5555-4555-a555-000000000004', 3, 'strength',    'Langkah pencegahan setelah insiden menunjukkan rasa tanggung jawab yang dinilai tinggi.', NOW() - INTERVAL '7 days'),

  ('55555555-5555-4555-a555-000000000005', 1, 'improvement', 'Lengkapi jawaban idempotency dengan skenario kegagalan jaringan pada sisi klien.', NOW() - INTERVAL '2 days'),
  ('55555555-5555-4555-a555-000000000005', 2, 'practice',    'Siapkan pertanyaan balik kepada pewawancara untuk menutup sesi secara aktif.', NOW() - INTERVAL '2 days'),
  ('55555555-5555-4555-a555-000000000005', 3, 'strength',    'Penjelasan solusi yang selalu disertai strategi pengujian menjadi nilai lebih yang kuat.', NOW() - INTERVAL '2 days');

-- ------------------------------------------------------------------------------
-- 7. INSERT CONVERSATION_LOGS (dipecah otomatis dari transkrip: ai = pertanyaan, user = jawaban)
-- ------------------------------------------------------------------------------
INSERT INTO conversation_logs (session_id, question_text, user_answer, answer_type, timestamp, created_at)
SELECT
  s.id,
  s.transcript->i->>'text',
  s.transcript->(i + 1)->>'text',
  'voice',
  s.start_time + ((i / 2 + 1) * INTERVAL '5 minutes'),
  s.end_time
FROM interview_sessions s
CROSS JOIN LATERAL generate_series(0, jsonb_array_length(s.transcript) - 2, 2) AS i
WHERE s.id::text LIKE '55555555-5555-4555-a555-%';

-- ------------------------------------------------------------------------------
-- 8. INSERT USER_FEEDBACKS (dipakai laporan Umpan Balik Pengguna)
-- ------------------------------------------------------------------------------
INSERT INTO user_feedbacks (user_id, session_id, rating, comments, submitted_at, created_at)
SELECT
  s.user_id,
  s.id,
  (s.self_assessment->>'platformRating')::int,
  s.self_assessment->>'platformFeedback',
  s.end_time,
  s.end_time
FROM interview_sessions s
WHERE s.id::text LIKE '55555555-5555-4555-a555-%';

-- ==============================================================================
-- 9. QUERY RINGKASAN SESI INTERVIEW UNTUK USER TERSEBUT
--    Jalankan bagian ini untuk memverifikasi hasil seed sekaligus sebagai query
--    ringkasan yang bisa dipakai ulang kapan saja.
-- ==============================================================================
SELECT
  t.full_name                                                          AS nama_mahasiswa,
  to_char(s.start_time, 'DD/MM/YYYY HH24:MI')                          AS waktu_mulai,
  ROUND(EXTRACT(EPOCH FROM (s.end_time - s.start_time)) / 60)          AS durasi_menit,
  c.category_name                                                      AS kategori_modul,
  s.module_type                                                        AS jenis_wawancara,
  s.role_target                                                        AS posisi_dilamar,
  s.company                                                            AS perusahaan,
  s.difficulty                                                         AS tingkat_kesulitan,
  s.status,
  s.score                                                              AS skor_akhir,
  ar.communication_score                                               AS skor_komunikasi,
  ar.technical_score                                                   AS skor_teknis,
  ar.problem_solving_score                                             AS skor_problem_solving,
  ar.culture_fit_score                                                 AS skor_culture_fit,
  ar.expression_score                                                  AS skor_ekspresi,
  ar.dominant_expression                                               AS ekspresi_dominan,
  ar.confidence_level                                                  AS tingkat_kepercayaan_diri,
  jsonb_array_length(s.transcript)                                     AS baris_transkrip,
  (SELECT COUNT(*) FROM conversation_logs cl  WHERE cl.session_id = s.id) AS jumlah_tanya_jawab,
  (SELECT COUNT(*) FROM ai_recommendations r  WHERE r.session_id  = s.id) AS jumlah_rekomendasi,
  (s.self_assessment->>'selfScore')::int                               AS skor_penilaian_diri,
  s.is_verified_by_expert                                              AS sudah_divalidasi_dosen,
  ar.overall_feedback                                                  AS umpan_balik_keseluruhan
FROM interview_sessions s
CROSS JOIN _target t
LEFT JOIN interview_categories c ON c.id = s.category_id
LEFT JOIN analysis_results ar    ON ar.session_id = s.id
WHERE s.user_id = t.user_id
ORDER BY s.start_time DESC;
