-- ==============================================================================
-- SEED: Kategori Modul + Bank Soal Wawancara (question_banks)
--
-- Isi     : 9 kategori modul dan 54 butir soal (6 soal per kategori) lengkap
--           dengan kata kunci jawaban ideal dan tingkat kesulitan bervariasi.
-- Jalankan: SQL Editor Supabase (service role, jadi tidak terhalang RLS).
-- Aman diulang: memakai ID tetap dengan ON CONFLICT DO UPDATE, sehingga
--           menjalankan ulang skrip ini memperbarui data, bukan menduplikasi.
--
-- Nama kategori disamakan dengan konstanta DEFAULT_LECTURER_CATEGORIES pada
-- app/lecturer/questions/page.tsx supaya halaman dosen tidak membuat kategori
-- duplikat saat pertama kali dibuka.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- OPSIONAL: hapus seluruh bank soal lama lebih dulu.
-- Hilangkan tanda komentar pada dua baris di bawah jika ingin mulai dari bersih.
-- ------------------------------------------------------------------------------
-- DELETE FROM question_banks;
-- DELETE FROM interview_categories WHERE id::text NOT LIKE '22222222-2222-4222-a222-%';

-- ------------------------------------------------------------------------------
-- 1. KATEGORI MODUL WAWANCARA (9 kategori)
-- ------------------------------------------------------------------------------
INSERT INTO interview_categories (id, category_name, description, module_type, difficulty_level, is_active, created_at, updated_at)
VALUES
  ('22222222-2222-4222-a222-000000000001', 'Teknologi / IT - Software Engineering', 'Pertanyaan teknis & arsitektur perangkat lunak', 'Kerja', 'medium', TRUE, NOW(), NOW()),
  ('22222222-2222-4222-a222-000000000002', 'Teknologi / IT - Data Science & AI', 'Pertanyaan analitis data dan kecerdasan buatan', 'Kerja', 'medium', TRUE, NOW(), NOW()),
  ('22222222-2222-4222-a222-000000000003', 'Teknologi / IT - Jaringan & Keamanan (Cybersecurity)', 'Pertanyaan infrastruktur & keamanan sistem', 'Kerja', 'medium', TRUE, NOW(), NOW()),
  ('22222222-2222-4222-a222-000000000004', 'Keuangan / Perbankan - Akuntansi & Analis Keuangan', 'Pertanyaan perbankan, akuntansi, dan analisis finansial', 'Kerja', 'medium', TRUE, NOW(), NOW()),
  ('22222222-2222-4222-a222-000000000005', 'Manajemen & Bisnis - Konsultan & Business Development', 'Pertanyaan pengembangan usaha, strategi bisnis, dan pemasaran', 'Kerja', 'medium', TRUE, NOW(), NOW()),
  ('22222222-2222-4222-a222-000000000006', 'General Interview - Kepribadian & Motivasi', 'Pertanyaan umum perkenalan, kelebihan/kelemahan, dan motivasi kerja', 'Kerja', 'easy', TRUE, NOW(), NOW()),
  ('22222222-2222-4222-a222-000000000007', 'Technical Interview - Kompetensi Teknis Dasar', 'Pertanyaan pendalaman skill teknis dan keahlian profesi', 'Kerja', 'medium', TRUE, NOW(), NOW()),
  ('22222222-2222-4222-a222-000000000008', 'Behavioral Interview - STAR Method & Situasional', 'Pertanyaan perilaku menghadapi konflik, kerja tim, dan tekanan deadline', 'Kerja', 'medium', TRUE, NOW(), NOW()),
  ('22222222-2222-4222-a222-000000000009', 'Case Interview - Studi Kasus & Pemecahan Masalah', 'Pertanyaan analisis skenario dan perumusan solusi konkret', 'Kerja', 'hard', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  category_name    = EXCLUDED.category_name,
  description      = EXCLUDED.description,
  module_type      = EXCLUDED.module_type,
  difficulty_level = EXCLUDED.difficulty_level,
  is_active        = EXCLUDED.is_active,
  updated_at       = NOW();

-- ------------------------------------------------------------------------------
-- 2. BANK SOAL (54 butir, 6 soal per kategori)
-- ------------------------------------------------------------------------------
INSERT INTO question_banks (id, category_id, question_text, ideal_keywords, difficulty_level, created_at, updated_at)
VALUES
  -- ══ Kategori 1: Software Engineering ════════════════════════════════════════
  ('66666666-6666-4666-a666-000000000001', '22222222-2222-4222-a222-000000000001', 'Jelaskan perbedaan mendasar antara arsitektur monolitik dan microservices, serta kapan waktu yang tepat untuk melakukan transisi.', 'skalabilitas, modularitas, independent deployment, overhead komunikasi, domain driven design', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000002', '22222222-2222-4222-a222-000000000001', 'Bagaimana cara Anda mendiagnosis dan mengatasi kebocoran memori (memory leak) pada aplikasi web yang sudah berjalan di produksi?', 'profiling, heap dump, garbage collection, monitoring, root cause analysis', 'hard', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000003', '22222222-2222-4222-a222-000000000001', 'Ceritakan bagaimana pipeline CI/CD yang baik dapat menurunkan risiko kegagalan saat rilis ke produksi.', 'automated testing, code review, staging, zero downtime, rollback', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000004', '22222222-2222-4222-a222-000000000001', 'Bagaimana Anda merancang skema basis data relasional yang mampu menangani jutaan transaksi per hari?', 'indexing, normalisasi, partitioning, query optimization, connection pooling', 'hard', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000005', '22222222-2222-4222-a222-000000000001', 'Apa yang Anda pahami tentang prinsip SOLID, dan berikan contoh penerapannya pada kode yang pernah Anda tulis.', 'single responsibility, open closed, dependency inversion, maintainability, refactoring', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000006', '22222222-2222-4222-a222-000000000001', 'Jelaskan perbedaan antara pengujian unit, integrasi, dan end-to-end beserta porsi ideal masing-masing dalam sebuah proyek.', 'unit test, integration test, end to end, test pyramid, code coverage', 'easy', NOW(), NOW()),

  -- ══ Kategori 2: Data Science & AI ═══════════════════════════════════════════
  ('66666666-6666-4666-a666-000000000007', '22222222-2222-4222-a222-000000000002', 'Bagaimana Anda menangani kumpulan data yang tidak seimbang (imbalanced dataset) pada permasalahan klasifikasi?', 'SMOTE, oversampling, undersampling, f1 score, precision recall', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000008', '22222222-2222-4222-a222-000000000002', 'Bagaimana cara mengevaluasi kinerja model Large Language Model (LLM) pada kasus penggunaan nyata?', 'BLEU, ROUGE, human evaluation, halusinasi, prompt engineering', 'hard', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000009', '22222222-2222-4222-a222-000000000002', 'Apa perbedaan supervised learning dan unsupervised learning? Berikan contoh penerapannya di industri Indonesia.', 'klasifikasi, regresi, clustering, segmentasi pelanggan, deteksi fraud', 'easy', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000010', '22222222-2222-4222-a222-000000000002', 'Bagaimana Anda mencegah overfitting maupun underfitting saat melatih model neural network?', 'cross validation, dropout, regularisasi, early stopping, augmentasi data', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000011', '22222222-2222-4222-a222-000000000002', 'Jelaskan langkah-langkah Anda dalam melakukan pembersihan dan persiapan data sebelum pemodelan.', 'missing value, outlier, encoding, normalisasi, feature engineering', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000012', '22222222-2222-4222-a222-000000000002', 'Bagaimana Anda menjelaskan hasil model yang kompleks kepada pemangku kepentingan yang tidak memiliki latar belakang teknis?', 'visualisasi, feature importance, storytelling, dampak bisnis, bahasa sederhana', 'medium', NOW(), NOW()),

  -- ══ Kategori 3: Jaringan & Keamanan (Cybersecurity) ═════════════════════════
  ('66666666-6666-4666-a666-000000000013', '22222222-2222-4222-a222-000000000003', 'Jelaskan cara kerja serangan SQL Injection dan langkah-langkah pencegahannya pada aplikasi web.', 'parameterized query, prepared statement, validasi input, least privilege, sanitasi', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000014', '22222222-2222-4222-a222-000000000003', 'Apa perbedaan antara autentikasi dan otorisasi? Berikan contoh implementasinya pada sebuah sistem informasi.', 'autentikasi, otorisasi, role based access control, token, sesi', 'easy', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000015', '22222222-2222-4222-a222-000000000003', 'Bagaimana langkah penanganan insiden yang Anda lakukan ketika mencurigai adanya kebocoran data pada sistem produksi?', 'identifikasi, isolasi, eradikasi, pemulihan, post-mortem, notifikasi', 'hard', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000016', '22222222-2222-4222-a222-000000000003', 'Jelaskan fungsi enkripsi simetris dan asimetris serta kapan masing-masing sebaiknya digunakan.', 'AES, RSA, kunci publik, kunci privat, TLS, pertukaran kunci', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000017', '22222222-2222-4222-a222-000000000003', 'Bagaimana cara Anda mengamankan komunikasi antar layanan pada arsitektur berbasis cloud?', 'TLS, mutual authentication, secret management, network policy, zero trust', 'hard', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000018', '22222222-2222-4222-a222-000000000003', 'Apa yang Anda ketahui tentang model OSI, dan pada lapisan mana permasalahan latensi jaringan umumnya dianalisis?', 'model OSI, lapisan transport, TCP, latensi, throughput, traceroute', 'easy', NOW(), NOW()),

  -- ══ Kategori 4: Akuntansi & Analis Keuangan ════════════════════════════════
  ('66666666-6666-4666-a666-000000000019', '22222222-2222-4222-a222-000000000004', 'Jelaskan keterkaitan antara laporan laba rugi, neraca, dan laporan arus kas dalam menilai kesehatan sebuah perusahaan.', 'laba bersih, laba ditahan, arus kas operasi, ekuitas, keterkaitan laporan', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000020', '22222222-2222-4222-a222-000000000004', 'Bagaimana Anda menilai kelayakan sebuah proyek investasi dari sisi keuangan?', 'NPV, IRR, payback period, biaya modal, analisis sensitivitas', 'hard', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000021', '22222222-2222-4222-a222-000000000004', 'Apa perbedaan antara basis akrual dan basis kas dalam pencatatan akuntansi?', 'basis akrual, basis kas, pengakuan pendapatan, matching principle, periode', 'easy', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000022', '22222222-2222-4222-a222-000000000004', 'Bagaimana langkah Anda ketika menemukan selisih pada proses rekonsiliasi bank di akhir periode?', 'rekonsiliasi, jurnal koreksi, dokumen pendukung, audit trail, ketelitian', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000023', '22222222-2222-4222-a222-000000000004', 'Rasio keuangan apa yang Anda gunakan untuk menilai likuiditas dan solvabilitas perusahaan, dan mengapa?', 'current ratio, quick ratio, debt to equity, interest coverage, likuiditas', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000024', '22222222-2222-4222-a222-000000000004', 'Bagaimana Anda menjaga ketelitian pekerjaan saat menangani volume transaksi yang besar dengan tenggat waktu ketat.', 'checklist, kontrol ganda, prioritas, otomatisasi spreadsheet, ketelitian', 'easy', NOW(), NOW()),

  -- ══ Kategori 5: Konsultan & Business Development ════════════════════════════
  ('66666666-6666-4666-a666-000000000025', '22222222-2222-4222-a222-000000000005', 'Bagaimana Anda menyusun strategi masuk pasar (go to market) untuk produk baru di kota tier dua?', 'segmentasi, target pasar, positioning, kanal distribusi, proyeksi biaya', 'hard', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000026', '22222222-2222-4222-a222-000000000005', 'Jelaskan cara Anda melakukan analisis SWOT dan bagaimana hasilnya diterjemahkan menjadi rencana aksi.', 'kekuatan, kelemahan, peluang, ancaman, rencana aksi, prioritas', 'easy', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000027', '22222222-2222-4222-a222-000000000005', 'Bagaimana Anda menentukan harga jual sebuah produk agar tetap kompetitif namun menguntungkan?', 'struktur biaya, margin, harga pesaing, nilai bagi pelanggan, elastisitas', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000028', '22222222-2222-4222-a222-000000000005', 'Ceritakan pendekatan Anda dalam membangun hubungan dengan klien baru yang masih ragu terhadap produk kita.', 'riset kebutuhan, membangun kepercayaan, demonstrasi nilai, tindak lanjut, negosiasi', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000029', '22222222-2222-4222-a222-000000000005', 'Metrik apa yang Anda pantau untuk mengukur keberhasilan sebuah inisiatif pengembangan bisnis?', 'pertumbuhan pendapatan, biaya akuisisi, retensi, konversi, margin kontribusi', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000030', '22222222-2222-4222-a222-000000000005', 'Bagaimana Anda menangani situasi ketika target penjualan tim tidak tercapai selama dua kuartal berturut-turut?', 'analisis akar masalah, evaluasi pipeline, penyesuaian strategi, pembinaan tim, transparansi', 'hard', NOW(), NOW()),

  -- ══ Kategori 6: General Interview - Kepribadian & Motivasi ══════════════════
  ('66666666-6666-4666-a666-000000000031', '22222222-2222-4222-a222-000000000006', 'Silakan perkenalkan diri Anda beserta latar belakang pendidikan dan minat karier yang ingin ditekuni.', 'nama, latar belakang, keahlian utama, tujuan karier, relevansi posisi', 'easy', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000032', '22222222-2222-4222-a222-000000000006', 'Apa kelebihan terbesar Anda, dan bagaimana kelebihan itu bermanfaat bagi posisi yang Anda lamar?', 'kelebihan spesifik, bukti pengalaman, relevansi posisi, dampak, kesadaran diri', 'easy', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000033', '22222222-2222-4222-a222-000000000006', 'Sebutkan satu kelemahan Anda dan langkah nyata yang sedang Anda lakukan untuk memperbaikinya.', 'kejujuran, kesadaran diri, langkah perbaikan, perkembangan, tanpa alasan', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000034', '22222222-2222-4222-a222-000000000006', 'Mengapa Anda tertarik bekerja di perusahaan kami, dan apa yang Anda ketahui tentang kami?', 'riset perusahaan, nilai perusahaan, kesesuaian minat, kontribusi, motivasi', 'easy', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000035', '22222222-2222-4222-a222-000000000006', 'Di mana Anda melihat diri Anda dalam lima tahun ke depan, dan bagaimana posisi ini mendukung rencana tersebut?', 'rencana karier, pengembangan diri, komitmen, realistis, keselarasan', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000036', '22222222-2222-4222-a222-000000000006', 'Bagaimana Anda menjaga motivasi ketika mengerjakan tugas yang terasa monoton dalam jangka panjang?', 'disiplin, tujuan jangka panjang, pembagian target, inisiatif perbaikan, konsistensi', 'easy', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  category_id      = EXCLUDED.category_id,
  question_text    = EXCLUDED.question_text,
  ideal_keywords   = EXCLUDED.ideal_keywords,
  difficulty_level = EXCLUDED.difficulty_level,
  updated_at       = NOW();

-- ------------------------------------------------------------------------------
-- 3. LANJUTAN BANK SOAL (kategori 7, 8, dan 9)
-- ------------------------------------------------------------------------------
INSERT INTO question_banks (id, category_id, question_text, ideal_keywords, difficulty_level, created_at, updated_at)
VALUES
  -- ══ Kategori 7: Technical Interview - Kompetensi Teknis Dasar ═══════════════
  ('66666666-6666-4666-a666-000000000037', '22222222-2222-4222-a222-000000000007', 'Jelaskan alur kerja Git yang biasa Anda gunakan dalam tim, mulai dari membuat cabang hingga penggabungan kode.', 'branch, commit, pull request, code review, merge conflict', 'easy', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000038', '22222222-2222-4222-a222-000000000007', 'Apa perbedaan antara REST API dan GraphQL, serta pada kondisi apa Anda memilih salah satunya?', 'endpoint, over fetching, schema, query, fleksibilitas klien', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000039', '22222222-2222-4222-a222-000000000007', 'Bagaimana cara Anda menelusuri penyebab sebuah fitur yang berjalan normal di komputer lokal namun gagal di server.', 'perbedaan environment, variabel konfigurasi, log, dependency, reproduksi masalah', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000040', '22222222-2222-4222-a222-000000000007', 'Jelaskan konsep kompleksitas waktu dan berikan contoh perbedaan algoritma pencarian linear dengan biner.', 'big O, kompleksitas waktu, pencarian linear, pencarian biner, efisiensi', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000041', '22222222-2222-4222-a222-000000000007', 'Apa yang Anda lakukan untuk memastikan kode yang Anda tulis mudah dipahami dan dirawat oleh rekan satu tim?', 'penamaan jelas, dokumentasi, konsistensi gaya, modularitas, code review', 'easy', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000042', '22222222-2222-4222-a222-000000000007', 'Bagaimana Anda mempelajari teknologi baru yang belum pernah Anda gunakan dalam waktu yang terbatas?', 'dokumentasi resmi, proyek kecil, sumber terpercaya, praktik langsung, bertanya', 'medium', NOW(), NOW()),

  -- ══ Kategori 8: Behavioral Interview - STAR Method & Situasional ════════════
  ('66666666-6666-4666-a666-000000000043', '22222222-2222-4222-a222-000000000008', 'Ceritakan situasi ketika Anda harus menyelesaikan pekerjaan dengan tenggat waktu yang sangat ketat. Apa yang Anda lakukan dan bagaimana hasilnya?', 'situation, task, action, result, prioritas, hasil terukur', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000044', '22222222-2222-4222-a222-000000000008', 'Ceritakan pengalaman Anda menghadapi perbedaan pendapat dengan anggota tim dan bagaimana Anda menyelesaikannya.', 'komunikasi, mendengarkan, kompromi, penyelesaian konflik, hasil akhir', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000045', '22222222-2222-4222-a222-000000000008', 'Ceritakan satu kegagalan terbesar Anda dan pelajaran apa yang Anda ambil dari kejadian tersebut.', 'kejujuran, tanggung jawab, akar masalah, pelajaran, perbaikan', 'hard', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000046', '22222222-2222-4222-a222-000000000008', 'Ceritakan momen ketika Anda mengambil inisiatif tanpa diminta atasan dan dampaknya bagi tim.', 'inisiatif, kepemilikan, dampak, koordinasi, hasil terukur', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000047', '22222222-2222-4222-a222-000000000008', 'Ceritakan pengalaman Anda menerima kritik atas hasil kerja dan bagaimana Anda menindaklanjutinya.', 'menerima masukan, tidak defensif, tindak lanjut, perbaikan, pertumbuhan', 'easy', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000048', '22222222-2222-4222-a222-000000000008', 'Ceritakan situasi ketika Anda harus bekerja sama dengan orang yang gaya kerjanya sangat berbeda dari Anda.', 'adaptasi, empati, komunikasi, pembagian peran, hasil kolaborasi', 'medium', NOW(), NOW()),

  -- ══ Kategori 9: Case Interview - Studi Kasus & Pemecahan Masalah ════════════
  ('66666666-6666-4666-a666-000000000049', '22222222-2222-4222-a222-000000000009', 'Sebuah aplikasi e-commerce mengalami penurunan konversi pembelian sebesar 20 persen dalam satu bulan. Bagaimana Anda menganalisis penyebabnya?', 'kerangka analisis, segmentasi data, funnel, hipotesis, prioritas perbaikan', 'hard', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000050', '22222222-2222-4222-a222-000000000009', 'Perusahaan ingin menekan biaya operasional sebesar 15 persen tanpa mengurangi jumlah karyawan. Apa saja usulan Anda?', 'struktur biaya, efisiensi proses, otomatisasi, negosiasi vendor, dampak jangka panjang', 'hard', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000051', '22222222-2222-4222-a222-000000000009', 'Sebuah kampus ingin meningkatkan jumlah mahasiswa yang siap kerja saat lulus. Bagaimana Anda merancang programnya?', 'identifikasi kebutuhan, indikator keberhasilan, pemangku kepentingan, tahapan program, evaluasi', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000052', '22222222-2222-4222-a222-000000000009', 'Estimasikan berapa banyak gelas kopi yang terjual per hari di sekitar kawasan kampus Anda beserta asumsi yang Anda gunakan.', 'estimasi, asumsi eksplisit, pemecahan masalah bertahap, perhitungan, validasi', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000053', '22222222-2222-4222-a222-000000000009', 'Sebuah layanan digital menerima banyak keluhan mengenai kecepatan aplikasi. Bagaimana Anda menentukan prioritas perbaikannya?', 'data keluhan, dampak pengguna, usaha pengerjaan, prioritas, pengukuran hasil', 'medium', NOW(), NOW()),
  ('66666666-6666-4666-a666-000000000054', '22222222-2222-4222-a222-000000000009', 'Anda diminta memutuskan apakah sebuah fitur baru layak dikembangkan meskipun data pendukungnya masih terbatas. Bagaimana Anda mengambil keputusan?', 'hipotesis, uji coba kecil, biaya peluang, risiko, kriteria keputusan', 'hard', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  category_id      = EXCLUDED.category_id,
  question_text    = EXCLUDED.question_text,
  ideal_keywords   = EXCLUDED.ideal_keywords,
  difficulty_level = EXCLUDED.difficulty_level,
  updated_at       = NOW();

-- ------------------------------------------------------------------------------
-- 4. TANDAI PEMBUAT SOAL (created_by) dengan akun dosen atau administrator
--    Kolom created_by mereferensi users(id), bukan auth.uid(). Jika belum ada
--    akun dosen maupun administrator, nilainya dibiarkan NULL.
-- ------------------------------------------------------------------------------
UPDATE question_banks
SET created_by = (
  SELECT id FROM users
  WHERE role IN ('lecturer', 'administrator')
  ORDER BY CASE role WHEN 'lecturer' THEN 0 ELSE 1 END, created_at
  LIMIT 1
)
WHERE id::text LIKE '66666666-6666-4666-a666-%'
  AND created_by IS NULL;

-- ==============================================================================
-- 5. VERIFIKASI HASIL SEED
-- ==============================================================================
SELECT
  c.category_name                                             AS kategori,
  c.module_type                                               AS jenis_modul,
  COUNT(q.id)                                                 AS jumlah_soal,
  COUNT(*) FILTER (WHERE q.difficulty_level = 'easy')         AS mudah,
  COUNT(*) FILTER (WHERE q.difficulty_level = 'medium')       AS sedang,
  COUNT(*) FILTER (WHERE q.difficulty_level = 'hard')         AS sulit
FROM interview_categories c
LEFT JOIN question_banks q ON q.category_id = c.id
GROUP BY c.id, c.category_name, c.module_type
ORDER BY c.category_name;

-- Total keseluruhan bank soal
SELECT COUNT(*) AS total_soal FROM question_banks;
