## HALAMAN JUDUL

**PROPOSAL SKRIPSI**  
**PENGEMBANGAN VIRTUAL INTERVIEW COACH BERBASIS REAL-TIME CONVERSATIONAL ARTIFICIAL INTELLIGENCE UNTUK ANALISIS DAN EVALUASI PERFORMA WAWANCARA MAHASISWA**

Disusun untuk memenuhi salah satu syarat penyusunan Skripsi  
Program Studi Teknik Informatika  
Fakultas Teknologi Informasi  
Universitas Islam Kalimantan Muhammad Arsyad Al Banjari (UNISKA)

Disusun oleh:  
Nama: [Nama Mahasiswa]  
NPM: [NPM]

BANJARMASIN  
2026

---

## CATATAN FORMAT NASKAH

Naskah ini disusun dalam format Markdown agar mudah dibaca. Saat dipindahkan ke dokumen akhir proposal, terapkan ketentuan pedoman: **Times New Roman 12 pt, spasi 2, paragraf justify, indent 1 tab, dan penomoran 1.1, 1.1.1, dst**.

---

## DAFTAR ISI

- HALAMAN JUDUL
- DAFTAR ISI
- DAFTAR GAMBAR
- DAFTAR TABEL
- BAB I PENDAHULUAN
  - 1.1 Latar Belakang
  - 1.2 Rumusan Masalah
  - 1.3 Batasan Masalah
  - 1.4 Tujuan Penelitian
  - 1.5 Manfaat Penelitian
  - 1.6 Sistematika Penulisan
- BAB II TINJAUAN PUSTAKA
  - 2.1 Landasan Teori
  - 2.2 Penelitian Terdahulu
  - 2.3 Kerangka Pemikiran
- BAB III METODOLOGI PENELITIAN DAN PERANCANGAN SISTEM
  - 3.1 Jenis dan Pendekatan Penelitian
  - 3.2 Metode Pengembangan Sistem
  - 3.3 Lokasi dan Waktu Penelitian
  - 3.4 Teknik Pengumpulan Data
  - 3.5 Analisis Kebutuhan Sistem
  - 3.6 Perancangan Sistem
  - 3.7 Rancangan Basis Data
  - 3.8 Rancangan Input dan Output
  - 3.9 Teknik Pengujian Sistem
  - 3.10 Kesesuaian Implementasi Codebase
- DAFTAR PUSTAKA

---

## DAFTAR GAMBAR

- Gambar 2.1 Kerangka Pemikiran Penelitian
- Gambar 3.1 Flowmap Sistem Lama (Manual)
- Gambar 3.2 Flowmap Sistem Usulan (Intervox)
- Gambar 3.3 DFD Level 0 Sistem Intervox
- Gambar 3.4 DFD Level 1 Proses Utama Sistem Intervox
- Gambar 3.5 Arsitektur Aplikasi Intervox

---

## DAFTAR TABEL

- Tabel 2.1 Ringkasan Penelitian Terdahulu
- Tabel 3.1 Kebutuhan Fungsional Sistem
- Tabel 3.2 Rancangan 10 Input Form Intervox
- Tabel 3.3 Rancangan 10 Output/Laporan Intervox
- Tabel 3.4 Struktur Tabel `users`
- Tabel 3.5 Struktur Tabel `student_profiles`
- Tabel 3.6 Struktur Tabel `interview_categories`
- Tabel 3.7 Struktur Tabel `question_banks`
- Tabel 3.8 Struktur Tabel `scoring_criteria`
- Tabel 3.9 Struktur Tabel `interview_sessions`
- Tabel 3.10 Struktur Tabel `conversation_logs`
- Tabel 3.11 Struktur Tabel `analysis_results`
- Tabel 3.12 Struktur Tabel `ai_recommendations`
- Tabel 3.13 Struktur Tabel `user_feedbacks`

---

# BAB I

## PENDAHULUAN

