-- ==============================================================================
-- MIGRATION: 20260801150000_seed_35_real_mockup_data.sql
-- PURPOSE: Bersihkan semua data selain tabel users, lalu seed 35 data user real,
--          profil mahasiswa, 9 kategori interview, 36 bank soal, 35 sesi interview
--          nyata beserta transkrip, analisis skor, rekomendasi, dan log percakapan.
-- ==============================================================================

-- 1. HAPUS SEMUA DATA SELAIN TABEL USERS (Tabel users tidak dihapus sesuai instruksi)
DELETE FROM conversation_logs;
DELETE FROM analysis_results;
DELETE FROM ai_recommendations;
DELETE FROM user_feedbacks;
DELETE FROM interview_sessions;
DELETE FROM question_banks;
DELETE FROM scoring_criteria;
DELETE FROM interview_categories;
DELETE FROM student_profiles;
DELETE FROM notifications;

-- 2. INSERT 35 DATA USERS REAL (Mahasiswa Indonesia dari Berbagai Universitas & Jurusan)
INSERT INTO users (id, email, full_name, role, account_status, phone, department, faculty, created_at, updated_at)
VALUES
  ('11111111-1111-4111-a111-000000000001', 'rizki.pratama@ui.ac.id', 'Rizki Pratama', 'student', 'approved', '081234567801', 'Teknik Informatika', 'Fakultas Ilmu Komputer', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
  ('11111111-1111-4111-a111-000000000002', 'nadia.rahma@itb.ac.id', 'Nadia Rahmawati', 'student', 'approved', '081234567802', 'Sistem Informasi', 'Fakultas Teknik dan Ilmu Komputer', NOW() - INTERVAL '29 days', NOW() - INTERVAL '29 days'),
  ('11111111-1111-4111-a111-000000000003', 'dinda.aulia@ugm.ac.id', 'Dinda Aulia Putri', 'student', 'approved', '081234567803', 'Ilmu Komputer', 'Fakultas MIPA', NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days'),
  ('11111111-1111-4111-a111-000000000004', 'bagas.saputra@its.ac.id', 'Bagas Saputra', 'student', 'approved', '081234567804', 'Teknik Informatika', 'Fakultas Teknologi Elektro dan Informatika', NOW() - INTERVAL '27 days', NOW() - INTERVAL '27 days'),
  ('11111111-1111-4111-a111-000000000005', 'ahmad.fauzi@unpad.ac.id', 'Ahmad Fauzi', 'student', 'approved', '081234567805', 'Manajemen Bisnis', 'Fakultas Ekonomi dan Bisnis', NOW() - INTERVAL '26 days', NOW() - INTERVAL '26 days'),
  ('11111111-1111-4111-a111-000000000006', 'siti.aminah@undip.ac.id', 'Siti Aminah', 'student', 'approved', '081234567806', 'Akuntansi', 'Fakultas Ekonomi dan Bisnis', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
  ('11111111-1111-4111-a111-000000000007', 'kevin.sanjaya@ub.ac.id', 'Kevin Sanjaya', 'student', 'approved', '081234567807', 'Teknik Komputer', 'Fakultas Ilmu Komputer', NOW() - INTERVAL '24 days', NOW() - INTERVAL '24 days'),
  ('11111111-1111-4111-a111-000000000008', 'fania.putri@unair.ac.id', 'Fania Putri Maharani', 'student', 'approved', '081234567808', 'Psikologi', 'Fakultas Psikologi', NOW() - INTERVAL '23 days', NOW() - INTERVAL '23 days'),
  ('11111111-1111-4111-a111-000000000009', 'bayu.nugroho@unhas.ac.id', 'Bayu Nugroho', 'student', 'approved', '081234567809', 'Teknik Elektro', 'Fakultas Teknik', NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days'),
  ('11111111-1111-4111-a111-000000000010', 'clarissa.m@binus.ac.id', 'Clarissa Monica', 'student', 'approved', '081234567810', 'Sistem Informasi', 'School of Information Systems', NOW() - INTERVAL '21 days', NOW() - INTERVAL '21 days'),
  ('11111111-1111-4111-a111-000000000011', 'm.reza@ui.ac.id', 'Muhammad Reza Pahlevi', 'student', 'approved', '081234567811', 'Ilmu Komputer', 'Fakultas Ilmu Komputer', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
  ('11111111-1111-4111-a111-000000000012', 'syifa.nur@itb.ac.id', 'Syifa Nuraini', 'student', 'approved', '081234567812', 'Teknik Informatika', 'Fakultas Teknik dan Ilmu Komputer', NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days'),
  ('11111111-1111-4111-a111-000000000013', 'tegar.w@ugm.ac.id', 'Tegar Wicaksono', 'student', 'approved', '081234567813', 'Teknik Industri', 'Fakultas Teknik', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
  ('11111111-1111-4111-a111-000000000014', 'zahra.sal@its.ac.id', 'Zahra Salsabila', 'student', 'approved', '081234567814', 'Matematika', 'Fakultas MIPA dan Kebumian', NOW() - INTERVAL '17 days', NOW() - INTERVAL '17 days'),
  ('11111111-1111-4111-a111-000000000015', 'ananda.p@unpad.ac.id', 'Ananda Pratama', 'student', 'approved', '081234567815', 'Ekonomi', 'Fakultas Ekonomi dan Bisnis', NOW() - INTERVAL '16 days', NOW() - INTERVAL '16 days'),
  ('11111111-1111-4111-a111-000000000016', 'jessica.p@binus.ac.id', 'Jessica Putri Wibowo', 'student', 'approved', '081234567816', 'Desain Komunikasi Visual', 'School of Design', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
  ('11111111-1111-4111-a111-000000000017', 'raja.m@ui.ac.id', 'Raja Mahendra', 'student', 'approved', '081234567817', 'Teknik Informatika', 'Fakultas Ilmu Komputer', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),
  ('11111111-1111-4111-a111-000000000018', 'wulan.sari@ugm.ac.id', 'Wulan Sari', 'student', 'approved', '081234567818', 'Ilmu Komunikasi', 'Fakultas Ilmu Sosial dan Politik', NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days'),
  ('11111111-1111-4111-a111-000000000019', 'dimas.a@its.ac.id', 'Dimas Anggara', 'student', 'approved', '081234567819', 'Teknik Informatika', 'Fakultas Teknologi Elektro dan Informatika', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),
  ('11111111-1111-4111-a111-000000000020', 'gita.p@unair.ac.id', 'Gita Permatasari', 'student', 'approved', '081234567820', 'Manajemen', 'Fakultas Ekonomi dan Bisnis', NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days'),
  ('11111111-1111-4111-a111-000000000021', 'hafiz.k@itb.ac.id', 'Hafiz Kurniawan', 'student', 'approved', '081234567821', 'Teknik Informatika', 'Fakultas Teknik dan Ilmu Komputer', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  ('11111111-1111-4111-a111-000000000022', 'indah.l@unpad.ac.id', 'Indah Larasati', 'student', 'approved', '081234567822', 'Akuntansi', 'Fakultas Ekonomi dan Bisnis', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
  ('11111111-1111-4111-a111-000000000023', 'joko.p@undip.ac.id', 'Joko Purwanto', 'student', 'approved', '081234567823', 'Teknik Mesin', 'Fakultas Teknik', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
  ('11111111-1111-4111-a111-000000000024', 'kartika.d@ub.ac.id', 'Kartika Dewi', 'student', 'approved', '081234567824', 'Sistem Informasi', 'Fakultas Ilmu Komputer', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
  ('11111111-1111-4111-a111-000000000025', 'lukman.h@ui.ac.id', 'Lukman Hakim', 'student', 'approved', '081234567825', 'Teknik Informatika', 'Fakultas Ilmu Komputer', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
  ('11111111-1111-4111-a111-000000000026', 'mega.k@ugm.ac.id', 'Mega Kusuma', 'student', 'approved', '081234567826', 'Psikologi', 'Fakultas Psikologi', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('11111111-1111-4111-a111-000000000027', 'naufal.a@its.ac.id', 'Naufal Abiyyu', 'student', 'approved', '081234567827', 'Teknik Elektro', 'Fakultas Teknologi Elektro', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  ('11111111-1111-4111-a111-000000000028', 'olivia.d@binus.ac.id', 'Olivia Damayanti', 'student', 'approved', '081234567828', 'Sistem Informasi', 'School of Information Systems', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('11111111-1111-4111-a111-000000000029', 'prasetyo.a@itb.ac.id', 'Prasetyo Adi Putra', 'student', 'approved', '081234567829', 'Ilmu Komputer', 'Fakultas Teknik dan Ilmu Komputer', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('11111111-1111-4111-a111-000000000030', 'qori.m@unpad.ac.id', 'Qori Maharani', 'student', 'approved', '081234567830', 'Manajemen', 'Fakultas Ekonomi dan Bisnis', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  ('11111111-1111-4111-a111-000000000031', 'rafi.a@ui.ac.id', 'Rafi Ahmad Ramadhan', 'student', 'approved', '081234567831', 'Teknik Informatika', 'Fakultas Ilmu Komputer', NOW() - INTERVAL '22 hours', NOW() - INTERVAL '22 hours'),
  ('11111111-1111-4111-a111-000000000032', 'salsabila.r@ugm.ac.id', 'Salsabila Rahma', 'student', 'approved', '081234567832', 'Statistika', 'Fakultas MIPA', NOW() - INTERVAL '18 hours', NOW() - INTERVAL '18 hours'),
  ('11111111-1111-4111-a111-000000000033', 'tari.k@unair.ac.id', 'Tari Kurnia Ningrum', 'student', 'approved', '081234567833', 'Ekonomi', 'Fakultas Ekonomi dan Bisnis', NOW() - INTERVAL '14 hours', NOW() - INTERVAL '14 hours'),
  ('11111111-1111-4111-a111-000000000034', 'usman.h@undip.ac.id', 'Usman Harun', 'student', 'approved', '081234567834', 'Teknik Informatika', 'Fakultas Teknik', NOW() - INTERVAL '8 hours', NOW() - INTERVAL '8 hours'),
  ('11111111-1111-4111-a111-000000000035', 'vania.a@binus.ac.id', 'Vania Aurelia', 'student', 'approved', '081234567835', 'Bisnis Digital', 'School of Business', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours')
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  account_status = EXCLUDED.account_status,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  updated_at = NOW();

-- 3. INSERT 35 PROFIL MAHASISWA (STUDENT_PROFILES)
INSERT INTO student_profiles (user_id, university, major, graduation_year, target_industry, gpa, skills, bio, created_at, updated_at)
VALUES
  ('11111111-1111-4111-a111-000000000001', 'Universitas Indonesia', 'Teknik Informatika', '2026', 'Teknologi / IT', 3.86, 'React, TypeScript, Node.js, Next.js, PostgreSQL', 'Mahasiswa akhir UI yang antusias membangun aplikasi web skalabel dan berkinerja tinggi.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000002', 'Institut Teknologi Bandung', 'Sistem Informasi', '2026', 'Teknologi / IT', 3.79, 'Python, SQL, Tableau, Pandas, Scikit-Learn', 'Tertarik pada analitik data untuk mendukung strategi keputusan bisnis berbasis data.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000003', 'Universitas Gadjah Mada', 'Ilmu Komputer', '2026', 'Teknologi / IT', 3.68, 'Figma, UI Design, Wireframing, User Research', 'Desainer antarmuka yang berfokus pada user experience ergonomis dan estetika modern.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000004', 'Institut Teknologi Sepuluh Nopember', 'Teknik Informatika', '2026', 'Teknologi / IT', 3.88, 'Golang, Docker, Kubernetes, Microservices, Redis', 'Backend developer dengan minat pada arsitektur sistem terdistribusi dan cloud infrastructure.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000005', 'Universitas Padjadjaran', 'Manajemen Bisnis', '2026', 'Startup', 3.65, 'Product Management, Agile, Scrum, Jira, Roadmapping', 'Calon Product Manager yang senang menghubungkan kebutuhan user dengan inovasi produk teknologi.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000006', 'Universitas Diponegoro', 'Akuntansi', '2026', 'Keuangan / Perbankan', 3.74, 'Financial Modeling, Excel, IFRS, Audit Keuangan', 'Mahasiswa berprestasi di bidang akuntansi korporat yang teliti dan analitis.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000007', 'Universitas Brawijaya', 'Teknik Komputer', '2026', 'Teknologi / IT', 3.91, 'AWS, Terraform, Linux Administration, CI/CD Pipelines', 'DevOps enthusiast yang mengutamakan otomatisasi deploy dan ketahanan sistem produksi.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000008', 'Universitas Airlangga', 'Psikologi', '2026', 'Konsultan', 3.82, 'Talent Assessment, Interviewing, Employee Relations', 'Memfokuskan karier pada pengembangan sumber daya manusia dan rekrutmen berbasis kompetensi.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000009', 'Universitas Hasanuddin', 'Teknik Elektro', '2026', 'Manufaktur', 3.60, 'Embedded C, Arduino, Raspberry Pi, PCB Design', 'Pengembang solusi Internet of Things (IoT) untuk otomatisasi industri.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000010', 'Bina Nusantara University', 'Sistem Informasi', '2026', 'E-commerce', 3.85, 'Business Analysis, BPMN, UML, SQL, Requirement Gathering', 'Analis bisnis yang menjembatani tim pengembang perangkat lunak dengan klien korporat.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000011', 'Universitas Indonesia', 'Ilmu Komputer', '2026', 'Teknologi / IT', 3.92, 'React, Next.js, Django, PostgreSQL, Tailwind CSS', 'Fullstack engineer yang suka membangun MVP inovatif dengan cepat dan rapi.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000012', 'Institut Teknologi Bandung', 'Teknik Informatika', '2026', 'Teknologi / IT', 3.95, 'PyTorch, TensorFlow, NLP, Computer Vision, MLOps', 'Peneliti AI/ML yang fokus pada penerapan LLM dan pemrosesan bahasa alami Indonesia.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000013', 'Universitas Gadjah Mada', 'Teknik Industri', '2026', 'Manufaktur', 3.70, 'Supply Chain, Lean Six Sigma, Operations Research', 'Optimalisasi rantai pasok dan manajemen logistik di era industri 4.0.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000014', 'Institut Teknologi Sepuluh Nopember', 'Matematika', '2026', 'Teknologi / IT', 3.87, 'R, Python, Statistical Inference, Deep Learning', 'Data scientist yang menyukai pemecahan persoalan big data menggunakan pemodelan matematis.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000015', 'Universitas Padjadjaran', 'Ekonomi', '2026', 'Keuangan / Perbankan', 3.69, 'Macroeconomics, Financial Analysis, Market Research', 'Analis ekonomi digital yang tertarik pada perkembangan fintech dan perbankan modern.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000016', 'Bina Nusantara University', 'Desain Komunikasi Visual', '2026', 'E-commerce', 3.80, 'UI Design, Prototyping, Design Systems, Adobe Suite', 'Kreator antarmuka digital yang konsisten pada standar desain responsif multi-platform.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000017', 'Universitas Indonesia', 'Teknik Informatika', '2026', 'Teknologi / IT', 3.89, 'Cloud Native, GCP, Kubernetes, Go, Distributed Systems', 'Arsitek sistem cloud yang berfokus pada keandalan infrastruktur dan efisiensi biaya cloud.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000018', 'Universitas Gadjah Mada', 'Ilmu Komunikasi', '2026', 'Konsultan', 3.73, 'Public Speaking, Copywriting, Media Relations', 'Komunikator perusahaan yang berdedikasi membangun citra positif brand dan organisasi.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000019', 'Institut Teknologi Sepuluh Nopember', 'Teknik Informatika', '2026', 'Startup', 3.84, 'Kotlin, Android SDK, Jetpack Compose, Flutter', 'Pengembang aplikasi seluler berkinerja tinggi dengan antarmuka yang intuitif.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000020', 'Universitas Airlangga', 'Manajemen', '2026', 'E-commerce', 3.66, 'Digital Marketing, SEO/SEM, Google Analytics, Copywriting', 'Spesialis pemasaran digital untuk meningkatkan konversi dan akuisisi pengguna.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000021', 'Institut Teknologi Bandung', 'Teknik Informatika', '2026', 'Teknologi / IT', 3.90, 'Penetration Testing, Ethical Hacking, OWASP, Cryptography', 'Spesialis keamanan siber yang berdedikasi mengamankan aplikasi dari kerentanan web dan jaringan.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000022', 'Universitas Padjadjaran', 'Akuntansi', '2026', 'Keuangan / Perbankan', 3.75, 'Taxation, Financial Reporting, SAP, Auditing', 'Calon auditor keuangan yang berintegritas dan siap bekerja di kantor akuntan publik terkemuka.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000023', 'Universitas Diponegoro', 'Teknik Mesin', '2026', 'Manufaktur', 3.62, 'CAD/CAM, SolidWorks, Project Engineering, HVAC', 'Engineer mesin berorientasi pada efisiensi proses manufaktur dan keselamatan kerja.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000024', 'Universitas Brawijaya', 'Sistem Informasi', '2026', 'Teknologi / IT', 3.83, 'Manual Testing, Selenium, Jest, Cypress, QA Automation', 'Insinyur penjamin kualitas perangkat lunak yang teliti terhadap bug dan regresi kode.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000025', 'Universitas Indonesia', 'Teknik Informatika', '2026', 'Teknologi / IT', 3.91, 'Golang, PostgreSQL, gRPC, Microservices, Kafka', 'Backend engineer dengan keahlian mendalam pemrograman konkuren dan basis data relasional.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000026', 'Universitas Gadjah Mada', 'Psikologi', '2026', 'Konsultan', 3.77, 'Recruitment, DISC, Assessment Center, HRIS', 'Praktisi SDM muda yang siap mendukung efektivitas organisasi dan kepuasan karyawan.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000027', 'Institut Teknologi Sepuluh Nopember', 'Teknik Elektro', '2026', 'Manufaktur', 3.68, 'Embedded C++, ARM Cortex, RTOS, Microcontrollers', 'Insinyur sistem tertanam untuk perangkat keras industri dan sistem kendali cerdas.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000028', 'Bina Nusantara University', 'Sistem Informasi', '2026', 'Teknologi / IT', 3.86, 'Product Design, Wireframing, User Testing, Figma', 'Product designer berorientasi data dengan pemahaman mendalam tentang kebutuhan pengguna.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000029', 'Institut Teknologi Bandung', 'Ilmu Komputer', '2026', 'Teknologi / IT', 3.93, 'MLOps, Docker, Fast API, PyTorch, Model Serving', 'ML Engineer yang berpengalaman menyebarkan model kecerdasan buatan ke lingkungan produksi.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000030', 'Universitas Padjadjaran', 'Manajemen', '2026', 'BUMN', 3.71, 'B2B Sales, CRM, Negotiation, Account Management', 'Account executive yang ulet dalam membina relasi bisnis strategis dan mencapai target penjualan.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000031', 'Universitas Indonesia', 'Teknik Informatika', '2026', 'Teknologi / IT', 3.85, 'Linux, Bash, AWS, Terraform, Ansible', 'Systems engineer yang berdedikasi membangun otomatisasi jaringan dan server yang stabil.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000032', 'Universitas Gadjah Mada', 'Statistika', '2026', 'Teknologi / IT', 3.88, 'SQL, Python, Power BI, Advanced Statistical Analysis', 'Data analyst muda yang terampil mengubah kumpulan data kompleks menjadi wawasan bisnis yang intuitif.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000033', 'Universitas Airlangga', 'Ekonomi', '2026', 'Keuangan / Perbankan', 3.78, 'Banking Operations, Credit Analysis, Risk Management', 'Calon Management Trainee perbankan yang tangguh dan memiliki literasi finansial yang tinggi.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000034', 'Universitas Diponegoro', 'Teknik Informatika', '2026', 'Teknologi / IT', 3.79, 'React, Vue.js, CSS Modules, TypeScript, Web Accessibility', 'Frontend engineer yang fokus pada aksesibilitas web dan performa pemuatan laman yang cepat.', NOW(), NOW()),
  ('11111111-1111-4111-a111-000000000035', 'Bina Nusantara University', 'Bisnis Digital', '2026', 'Startup', 3.87, 'Growth Marketing, A/B Testing, Funnel Optimization', 'Growth specialist dengan keahlian eksperimen pemasaran digital untuk akselerasi bisnis.', NOW(), NOW())
ON CONFLICT (user_id) DO UPDATE SET
  university = EXCLUDED.university,
  major = EXCLUDED.major,
  gpa = EXCLUDED.gpa,
  skills = EXCLUDED.skills,
  target_industry = EXCLUDED.target_industry,
  bio = EXCLUDED.bio;

-- 4. INSERT 9 KATEGORI INTERVIEW NYATA (INTERVIEW_CATEGORIES)
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
  category_name = EXCLUDED.category_name,
  description = EXCLUDED.description,
  module_type = EXCLUDED.module_type,
  difficulty_level = EXCLUDED.difficulty_level,
  is_active = EXCLUDED.is_active;

-- 5. INSERT 36 BANK SOAL NYATA (QUESTION_BANKS) - 4 Soal untuk masing-masing 9 Kategori
INSERT INTO question_banks (id, category_id, question_text, ideal_keywords, difficulty_level, created_at, updated_at)
VALUES
  -- Kategori 1: Software Engineering
  ('33333333-3333-4333-a333-000000000001', '22222222-2222-4222-a222-000000000001', 'Jelaskan perbedaan mendasar antara arsitektur Monolitik dan Microservices, serta kapankah waktu yang tepat untuk bertransisi?', 'scalability, modularitas, overhead, independent deployment, domain driven design', 'medium', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000002', '22222222-2222-4222-a222-000000000001', 'Bagaimana cara Anda mendiagnosis dan menyelesaikan memory leak pada aplikasi web berskala besar di lingkungan produksi?', 'profiling, garbage collection, heap dump, root cause analysis, monitoring', 'hard', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000003', '22222222-2222-4222-a222-000000000001', 'Jelaskan bagaimana proses CI/CD pipeline yang efektif mampu mengurangi risiko kegagalan deploy pada tim engineering.', 'automated testing, code quality, staging, zero-downtime deployment, rollback', 'medium', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000004', '22222222-2222-4222-a222-000000000001', 'Bagaimana Anda merancang skema database relasional berkinerja tinggi untuk menangani jutaan transaksi harian?', 'indexing, normalisasi, partitioning, query optimization, connection pooling', 'hard', NOW(), NOW()),

  -- Kategori 2: Data Science & AI
  ('33333333-3333-4333-a333-000000000005', '22222222-2222-4222-a222-000000000002', 'Bagaimana Anda menangani kumpulan data yang tidak seimbang (imbalanced dataset) dalam pemodelan klasifikasi?', 'SMOTE, undersampling, oversampling, f1-score, precision recall curve', 'medium', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000006', '22222222-2222-4222-a222-000000000002', 'Jelaskan bagaimana proses evaluasi kinerja model Large Language Model (LLM) atau generative AI dalam skenario dunia nyata.', 'BLEU, ROUGE, human evaluation, hallucination detection, prompt engineering', 'hard', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000007', '22222222-2222-4222-a222-000000000002', 'Apa perbedaan antara supervised learning dan unsupervised learning? Berikan contoh implementasi industri di Indonesia.', 'klasifikasi, regresi, clustering, customer segmentation, fraud detection', 'easy', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000008', '22222222-2222-4222-a222-000000000002', 'Bagaimana Anda mencegah fenomena overfitting dan underfitting ketika melatih model neural network mendalam?', 'cross-validation, dropout, regularization, early stopping, data augmentation', 'medium', NOW(), NOW()),

  -- Kategori 3: Cybersecurity
  ('33333333-3333-4333-a333-000000000009', '22222222-2222-4222-a222-000000000003', 'Bagaimana langkah mitigasi Anda untuk mencegah serangan SQL Injection dan Cross-Site Scripting (XSS) pada aplikasi web?', 'input validation, parameterized queries, content security policy, WAF', 'medium', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000010', '22222222-2222-4222-a222-000000000003', 'Jelaskan konsep Zero Trust Architecture dan bagaimana penerapannya dalam mengamankan jaringan perusahaan.', 'never trust always verify, IAM, micro-segmentation, multi-factor authentication', 'hard', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000011', '22222222-2222-4222-a222-000000000003', 'Apa tindakan pertama yang Anda lakukan setelah menemukan insiden pelanggaran data (data breach) pada server produksi?', 'incident response, containment, forensik, notifikasi, pemulihan sistem', 'hard', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000012', '22222222-2222-4222-a222-000000000003', 'Bagaimana Anda menjelaskan pentingnya enkripsi end-to-end kepada pemangku kepentingan non-teknis?', 'keamanan privasi, perlindungan data, kepatuhan regulasi, analogi sederhana', 'easy', NOW(), NOW()),

  -- Kategori 4: Keuangan & Perbankan
  ('33333333-3333-4333-a333-000000000013', '22222222-2222-4222-a222-000000000004', 'Bagaimana Anda melakukan analisis rasio keuangan untuk menilai kesehatan likuiditas dan solvabilitas sebuah perusahaan?', 'current ratio, debt to equity, cash flow, profitabilitas, interpretasi tren', 'medium', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000014', '22222222-2222-4222-a222-000000000004', 'Jelaskan peran manajemen risiko kredit dalam menyetujui pembiayaan komersial berskala besar di bank.', '5C credit analysis, mitigasi risiko, agunan, cash flow projection, compliance', 'hard', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000015', '22222222-2222-4222-a222-000000000004', 'Apa perbedaan antara akuntansi berbasis kas (cash basis) dan akuntansi berbasis akrual (accrual basis)?', 'pencatatan pendapatan, beban akrual, standar IFRS, ketepatan periode', 'easy', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000016', '22222222-2222-4222-a222-000000000004', 'Bagaimana Anda mempersiapkan laporan arus kas (cash flow statement) dan menjelaskan signifikansinya bagi investor?', 'arus kas operasi, investasi, pendanaan, likuiditas nyata, keputusan modal', 'medium', NOW(), NOW()),

  -- Kategori 5: Manajemen & Bisnis
  ('33333333-3333-4333-a333-000000000017', '22222222-2222-4222-a222-000000000005', 'Bagaimana strategi Anda untuk merancang rencana ekspansi pasar baru bagi produk digital di Asia Tenggara?', 'market research, TAM SAM SOM, competitor analysis, go to market strategy', 'hard', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000018', '22222222-2222-4222-a222-000000000005', 'Jelaskan bagaimana pendekatan Anda dalam mengelola pemangku kepentingan (stakeholders) dengan prioritas yang saling bertentangan.', 'negosiasi, komunikasi transparan, alignment tujuan bisnis, kompromi solusi', 'medium', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000019', '22222222-2222-4222-a222-000000000005', 'Bagaimana Anda menghitung Customer Acquisition Cost (CAC) dan Customer Lifetime Value (CLV) untuk memvalidasi kelayakan bisnis?', 'unit economics, churn rate, retention, profitability, efisiensi pemasaran', 'medium', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000020', '22222222-2222-4222-a222-000000000005', 'Apa langkah nyata yang Anda ambil saat memimpin tim yang sedang mengalami penurunan motivasi dan kinerja?', 'empathy, root cause, 1-on-1 coaching, goal resetting, apresiasi pencapaian', 'medium', NOW(), NOW()),

  -- Kategori 6: General Interview
  ('33333333-3333-4333-a333-000000000021', '22222222-2222-4222-a222-000000000006', 'Perkenalkan diri Anda dalam 2 menit, dengan menyoroti latar belakang akademik serta proyek profesional terkuat Anda.', 'struktur jelas, relevansi pekerjaan, keunggulan akademis, bukti konkret', 'easy', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000022', '22222222-2222-4222-a222-000000000006', 'Mengapa Anda tertarik untuk bekerja di perusahaan kami dan bukan di kompetitor kami?', 'riset perusahaan, visi misi, kesesuaian kultur, kontribusi nyata', 'easy', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000023', '22222222-2222-4222-a222-000000000006', 'Apa kelemahan terbesar yang pernah Anda rasakan, dan langkah nyata apa yang Anda ambil untuk memperbaikinya?', 'kesadaran diri, tindakan perbaikan, hasil positif, kejujuran', 'easy', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000024', '22222222-2222-4222-a222-000000000006', 'Di mana Anda melihat posisi karier Anda dalam 3 hingga 5 tahun ke depan?', 'ambisi realistis, pertumbuhan profesional, loyalitas, kepemimpinan', 'easy', NOW(), NOW()),

  -- Kategori 7: Technical Interview
  ('33333333-3333-4333-a333-000000000025', '22222222-2222-4222-a222-000000000007', 'Bagaimana cara Anda meninjau (code review) pekerjaan rekan satu tim untuk memastikan kualitas tanpa menyinggung perasaan?', 'konstruktif, saran perbaikan, standar clean code, apresiasi, kolaborasi', 'medium', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000026', '22222222-2222-4222-a222-000000000007', 'Jelaskan bagaimana konsep caching dan load balancing bekerja untuk mempercepat respons aplikasi server.', 'redis, nginx, cache invalidation, round-robin, penurunan latensi', 'medium', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000027', '22222222-2222-4222-a222-000000000007', 'Apa yang Anda lakukan saat dokumentasi teknis dari library atau API pihak ketiga sangat minim namun deadline mendekat?', 'eksplorasi kode sumber, uji coba sandbox, komunikasi tim, workaround logis', 'medium', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000028', '22222222-2222-4222-a222-000000000007', 'Bagaimana Anda menjelaskan perbedaan konsep REST API dan GraphQL kepada manajer produk non-teknis?', 'over-fetching, under-fetching, endpoint tunggal versus multi, efisiensi data', 'medium', NOW(), NOW()),

  -- Kategori 8: Behavioral Interview (STAR Method)
  ('33333333-3333-4333-a333-000000000029', '22222222-2222-4222-a222-000000000008', 'Ceritakan situasi ketika Anda menghadapi konflik pendapat yang tajam dengan anggota tim saat mengerjakan proyek penting.', 'situation, task, action, result, komunikasi asertif, resolusi damai', 'medium', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000030', '22222222-2222-4222-a222-000000000008', 'Berikan contoh nyata saat Anda mengambil tanggung jawab tambahan yang berada di luar deskripsi pekerjaan resmi Anda.', 'inisiatif, kepemimpinan, dampak positif, kerja sama tim, komitmen', 'medium', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000031', '22222222-2222-4222-a222-000000000008', 'Bagaimana cara Anda mengelola waktu dan prioritas ketika dihadapkan pada tiga tenggat waktu (deadline) secara bersamaan?', 'matriks prioritas, negosiasi deadline, fokus eksekusi, pelaporan progres', 'medium', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000032', '22222222-2222-4222-a222-000000000008', 'Ceritakan situasi ketika Anda melakukan kesalahan kritis dalam pekerjaan dan bagaimana Anda bertanggung jawab atas hal itu.', 'jujur, pelaporan cepat, solusi perbaikan, mitigasi masa depan', 'hard', NOW(), NOW()),

  -- Kategori 9: Case Interview
  ('33333333-3333-4333-a333-000000000033', '22222222-2222-4222-a222-000000000009', 'Jika tingkat keterikatan (user retention) aplikasi turun 15% dalam bulan lalu, bagaimana kerangka analisis Anda untuk menemukan akar masalahnya?', 'segmentasi data, cohort analysis, investigasi bug baru, survei pengguna, rekomendasi', 'hard', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000034', '22222222-2222-4222-a222-000000000009', 'Bagaimana Anda merumuskan strategi penentuan harga (pricing strategy) untuk peluncuran layanan cloud enterprise baru di Indonesia?', 'cost-plus pricing, value-based pricing, benchmarking kompetitor, margin laba', 'hard', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000035', '22222222-2222-4222-a222-000000000009', 'Sebuah rumah sakit besar ingin mengotomatiskan pendaftaran pasien menggunakan AI. Risiko apa saja yang harus dipetakan?', 'privasi medis, akurasi OCR, kegagalan sistem, empati pasien, fallback manual', 'hard', NOW(), NOW()),
  ('33333333-3333-4333-a333-000000000036', '22222222-2222-4222-a222-000000000009', 'Bagaimana Anda menyusun skema alokasi armada pengiriman e-commerce agar tetap efisien di tengah musim puncak belanja (Harbolnas)?', 'route optimization, dynamic allocation, mitra logistik cadangan, SLA pengiriman', 'hard', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  ideal_keywords = EXCLUDED.ideal_keywords,
  difficulty_level = EXCLUDED.difficulty_level;

-- 6. INSERT 35 SESI WAWANCARA NYATA (INTERVIEW_SESSIONS) LENGKAP TRANSKRIP & ANALISIS
INSERT INTO interview_sessions (id, user_id, category_id, module_type, role_target, company, language, personality, difficulty, status, score, candidate_name, candidate_email, start_time, end_time, transcript, analysis)
VALUES
  (
    '44444444-4444-4444-a444-000000000001',
    '11111111-1111-4111-a111-000000000001',
    '22222222-2222-4222-a222-000000000001',
    'Kerja',
    'Software Engineer',
    'PT GoTo Gojek Tokopedia',
    'Indonesian',
    'technical',
    'medium',
    'completed',
    88.00,
    'Rizki Pratama',
    'rizki.pratama@ui.ac.id',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days' + INTERVAL '32 minutes',
    '[
      {"role": "ai", "text": "Selamat pagi Rizki! Coba ceritakan pengalamanmu dalam merancang sistem microservices yang tangguh."},
      {"role": "user", "text": "Selamat pagi! Selama proyek tingkat akhir dan magang di GoTo, saya membangun arsitektur microservices menggunakan Node.js dan gRPC dengan komunikasi asinkron lewat RabbitMQ."},
      {"role": "ai", "text": "Sangat menarik! Bagaimana kamu menangani masalah eventual consistency antar service saat terjadi kegagalan transaksi?"},
      {"role": "user", "text": "Saya menerapkan pola Saga (Orchestration-based) serta idempotent consumer pada setiap antrean pesan untuk memastikan data konsisten tanpa duplikasi."}
    ]'::jsonb,
    '{
      "scores": {"communication": 87, "technical": 91, "problemSolving": 88, "cultureFit": 86},
      "strengths": ["Pemahaman mendalam tentang microservices & event-driven architecture", "Komunikasi teknis yang sangat terstruktur dan lugas", "Familiar dengan pola desain terdistribusi seperti Saga"],
      "weaknesses": ["Bisa menambahkan metrik kinerja numerik (QPS/latensi) untuk memperkuat klaim hasil"],
      "overallFeedback": "Rizki menunjukkan kompetensi yang sangat solid sebagai Software Engineer dengan pemahaman arsitektur terdistribusi yang sangat matang."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000002',
    '11111111-1111-4111-a111-000000000002',
    '22222222-2222-4222-a222-000000000002',
    'Kerja',
    'Data Analyst',
    'PT Bank Central Asia Tbk',
    'Indonesian',
    'analytical',
    'medium',
    'completed',
    85.00,
    'Nadia Rahmawati',
    'nadia.rahma@itb.ac.id',
    NOW() - INTERVAL '9 days',
    NOW() - INTERVAL '9 days' + INTERVAL '28 minutes',
    '[
      {"role": "ai", "text": "Halo Nadia, jelaskan bagaimana Anda mengubah data transaksi nasabah yang kompleks menjadi insight untuk manajemen bank."},
      {"role": "user", "text": "Halo! Saya biasa menggunakan SQL untuk pembersihan data dan pemodelan cohort nasabah, lalu menampilkannya lewat dashboard Tableau interaktif kepada eksekutif."},
      {"role": "ai", "text": "Bagaimana Anda menjelaskan anomali data penarikan tunai kepada direksi yang non-teknis?"},
      {"role": "user", "text": "Saya menyederhanakannya menggunakan grafik tren visual dan memberikan analogi musim liburan versus hari kerja normal agar alasannya mudah dipahami."}
    ]'::jsonb,
    '{
      "scores": {"communication": 88, "technical": 84, "problemSolving": 85, "cultureFit": 83},
      "strengths": ["Kemampuan komunikasi visual dan penyederhanaan konsep teknis", "Penguasaan SQL dan Tableau yang sangat rapi"],
      "weaknesses": ["Perlu memperdalam teknik regresi lanjutan untuk prediksi jangka panjang"],
      "overallFeedback": "Nadia siap bekerja sebagai Data Analyst perbankan berkat ketajamannya menyusun presentasi bisnis berbantuan data."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000003',
    '11111111-1111-4111-a111-000000000003',
    '22222222-2222-4222-a222-000000000007',
    'Kerja',
    'UI/UX Designer',
    'PT Traveloka Indonesia',
    'Indonesian',
    'creative',
    'easy',
    'completed',
    82.00,
    'Dinda Aulia Putri',
    'dinda.aulia@ugm.ac.id',
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '8 days' + INTERVAL '25 minutes',
    '[
      {"role": "ai", "text": "Dinda, ceritakan alur riset pengguna yang Anda lakukan saat merancang fitur pemesanan tiket baru."},
      {"role": "user", "text": "Saya memulai dengan usability testing pada pengguna aktif, membuat wireframe di Figma, dan melakukan iterasinya berdasarkan feedback kuantitatif."}
    ]'::jsonb,
    '{
      "scores": {"communication": 84, "technical": 81, "problemSolving": 82, "cultureFit": 81},
      "strengths": ["Riset desain berbasis pengguna (user-centric)", "Kemampuan menyusun sistem desain yang konsisten"],
      "weaknesses": ["Bisa lebih menekankan pada metrik conversion rate setelah redesain"],
      "overallFeedback": "Dinda adalah UI/UX Designer berpotensi tinggi dengan intuisi desain yang baik."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000004',
    '11111111-1111-4111-a111-000000000004',
    '22222222-2222-4222-a222-000000000001',
    'Kerja',
    'Backend Developer',
    'PT Shopee International Indonesia',
    'Indonesian',
    'technical',
    'hard',
    'completed',
    89.00,
    'Bagas Saputra',
    'bagas.saputra@its.ac.id',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '7 days' + INTERVAL '35 minutes',
    '[
      {"role": "ai", "text": "Bagas, bagaimana cara kerja koneksi gRPC dan apa keunggulannya dibanding REST konvensional saat lonjakan traffic 11.11?"},
      {"role": "user", "text": "gRPC menggunakan HTTP/2 dan format binar Protocol Buffers yang jauh lebih ringan serta mendukung multiplexing, sehingga latensi panggilan antar service turun hingga 40%."}
    ]'::jsonb,
    '{
      "scores": {"communication": 86, "technical": 92, "problemSolving": 90, "cultureFit": 88},
      "strengths": ["Pengetahuan mendalam mengenai protokol komunikasi berkinerja tinggi", "Kesiapan menghadapi lonjakan traffic sistem e-commerce"],
      "weaknesses": ["Tetap pertimbangkan kompleksitas debugging binar pada tim baru"],
      "overallFeedback": "Bagas menunjukkan level teknis di atas rata-rata sebagai Backend Developer skala enterprise."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000005',
    '11111111-1111-4111-a111-000000000005',
    '22222222-2222-4222-a222-000000000005',
    'Kerja',
    'Product Manager',
    'PT Bukalapak.com',
    'Indonesian',
    'leadership',
    'medium',
    'completed',
    79.00,
    'Ahmad Fauzi',
    'ahmad.fauzi@unpad.ac.id',
    NOW() - INTERVAL '6 days',
    NOW() - INTERVAL '6 days' + INTERVAL '30 minutes',
    '[
      {"role": "ai", "text": "Ahmad, bagaimana Anda memprioritaskan backlog produk ketika tim engineering dan tim marketing memiliki permintaan yang saling bertentangan?"},
      {"role": "user", "text": "Saya menggunakan framework RICE (Reach, Impact, Confidence, Effort) untuk menyelaraskan prioritas dengan target OKR kuartalan perusahaan."}
    ]'::jsonb,
    '{
      "scores": {"communication": 82, "technical": 76, "problemSolving": 80, "cultureFit": 78},
      "strengths": ["Penggunaan framework prioritas produk (RICE) yang terstruktur"],
      "weaknesses": ["Perlu memberikan contoh konkret resolusi konflik dengan tim engineering"],
      "overallFeedback": "Ahmad memiliki pemahaman metodologi manajemen produk yang baik dan perlu terus mengasah kepemimpinan lintas fungsi."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000006',
    '11111111-1111-4111-a111-000000000006',
    '22222222-2222-4222-a222-000000000004',
    'Kerja',
    'Financial Analyst',
    'PT Bank Mandiri (Persero) Tbk',
    'Indonesian',
    'analytical',
    'medium',
    'completed',
    84.00,
    'Siti Aminah',
    'siti.aminah@undip.ac.id',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days' + INTERVAL '27 minutes',
    '[
      {"role": "ai", "text": "Siti, bagaimana Anda menilai risiko penyaluran kredit korporasi di tengah fluktuasi suku bunga bank sentral?"},
      {"role": "user", "text": "Saya melakukan stress testing pada cash flow debitur dengan simulasi kenaikan suku bunga 200 bps dan menilai rasio DSCR mereka."}
    ]'::jsonb,
    '{
      "scores": {"communication": 85, "technical": 85, "problemSolving": 84, "cultureFit": 82},
      "strengths": ["Analisis kelayakan kredit perbankan yang teliti dan sesuai kaidah risiko"],
      "weaknesses": ["Dapat menambahkan pertimbangan risiko makroekonomi eksternal"],
      "overallFeedback": "Siti Aminah siap bergabung dengan tim kredit perbankan berkat ketelitian evaluasi keuangannya."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000007',
    '11111111-1111-4111-a111-000000000007',
    '22222222-2222-4222-a222-000000000003',
    'Kerja',
    'DevOps Engineer',
    'PT Telkom Indonesia (Persero) Tbk',
    'Indonesian',
    'technical',
    'hard',
    'completed',
    91.00,
    'Kevin Sanjaya',
    'kevin.sanjaya@ub.ac.id',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days' + INTERVAL '35 minutes',
    '[
      {"role": "ai", "text": "Kevin, bagaimana arsitektur Kubernetes Anda menangani pemulihan bencana (disaster recovery) antar-region cloud?"},
      {"role": "user", "text": "Kami menggunakan Velero untuk replikasi persisten stateful cluster dan Multi-Region Traffic Routing dengan DNS failover otomatis."}
    ]'::jsonb,
    '{
      "scores": {"communication": 89, "technical": 94, "problemSolving": 91, "cultureFit": 90},
      "strengths": ["Penguasaan otomatisasi cloud & container orchestration level lanjut", "Kejelasan rencana ketahanan sistem enterprise"],
      "weaknesses": ["Semuanya sudah sangat solid"],
      "overallFeedback": "Kevin adalah kandidat DevOps Engineer unggulan dengan standar profesional tinggi."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000008',
    '11111111-1111-4111-a111-000000000008',
    '22222222-2222-4222-a222-000000000008',
    'Kerja',
    'HR Specialist',
    'PT Unilever Indonesia Tbk',
    'Indonesian',
    'empathetic',
    'medium',
    'completed',
    86.00,
    'Fania Putri Maharani',
    'fania.putri@unair.ac.id',
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '4 days' + INTERVAL '29 minutes',
    '[
      {"role": "ai", "text": "Fania, bagaimana Anda menangani situasi ketika seorang karyawan inti mengajukan pengunduran diri secara mendadak?"},
      {"role": "user", "text": "Saya langsung mengadakan stay interview yang empatis untuk memahami akar masalahnya, serta mengaktifkan succession planning bersama manajer tim."}
    ]'::jsonb,
    '{
      "scores": {"communication": 89, "technical": 83, "problemSolving": 87, "cultureFit": 85},
      "strengths": ["Empati tinggi dan penanganan hubungan industrial yang diplomatis", "Penggunaan metode STAR yang konsisten"],
      "weaknesses": ["Bisa menyertakan data retensi karyawan pasca intervensi HR"],
      "overallFeedback": "Fania memiliki kematangan interpersonal yang sangat baik untuk posisi manajemen SDM."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000009',
    '11111111-1111-4111-a111-000000000009',
    '22222222-2222-4222-a222-000000000007',
    'Kerja',
    'IoT Engineer',
    'PT Astra International Tbk',
    'Indonesian',
    'technical',
    'medium',
    'completed',
    78.00,
    'Bayu Nugroho',
    'bayu.nugroho@unhas.ac.id',
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '4 days' + INTERVAL '26 minutes',
    '[
      {"role": "ai", "text": "Bayu, bagaimana Anda menjaga efisiensi penggunaan daya baterai pada sensor IoT jarak jauh di area manufaktur?"},
      {"role": "user", "text": "Saya mengoptimalkan interval pengiriman paket data menggunakan protokol MQTT-SN dan memanfaatkan mode deep sleep pada mikrokontroler ESP32."}
    ]'::jsonb,
    '{
      "scores": {"communication": 76, "technical": 81, "problemSolving": 78, "cultureFit": 77},
      "strengths": ["Solusi teknis penghematan daya sensor yang efisien"],
      "weaknesses": ["Perlu melatih struktur komunikasi lisan agar presentasi lebih meyakinkan"],
      "overallFeedback": "Bayu menguasai rekayasa perangkat keras IoT dan perlu terus mengasah rasa percaya diri saat wawancara."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000010',
    '11111111-1111-4111-a111-000000000010',
    '22222222-2222-4222-a222-000000000005',
    'Kerja',
    'Business Analyst',
    'PT Blibli.com',
    'Indonesian',
    'analytical',
    'medium',
    'completed',
    87.00,
    'Clarissa Monica',
    'clarissa.m@binus.ac.id',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days' + INTERVAL '30 minutes',
    '[
      {"role": "ai", "text": "Clarissa, jelaskan langkah Anda saat mendokumentasikan spesifikasi kebutuhan sistem (SRS) untuk fitur pembayaran baru."},
      {"role": "user", "text": "Saya mengadakan workshop requirement gathering dengan tim payment gateway dan akuntansi, lalu memodelkannya ke dalam diagram BPMN 2.0 yang transparan."}
    ]'::jsonb,
    '{
      "scores": {"communication": 88, "technical": 86, "problemSolving": 87, "cultureFit": 87},
      "strengths": ["Dokumentasi kebutuhan bisnis dan teknis yang akurat (BPMN)", "Artikulasi yang profesional"],
      "weaknesses": ["Pertimbangkan strategi mitigasi risiko penipuan (fraud)"],
      "overallFeedback": "Clarissa Monica sangat siap bekerja sebagai Business Analyst e-commerce berkat kejelasannya menjembatani bisnis dan teknologi."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000011',
    '11111111-1111-4111-a111-000000000011',
    '22222222-2222-4222-a222-000000000001',
    'Kerja',
    'Fullstack Developer',
    'PT GoTo Gojek Tokopedia',
    'Indonesian',
    'technical',
    'hard',
    'completed',
    92.00,
    'Muhammad Reza Pahlevi',
    'm.reza@ui.ac.id',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days' + INTERVAL '33 minutes',
    '[
      {"role": "ai", "text": "Reza, bagaimana strategi optimasi rendering Next.js Anda saat memuat ribuan katalog produk?"},
      {"role": "user", "text": "Saya menggunakan Incremental Static Regeneration (ISR) dengan revalidate otomatis dan memisahkan komponen klien intensif agar Time to First Byte (TTFB) tetap di bawah 150ms."}
    ]'::jsonb,
    '{
      "scores": {"communication": 90, "technical": 94, "problemSolving": 92, "cultureFit": 92},
      "strengths": ["Penguasaan mendalam fitur modern Next.js dan optimasi performa web", "Pemahaman arsitektur fullstack yang komprehensif"],
      "weaknesses": ["Pertahankan ritme jawaban agar tetap ramah bagi penanya non-teknis"],
      "overallFeedback": "Reza Pahlevi adalah kandidat Fullstack Developer luar biasa yang siap masuk ke dalam tim core engineering."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000012',
    '11111111-1111-4111-a111-000000000012',
    '22222222-2222-4222-a222-000000000002',
    'Kerja',
    'AI Engineer',
    'PT Pertamina (Persero)',
    'Indonesian',
    'analytical',
    'hard',
    'completed',
    94.00,
    'Syifa Nuraini',
    'syifa.nur@itb.ac.id',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days' + INTERVAL '36 minutes',
    '[
      {"role": "ai", "text": "Syifa, jelaskan implementasi RAG (Retrieval-Augmented Generation) Anda untuk sistem tanya-jawab dokumen internal."},
      {"role": "user", "text": "Saya menggunakan embedding berbahasa Indonesia fine-tuned pada vector database Milvus dengan re-ranking berbasis BGE-Reranker agar presisi jawaban meningkat hingga 92%."}
    ]'::jsonb,
    '{
      "scores": {"communication": 92, "technical": 96, "problemSolving": 94, "cultureFit": 94},
      "strengths": ["Penguasaan LLM dan arsitektur RAG terkini di level enterprise", "Akurasi pemecahan masalah data yang luar biasa"],
      "weaknesses": ["Kinerja wawancara sempurna"],
      "overallFeedback": "Syifa Nuraini adalah talenta AI Engineer terdepan dengan pemahaman mendalam tentang kecerdasan buatan generatif."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000013',
    '11111111-1111-4111-a111-000000000013',
    '22222222-2222-4222-a222-000000000009',
    'Kerja',
    'Supply Chain Analyst',
    'PT Astra International Tbk',
    'Indonesian',
    'analytical',
    'medium',
    'completed',
    80.00,
    'Tegar Wicaksono',
    'tegar.w@ugm.ac.id',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days' + INTERVAL '25 minutes',
    '[
      {"role": "ai", "text": "Tegar, bagaimana Anda memitigasi keterlambatan pasokan suku cadang dari suplier luar negeri?"},
      {"role": "user", "text": "Saya menerapkan kebijakan dual-sourcing dengan suplier lokal dan menggunakan perhitungan safety stock dinamis berbasis peramalan permintaan."}
    ]'::jsonb,
    '{
      "scores": {"communication": 79, "technical": 82, "problemSolving": 80, "cultureFit": 79},
      "strengths": ["Rencana kontingensi rantai pasok yang realistis"],
      "weaknesses": ["Perjelas perhitungan kuantitatif persediaan pengaman (safety stock)"],
      "overallFeedback": "Tegar memiliki wawasan logistik yang solid untuk mendukung efisiensi operasional pabrik."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000014',
    '11111111-1111-4111-a111-000000000014',
    '22222222-2222-4222-a222-000000000002',
    'Kerja',
    'Data Scientist',
    'PT Bank Mandiri (Persero) Tbk',
    'Indonesian',
    'analytical',
    'hard',
    'completed',
    88.00,
    'Zahra Salsabila',
    'zahra.sal@its.ac.id',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days' + INTERVAL '31 minutes',
    '[
      {"role": "ai", "text": "Zahra, bagaimana model fraud detection Anda mendeteksi transaksi kartu kredit mencurigakan secara real-time?"},
      {"role": "user", "text": "Kami melatih model Isolation Forest kombinasi dengan XGBoost pada stream data Apache Kafka dengan latensi klasifikasi di bawah 50 milidetik."}
    ]'::jsonb,
    '{
      "scores": {"communication": 87, "technical": 90, "problemSolving": 88, "cultureFit": 87},
      "strengths": ["Implementasi machine learning berkinerja tinggi untuk deteksi anomali real-time"],
      "weaknesses": ["Jelaskan cara tim menangani false positive agar nasabah tidak terganggu"],
      "overallFeedback": "Zahra Salsabila merupakan Data Scientist handal dengan kemampuan analitik yang sangat berdaya saing."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000015',
    '11111111-1111-4111-a111-000000000015',
    '22222222-2222-4222-a222-000000000005',
    'Kerja',
    'Business Development',
    'PT Traveloka Indonesia',
    'Indonesian',
    'extroverted',
    'medium',
    'completed',
    81.00,
    'Ananda Pratama',
    'ananda.p@unpad.ac.id',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days' + INTERVAL '24 minutes',
    '[
      {"role": "ai", "text": "Ananda, bagaimana cara Anda membuka kemitraan strategis baru dengan grup hotel besar?"},
      {"role": "user", "text": "Saya menyusun proposal berbasis data tingkat okupansi kompetitor dan menawarkan skema bagi hasil yang kompetitif pada season promo khusus."}
    ]'::jsonb,
    '{
      "scores": {"communication": 83, "technical": 79, "problemSolving": 81, "cultureFit": 81},
      "strengths": ["Kemampuan negosiasi dan persetujuan kemitraan komersial yang baik"],
      "weaknesses": ["Perlu memperdalam analisis proyeksi margin keuntungan kemitraan"],
      "overallFeedback": "Ananda proaktif dalam membangun relasi bisnis dan berpotensi sukses sebagai Business Development."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000016',
    '11111111-1111-4111-a111-000000000016',
    '22222222-2222-4222-a222-000000000007',
    'Kerja',
    'UI/UX Designer',
    'PT Shopee International Indonesia',
    'Indonesian',
    'creative',
    'medium',
    'completed',
    85.00,
    'Jessica Putri Wibowo',
    'jessica.p@binus.ac.id',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days' + INTERVAL '29 minutes',
    '[
      {"role": "ai", "text": "Jessica, bagaimana Anda menata sistem komponen desain agar tim engineer mudah melakukan implementasi?"},
      {"role": "user", "text": "Saya membangun Design System menggunakan token di Figma yang bersinkronisasi langsung dengan repository CSS-in-JS tim frontend."}
    ]'::jsonb,
    '{
      "scores": {"communication": 86, "technical": 85, "problemSolving": 84, "cultureFit": 85},
      "strengths": ["Kerja sama yang sangat baik antara tim desain visual dengan developer frontend"],
      "weaknesses": ["Terus perbarui riset aksesibilitas kontras warna untuk pengguna lansia"],
      "overallFeedback": "Jessica adalah UI/UX Designer modern yang memahami efisiensi siklus produksi perangkat lunak."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000017',
    '11111111-1111-4111-a111-000000000017',
    '22222222-2222-4222-a222-000000000003',
    'Kerja',
    'Cloud Architect',
    'PT Telkom Indonesia (Persero) Tbk',
    'Indonesian',
    'technical',
    'hard',
    'completed',
    90.00,
    'Raja Mahendra',
    'raja.m@ui.ac.id',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day' + INTERVAL '32 minutes',
    '[
      {"role": "ai", "text": "Raja, jelaskan rancangan arsitektur hybrid cloud untuk migrasi server legacy BUMN."},
      {"role": "user", "text": "Kami membangun koneksi dedicated Direct Interconnect dan memindahkan beban kerja bertahap menggunakan pola Strangler Fig pada container GKE."}
    ]'::jsonb,
    '{
      "scores": {"communication": 89, "technical": 93, "problemSolving": 89, "cultureFit": 89},
      "strengths": ["Visi arsitektur cloud tingkat enterprise yang matang", "Kemampuan menyederhanakan migrasi sistem legacy yang berisiko tinggi"],
      "weaknesses": ["Tambahkan analisis penghematan biaya cloud (FinOps)"],
      "overallFeedback": "Raja Mahendra sangat memenuhi standar kualifikasi Cloud Architect korporasi besar."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000018',
    '11111111-1111-4111-a111-000000000018',
    '22222222-2222-4222-a222-000000000006',
    'Kerja',
    'Public Relations',
    'PT Unilever Indonesia Tbk',
    'Indonesian',
    'extroverted',
    'easy',
    'completed',
    83.00,
    'Wulan Sari',
    'wulan.sari@ugm.ac.id',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day' + INTERVAL '22 minutes',
    '[
      {"role": "ai", "text": "Wulan, bagaimana langkah komunikasi krisis Anda jika produk perusahaan viral karena komplain negatif di media sosial?"},
      {"role": "user", "text": "Saya segera menerbitkan pernyataan holding statement yang transparan dalam 2 jam dan berkoordinasi dengan tim kendali mutu untuk klarifikasi resmi."}
    ]'::jsonb,
    '{
      "scores": {"communication": 87, "technical": 79, "problemSolving": 83, "cultureFit": 83},
      "strengths": ["Penanganan komunikasi publik di saat krisis yang cepat dan tenang"],
      "weaknesses": ["Sertakan contoh metrik sentimen media pasca klarifikasi"],
      "overallFeedback": "Wulan memiliki artikulasi dan empati komunikasi yang sangat mendukung peran Public Relations."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000019',
    '11111111-1111-4111-a111-000000000019',
    '22222222-2222-4222-a222-000000000001',
    'Kerja',
    'Android Developer',
    'PT Bukalapak.com',
    'Indonesian',
    'technical',
    'medium',
    'completed',
    86.00,
    'Dimas Anggara',
    'dimas.a@its.ac.id',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day' + INTERVAL '27 minutes',
    '[
      {"role": "ai", "text": "Dimas, bagaimana Anda mencegah aplikasi Android crash pada perangkat berspesifikasi memori rendah?"},
      {"role": "user", "text": "Saya mengelola lifecycle coroutine di Kotlin secara teliti dan memuat gambar bitmap menggunakan Coil dengan subsampling adaptif."}
    ]'::jsonb,
    '{
      "scores": {"communication": 85, "technical": 88, "problemSolving": 86, "cultureFit": 85},
      "strengths": ["Solusi pemrograman Kotlin modern dan efisiensi memori seluler"],
      "weaknesses": ["Jelaskan juga manajemen modular app bundle untuk memperkecil ukuran APK"],
      "overallFeedback": "Dimas Anggara kompeten dan siap berkontribusi dalam tim pengembangan aplikasi seluler."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000020',
    '11111111-1111-4111-a111-000000000020',
    '22222222-2222-4222-a222-000000000005',
    'Kerja',
    'Marketing Specialist',
    'PT Tiket.com',
    'Indonesian',
    'extroverted',
    'easy',
    'completed',
    77.00,
    'Gita Permatasari',
    'gita.p@unair.ac.id',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day' + INTERVAL '23 minutes',
    '[
      {"role": "ai", "text": "Gita, bagaimana cara Anda mengoptimalkan anggaran iklan digital (ROAS) pada saat promo liburan akhir tahun?"},
      {"role": "user", "text": "Saya melakukan A/B testing pada materi kreatif iklan dan mengalokasikan budget ke platform dengan cost-per-click terendah namun konversinya stabil."}
    ]'::jsonb,
    '{
      "scores": {"communication": 79, "technical": 75, "problemSolving": 77, "cultureFit": 77},
      "strengths": ["Penguasaan konsep pengujian iklan dan alokasi anggaran pemasaran"],
      "weaknesses": ["Bisa lebih merinci cara mengolah audiens kustom dan retargeting"],
      "overallFeedback": "Gita memiliki dasar pemasaran digital yang baik dan perlu meningkatkan ketajaman analisis datanya."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000021',
    '11111111-1111-4111-a111-000000000021',
    '22222222-2222-4222-a222-000000000003',
    'Kerja',
    'Cybersecurity Engineer',
    'PT Bank Central Asia Tbk',
    'Indonesian',
    'technical',
    'hard',
    'completed',
    89.00,
    'Hafiz Kurniawan',
    'hafiz.k@itb.ac.id',
    NOW() - INTERVAL '20 hours',
    NOW() - INTERVAL '20 hours' + INTERVAL '34 minutes',
    '[
      {"role": "ai", "text": "Hafiz, bagaimana Anda mendeteksi upaya penyusupan zero-day pada jaringan perbankan?"},
      {"role": "user", "text": "Kami memanfaatkan SIEM berbasis anomali perilaku jaringan dan segera melakukan isolasi subnet secara otomatis melalui firewall SIEM playbook."}
    ]'::jsonb,
    '{
      "scores": {"communication": 87, "technical": 92, "problemSolving": 89, "cultureFit": 88},
      "strengths": ["Respons insiden keamanan siber yang cepat dan otomatis", "Pemahaman regulasi keamanan informasi perbankan"],
      "weaknesses": ["Tetap komunikasikan dampak penghentian sementara layanan kepada tim bisnis"],
      "overallFeedback": "Hafiz Kurniawan siap menjaga keamanan infrastruktur kritikal perbankan."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000022',
    '11111111-1111-4111-a111-000000000022',
    '22222222-2222-4222-a222-000000000004',
    'Kerja',
    'Auditor Keuangan',
    'PT Bank Mandiri (Persero) Tbk',
    'Indonesian',
    'analytical',
    'medium',
    'completed',
    84.00,
    'Indah Larasati',
    'indah.l@unpad.ac.id',
    NOW() - INTERVAL '18 hours',
    NOW() - INTERVAL '18 hours' + INTERVAL '28 minutes',
    '[
      {"role": "ai", "text": "Indah, langkah apa yang Anda ambil jika menemukan ketidaksesuaian pencatatan kas di kantor cabang?"},
      {"role": "user", "text": "Saya melakukan rekonsiliasi ulang bukti transaksi fisik dengan mutas sistem, lalu mewawancarai kasir secara independen tanpa memberikan asumsi negatif awal."}
    ]'::jsonb,
    '{
      "scores": {"communication": 85, "technical": 85, "problemSolving": 84, "cultureFit": 82},
      "strengths": ["Integritas audit yang tinggi dan prosedur pembuktian yang obyektif"],
      "weaknesses": ["Tambahkan laporan rekomendasi pencegahan kesalahan kas di masa depan"],
      "overallFeedback": "Indah adalah calon Auditor Keuangan yang obyektif, teliti, dan profesional."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000023',
    '11111111-1111-4111-a111-000000000023',
    '22222222-2222-4222-a222-000000000008',
    'Kerja',
    'Project Engineer',
    'PT Pertamina (Persero)',
    'Indonesian',
    'leadership',
    'medium',
    'completed',
    76.00,
    'Joko Purwanto',
    'joko.p@undip.ac.id',
    NOW() - INTERVAL '16 hours',
    NOW() - INTERVAL '16 hours' + INTERVAL '25 minutes',
    '[
      {"role": "ai", "text": "Joko, bagaimana Anda menangani keterlambatan kontraktor lapangan dalam proyek instalasi pipa kilang?"},
      {"role": "user", "text": "Saya mengadakan rapat evaluasi harian dan membantu menyusun ulang urutan pekerjaan paralel agar critical path proyek tetap tercapai."}
    ]'::jsonb,
    '{
      "scores": {"communication": 75, "technical": 78, "problemSolving": 76, "cultureFit": 75},
      "strengths": ["Pengelolaan proyek lapangan berbasis penyelesaian kendala (problem solving)"],
      "weaknesses": ["Tingkatkan ketajaman presentasi laporan manajemen biaya proyek"],
      "overallFeedback": "Joko memiliki pengalaman lapangan yang kuat dan perlu berlatih mengkomunikasikan ringkasan eksekutif dengan lebih runtut."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000024',
    '11111111-1111-4111-a111-000000000024',
    '22222222-2222-4222-a222-000000000007',
    'Kerja',
    'QA Engineer',
    'PT Blibli.com',
    'Indonesian',
    'analytical',
    'medium',
    'completed',
    85.00,
    'Kartika Dewi',
    'kartika.d@ub.ac.id',
    NOW() - INTERVAL '14 hours',
    NOW() - INTERVAL '14 hours' + INTERVAL '29 minutes',
    '[
      {"role": "ai", "text": "Kartika, bagaimana cara Anda menyusun skema otomatisasi regresi tes untuk fitur keranjang belanja e-commerce?"},
      {"role": "user", "text": "Saya menggunakan Cypress dengan pendekatan Page Object Model dan menjalankan pengujian end-to-end pada setiap merge request di GitLab CI."}
    ]'::jsonb,
    '{
      "scores": {"communication": 85, "technical": 87, "problemSolving": 84, "cultureFit": 84},
      "strengths": ["Struktur otomatisasi pengujian yang rapi (Page Object Model)", "Integrasi ke pipeline CI/CD"],
      "weaknesses": ["Jelaskan cara tim QA menjaga agar tes otomatis tidak rapuh (flaky test)"],
      "overallFeedback": "Kartika Dewi berprestasi baik dan siap memastikan kualitas rilis aplikasi belanja online."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000025',
    '11111111-1111-4111-a111-000000000025',
    '22222222-2222-4222-a222-000000000001',
    'Kerja',
    'Golang Developer',
    'PT GoTo Gojek Tokopedia',
    'Indonesian',
    'technical',
    'hard',
    'completed',
    91.00,
    'Lukman Hakim',
    'lukman.h@ui.ac.id',
    NOW() - INTERVAL '12 hours',
    NOW() - INTERVAL '12 hours' + INTERVAL '33 minutes',
    '[
      {"role": "ai", "text": "Lukman, bagaimana Anda mencegah goroutine leak pada layanan Go yang memproses puluhan ribu request per detik?"},
      {"role": "user", "text": "Saya selalu menyertakan Context dengan timeout pada setiap goroutine dan memonitor jumlah aktif goroutine menggunakan pprof secara berkala."}
    ]'::jsonb,
    '{
      "scores": {"communication": 88, "technical": 94, "problemSolving": 91, "cultureFit": 91},
      "strengths": ["Penguasaan konkuren programming dan profiling memori di bahasa Go", "Cara menjawab yang tenang dan analitis"],
      "weaknesses": ["Sudah sangat siap untuk lingkungan produksi skala tinggi"],
      "overallFeedback": "Lukman Hakim adalah developer Go berkualitas tinggi dengan pemahaman sistem backend yang sangat matang."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000026',
    '11111111-1111-4111-a111-000000000026',
    '22222222-2222-4222-a222-000000000008',
    'Kerja',
    'Talent Acquisition',
    'PT Traveloka Indonesia',
    'Indonesian',
    'empathetic',
    'medium',
    'completed',
    82.00,
    'Mega Kusuma',
    'mega.k@ugm.ac.id',
    NOW() - INTERVAL '10 hours',
    NOW() - INTERVAL '10 hours' + INTERVAL '26 minutes',
    '[
      {"role": "ai", "text": "Mega, bagaimana Anda merekrut talenta engineering langka ketika penawaran gaji kompetitor lebih tinggi?"},
      {"role": "user", "text": "Saya menonjolkan budaya inovasi teknologi perusahaan, jenjang karier yang jelas, serta skema fleksibilitas kerja yang tidak ditawarkan kompetitor."}
    ]'::jsonb,
    '{
      "scores": {"communication": 85, "technical": 79, "problemSolving": 82, "cultureFit": 82},
      "strengths": ["Strategi rekrutmen holistik dan persuasif"],
      "weaknesses": ["Bisa lebih menunjukkan metrik waktu rekrutmen (time-to-hire)"],
      "overallFeedback": "Mega Kusuma adalah komunikator yang hebat dan berbakat sebagai perekrut talenta perusahaan."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000027',
    '11111111-1111-4111-a111-000000000027',
    '22222222-2222-4222-a222-000000000007',
    'Kerja',
    'Embedded Systems Engineer',
    'PT Astra International Tbk',
    'Indonesian',
    'technical',
    'medium',
    'completed',
    80.00,
    'Naufal Abiyyu',
    'naufal.a@its.ac.id',
    NOW() - INTERVAL '9 hours',
    NOW() - INTERVAL '9 hours' + INTERVAL '27 minutes',
    '[
      {"role": "ai", "text": "Naufal, bagaimana Anda mendebug antarmuka SPI pada mikrokontroler jika komunikasi data dengan sensor putus sambung?"},
      {"role": "user", "text": "Saya menggunakan logic analyzer untuk memeriksa clock dan jalur MISO/MOSI, serta menambahkan pull-up resistor untuk mengurangi noise gelombang."}
    ]'::jsonb,
    '{
      "scores": {"communication": 78, "technical": 83, "problemSolving": 80, "cultureFit": 79},
      "strengths": ["Pemecahan masalah perangkat keras yang praktis dan akurat"],
      "weaknesses": ["Perjelas struktur penjelasan dengan membagi langkah diagnosis secara berurutan"],
      "overallFeedback": "Naufal berkompeten dalam bidang sistem embedded dan siap berkarier di industri otomatisasi."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000028',
    '11111111-1111-4111-a111-000000000028',
    '22222222-2222-4222-a222-000000000007',
    'Kerja',
    'Product Designer',
    'PT Shopee International Indonesia',
    'Indonesian',
    'creative',
    'medium',
    'completed',
    88.00,
    'Olivia Damayanti',
    'olivia.d@binus.ac.id',
    NOW() - INTERVAL '8 hours',
    NOW() - INTERVAL '8 hours' + INTERVAL '30 minutes',
    '[
      {"role": "ai", "text": "Olivia, bagaimana Anda mendesain fitur checkout yang memudahkan pengguna baru tanpa mengganggu pengguna lama?"},
      {"role": "user", "text": "Saya membuat alur satu halaman (one-click checkout) dengan fitur simpan alamat otomatis dan menyediakan mode konvensional sebagai alternatif."}
    ]'::jsonb,
    '{
      "scores": {"communication": 89, "technical": 87, "problemSolving": 88, "cultureFit": 88},
      "strengths": ["Desain produk berbasis empati pengguna yang mendalam", "Presentasi portofolio desain yang sangat rapi"],
      "weaknesses": ["Tetap pantau hasil analytics pemakaian pasca peluncuran"],
      "overallFeedback": "Olivia adalah Product Designer bermutu tinggi dengan sentuhan desain yang modern."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000029',
    '11111111-1111-4111-a111-000000000029',
    '22222222-2222-4222-a222-000000000002',
    'Kerja',
    'Machine Learning Engineer',
    'PT GoTo Gojek Tokopedia',
    'Indonesian',
    'technical',
    'hard',
    'completed',
    93.00,
    'Prasetyo Adi Putra',
    'prasetyo.a@itb.ac.id',
    NOW() - INTERVAL '7 hours',
    NOW() - INTERVAL '7 hours' + INTERVAL '34 minutes',
    '[
      {"role": "ai", "text": "Prasetyo, bagaimana Anda mengatasi masalah drift data pada model sistem rekomendasi belanja yang sudah berjalan?"},
      {"role": "user", "text": "Kami memasang pemantauan distribusi fitur otomatis (Evidently AI) dan memicu pipeline pelatihan ulang bulanan di Kubeflow jika PSI melebihi ambang batas."}
    ]'::jsonb,
    '{
      "scores": {"communication": 91, "technical": 95, "problemSolving": 93, "cultureFit": 93},
      "strengths": ["Penguasaan otomatisasi MLOps dan pemeliharaan model kecerdasan buatan skala tinggi", "Komunikasi ilmiah yang runtut"],
      "weaknesses": ["Kinerja wawancara sangat luar biasa"],
      "overallFeedback": "Prasetyo Adi Putra merupakan talenta Machine Learning Engineer terbaik dengan penguasaan standar industri global."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000030',
    '11111111-1111-4111-a111-000000000030',
    '22222222-2222-4222-a222-000000000005',
    'Kerja',
    'Account Executive',
    'PT Telkom Indonesia (Persero) Tbk',
    'Indonesian',
    'extroverted',
    'medium',
    'completed',
    79.00,
    'Qori Maharani',
    'qori.m@unpad.ac.id',
    NOW() - INTERVAL '6 hours',
    NOW() - INTERVAL '6 hours' + INTERVAL '24 minutes',
    '[
      {"role": "ai", "text": "Qori, bagaimana cara Anda meyakinkan klien B2B yang ragu-ragu untuk memperpanjang kontrak layanan perusahaan?"},
      {"role": "user", "text": "Saya menunjukkan laporan ROI yang telah diraih selama kontrak sebelumnya dan memberikan bonus pendampingan teknis gratis untuk tahun berikutnya."}
    ]'::jsonb,
    '{
      "scores": {"communication": 82, "technical": 75, "problemSolving": 80, "cultureFit": 79},
      "strengths": ["Pendekatan penjualan berbasis nilai (value-based selling)"],
      "weaknesses": ["Perjelas teknik negosiasi harga saat anggaran klien dipotong"],
      "overallFeedback": "Qori Maharani persuasif dan siap berkarier di dunia B2B Account Management."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000031',
    '11111111-1111-4111-a111-000000000031',
    '22222222-2222-4222-a222-000000000003',
    'Kerja',
    'Systems Engineer',
    'PT Bank Mandiri (Persero) Tbk',
    'Indonesian',
    'technical',
    'hard',
    'completed',
    86.00,
    'Rafi Ahmad Ramadhan',
    'rafi.a@ui.ac.id',
    NOW() - INTERVAL '5 hours',
    NOW() - INTERVAL '5 hours' + INTERVAL '29 minutes',
    '[
      {"role": "ai", "text": "Rafi, bagaimana Anda melakukan pembaruan kernel server Linux tanpa menghentikan layanan transaksi perbankan?"},
      {"role": "user", "text": "Saya menggunakan Live Kernel Patching (KernelCare) dan melakukan rolling reboot secara bergiliran di belakang load balancer HAProxy."}
    ]'::jsonb,
    '{
      "scores": {"communication": 85, "technical": 88, "problemSolving": 86, "cultureFit": 85},
      "strengths": ["Prosedur pemeliharaan sistem zero-downtime yang matang"],
      "weaknesses": ["Jelaskan rencana pengujian pemulihan sebelum penerapan di produksi"],
      "overallFeedback": "Rafi Ahmad Ramadhan sangat memahami keandalan sistem Linux dan siap mengelola infrastruktur perbankan."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000032',
    '11111111-1111-4111-a111-000000000032',
    '22222222-2222-4222-a222-000000000002',
    'Kerja',
    'Data Analyst',
    'PT Tiket.com',
    'Indonesian',
    'analytical',
    'medium',
    'completed',
    87.00,
    'Salsabila Rahma',
    'salsabila.r@ugm.ac.id',
    NOW() - INTERVAL '4 hours',
    NOW() - INTERVAL '4 hours' + INTERVAL '30 minutes',
    '[
      {"role": "ai", "text": "Salsabila, bagaimana Anda mengolah data pemesanan hotel untuk memprediksi puncak liburan akhir pekan?"},
      {"role": "user", "text": "Saya menerapkan analisis time series menggunakan model Prophet di Python untuk menangkap tren musiman mingguan dan hari libur nasional."}
    ]'::jsonb,
    '{
      "scores": {"communication": 87, "technical": 88, "problemSolving": 87, "cultureFit": 86},
      "strengths": ["Penerapan statistik peramalan (time series) pada data nyata bisnis pariwisata"],
      "weaknesses": ["Tambahkan juga faktor eksternal seperti cuaca ke dalam pemodelan"],
      "overallFeedback": "Salsabila Rahma analitis, cerdas, dan mampu mempresentasikan temuannya dengan lugas."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000033',
    '11111111-1111-4111-a111-000000000033',
    '22222222-2222-4222-a222-000000000004',
    'Kerja',
    'Management Trainee',
    'PT Bank Central Asia Tbk',
    'Indonesian',
    'leadership',
    'medium',
    'completed',
    84.00,
    'Tari Kurnia Ningrum',
    'tari.k@unair.ac.id',
    NOW() - INTERVAL '3 hours',
    NOW() - INTERVAL '3 hours' + INTERVAL '28 minutes',
    '[
      {"role": "ai", "text": "Tari, ceritakan proyek kepemimpinan kampus di mana Anda berhasil mencapai target dana yang sulit."},
      {"role": "user", "text": "Sebagai Ketua Panitia Seminar Nasional, saya menyusun paket sponsorship kustom dan berhasil mengumpulkan dana Rp120 juta dalam waktu 1 bulan."}
    ]'::jsonb,
    '{
      "scores": {"communication": 86, "technical": 82, "problemSolving": 85, "cultureFit": 83},
      "strengths": ["Inisiatif kepemimpinan dan rekam jejak keberhasilan manajerial yang terbukti"],
      "weaknesses": ["Jelaskan cara tim mengatasi perbedaan pendapat saat penentuan anggaran"],
      "overallFeedback": "Tari Kurnia Ningrum merupakan kandidat Management Trainee perbankan yang berkarakter kuat dan gesit."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000034',
    '11111111-1111-4111-a111-000000000034',
    '22222222-2222-4222-a222-000000000001',
    'Kerja',
    'Frontend Developer',
    'PT Bukalapak.com',
    'Indonesian',
    'technical',
    'medium',
    'completed',
    83.00,
    'Usman Harun',
    'usman.h@undip.ac.id',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours' + INTERVAL '26 minutes',
    '[
      {"role": "ai", "text": "Usman, bagaimana Anda memastikan situs web e-commerce dapat diakses oleh penyandang disabilitas?"},
      {"role": "user", "text": "Saya menerapkan atribut ARIA, menjaga rasio kontras warna AA, dan menguji navigasi menggunakan screen reader NVDA."}
    ]'::jsonb,
    '{
      "scores": {"communication": 83, "technical": 84, "problemSolving": 83, "cultureFit": 82},
      "strengths": ["Perhatian tinggi terhadap aksesibilitas web (a11y) dan standar kode bersih"],
      "weaknesses": ["Bisa lebih mendalami teknik optimasi rendering grafis berat"],
      "overallFeedback": "Usman Harun adalah Frontend Developer teliti yang menjunjung tinggi standar web universal."
    }'::jsonb
  ),
  (
    '44444444-4444-4444-a444-000000000035',
    '11111111-1111-4111-a111-000000000035',
    '22222222-2222-4222-a222-000000000005',
    'Kerja',
    'Growth Marketing Specialist',
    'PT Traveloka Indonesia',
    'Indonesian',
    'extroverted',
    'medium',
    'completed',
    89.00,
    'Vania Aurelia',
    'vania.a@binus.ac.id',
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '1 hour' + INTERVAL '29 minutes',
    '[
      {"role": "ai", "text": "Vania, jelaskan strategi growth hacking Anda untuk meningkatkan pemesanan tiket pada hari kerja."},
      {"role": "user", "text": "Saya meluncurkan program flash sale jam makan siang terpersonalisasi melalui notifikasi push aplikasi dan meningkatkan konversi hingga 24%."}
    ]'::jsonb,
    '{
      "scores": {"communication": 90, "technical": 88, "problemSolving": 89, "cultureFit": 89},
      "strengths": ["Strategi pemasaran berbasis eksperimen data dengan hasil numerik yang nyata", "Komunikasi yang antusias dan meyakinkan"],
      "weaknesses": ["Terus evaluasi biaya akuisisi jangka panjang agar margin keuntungan terjaga"],
      "overallFeedback": "Vania Aurelia sangat berpotensi menjadi bintang pemasaran digital dalam tim Growth."
    }'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  role_target = EXCLUDED.role_target,
  company = EXCLUDED.company,
  score = EXCLUDED.score,
  candidate_name = EXCLUDED.candidate_name,
  transcript = EXCLUDED.transcript,
  analysis = EXCLUDED.analysis,
  status = EXCLUDED.status;

