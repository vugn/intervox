-- ==============================================================================
-- DIAGNOSIS & PERBAIKAN: Bank soal tampak kosong di halaman dosen
--
-- Penyebab paling umum: tabel interview_categories punya beberapa baris dengan
-- NAMA KATEGORI SAMA. Soal tersimpan di salah satu baris, sementara dropdown
-- memilih baris duplikat yang kosong, sehingga daftar soal terlihat kosong.
--
-- Jalankan BAGIAN A lebih dulu untuk melihat kondisi sebenarnya, baru putuskan
-- apakah perlu menjalankan BAGIAN B.
-- ==============================================================================


-- ==============================================================================
-- BAGIAN A — DIAGNOSIS (hanya membaca, tidak mengubah apa pun)
-- ==============================================================================

-- A1. Jumlah soal per kategori. Kategori dengan nama sama yang muncul dua kali
--     atau lebih di hasil ini adalah sumber masalahnya.
SELECT
  c.category_name                       AS kategori,
  c.id                                  AS category_id,
  to_char(c.created_at, 'DD/MM/YYYY HH24:MI') AS dibuat,
  c.is_active                           AS aktif,
  COUNT(q.id)                           AS jumlah_soal
FROM interview_categories c
LEFT JOIN question_banks q ON q.category_id = c.id
GROUP BY c.id, c.category_name, c.created_at, c.is_active
ORDER BY c.category_name, c.created_at;

-- A2. Daftar nama kategori yang terduplikasi.
SELECT
  lower(trim(category_name)) AS nama_kategori,
  COUNT(*)                   AS jumlah_baris
FROM interview_categories
GROUP BY lower(trim(category_name))
HAVING COUNT(*) > 1
ORDER BY jumlah_baris DESC;

-- A3. Total soal yang benar-benar tersimpan di database.
SELECT COUNT(*) AS total_soal FROM question_banks;

-- A4. Sepuluh soal terakhir yang masuk, beserta kategori dan pembuatnya.
SELECT
  to_char(q.created_at, 'DD/MM/YYYY HH24:MI') AS dibuat,
  c.category_name                             AS kategori,
  q.difficulty_level                          AS kesulitan,
  left(q.question_text, 70) || '…'            AS pertanyaan,
  u.full_name                                 AS dibuat_oleh
FROM question_banks q
LEFT JOIN interview_categories c ON c.id = q.category_id
LEFT JOIN users u                ON u.id = q.created_by
ORDER BY q.created_at DESC
LIMIT 10;


-- ==============================================================================
-- BAGIAN B — PERBAIKAN: gabungkan kategori duplikat
--
-- Untuk setiap nama kategori yang sama, baris TERTUA dipertahankan. Seluruh soal
-- dan sesi wawancara milik baris duplikat dipindahkan ke baris tertua tersebut,
-- lalu baris duplikatnya dihapus. Tidak ada soal yang hilang.
--
-- Jalankan seluruh blok di bawah ini sekaligus.
-- ==============================================================================

BEGIN;

CREATE TEMP TABLE _dupe_map AS
WITH ranked AS (
  SELECT
    id,
    lower(trim(category_name)) AS nama,
    ROW_NUMBER() OVER (
      PARTITION BY lower(trim(category_name))
      ORDER BY created_at, id
    ) AS urutan
  FROM interview_categories
),
keeper AS (
  SELECT nama, id AS keep_id FROM ranked WHERE urutan = 1
)
SELECT r.id AS dupe_id, k.keep_id
FROM ranked r
JOIN keeper k ON k.nama = r.nama
WHERE r.urutan > 1;

-- B1. Pindahkan soal dari kategori duplikat ke kategori yang dipertahankan.
UPDATE question_banks q
SET category_id = m.keep_id,
    updated_at  = NOW()
FROM _dupe_map m
WHERE q.category_id = m.dupe_id;

-- B2. Pindahkan juga sesi wawancara yang menunjuk kategori duplikat,
--     karena interview_sessions.category_id mereferensi tabel kategori.
UPDATE interview_sessions s
SET category_id = m.keep_id,
    updated_at  = NOW()
FROM _dupe_map m
WHERE s.category_id = m.dupe_id;

-- B3. Hapus baris kategori duplikat yang sekarang sudah tidak dipakai.
DELETE FROM interview_categories c
USING _dupe_map m
WHERE c.id = m.dupe_id;

DROP TABLE _dupe_map;

COMMIT;


-- ==============================================================================
-- BAGIAN C — VERIFIKASI SETELAH PERBAIKAN
--     Setiap nama kategori seharusnya muncul tepat satu kali,
--     dan jumlah soalnya sudah terkumpul pada satu baris.
-- ==============================================================================
SELECT
  c.category_name AS kategori,
  COUNT(q.id)     AS jumlah_soal
FROM interview_categories c
LEFT JOIN question_banks q ON q.category_id = c.id
GROUP BY c.id, c.category_name
ORDER BY c.category_name;