### 1.1 Latar Belakang

    Perkembangan dunia kerja saat ini ditandai oleh kompetisi yang semakin ketat, percepatan transformasi digital, serta kebutuhan kompetensi adaptif pada lulusan perguruan tinggi. Perusahaan tidak lagi hanya menilai kemampuan akademik, melainkan juga menilai kemampuan komunikasi, pemecahan masalah, dan kesiapan kandidat dalam berinteraksi profesional melalui tahapan wawancara. Kondisi ini menuntut mahasiswa memiliki kesiapan yang lebih komprehensif sebelum memasuki proses rekrutmen (World Economic Forum, 2023).

    Salah satu kompetensi yang berpengaruh terhadap keberhasilan seleksi kerja adalah kemampuan wawancara. Wawancara menjadi instrumen penting untuk menilai kecocokan kandidat terhadap kebutuhan organisasi. Seiring perkembangan teknologi, Artificial Intelligence (AI), khususnya conversational AI, memiliki potensi besar dalam menyediakan simulasi wawancara adaptif, responsif, dan terpersonalisasi. Sistem real-time conversational AI memungkinkan interaksi dua arah yang menyerupai situasi wawancara nyata sehingga proses latihan dapat lebih efektif (Jurafsky & Martin, 2023; Russell & Norvig, 2021).

    Pada praktiknya, banyak mahasiswa menghadapi hambatan dalam mempersiapkan wawancara kerja, seperti keterbatasan media latihan, rasa gugup saat menjawab pertanyaan, serta minimnya evaluasi terstruktur setelah sesi latihan. Latihan mandiri tanpa umpan balik objektif menyebabkan mahasiswa sulit mengidentifikasi kelemahan spesifik pada aspek komunikasi, struktur jawaban, maupun ketepatan konten. Akibatnya, peningkatan performa wawancara menjadi tidak terarah dan cenderung lambat.

    Beberapa penelitian terdahulu menunjukkan bahwa pendekatan digital dapat membantu proses pembelajaran komunikasi profesional. Penelitian Pratama dan Sari (2022) mengembangkan chatbot karier untuk latihan tanya jawab dasar, namun belum menyediakan analisis performa real-time. Penelitian Nurfadilah (2023) mengembangkan modul e-learning persiapan kerja, tetapi belum memiliki fitur interaksi percakapan dinamis. Penelitian Rahman, Putri, dan Akbar (2024) membangun sistem evaluasi jawaban berbasis teks, namun belum mengintegrasikan simulasi wawancara menyeluruh dan pelaporan perkembangan pengguna. Research gap pada penelitian ini terletak pada integrasi simulasi wawancara real-time, evaluasi multi-kriteria, rekomendasi pengembangan diri berbasis AI, serta pelaporan komprehensif dalam satu platform.

    Berdasarkan permasalahan tersebut, penelitian ini mengusulkan pengembangan sistem **Intervox**, yaitu virtual interview coach berbasis real-time conversational AI untuk membantu mahasiswa berlatih wawancara secara terstruktur, memperoleh analisis performa, serta mendapatkan rekomendasi peningkatan kompetensi. Oleh karena itu, penelitian ini berjudul **“Pengembangan Virtual Interview Coach Berbasis Real-Time Conversational Artificial Intelligence untuk Analisis dan Evaluasi Performa Wawancara Mahasiswa.”**

### 1.2 Rumusan Masalah

1. Bagaimana merancang dan mengembangkan aplikasi Intervox berbasis real-time conversational AI untuk latihan wawancara mahasiswa?
2. Bagaimana mengimplementasikan mekanisme analisis dan evaluasi performa wawancara secara terstruktur pada Intervox?
3. Bagaimana menghasilkan keluaran laporan yang komprehensif untuk mendukung monitoring perkembangan latihan mahasiswa?
4. Bagaimana menilai kelayakan fungsional sistem Intervox berdasarkan pengujian aplikasi?

### 1.3 Batasan Masalah

1. Penelitian difokuskan pada pengembangan aplikasi perangkat lunak (software engineering).
2. Pengguna utama adalah mahasiswa, dengan peran tambahan admin/dosen untuk pengelolaan data tertentu.
3. Sistem memuat 10 input form, 10 tabel database, dan 10 output/laporan sesuai spesifikasi penelitian.
4. Evaluasi performa difokuskan pada data sesi latihan dalam aplikasi, bukan asesmen psikologis klinis.
5. Pengujian sistem dibatasi pada pengujian fungsional (black-box) dan evaluasi awal pengguna.

### 1.4 Tujuan Penelitian

1. Mengembangkan aplikasi Intervox sebagai media latihan wawancara berbasis real-time conversational AI.
2. Mengimplementasikan fitur analisis dan evaluasi performa wawancara mahasiswa secara otomatis.
3. Menyediakan keluaran laporan yang mendukung pemetaan kekuatan, kelemahan, dan rekomendasi pengembangan diri.
4. Menguji kelayakan sistem dari sisi fungsi utama sesuai kebutuhan pengguna.

### 1.5 Manfaat Penelitian

**1.5.1 Manfaat Teoretis**  
Menambah kontribusi keilmuan pada bidang rekayasa perangkat lunak dan penerapan conversational AI dalam konteks pendidikan karier mahasiswa.

