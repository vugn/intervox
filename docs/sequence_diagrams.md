# Sequence Diagrams

Berikut adalah *sequence diagram* untuk alur kerja keempat *role* (Student, Lecturer, Administrator, Dean) dalam sistem Intervox.

## 1. Student Flow
```text
autoNumber on

Student [icon: user, color: blue]
Frontend [icon: monitor, color: gray]
Backend [icon: server, color: red]
Database [icon: database, color: green]
AI_Service [icon: tool, color: purple]

Student > Frontend: Login dengan kredensial
activate Frontend
Frontend > Backend: Permintaan Autentikasi
activate Backend
Backend > Database: Validasi Pengguna
Database --> Backend: Token Autentikasi
Backend --> Frontend: Kembalikan Sesi
deactivate Backend
Frontend --> Student: Tampilkan Dashboard Student

Student > Frontend: Mulai Interview Baru
Frontend > Backend: Ambil Kategori
Backend > Database: Dapatkan Kategori
Database --> Backend: Data Kategori
Backend --> Frontend: Kembalikan Kategori
Frontend --> Student: Tampilkan Halaman Persiapan

Student > Frontend: Pilih Kategori & Mulai
Frontend > Backend: Inisialisasi Sesi
Backend > Database: Buat Rekaman Sesi
Database --> Backend: ID Sesi
Backend --> Frontend: Sesi Siap
Frontend --> Student: Tampilkan UI Interview

loop [label: Selama Interview, color: orange] {
  Student > Frontend: Berbicara / Jawab Audio
  Frontend > AI_Service: Proses Audio / Dapatkan Balasan AI
  AI_Service --> Frontend: Suara AI & Balasan Teks
  Frontend --> Student: Putar Balasan AI
}

Student > Frontend: Akhiri Interview
Frontend > Backend: Kirim Transkrip Akhir
Backend > AI_Service: Buat Penilaian & Feedback
AI_Service --> Backend: Hasil Evaluasi
Backend > Database: Simpan Hasil
Database --> Backend: Konfirmasi Tersimpan
Backend --> Frontend: Kembalikan URL Laporan
Frontend --> Student: Tampilkan Laporan Skor & Evaluasi
deactivate Frontend
```

## 2. Lecturer Flow
```text
autoNumber on

Lecturer [icon: user, color: green]
Frontend [icon: monitor, color: gray]
Backend [icon: server, color: red]
Database [icon: database, color: green]

Lecturer > Frontend: Login dengan kredensial
activate Frontend
Frontend > Backend: Permintaan Autentikasi
activate Backend
Backend > Database: Validasi Pengguna
Database --> Backend: Token Autentikasi
Backend --> Frontend: Kembalikan Sesi
deactivate Backend
Frontend --> Lecturer: Tampilkan Dashboard Lecturer

Lecturer > Frontend: Navigasi ke Bank Soal
Frontend > Backend: Ambil Pertanyaan & Kategori
Backend > Database: Query Pertanyaan
Database --> Backend: Data
Backend --> Frontend: Kembalikan Data Pertanyaan
Frontend --> Lecturer: Tampilkan Daftar Pertanyaan

Lecturer > Frontend: Tambah Pertanyaan Baru
Frontend > Backend: API Simpan Pertanyaan
Backend > Database: Masukkan Pertanyaan
Database --> Backend: Berhasil
Backend --> Frontend: Konfirmasi
Frontend --> Lecturer: Perbarui Daftar Pertanyaan

Lecturer > Frontend: Lihat Laporan Mahasiswa
Frontend > Backend: Ambil Ringkasan Kompetensi
Backend > Database: Query Hasil Mahasiswa
Database --> Backend: Data
Backend --> Frontend: Kembalikan Ringkasan
Frontend --> Lecturer: Tampilkan Analisis Kelas
deactivate Frontend
```

## 3. Administrator Flow
```text
autoNumber on

Administrator [icon: user, color: red]
Frontend [icon: monitor, color: gray]
Backend [icon: server, color: red]
Database [icon: database, color: green]

Administrator > Frontend: Login dengan kredensial
activate Frontend
Frontend > Backend: Permintaan Autentikasi
activate Backend
Backend > Database: Validasi Pengguna
Database --> Backend: Token Autentikasi
Backend --> Frontend: Kembalikan Sesi
deactivate Backend
Frontend --> Administrator: Tampilkan Dashboard Administrator

Administrator > Frontend: Navigasi ke Verifikasi
Frontend > Backend: Ambil Pengguna Pending
Backend > Database: Query Pengguna Pending
Database --> Backend: Data
Backend --> Frontend: Kembalikan Data Pengguna
Frontend --> Administrator: Tampilkan Daftar Pengguna

Administrator > Frontend: Setujui Pengguna
Frontend > Backend: API Perbarui Status Pengguna
Backend > Database: Perbarui Status = Disetujui
Database --> Backend: Berhasil
Backend --> Frontend: Konfirmasi
Frontend --> Administrator: Perbarui Status Pengguna

Administrator > Frontend: Navigasi ke Pengaturan Sistem
Frontend > Backend: Ambil Pengaturan (Tanda Tangan Dekan)
Backend > Database: Query Pengaturan
Database --> Backend: Data
Backend --> Frontend: Kembalikan Data Pengaturan
Frontend --> Administrator: Tampilkan Pengaturan Sistem

Administrator > Frontend: Unggah Tanda Tangan
Frontend > Backend: Simpan URL Tanda Tangan
Backend > Database: Perbarui Pengaturan
Database --> Backend: Berhasil
Backend --> Frontend: Konfirmasi
Frontend --> Administrator: Pengaturan Disimpan
deactivate Frontend
```

## 4. Dean Flow
```text
autoNumber on

Dean [icon: user, color: purple]
Frontend [icon: monitor, color: gray]
Backend [icon: server, color: red]
Database [icon: database, color: green]

Dean > Frontend: Login dengan kredensial
activate Frontend
Frontend > Backend: Permintaan Autentikasi
activate Backend
Backend > Database: Validasi Pengguna
Database --> Backend: Token Autentikasi
Backend --> Frontend: Kembalikan Sesi
deactivate Backend
Frontend --> Dean: Tampilkan Dashboard Dean

Dean > Frontend: Navigasi ke Laporan
Frontend > Backend: Ambil Statistik Keseluruhan Sistem
Backend > Database: Agregasi Data
Database --> Backend: Data Statistik
Backend --> Frontend: Kembalikan Data Laporan
Frontend --> Dean: Tampilkan Metrik Dashboard

Dean > Frontend: Unduh Laporan Resmi
Frontend > Backend: Buat PDF dengan Tanda Tangan
Backend > Database: Ambil Data & Tanda Tangan Dekan
Database --> Backend: Data + Tanda Tangan
Backend - Backend: Buat File PDF
Backend --> Frontend: URL File PDF
Frontend --> Dean: Munculkan Unduhan
deactivate Frontend
```
