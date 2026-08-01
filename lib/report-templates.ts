export type ReportItem = {
  id: string;
  title: string;
  description: string;
  type: string;
  exportTypes: Array<"PDF" | "Excel">;
  adminOnly?: boolean;
  lecturerOnly?: boolean;
  studentOnly?: boolean;
  requireSignature?: boolean;
};

export const REPORT_ITEMS: ReportItem[] = [
  {
    id: "r1",
    title: "Laporan Transkrip Wawancara",
    description: "Dokumen log percakapan lengkap sesi interview.",
    type: "transcript",
    exportTypes: ["PDF", "Excel"],
    studentOnly: true,
    requireSignature: true,
  },
  {
    id: "r2",
    title: "Laporan Hasil Evaluasi Skor (Performa Keseluruhan)",
    description: "Rekap nilai akhir per sesi latihan secara resmi.",
    type: "score-evaluation",
    exportTypes: ["PDF", "Excel"],
    requireSignature: true,
  },
  {
    id: "r3",
    title: "Laporan Analisis Kekuatan & Kelemahan",
    description: "Rincian kekuatan dan area perbaikan jawaban.",
    type: "strength-weakness",
    exportTypes: ["PDF", "Excel"],
    studentOnly: true,
    requireSignature: true,
  },
  {
    id: "r4",
    title: "Laporan Perbandingan Jawaban",
    description: "Tabel jawaban user versus jawaban ideal.",
    type: "answer-comparison",
    exportTypes: ["PDF", "Excel"],
    studentOnly: true,
    requireSignature: true,
  },
  {
    id: "r5",
    title: "Laporan Grafik Perkembangan",
    description: "Tren skor latihan dari waktu ke waktu.",
    type: "progress-chart",
    exportTypes: ["PDF", "Excel"],
    studentOnly: true,
    requireSignature: true,
  },
  {
    id: "r6",
    title: "Laporan Rekomendasi Pengembangan Diri",
    description: "Saran belajar dan latihan yang dipersonalisasi AI.",
    type: "development-recommendation",
    exportTypes: ["PDF", "Excel"],
    studentOnly: true,
    requireSignature: true,
  },
  {
    id: "r7",
    title: "Laporan Data Peserta Aktif & Demografi (Admin)",
    description: "Rekap resmi peserta yang aktif berlatih di platform.",
    type: "active-participants",
    exportTypes: ["PDF", "Excel"],
    adminOnly: true,
    requireSignature: true,
  },
  {
    id: "r8",
    title: "Laporan Analitik Modul (Admin)",
    description: "Data penggunaan dan kompetensi modul latihan.",
    type: "module-statistics",
    exportTypes: ["PDF", "Excel"],
    adminOnly: true,
    requireSignature: true,
  },
  {
    id: "r9",
    title: "Laporan Analisis Tingkat Kesulitan (Admin)",
    description: "Statistik soal yang paling sering dijawab salah.",
    type: "difficulty-analysis",
    exportTypes: ["PDF", "Excel"],
    adminOnly: true,
    requireSignature: true,
  },
  {
    id: "r10",
    title: "Sertifikat Latihan",
    description: "Bukti menyelesaikan sesi latihan interview.",
    type: "certificate",
    exportTypes: ["PDF"],
    studentOnly: true,
    requireSignature: false,
  },
  {
    id: "r11",
    title: "Laporan Statistik Penggunaan Sistem",
    description: "Jumlah sesi per periode, waktu latihan rata-rata, fitur yang paling sering digunakan.",
    type: "system-stats",
    exportTypes: ["PDF", "Excel"],
    adminOnly: true,
    requireSignature: true,
  },
  {
    id: "r12",
    title: "Laporan Feedback Pengguna",
    description: "Umpan balik dan penilaian sistem dari mahasiswa.",
    type: "user-feedback",
    exportTypes: ["PDF", "Excel"],
    adminOnly: true,
    requireSignature: true,
  },
  {
    id: "r13",
    title: "Laporan Penggunaan Bank Soal & Modul",
    description: "Rekap frekuensi penggunaan setiap butir bank soal oleh mahasiswa pada sesi latihan.",
    type: "question-bank-usage",
    exportTypes: ["PDF", "Excel"],
    lecturerOnly: true,
    requireSignature: true,
  },
  {
    id: "r14",
    title: "Laporan Akumulasi Kompetensi Mahasiswa",
    description: "Rekap rata-rata skor latihan mahasiswa berdasarkan kategori modul wawancara.",
    type: "student-competency-summary",
    exportTypes: ["PDF", "Excel"],
    lecturerOnly: true,
    requireSignature: true,
  },
  {
    id: "r15",
    title: "Laporan Analisis Kesalahan & Area Perbaikan Kelas",
    description: "Rangkuman indikator kriteria yang paling sering mendapat skor rendah oleh mahasiswa.",
    type: "class-error-analysis",
    exportTypes: ["PDF", "Excel"],
    lecturerOnly: true,
    requireSignature: true,
  },
  {
    id: "r16",
    title: "Laporan Evaluasi Kesulitan Soal",
    description: "Statistik sebaran nilai mahasiswa pada soal tingkat Mudah, Sedang, dan Sulit.",
    type: "question-difficulty-evaluation",
    exportTypes: ["PDF", "Excel"],
    lecturerOnly: true,
    requireSignature: true,
  },
  {
    id: "r17",
    title: "Laporan Keaktifan & Frekuensi Latihan Mahasiswa",
    description: "Log aktivitas sesi wawancara mahasiswa dan intensitas latihan dari waktu ke waktu.",
    type: "student-practice-attendance",
    exportTypes: ["PDF", "Excel"],
    lecturerOnly: true,
    requireSignature: true,
  },
  {
    id: "r18",
    title: "Laporan Rekapitulasi Bimbingan Dosen",
    description: "Laporan resmi kemajuan dan hasil pembimbingan wawancara kerja mahasiswa didik.",
    type: "lecturer-mentoring-summary",
    exportTypes: ["PDF", "Excel"],
    lecturerOnly: true,
    requireSignature: true,
  },
];