**1.5.2 Manfaat Praktis**

1. Bagi mahasiswa: membantu latihan wawancara secara mandiri dan terukur.
2. Bagi dosen/program studi: menjadi media pendukung pembinaan kesiapan karier mahasiswa.
3. Bagi institusi: mendukung peningkatan employability lulusan melalui inovasi pembelajaran berbasis AI.

### 1.6 Sistematika Penulisan

- **BAB I** membahas pendahuluan meliputi latar belakang, rumusan masalah, batasan, tujuan, manfaat, dan sistematika.
- **BAB II** membahas landasan teori, penelitian terdahulu, dan kerangka pemikiran.
- **BAB III** membahas metodologi penelitian, metode pengembangan, analisis kebutuhan, dan perancangan sistem Intervox.

---

# BAB II

## TINJAUAN PUSTAKA

### 2.1 Landasan Teori

#### 2.1.1 Wawancara Kerja dan Kesiapan Mahasiswa

Wawancara kerja merupakan proses komunikasi terstruktur untuk menilai kompetensi teknis dan nonteknis kandidat. Kesiapan wawancara dipengaruhi oleh kemampuan menyusun jawaban, penguasaan materi, pengelolaan kecemasan, dan kemampuan komunikasi interpersonal.

#### 2.1.2 Conversational Artificial Intelligence

Conversational AI adalah teknologi yang memungkinkan sistem berinteraksi dalam bentuk percakapan menggunakan pemrosesan bahasa alami (NLP). Dalam konteks pelatihan wawancara, conversational AI memungkinkan simulasi respons dinamis, pertanyaan lanjutan, dan evaluasi jawaban berbasis konteks (Jurafsky & Martin, 2023).

#### 2.1.3 Real-Time Interaction pada Sistem Latihan

Interaksi real-time meningkatkan kualitas pengalaman pengguna karena umpan balik diberikan segera setelah pengguna merespons. Hal ini penting untuk pembelajaran performatif seperti wawancara, karena pengguna dapat langsung mengetahui area perbaikan.

#### 2.1.4 Evaluasi Performa Wawancara

Evaluasi performa dilakukan menggunakan kriteria terukur, misalnya kejelasan komunikasi, relevansi konten, struktur jawaban, problem solving, dan kesesuaian budaya kerja. Evaluasi multi-kriteria menghasilkan informasi yang lebih objektif dibanding penilaian tunggal.

#### 2.1.5 Rekayasa Perangkat Lunak

Rekayasa perangkat lunak mencakup proses sistematis dari analisis kebutuhan hingga pengujian. Untuk sistem AI yang membutuhkan validasi interaksi pengguna secara berulang, pendekatan iteratif lebih sesuai karena mendukung perbaikan cepat terhadap kualitas fungsional dan pengalaman pengguna (Pressman & Maxim, 2020).

#### 2.1.6 Basis Data Relasional

Basis data relasional menyimpan data dalam tabel-tabel terstruktur dengan relasi melalui primary key dan foreign key. Pendekatan ini sesuai untuk sistem Intervox karena data pengguna, sesi wawancara, log percakapan, analisis, dan laporan memiliki keterkaitan kuat.

#### 2.1.7 DFD (Data Flow Diagram)

DFD digunakan untuk memodelkan aliran data antarkomponen sistem. DFD Level 0 menggambarkan sistem secara umum, sedangkan DFD Level 1 merinci proses utama.

### 2.2 Penelitian Terdahulu

**Tabel 2.1 Ringkasan Penelitian Terdahulu**

| No  | Peneliti                 | Judul/Topik                         | Hasil Utama                              | Keterbatasan                                     | Gap dengan Penelitian Ini                                                 |
| --- | ------------------------ | ----------------------------------- | ---------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------- |
| 1   | Pratama & Sari (2022)    | Chatbot persiapan wawancara         | Membantu latihan tanya jawab dasar       | Tidak real-time adaptif, tanpa analisis mendalam | Intervox menambah evaluasi multi-kriteria dan laporan lengkap             |
| 2   | Nurfadilah (2023)        | E-learning soft skill karier        | Materi terstruktur untuk persiapan kerja | Tidak ada simulasi percakapan langsung           | Intervox menyediakan simulasi wawancara interaktif real-time              |
| 3   | Rahman et al. (2024)     | Penilaian jawaban berbasis teks     | Otomatisasi skoring jawaban              | Tidak mengelola sesi latihan end-to-end          | Intervox mencakup sesi, log percakapan, analisis, rekomendasi, sertifikat |
| 4   | Hidayat & Lestari (2024) | Sistem monitoring latihan mahasiswa | Dashboard perkembangan                   | Tidak fokus pada wawancara AI                    | Intervox fokus pada coaching wawancara berbasis conversational AI         |

