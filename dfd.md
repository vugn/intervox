# Data Flow Diagram (DFD) Aplikasi Intervox

Dokumen ini berisi pemodelan **Data Flow Diagram (DFD)** mulai dari Level 0 (Context Diagram) hingga Level 4 untuk aplikasi **Intervox** (AI Interview System).

> [!NOTE]
> Pemodelan ini disusun berdasarkan struktur *database* Supabase dan arsitektur fitur aplikasi saat ini (termasuk peran Student, Administrator, Lecturer, dan Dean).

---

## 1. DFD Level 0 (Context Diagram)
Diagram konteks menggambarkan interaksi sistem secara keseluruhan dengan entitas eksternal (Terminators).

```mermaid
graph LR
    %% External Entities
    ST["Student / Kandidat"]
    AD["Administrator"]
    LC["Lecturer / Dosen"]
    DN["Dean / Pimpinan"]
    AI["AI Engine / LLM"]

    %% System
    SYS(("0. Sistem Intervox"))

    %% Data Flows
    ST -->|Data Profil, Video/Audio Jawaban, Feedback| SYS
    SYS -->|Auth Token, Pertanyaan, Hasil Analisis, PDF Laporan| ST

    AD -->|Verifikasi Akun, Konfigurasi Sistem| SYS
    SYS -->|Statistik Penggunaan, Data Pengguna| AD

    LC -->|Verifikasi Pakar, Feedback Manual| SYS
    SYS -->|Data Sesi Mahasiswa, Laporan Evaluasi| LC

    DN -->|Permintaan Laporan Akademik| SYS
    SYS -->|Dashboard Statistik, Laporan Keseluruhan| DN

    SYS -->|Transkrip Wawancara, System Prompt| AI
    AI -->|Skor Penilaian, Rekomendasi, Feedback STAR| SYS
```

---

## 2. DFD Level 1
Level 1 memecah Sistem Intervox menjadi proses-proses utama (sub-sistem) dan bagaimana data mengalir ke basis data (*data stores*).

```mermaid
graph TD
    %% Entities
    ST["Student"]
    AD["Administrator"]
    LC["Lecturer"]
    DN["Dean"]
    AI["AI Engine"]

    %% Processes
    P1(("1. Manajemen<br>Pengguna"))
    P2(("2. Konfigurasi<br>Wawancara"))
    P3(("3. Pelaksanaan<br>Wawancara"))
    P4(("4. Analisis<br>AI"))
    P5(("5. Pelaporan &<br>Dashboard"))

    %% Data Stores
    D1[("D1. Users & Profiles")]
    D2[("D2. Master Data")]
    D3[("D3. Interview Sessions")]
    D4[("D4. Analysis Results")]

    %% P1
    ST -->|Registrasi & Profil| P1
    AD -->|Verifikasi Akun| P1
    P1 -->|Simpan Data User| D1

    %% P2
    AD -->|Setup Kategori & Soal| P2
    P2 -->|Simpan Referensi| D2

    %% P3
    ST -->|Input Suara/Teks, Video Ekspresi| P3
    D2 -->|Daftar Pertanyaan| P3
    D1 -->|Validasi Akses| P3
    P3 -->|Simpan Sesi & Log Percakapan| D3

    %% P4
    D3 -->|Transkrip Sesi| P4
    P4 -->|Kirim Transkrip| AI
    AI -->|Skor, Feedback, STAR| P4
    LC -->|Validasi Pakar| P4
    P4 -->|Simpan Hasil Analisis| D4

    %% P5
    D4 -->|Data Metrik| P5
    D3 -->|Data Sesi| P5
    D1 -->|Data Pengguna| P5
    P5 -->|Akses Laporan Pribadi| ST
    P5 -->|Akses Laporan Verifikasi| AD
    P5 -->|Akses Evaluasi Nilai| LC
    P5 -->|Akses Dasbor Statistik| DN
```

---

## 3. DFD Level 2 (Breakdown Proses 3: Pelaksanaan Wawancara)
Level ini membedah lebih detail apa yang terjadi saat kandidat melakukan simulasi wawancara.