export const SAMPLE_ROWS: Record<
  string,
  Array<Record<string, string | number>>
> = {
  transcript: [
    { No: 1, Speaker: "AI", Text: "Perkenalkan diri Anda." },
    {
      No: 2,
      Speaker: "Mahasiswa",
      Text: "Saya mahasiswa TI semester akhir...",
    },
  ],
  "score-evaluation": [
    { Kriteria: "Communication", Nilai: 85 },
    { Kriteria: "Technical", Nilai: 78 },
    { Kriteria: "Problem Solving", Nilai: 82 },
  ],
  "strength-weakness": [
    { Tipe: "Kekuatan", Item: "Jawaban terstruktur" },
    { Tipe: "Kelemahan", Item: "Contoh kurang konkret" },
  ],
  "answer-comparison": [
    {
      Pertanyaan: "Apa kelebihanmu?",
      "Jawaban User": "Cepat belajar",
      "Jawaban Ideal": "Cepat belajar + contoh nyata",
    },
  ],
  "progress-chart": [
    { Bulan: "Jan", Skor: 72 },
    { Bulan: "Feb", Skor: 79 },
    { Bulan: "Mar", Skor: 84 },
  ],
  "development-recommendation": [
    {
      Prioritas: "Tinggi",
      Rekomendasi: "Latih STAR method untuk behavioral question",
    },
  ],
  "active-participants": [
    { Nama: "Budi", Sesi: 12, Status: "Aktif" },
    { Nama: "Sari", Sesi: 9, Status: "Aktif" },
  ],
  "module-statistics": [
    { Modul: "Technical Interview", Penggunaan: 120 },
    { Modul: "General Interview", Penggunaan: 96 },
  ],
  "difficulty-analysis": [
    { Pertanyaan: "System design caching", "Salah (%)": 68 },
  ],
  certificate: [
    {
      Nama: "Mahasiswa",
      Modul: "Technical Interview",
      Nilai: 84,
      Tanggal: "2026-03-13",
    },
  ],
  "question-bank-usage": [
    { "Kategori / Bidang": "Rekayasa Perangkat Lunak", "Total Penggunaan": 45, "Rata-rata Skor": 82, "Status Pemakaian": "Tinggi" },
    { "Kategori / Bidang": "Jaringan & Keamanan", "Total Penggunaan": 28, "Rata-rata Skor": 75, "Status Pemakaian": "Sedang" },
  ],
  "student-competency-summary": [
    { "Nama Mahasiswa": "Budi Santoso", "Total Sesi Latihan": 14, "Rata-rata Nilai Akhir": 86, "Capaian Kompetensi": "Sangat Baik" },
    { "Nama Mahasiswa": "Sari Wulandari", "Total Sesi Latihan": 10, "Rata-rata Nilai Akhir": 79, "Capaian Kompetensi": "Baik" },
  ],
  "class-error-analysis": [
    { "Indikator / Kriteria": "Penyampaian Contoh Nyata (STAR)", "Sesi Skor Di Bawah Standar": 18, "Persentase Kelemahan (%)": 42, "Rekomendasi Dosen": "Latihan teknik penataan jawaban struktural" },
    { "Indikator / Kriteria": "Kedalaman Solusi Teknis", "Sesi Skor Di Bawah Standar": 12, "Persentase Kelemahan (%)": 28, "Rekomendasi Dosen": "Eksplorasi arsitektur sistem dasar" },
  ],
  "question-difficulty-evaluation": [
    { "Tingkat Kesulitan": "Mudah (Easy)", "Total Sesi Dijawab": 62, "Rata-rata Skor Mahasiswa": 88, "Status Evaluasi": "Soal Efektif" },
    { "Tingkat Kesulitan": "Sedang (Medium)", "Total Sesi Dijawab": 54, "Rata-rata Skor Mahasiswa": 78, "Status Evaluasi": "Soal Efektif" },
    { "Tingkat Kesulitan": "Sulit (Hard)", "Total Sesi Dijawab": 30, "Rata-rata Skor Mahasiswa": 66, "Status Evaluasi": "Perlu Pembahasan Kelas" },
  ],
  "student-practice-attendance": [
    { "Mahasiswa": "Budi Santoso", "Total Sesi Selesai": 14, "Sesi Terakhir": "2026-07-28", "Status Keaktifan": "Aktif Berlatih" },
    { "Mahasiswa": "Sari Wulandari", "Total Sesi Selesai": 10, "Sesi Terakhir": "2026-07-29", "Status Keaktifan": "Aktif Berlatih" },
  ],
  "lecturer-mentoring-summary": [
    { "Nama Mahasiswa": "Budi Santoso", "Program Studi": "Teknik Informatika", "Jumlah Sesi Bimbingan AI": 14, "Nilai Evaluasi Akhir": 86, "Status Rekomendasi": "Siap Kerja / Kompeten" },
    { "Nama Mahasiswa": "Sari Wulandari", "Program Studi": "Sistem Informasi", "Jumlah Sesi Bimbingan AI": 10, "Nilai Evaluasi Akhir": 79, "Status Rekomendasi": "Siap Kerja / Kompeten" },
  ],
};