### 2.3 Kerangka Pemikiran

Penelitian ini berangkat dari masalah rendahnya kesiapan wawancara mahasiswa, kemudian dirumuskan solusi berupa pengembangan Intervox dengan komponen utama: simulasi real-time, analisis performa, rekomendasi AI, serta pelaporan komprehensif. Hasil akhir yang diharapkan adalah peningkatan kualitas latihan dan kesiapan mahasiswa menghadapi wawancara kerja.

**[Gambar 2.1 Kerangka Pemikiran Penelitian]**

---

# BAB III

## METODOLOGI PENELITIAN DAN PERANCANGAN SISTEM

### 3.1 Jenis dan Pendekatan Penelitian

Jenis penelitian ini adalah **penelitian pengembangan aplikasi** (software engineering research) dengan pendekatan **rancang bangun sistem**. Fokus penelitian adalah menghasilkan produk perangkat lunak Intervox yang fungsional dan relevan dengan kebutuhan pengguna.

### 3.2 Metode Pengembangan Sistem

Metode yang digunakan adalah **Model Prototype**, karena paling sesuai untuk riset AI yang memerlukan iterasi cepat antara desain, uji coba, dan perbaikan kualitas interaksi.

Tahapan model prototype:

1. Pengumpulan kebutuhan awal.
2. Perancangan cepat (quick design).
3. Pembuatan prototype awal.
4. Evaluasi pengguna dan revisi.
5. Penyempurnaan menjadi sistem final.
6. Pengujian dan dokumentasi.

### 3.3 Lokasi dan Waktu Penelitian

- Lokasi: Fakultas Teknologi Informasi UNISKA, Banjarmasin.
- Waktu: Semester berjalan tahun akademik 2025/2026.

### 3.4 Teknik Pengumpulan Data

1. **Observasi** proses latihan wawancara mahasiswa.
2. **Wawancara** dengan mahasiswa dan dosen pembimbing karier.
3. **Studi pustaka** terkait conversational AI, evaluasi wawancara, dan metode prototype.
4. **Dokumentasi** kebutuhan fitur dan skenario penggunaan.

### 3.5 Analisis Kebutuhan Sistem

**Tabel 3.1 Kebutuhan Fungsional Sistem**

| No  | Kode | Kebutuhan Fungsional                                   |
| --- | ---- | ------------------------------------------------------ |
| 1   | F-01 | Sistem menyediakan autentikasi login dan registrasi    |
| 2   | F-02 | Pengguna dapat mengelola profil dan akun               |
| 3   | F-03 | Pengguna dapat memilih modul/kategori latihan          |
| 4   | F-04 | Sistem menerima input jawaban real-time                |
| 5   | F-05 | Admin mengelola kategori dan bank pertanyaan           |
| 6   | F-06 | Admin mengelola kriteria penilaian                     |
| 7   | F-07 | Sistem menyimpan sesi dan log percakapan               |
| 8   | F-08 | Sistem menghasilkan analisis berbasis STAR, rekomendasi, dan laporan |
| 9   | F-09 | Pakar/Dosen melakukan validasi manual dan persetujuan nilai akhir (Expert Verification) |
| 10  | F-10 | Pengguna mengirim umpan balik aplikasi |
| 11  | F-11 | Admin mengelola data dosen/mentor dan melihat statistik penggunaan |

### 3.6 Perancangan Sistem

### 3.6.1 Flowmap Sistem Lama (Manual)

Sistem lama bersifat manual: mahasiswa mencari pertanyaan sendiri, berlatih tanpa simulator, lalu meminta masukan secara terbatas dari teman/dosen. Evaluasi tidak terstruktur dan data latihan tidak terdokumentasi.  
Alur ringkas:

1. Mahasiswa mempersiapkan pertanyaan secara manual.
2. Mahasiswa berlatih menjawab tanpa sistem evaluasi otomatis.
3. Umpan balik diperoleh tidak konsisten.
4. Tidak ada rekap histori perkembangan.

**[Gambar 3.1 Flowmap Sistem Lama (Manual)]**

### 3.6.2 Flowmap Sistem Usulan (Intervox)

Pada sistem usulan, mahasiswa login, memilih modul, melakukan sesi wawancara real-time dengan AI, menerima evaluasi otomatis, lalu mengakses laporan perkembangan. Admin mengelola data master dan kualitas materi.  
Alur ringkas:

1. User registrasi/login.
2. User memilih modul/kategori latihan.
3. Sistem menjalankan sesi wawancara AI secara dinamis dengan deteksi ekspresi wajah real-time.
4. Sistem memproses jawaban pengguna menggunakan analisis berbasis Metode STAR di akhir sesi.
5. Laporan berstatus "Menunggu Validasi" hingga Pakar/Dosen memberikan persetujuan (Expert Verification).
6. User mengakses laporan akhir yang telah tervalidasi beserta rekomendasi.

**[Gambar 3.2 Flowmap Sistem Usulan (Intervox)]**

### 3.6.3 DFD Level 0

DFD Level 0 menggambarkan Intervox sebagai satu proses utama yang berinteraksi dengan entitas eksternal:

- **Mahasiswa**: input data akun, jawaban, feedback; menerima laporan.
- **Admin/Dosen**: input data kategori, pertanyaan, kriteria, dosen.
- **Sistem AI**: memproses percakapan dan analisis.

**[Gambar 3.3 DFD Level 0 Sistem Intervox]**

### 3.6.4 DFD Level 1

DFD Level 1 merinci proses utama:

1. Manajemen autentikasi & profil.
2. Manajemen modul latihan & pertanyaan.
3. Eksekusi wawancara real-time.
4. Penyimpanan log & hasil analisis.
5. Penyajian laporan & rekomendasi.
6. Pengelolaan feedback pengguna dan data dosen/admin.

**[Gambar 3.4 DFD Level 1 Proses Utama Sistem Intervox]**

### 3.6.5 Arsitektur Sistem

Sistem Intervox dirancang sebagai aplikasi web dengan komponen:

- Frontend antarmuka pengguna.
- Backend layanan data dan analisis.
- Database relasional 10 tabel utama.
- Integrasi AI untuk conversational engine dan evaluasi respons.

**[Gambar 3.5 Arsitektur Aplikasi Intervox]**

---

### 3.7 Rancangan Basis Data

Implementasi Intervox saat ini menggunakan Firestore (NoSQL). Oleh karena itu, istilah “tabel” pada proposal dimaknai sebagai **entitas logis** yang dipetakan ke koleksi/dokumen Firestore. Beberapa data pada implementasi aktual disimpan ter-embedding di koleksi `interview_sessions`.

### 3.7.1 Tabel `users` (Tabel 3.4)

| No  | Field Name | Type     | Width | Keterangan             |
| --- | ---------- | -------- | ----- | ---------------------- |
| 1   | userId     | VARCHAR  | 36    | Primary key dokumen    |
| 2   | email      | VARCHAR  | 100   | Email pengguna (unik)  |
| 3   | role       | VARCHAR  | 20    | student/admin/lecturer |
| 4   | fullName   | VARCHAR  | 100   | Nama pengguna          |
| 5   | createdAt  | DATETIME | -     | Tanggal pembuatan akun |
| 6   | updatedAt  | DATETIME | -     | Tanggal pembaruan akun |

Keterangan: autentikasi kata sandi dikelola Firebase Authentication, sehingga `password_hash` tidak disimpan pada koleksi aplikasi.

### 3.7.2 Tabel `student_profiles` (Tabel 3.5)

| No  | Field Name     | Type    | Width | Keterangan             |
| --- | -------------- | ------- | ----- | ---------------------- |
| 1   | profileId      | VARCHAR | 36    | Primary key dokumen    |
| 2   | userId         | VARCHAR | 36    | Referensi ke users     |
| 3   | full_name      | VARCHAR | 100   | Nama lengkap mahasiswa |
| 4   | major          | VARCHAR | 100   | Jurusan                |
| 5   | university     | VARCHAR | 120   | Universitas            |
| 6   | graduationYear | VARCHAR | 10    | Tahun lulus            |
| 7   | targetIndustry | VARCHAR | 100   | Industri target        |
| 8   | cvPath         | VARCHAR | 255   | URL CV pengguna        |

### 3.7.3 Tabel `interview_categories` (Tabel 3.6)

| No  | Field Name      | Type     | Width | Keterangan              |
| --- | --------------- | -------- | ----- | ----------------------- |
| 1   | category_id     | VARCHAR  | 36    | Primary key             |
| 2   | categoryName    | VARCHAR  | 100   | Nama kategori           |
| 3   | moduleType      | VARCHAR  | 50    | technical/hr/behavioral |
| 4   | difficultyLevel | VARCHAR  | 20    | easy/medium/hard        |
| 5   | is_active       | BOOLEAN  | -     | Status kategori         |
| 6   | createdAt       | DATETIME | -     | Timestamp pembuatan     |

