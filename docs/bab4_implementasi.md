BAB IV
IMPLEMENTASI DAN PENGUJIAN

4.1	Spesifikasi Sistem
Spesifikasi sistem mencakup kebutuhan dan rancangan platform Intervox yang akan dibangun untuk mendukung proses simulasi wawancara berbasis kecerdasan buatan (AI) di lingkungan perguruan tinggi. Spesifikasi ini mencakup aspek fungsional dan non-fungsional yang diperlukan agar sistem dapat bekerja sesuai dengan kebutuhan mahasiswa, dosen, dan institusi.

4.1.1	Spesifikasi Perangkat keras (Hardware)
Spesifikasi perangkat keras digunakan untuk mendukung kelancaran operasional dan implementasi platform Intervox. Karena sistem berbasis web interaktif, pengguna membutuhkan perangkat keras dengan spesifikasi minimum agar pemrosesan simulasi AI berjalan lancar, khususnya terkait fitur pengenalan suara dan analisis ekspresi wajah. Adapun spesifikasi minimum perangkat keras yang disarankan adalah sebagai berikut:
1. Processor : Intel Core i5 / AMD Ryzen 5 atau yang setara
2. Memory RAM : 8 GB atau di atasnya
3. Monitor Display : Resolusi minimal 1366 x 768 (disarankan 1920 x 1080)
4. Perangkat I/O : Mikrofon (Microphone) dan Kamera Web (Webcam) yang berfungsi dengan baik
5. Jaringan : Terhubung ke internet dengan kecepatan stabil minimal 10 Mbps (diperlukan untuk pemrosesan AI secara real-time)

4.1.2	Spesifikasi Perangkat Lunak (Software)
Spesifikasi perangkat lunak yang digunakan untuk membangun dan menjalankan sistem ini adalah:
1. Sistem Operasi : Windows 10, macOS, atau distribusi Linux modern
2. Framework Utama : Next.js dan React
3. Bahasa Pemrograman : TypeScript dan Node.js
4. Database & BaaS : PostgreSQL yang dikelola melalui platform Supabase
5. Library Tambahan : Tailwind CSS (untuk styling antarmuka) dan modul Machine Learning (seperti face-api untuk deteksi ekspresi, serta API Generative AI)
6. Text Editor : Visual Studio Code
7. Browser Pengujian : Google Chrome, Mozilla Firefox, atau Microsoft Edge versi terbaru

4.2	Langkah Pembuatan Sistem
Mengembangkan sistem informasi simulasi wawancara Intervox ini dilakukan dengan menggunakan metode Waterfall. Metode ini bersifat linear dan berurutan, di mana setiap tahapan harus diselesaikan secara utuh sebelum melanjutkan ke tahap berikutnya, sehingga perancangan menjadi lebih terstruktur.
Adapun langkah-langkah pembuatan sistem berdasarkan metode Waterfall adalah sebagai berikut:

4.2.1	Analisa Kebutuhan Sistem
Langkah awal dalam pembuatan sistem adalah melakukan analisis kebutuhan. Pada tahap ini dilakukan pengumpulan informasi terkait kebutuhan latihan wawancara bagi mahasiswa, pengawasan oleh tenaga pendidik (dosen), serta pemantauan adopsi sistem tingkat fakultas oleh administrator dan dekanat.
Berdasarkan observasi dan studi analisis tersebut, diidentifikasi beberapa kebutuhan pengguna terhadap sistem:
1. Kemampuan simulasi wawancara dua arah menggunakan suara dan teks yang direspons oleh agen AI.
2. Analisis kemampuan wawancara yang mencakup evaluasi kelayakan jawaban maupun aspek non-teknis (seperti pengenalan ekspresi wajah).
3. Penyediaan metrik dan laporan komprehensif terkait perkembangan kompetensi mahasiswa.
4. Sistem harus mampu memisahkan dan mengakomodasi 4 peran pengguna yang berbeda dengan alur kerja masing-masing (Student, Lecturer, Administrator, dan Dean).