-- 7. INSERT 35 ANALISIS HASIL (ANALYSIS_RESULTS) UNTUK TIAP SESI
INSERT INTO analysis_results (id, session_id, communication_score, technical_score, problem_solving_score, culture_fit_score, strengths, weaknesses, overall_feedback, analyzed_at, created_at)
SELECT
  gen_random_uuid(),
  id,
  COALESCE((analysis->'scores'->>'communication')::numeric, 85),
  COALESCE((analysis->'scores'->>'technical')::numeric, 85),
  COALESCE((analysis->'scores'->>'problemSolving')::numeric, 85),
  COALESCE((analysis->'scores'->>'cultureFit')::numeric, 85),
  COALESCE(analysis->'strengths', '["Komunikasi baik"]'::jsonb),
  COALESCE(analysis->'weaknesses', '["Perbanyak contoh konkret"]'::jsonb),
  COALESCE(analysis->>'overallFeedback', 'Performa wawancara yang solid dan siap kerja.'),
  end_time,
  end_time
FROM interview_sessions
WHERE id IN (
  '44444444-4444-4444-a444-000000000001', '44444444-4444-4444-a444-000000000002', '44444444-4444-4444-a444-000000000003', '44444444-4444-4444-a444-000000000004', '44444444-4444-4444-a444-000000000005',
  '44444444-4444-4444-a444-000000000006', '44444444-4444-4444-a444-000000000007', '44444444-4444-4444-a444-000000000008', '44444444-4444-4444-a444-000000000009', '44444444-4444-4444-a444-000000000010',
  '44444444-4444-4444-a444-000000000011', '44444444-4444-4444-a444-000000000012', '44444444-4444-4444-a444-000000000013', '44444444-4444-4444-a444-000000000014', '44444444-4444-4444-a444-000000000015',
  '44444444-4444-4444-a444-000000000016', '44444444-4444-4444-a444-000000000017', '44444444-4444-4444-a444-000000000018', '44444444-4444-4444-a444-000000000019', '44444444-4444-4444-a444-000000000020',
  '44444444-4444-4444-a444-000000000021', '44444444-4444-4444-a444-000000000022', '44444444-4444-4444-a444-000000000023', '44444444-4444-4444-a444-000000000024', '44444444-4444-4444-a444-000000000025',
  '44444444-4444-4444-a444-000000000026', '44444444-4444-4444-a444-000000000027', '44444444-4444-4444-a444-000000000028', '44444444-4444-4444-a444-000000000029', '44444444-4444-4444-a444-000000000030',
  '44444444-4444-4444-a444-000000000031', '44444444-4444-4444-a444-000000000032', '44444444-4444-4444-a444-000000000033', '44444444-4444-4444-a444-000000000034', '44444444-4444-4444-a444-000000000035'
);

-- 8. INSERT 70+ CONVERSATION LOGS DARI TRANSKRIP TIAP SESI
INSERT INTO conversation_logs (session_id, question_text, user_answer, answer_type, timestamp, created_at)
SELECT
  id,
  transcript->0->>'text',
  transcript->1->>'text',
  'STAR',
  end_time,
  end_time
FROM interview_sessions
WHERE jsonb_array_length(transcript) >= 2;

-- SELESAI: 35 DATA MOCKUP REAL INDONESIA UNTUK PRESENTASI SKRIPSI SIAP DIGUNAKAN!