### 3.7.4 Tabel `question_banks` (Tabel 3.7)

| No  | Field Name      | Type     | Width | Keterangan                     |
| --- | --------------- | -------- | ----- | ------------------------------ |
| 1   | question_id     | VARCHAR  | 36    | Primary key                    |
| 2   | categoryId      | VARCHAR  | 36    | Relasi ke interview_categories |
| 3   | questionText    | TEXT     | -     | Teks pertanyaan                |
| 4   | idealKeywords   | TEXT     | -     | Kata kunci jawaban ideal       |
| 5   | difficultyLevel | VARCHAR  | 20    | Tingkat kesulitan              |
| 6   | createdAt       | DATETIME | -     | Waktu pembuatan                |

### 3.7.5 Tabel `scoring_criteria` (Tabel 3.8)

| No  | Field Name    | Type    | Width | Keterangan           |
| --- | ------------- | ------- | ----- | -------------------- |
| 1   | criteria_id   | VARCHAR | 36    | Primary key          |
| 2   | criteriaName  | VARCHAR | 100   | Nama kriteria        |
| 3   | description   | TEXT    | -     | Deskripsi kriteria   |
| 4   | weightScore   | DECIMAL | 5,2   | Bobot nilai          |
| 5   | idealKeywords | TEXT    | -     | Kata kunci penilaian |
| 6   | is_active     | BOOLEAN | -     | Status penggunaan    |

### 3.7.6 Tabel `interview_sessions` (Tabel 3.9)

| No  | Field Name          | Type       | Width | Keterangan                      |
| --- | ------------------- | ---------- | ----- | ------------------------------- |
| 1   | sessionId           | VARCHAR    | 36    | Primary key dokumen             |
| 2   | userId              | VARCHAR    | 36    | Relasi ke users                 |
| 3   | categoryId          | VARCHAR    | 36    | Relasi ke interview_categories  |
| 4   | roleTarget          | VARCHAR    | 100   | Posisi yang dilamar             |
| 5   | moduleType          | VARCHAR    | 50    | Jenis modul wawancara           |
| 6   | language            | VARCHAR    | 30    | Bahasa sesi                     |
| 7   | personality         | VARCHAR    | 30    | Gaya interviewer AI             |
| 8   | difficulty          | VARCHAR    | 20    | Tingkat kesulitan               |
| 9   | status              | VARCHAR    | 30    | in-progress/analyzing/pending-verification/completed |
| 10  | score/totalScore    | DECIMAL    | 5,2   | Nilai akhir                     |
| 11  | isVerifiedByExpert  | BOOLEAN    | -     | Status validasi dosen/pakar     |
| 12  | expertFeedback      | TEXT       | -     | Catatan manual dari pakar       |
| 13  | starAnalysis        | JSON       | -     | Hasil analisis metode STAR      |
| 14  | startTime           | DATETIME   | -     | Mulai sesi                      |
| 15  | endTime             | DATETIME   | -     | Selesai sesi                    |
| 16  | transcript          | ARRAY/JSON | -     | Log percakapan ter-embed        |
| 17  | analysis            | JSON       | -     | Hasil analisis AI ter-embed     |
| 18  | selfAssessment      | JSON       | -     | Umpan balik pengguna ter-embed  |
| 19  | createdAt/updatedAt | DATETIME   | -     | Timestamp sistem                |

### 3.7.7 Tabel `conversation_logs` (Tabel 3.10)

| No  | Field Name   | Type     | Width | Keterangan                   |
| --- | ------------ | -------- | ----- | ---------------------------- |
| 1   | logId        | VARCHAR  | 36    | Primary key                  |
| 2   | sessionId    | VARCHAR  | 36    | Relasi ke interview_sessions |
| 3   | questionText | TEXT     | -     | Pertanyaan AI                |
| 4   | userAnswer   | TEXT     | -     | Jawaban pengguna             |
| 5   | answerType   | VARCHAR  | 30    | Tipe jawaban                 |
| 6   | timestamp    | DATETIME | -     | Timestamp log                |

Keterangan: pada implementasi saat ini, koleksi ini belum menjadi sumber utama; laporan transkrip lebih sering membaca field `transcript` dari `interview_sessions`.

### 3.7.8 Tabel `analysis_results` (Tabel 3.11)