4.2.2	Perancangan Sistem
Tahap ini berfokus pada desain sistem berdasarkan hasil analisis kebutuhan, meliputi:
1. Desain Proses: menggunakan UML (Unified Modeling Language) untuk memodelkan alur kerja sistem dan interaksi antar komponen. Diagram UML yang digunakan antara lain:
   a. Use Case Diagram: untuk memetakan peran (aktor) dan fungsionalitas hak akses yang dimiliki di dalam sistem.
   b. Activity Diagram: untuk menampilkan langkah-langkah prosedural dari suatu proses, seperti persiapan memulai sesi latihan, atau manajemen bank soal oleh dosen.
   c. Sequence Diagram: untuk menampilkan urutan interaksi data antara objek frontend, backend, database, dan AI Service dari waktu ke waktu.
   d. Class Diagram: untuk merancang struktur data logika dan relasi antar entitas yang terlibat.
2. Desain Database: menggunakan Entity Relationship Diagram (ERD) untuk merancang fondasi arsitektur tabel database dan relasinya.
3. Desain Antarmuka: merancang user interface (UI) berupa konsep wireframe dari halaman-halaman utama untuk memetakan komponen aplikasi. Desain ditekankan pada penciptaan pengalaman pengguna (UX) yang imersif dan efisien.

4.2.3	Pembuatan Database
Pembuatan basis data (database) merupakan salah satu tahapan penting dalam pengembangan sistem untuk memastikan seluruh informasi terstruktur, aman, dan mudah diakses. Pada penelitian ini, basis data dibangun menggunakan relasional PostgreSQL yang dikelola melalui ekosistem Supabase. Struktur tabel dirancang mengikuti ERD yang telah dibuat, dengan relasi antar tabel diikat menggunakan foreign key beserta aturan ON DELETE CASCADE agar integritas data tetap terjaga. Terdapat sepuluh tabel utama yang digunakan dalam sistem, yaitu:
1. users : Menyimpan data identitas dan kredensial pengguna (email, nama lengkap, nomor telepon, program studi, fakultas, dan foto profil) beserta atribut role (student, lecturer, administrator, atau dean) serta account_status (pending, approved, rejected) yang menjadi dasar mekanisme verifikasi akun. Tabel ini terhubung ke tabel auth.users milik Supabase Auth melalui kolom auth_id.
2. student_profiles : Menyimpan data akademik dan profil lanjutan khusus mahasiswa, meliputi universitas, jurusan, tahun kelulusan, IPK, keahlian (skills), industri yang ditargetkan, tautan LinkedIn, serta berkas curriculum vitae (cv_url). Tabel ini berelasi satu-ke-satu dengan tabel users.
3. interview_categories : Menyimpan daftar kategori atau modul wawancara yang tersedia, mencakup nama kategori, deskripsi, jenis modul (module_type), tingkat kesulitan, dan status aktif kategori tersebut.
4. question_banks : Menyimpan bank pertanyaan kustom yang diinput oleh dosen untuk setiap kategori wawancara, dilengkapi kata kunci jawaban ideal (ideal_keywords), tingkat kesulitan, dan penanda pembuat pertanyaan (created_by).
5. scoring_criteria : Menyimpan kriteria penilaian beserta bobot skornya (weight_score) yang dijadikan acuan agen AI dalam melakukan evaluasi jawaban peserta.
6. interview_sessions : Mencatat data setiap sesi simulasi mahasiswa, meliputi kategori dan modul yang dipilih, parameter sesi (posisi yang dilamar, perusahaan, bahasa, kepribadian pewawancara, dan tingkat kesulitan), status sesi (in-progress, analyzing, completed), skor akhir, stempel waktu mulai dan selesai, serta data hasil sesi dalam format JSONB (transcript, analysis, self_assessment, dan expression_data).
7. conversation_logs : Menyimpan riwayat percakapan baris per baris antara agen AI dan pengguna selama wawancara berlangsung, mencakup teks pertanyaan, jawaban pengguna, jenis jawaban (suara atau teks), dan waktu perekamannya.
8. analysis_results : Menyimpan hasil penilaian otomatis pasca-wawancara per sesi, terdiri atas skor komunikasi, teknis, pemecahan masalah, kecocokan budaya kerja, dan skor ekspresi wajah, disertai daftar kekuatan (strengths), kelemahan (weaknesses), umpan balik keseluruhan, tingkat kepercayaan diri, serta ekspresi dominan yang terdeteksi.
9. ai_recommendations : Menyimpan butir-butir rekomendasi perbaikan yang dihasilkan AI untuk setiap sesi, dilengkapi tingkat prioritas dan jenis rekomendasi sehingga dapat ditampilkan secara berurutan pada halaman hasil.
10. user_feedbacks : Menyimpan umpan balik pengguna terhadap kualitas sistem maupun sesi wawancara tertentu, berupa nilai rating (skala 1–5) dan komentar, yang kemudian direkap pada laporan umpan balik pengguna.