```mermaid
graph TD
    %% Entities
    ST["Student"]

    %% Processes
    P3_1(("3.1 Inisialisasi<br>Sesi Baru"))
    P3_2(("3.2 Perekaman<br>Tanya Jawab"))
    P3_3(("3.3 Analisis<br>Ekspresi Kamera"))
    P3_4(("3.4 Finalisasi<br>Sesi"))

    %% Data Stores
    D2[("D2. Master Data")]
    D3_1[("D3.1 Interview Sessions")]
    D3_2[("D3.2 Conversation Logs")]

    ST -->|Setup Parameter Role & Bahasa| P3_1
    P3_1 -->|Buat ID Sesi| D3_1
    
    D2 -->|Pertanyaan Sistem| P3_2
    ST -->|Jawaban Kandidat| P3_2
    P3_2 -->|Simpan Log Percakapan Teks/Suara| D3_2
    
    ST -->|Video Stream| P3_3
    P3_3 -->|Simpan Dominasi Emosi| D3_1
    
    ST -->|Sinyal Akhiri Wawancara| P3_4
    P3_4 -->|Update Status ke 'Analyzing'| D3_1
```

---

## 4. DFD Level 3 (Breakdown Proses 4: Analisis AI)
Level ini menjabarkan bagaimana sistem meracik *prompt*, memanggil API LLM (Gemini), dan menyimpan respons struktur.

```mermaid
graph TD
    %% Entities
    AI["AI Engine / LLM"]
    LC["Lecturer"]

    %% Processes
    P4_1(("4.1 Persiapan<br>Prompt & Konteks"))
    P4_2(("4.2 Eksekusi<br>LLM API"))
    P4_3(("4.3 Pemrosesan<br>Skor & Metrik"))
    P4_4(("4.4 Pemrosesan<br>Rekomendasi"))
    P4_5(("4.5 Verifikasi<br>Dosen Pakar"))

    %% Data Stores
    D3_1[("D3.1 Interview Sessions")]
    D4_1[("D4.1 Analysis Results")]
    D4_2[("D4.2 AI Recommendations")]

    D3_1 -->|Ambil Transkrip & Konteks Peran| P4_1
    P4_1 -->|Struktur Data Siap Uji| P4_2
    
    P4_2 -->|Kirim Request| AI
    AI -->|Terima Respons JSON| P4_2
    
    P4_2 -->|Payload Skor AI| P4_3
    P4_3 -->|Simpan Skor Total & Kekuatan| D4_1
    
    P4_2 -->|Payload Saran AI| P4_4
    P4_4 -->|Simpan Daftar Rekomendasi| D4_2
    
    LC -->|Input Ulasan Manual & Bintang| P4_5
    P4_5 -->|Update Status 'Verified'| D3_1
```

---

## 5. DFD Level 4 (Breakdown Proses 4.3: Pemrosesan Skor & Metrik)
Level 4 adalah tingkatan yang paling granular (spesifik), menunjukkan bagaimana JSON dari AI dibongkar (*parsing*) menjadi metrik-metrik individu sebelum disimpan.

```mermaid
graph TD
    %% Entities
    P4_2["Dari Proses 4.2<br>Eksekusi LLM API"]

    %% Processes
    P4_3_1(("4.3.1 Parsing Skor<br>Komunikasi"))
    P4_3_2(("4.3.2 Parsing Skor<br>Teknis"))
    P4_3_3(("4.3.3 Parsing Skor<br>Problem Solving"))
    P4_3_4(("4.3.4 Parsing Skor<br>Culture Fit"))
    P4_3_5(("4.3.5 Agregasi<br>Skor Keseluruhan"))

    %% Data Stores
    D4_1[("D4.1 Analysis Results")]

    P4_2 -->|JSON Node: Communication| P4_3_1
    P4_2 -->|JSON Node: Technical| P4_3_2
    P4_2 -->|JSON Node: ProblemSolving| P4_3_3
    P4_2 -->|JSON Node: CultureFit| P4_3_4

    P4_3_1 -->|Nilai Int (0-100)| P4_3_5
    P4_3_2 -->|Nilai Int (0-100)| P4_3_5
    P4_3_3 -->|Nilai Int (0-100)| P4_3_5
    P4_3_4 -->|Nilai Int (0-100)| P4_3_5

    P4_3_5 -->|Hitung Rata-rata &<br>Simpan ke Database| D4_1
```