| No  | Field Name          | Type       | Width | Keterangan                   |
| --- | ------------------- | ---------- | ----- | ---------------------------- |
| 1   | analysisId          | VARCHAR    | 36    | Primary key                  |
| 2   | sessionId           | VARCHAR    | 36    | Relasi ke interview_sessions |
| 3   | communicationScore  | DECIMAL    | 5,2   | Skor komunikasi              |
| 4   | technicalScore      | DECIMAL    | 5,2   | Skor teknis                  |
| 5   | problemSolvingScore | DECIMAL    | 5,2   | Skor problem solving         |
| 6   | cultureFitScore     | DECIMAL    | 5,2   | Skor culture fit             |
| 7   | strengths           | ARRAY/TEXT | -     | Ringkasan kekuatan           |
| 8   | weaknesses          | ARRAY/TEXT | -     | Ringkasan kelemahan          |
| 9   | overallFeedback     | TEXT       | -     | Ringkasan evaluasi akhir     |
| 10  | analyzedAt          | DATETIME   | -     | Waktu analisis               |

Keterangan: pada implementasi saat ini, data analisis utama disimpan sebagai field `analysis` dalam `interview_sessions`.

### 3.7.9 Tabel `ai_recommendations` (Tabel 3.12)

| No  | Field Name         | Type     | Width | Keterangan                   |
| --- | ------------------ | -------- | ----- | ---------------------------- |
| 1   | recommendationId   | VARCHAR  | 36    | Primary key                  |
| 2   | sessionId          | VARCHAR  | 36    | Relasi ke interview_sessions |
| 3   | priority           | INT      | 2     | Prioritas rekomendasi        |
| 4   | recommendationType | VARCHAR  | 50    | Jenis rekomendasi            |
| 5   | recommendationText | TEXT     | -     | Isi rekomendasi              |
| 6   | createdAt          | DATETIME | -     | Waktu pembuatan              |

Keterangan: jika koleksi rekomendasi belum ada, sistem membuat fallback rekomendasi dari kelemahan pada hasil analisis.

### 3.7.10 Tabel `user_feedbacks` (Tabel 3.13)

| No  | Field Name   | Type     | Width | Keterangan                        |
| --- | ------------ | -------- | ----- | --------------------------------- |
| 1   | feedback_id  | VARCHAR  | 36    | Primary key                       |
| 2   | user_id      | VARCHAR  | 36    | Foreign key ke users              |
| 3   | session_id   | VARCHAR  | 36    | Foreign key ke interview_sessions |
| 4   | rating       | INT      | 2     | Nilai kepuasan (1-5)              |
| 5   | comments     | TEXT     | -     | Saran/kritik pengguna             |
| 6   | submitted_at | DATETIME | -     | Waktu kirim feedback              |

Keterangan implementasi aktual: umpan balik pengguna saat ini belum dipisah ke koleksi `user_feedbacks`, melainkan disimpan sebagai objek `selfAssessment` di dokumen `interview_sessions`.

---

### 3.8 Rancangan Input dan Output

### 3.8.1 Rancangan 10 Input Form

**Tabel 3.2 Rancangan 10 Input Form Intervox**

| No  | Nama Input Form           | Fungsi                                       | Status Implementasi                      |
| --- | ------------------------- | -------------------------------------------- | ---------------------------------------- |
| 1   | Registrasi & Login        | Autentikasi pengguna ke sistem               | Sudah                                    |
| 2   | Manajemen Profil & CV     | Input data diri dan unggah riwayat hidup     | Sudah                                    |
| 3   | Manajemen Bank Soal       | Admin mengelola pertanyaan wawancara         | Sudah                                    |
| 4   | Kriteria Penilaian STAR   | Admin menetapkan rubrik kriteria             | Sudah                                    |
| 5   | Pengaturan Sesi Wawancara | Mahasiswa menentukan jenis modul sesi        | Sudah                                    |
| 6   | Input Jawaban Real-time   | Menangkap ucapan/teks pengguna dan ekspresi  | Sudah                                    |
| 7   | Validasi & Evaluasi Pakar | Dosen/HRD mereview dan mengubah skor AI      | **Baru** (Menunggu Pengembangan)         |
| 8   | Umpan Balik Sistem        | Mahasiswa mengirim rating & feedback aplikasi| Sudah                                    |

### 3.8.2 Rancangan 10 Output/Laporan

**Tabel 3.3 Rancangan 10 Output/Laporan Intervox**