Selain kesepuluh tabel utama di atas, sistem juga memanfaatkan tabel pendukung system_settings untuk menyimpan preferensi aplikasi berskala global (misalnya berkas tanda tangan Dekan yang dibutuhkan untuk cetak sertifikat otomatis) dan tabel notifications untuk menyimpan notifikasi pengguna, serta sebuah view system_usage_stats yang merangkum statistik penggunaan sistem per periode bulan guna mempercepat penyajian laporan agregat.

4.2.4	Pembuatan Antarmuka Sistem
Pengembangan antarmuka sistem (frontend) dilakukan menggunakan perpaduan Next.js, React, TypeScript, dan Tailwind CSS untuk menghasilkan antarmuka modern yang ringan, responsif, serta interaktif. Tampilan dirancang supaya seluruh fitur mudah dioperasikan melalui peramban. Layar halaman yang dikembangkan meliputi:
1. Halaman Autentikasi (Landing, Sign In, Sign Up) yang melayani lalu lintas pengguna masuk.
2. Halaman Dashboard terpersonalisasi untuk masing-masing role yang memuat widget analitik ringkas.
3. Halaman Sesi Interview yang menyatukan komponen antarmuka streaming video/audio, deteksi ekspresi wajah (Face API), dan chat transcript AI dalam satu layar waktu-nyata.
4. Halaman Manajemen (bagi Lecturer dan Administrator) untuk mengontrol bank soal, kategori modul, daftar pengguna, hingga persetujuan (verifikasi) akun baru mahasiswa.
5. Halaman Laporan (Report) yang menyajikan tampilan rekapitulasi data komprehensif siap cetak (Export to PDF), baik laporan capaian individu, performa satu kelas, maupun metrik keseluruhan institusi.

4.2.5	Implementasi Hak Akses Pengguna
Dalam sistem ini, hak akses pengguna dipisahkan secara hierarkis ke dalam 4 tingkatan, yaitu:
1. Student : Berperan sebagai pengguna akhir latihan. Memiliki akses untuk memulai sesi simulasi AI, melihat skor dan evaluasi hasil latihan sendiri, serta mengunduh sertifikat atau transkrip percakapan.
2. Lecturer : Bertanggung jawab dalam manajemen materi studi. Dapat mengelola pertanyaan spesifik di bank soal dan melihat berbagai laporan performa maupun tingkat kedisiplinan (kehadiran latihan) mahasiswa di kelas bimbingannya.
3. Administrator : Memiliki wewenang tata kelola sistem. Berhak menyetujui akun pengguna baru (verifikasi role), mengelola direktori dosen, mengatur pengaturan dokumen sistem, serta memantau keluhan/umpan balik performa AI.
4. Dean (Dekan) : Bertindak sebagai pihak eksekutif peninjau. Diberikan hak pemantauan berbasis level institusi untuk mengukur efektivitas sistem dan agregasi capaian partisipan secara keseluruhan.

4.2.6	Uji Coba dan Debugging
Setelah kerangka sistem selesai dibangun, tahapan uji coba (testing) fungsional dilakukan. Ini mencakup pemeriksaan kelancaran interaksi modul suara dan AI, pembatasan otorisasi antar role pengguna (role check), hingga perenderan layout secara responsif. Saat dijumpai kendala atau error (misalnya kesalahan urutan hook React atau inkonsistensi kembalian data kosong), segera dilakukan perbaikan (debugging) sampai sistem beroperasi dengan stabil.

4.2.7	Deployment
Sistem (frontend dan layanan API) kemudian di-deploy ke lingkungan komputasi awan produksi modern (seperti Vercel atau ekosistem Node.js terkait) terhubung langsung dengan Supabase, sehingga aplikasi web Intervox ini akhirnya dapat diakses publik oleh mahasiswa, dosen, serta staf institusi secara luas.
