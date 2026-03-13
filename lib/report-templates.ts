export type ReportItem = {
  id: string;
  title: string;
  description: string;
  type: string;
  exportTypes: Array<"PDF" | "Excel">;
  adminOnly?: boolean;
};

export const REPORT_ITEMS: ReportItem[] = [
  {
    id: "r1",
    title: "Laporan Transkrip Wawancara",
    description: "Dokumen log percakapan lengkap sesi interview.",
    type: "transcript",
    exportTypes: ["PDF", "Excel"],
  },
  {
    id: "r2",
    title: "Laporan Hasil Evaluasi Skor",
    description: "Rekap nilai akhir per sesi latihan.",
    type: "score-evaluation",
    exportTypes: ["PDF", "Excel"],
  },
  {
    id: "r3",
    title: "Laporan Analisis Kekuatan & Kelemahan",
    description: "Rincian kekuatan dan area perbaikan jawaban.",
    type: "strength-weakness",
    exportTypes: ["PDF", "Excel"],
  },
  {
    id: "r4",
    title: "Laporan Perbandingan Jawaban",
    description: "Tabel jawaban user versus jawaban ideal.",
    type: "answer-comparison",
    exportTypes: ["PDF", "Excel"],
  },
  {
    id: "r5",
    title: "Laporan Grafik Perkembangan",
    description: "Tren skor latihan dari waktu ke waktu.",
    type: "progress-chart",
    exportTypes: ["PDF", "Excel"],
  },
  {
    id: "r6",
    title: "Laporan Rekomendasi Pengembangan Diri",
    description: "Saran belajar dan latihan yang dipersonalisasi AI.",
    type: "development-recommendation",
    exportTypes: ["PDF", "Excel"],
  },
  {
    id: "r7",
    title: "Laporan Data Peserta Aktif (Admin)",
    description: "Rekap peserta yang aktif berlatih.",
    type: "active-participants",
    exportTypes: ["PDF", "Excel"],
    adminOnly: true,
  },
  {
    id: "r8",
    title: "Laporan Statistik Modul (Admin)",
    description: "Data popularitas modul latihan.",
    type: "module-statistics",
    exportTypes: ["PDF", "Excel"],
    adminOnly: true,
  },
  {
    id: "r9",
    title: "Laporan Analisis Tingkat Kesulitan (Admin)",
    description: "Statistik soal yang paling sering dijawab salah.",
    type: "difficulty-analysis",
    exportTypes: ["PDF", "Excel"],
    adminOnly: true,
  },
  {
    id: "r10",
    title: "Sertifikat Latihan",
    description: "Bukti menyelesaikan sesi latihan interview.",
    type: "certificate",
    exportTypes: ["PDF"],
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
};