| No  | Nama Output/Laporan                   | Fungsi                                           | Status Implementasi |
| --- | ------------------------------------- | ------------------------------------------------ | ------------------- |
| 1   | Transkrip & Deteksi Ekspresi Wajah | Menampilkan percakapan AI dan analisis ekspresi | Sudah                                    |
| 2   | Hasil Evaluasi AI (Metode STAR)    | Menampilkan penilaian berdasarkan metode STAR   | **Baru** (Update Prompt/UI)              |
| 3   | Hasil Validasi Pakar (Final Score) | Laporan yang telah disetujui dosen/admin        | **Baru** (Menunggu Pengembangan)         |
| 4   | Rekap Performa Keseluruhan         | Rekapitulasi progres seluruh sesi mahasiswa     | **Baru** (Sesuai Catatan Panelis)        |
| 5   | Statistik Penggunaan Sistem        | Total sesi, waktu rata-rata, tren (Dosen)       | **Baru** (Sesuai Catatan Panelis)        |
| 6   | Laporan Feedback Pengguna          | Rekap saran dan tingkat kepuasan user           | **Baru** (Sesuai Catatan Panelis)        |
| 7   | Rekomendasi Pengembangan Diri      | Menyarankan area yang perlu dilatih ulang       | Sudah                                    |
| 8   | Sertifikat / Bukti Latihan         | Sertifikat digital penyelesaian latihan         | Sudah                                    |

---

### 3.9 Teknik Pengujian Sistem

1. **Black-box testing** untuk memverifikasi fungsi utama sesuai kebutuhan (autentikasi, sesi latihan, analisis, laporan).
2. **Uji skenario pengguna** untuk menilai kelancaran alur end-to-end.
3. **Uji validasi keluaran** terhadap konsistensi data laporan dengan data sesi dan log percakapan.
4. **Evaluasi awal pengguna** menggunakan kuesioner kepuasan untuk masukan penyempurnaan prototype.

### 3.10 Kesesuaian Implementasi Codebase

Berdasarkan implementasi aktual pada codebase Intervox, diperoleh ringkasan kesesuaian berikut:

1. Kebutuhan 10 form input dan 10 output laporan telah terimplementasi pada halaman aplikasi dan modul admin.
2. Koleksi utama yang aktif dipakai adalah `users`, `student_profiles`, `interview_categories`, `question_banks`, `scoring_criteria`, dan `interview_sessions`.
3. Entitas `conversation_logs`, `analysis_results`, dan `ai_recommendations` tersedia pada layer data service, namun pada alur utama data sering dibaca dari field ter-embed pada `interview_sessions`.
4. Entitas `user_feedbacks` secara logis sudah ada di rancangan, namun implementasi aktual menyimpan data feedback pada field `selfAssessment` di `interview_sessions`.
5. Data dosen diimplementasikan pada koleksi `users` dengan `role = lecturer`, bukan koleksi terpisah.
6. Terdapat dukungan kompatibilitas data lama melalui koleksi `sessions` (legacy fallback) pada beberapa fungsi pembacaan data.

Dengan demikian, proposal ini dinyatakan selaras dengan implementasi nyata menggunakan pendekatan **entity mapping** antara model konseptual proposal dan struktur Firestore aktual.

---

## DAFTAR PUSTAKA

Brown, T. B., Mann, B., Ryder, N., Subbiah, M., Kaplan, J., Dhariwal, P., Neelakantan, A., Shyam, P., Sastry, G., Askell, A., Agarwal, S., Herbert-Voss, A., Krueger, G., Henighan, T., Child, R., Ramesh, A., Ziegler, D. M., Wu, J., Winter, C., ... Amodei, D. (2020). Language models are few-shot learners. _Advances in Neural Information Processing Systems, 33_, 1877–1901.

Jurafsky, D., & Martin, J. H. (2023). _Speech and language processing_ (3rd ed. draft). Stanford University.

Nurfadilah. (2023). Pengembangan e-learning soft skill untuk kesiapan kerja mahasiswa. _Jurnal Teknologi Pembelajaran, 8_(2), 101–112.

Pressman, R. S., & Maxim, B. R. (2020). _Software engineering: A practitioner’s approach_ (9th ed.). McGraw-Hill.

Pratama, A., & Sari, D. (2022). Chatbot pendamping persiapan wawancara kerja bagi mahasiswa. _Jurnal Sistem Cerdas, 6_(1), 45–56.

Rahman, M., Putri, N., & Akbar, R. (2024). Sistem evaluasi jawaban wawancara berbasis analisis teks. _Jurnal Informatika Terapan, 10_(1), 15–27.

Russell, S., & Norvig, P. (2021). _Artificial intelligence: A modern approach_ (4th ed.). Pearson.

World Economic Forum. (2023). _The future of jobs report 2023_. World Economic Forum.
