# 4.3 Pengujian Sistem (Black Box Testing)

Pengujian sistem dilakukan menggunakan metode **Black Box Testing**, yaitu pengujian yang berfokus pada fungsionalitas masukan (_input_) dan keluaran (_output_) sistem tanpa memperhatikan struktur kode internalnya. Ruang lingkup pengujian pada penelitian ini dibatasi hanya pada **formulir (form) masukan data** yang terdapat pada platform Intervox, karena form merupakan titik utama interaksi pengguna dengan sistem sekaligus bagian yang paling rawan terhadap kesalahan masukan (_invalid input_).

Setiap skenario pengujian diuji dengan tiga jenis data uji, yaitu data valid (_positive testing_), data tidak valid (_negative testing_), dan data kosong (_boundary/empty testing_). Hasil pengujian dinyatakan **Valid** apabila keluaran sistem sesuai dengan hasil yang diharapkan, dan **Tidak Valid** apabila terjadi ketidaksesuaian. Bukti pengujian berupa tangkapan layar (_screenshot_) disimpan pada direktori `docs/screenshots/` dengan nama berkas sebagaimana dicantumkan pada kolom Screenshot.

Total terdapat **18 form** yang diuji dengan **109 skenario pengujian**. Rincian pengujian masing-masing form dijabarkan sebagai berikut.

---

## 1. Form Login

**Tabel 4.1** Pengujian pada form login

| No | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Screenshot | Kesimpulan |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Mengisi email dan password yang benar lalu menekan tombol Masuk. | Email: `mahasiswa@uniska.ac.id`; Password: `mahasiswa123` | Pengguna berhasil login dan diarahkan ke halaman Dashboard. | `login_01_berhasil.png` | Valid |
| 2 | Mengisi email yang salah dan password benar lalu menekan tombol Masuk. | Email: `mahasiswa123@uniska.ac.id`; Password: `mahasiswa123` | Muncul pesan kesalahan: "Email atau password salah." | `login_02_email_salah.png` | Valid |
| 3 | Login dengan password salah. | Email: `mahasiswa@uniska.ac.id`; Password: `salah123` | Muncul pesan kesalahan: "Email atau password salah." | `login_03_password_salah.png` | Valid |
| 4 | Login dengan email dan password kosong. | Email: (dikosongkan); Password: (dikosongkan) | Muncul pesan: "Please fill in this field" | `login_04_kosong.png` | Valid |
| 5 | Login dengan hanya email terisi. | Email: `mahasiswa@uniska.ac.id`; Password: (dikosongkan) | Muncul pesan: "Please fill in this field" | `login_05_password_kosong.png` | Valid |
| 6 | Login dengan hanya password terisi. | Email: (dikosongkan); Password: `mahasiswa123` | Muncul pesan: "Please fill in this field" | `login_06_email_kosong.png` | Valid |
| 7 | Login dengan format email tidak valid (tanpa simbol @). | Email: `mahasiswauniska.ac.id`; Password: `mahasiswa123` | Sistem menolak submit dan muncul pesan: "Please include an '@' in the email address." | `login_07_format_email.png` | Valid |
| 8 | Login menggunakan akun yang belum diverifikasi Administrator. | Email: `pending@uniska.ac.id`; Password: `pending123` | Login berhasil namun pengguna diarahkan ke halaman Menunggu Verifikasi, bukan Dashboard. | `login_08_akun_pending.png` | Valid |

---

## 2. Form Registrasi Akun

**Tabel 4.2** Pengujian pada form registrasi akun

| No | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Screenshot | Kesimpulan |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Mendaftar dengan seluruh data terisi valid. | Nama: `Gusti Randa`; Email: `gusti@uniska.ac.id`; Password: `gusti123`; Konfirmasi: `gusti123` | Muncul pesan: "🎉 Pendaftaran berhasil! Cek email kamu dan klik link konfirmasi untuk mengaktifkan akun." dan sistem berpindah ke tab Masuk. | `register_01_berhasil.png` | Valid |
| 2 | Mendaftar dengan password dan konfirmasi password berbeda. | Password: `gusti123`; Konfirmasi: `gusti456` | Muncul pesan kesalahan: "Passwords do not match." | `register_02_password_beda.png` | Valid |
| 3 | Mendaftar dengan password kurang dari 6 karakter. | Password: `123`; Konfirmasi: `123` | Muncul pesan kesalahan: "Password must be at least 6 characters." | `register_03_password_pendek.png` | Valid |
| 4 | Mendaftar menggunakan email yang sudah terdaftar. | Email: `mahasiswa@uniska.ac.id` | Muncul pesan kesalahan: "Email sudah terdaftar. Coba masuk." | `register_04_email_terdaftar.png` | Valid |
| 5 | Mendaftar tanpa mengisi data apapun. | Seluruh field dikosongkan | Muncul pesan: "Please fill in this field" | `register_05_kosong.png` | Valid |
| 6 | Mendaftar dengan format email tidak valid. | Email: `gustigmail.com` | Muncul pesan: "Please include an '@' in the email address." | `register_06_format_email.png` | Valid |
| 7 | Mendaftar dengan hanya nama lengkap terisi. | Nama: `Gusti Randa`Field lain dikosongkan | Muncul pesan: "Please fill in this field" | `register_07_hanya_nama.png` | Valid |

---

## 3. Form Lupa Password

**Tabel 4.3** Pengujian pada form lupa password

| No | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Screenshot | Kesimpulan |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Mengisi email terdaftar lalu menekan tombol Kirim Link Reset. | Email: `mahasiswa@uniska.ac.id` | Muncul pesan: "Password reset email sent! Check your inbox." dan tautan reset dikirim ke email. | `lupa_password_01_berhasil.png` | Valid |
| 2 | Menekan tombol Kirim Link Reset tanpa mengisi email. | Email: (dikosongkan) | Muncul pesan: "Please fill in this field" | `lupa_password_02_kosong.png` | Valid |
| 3 | Mengisi email dengan format salah. | Email: `mahasiswauniska.ac.id` | Muncul pesan: "Please include an '@' in the email address." | `lupa_password_03_format_email.png` | Valid |
| 4 | Mengisi email yang tidak terdaftar. | Email: `tidakada@uniska.ac.id` | Sistem tetap menampilkan pesan "Password reset email sent! Check your inbox." tanpa membocorkan keberadaan akun (sesuai kebijakan keamanan). | `lupa_password_04_tidak_terdaftar.png` | Valid |

---

## 4. Form Edit Profil (Student)

**Tabel 4.4** Pengujian pada form edit profil

| No | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Screenshot | Kesimpulan |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Mengisi seluruh data profil dengan lengkap lalu menekan Simpan Perubahan. | Nama: `Gusti Randa`; NPM: `2010010001`; Universitas: `UNISKA`; Prodi: `Teknik Informatika` | Muncul pesan: "Profil berhasil disimpan!" dan data profil terbarui. | `profil_01_berhasil.png` | Valid |
| 2 | Menyimpan profil tanpa mengisi Nama Lengkap. | Nama: (dikosongkan) | Muncul pesan: "Please fill in this field" | `profil_02_nama_kosong.png` | Valid |
| 3 | Menyimpan profil tanpa mengisi NPM. | NPM: (dikosongkan) | Muncul pesan: "Please fill in this field" | `profil_03_npm_kosong.png` | Valid |
| 4 | Mengunggah dokumen CV berformat PDF. | Berkas: `cv_gusti.pdf` | Berkas berhasil diunggah dan muncul pesan "Profil berhasil disimpan!" | `profil_04_upload_cv.png` | Valid |
| 5 | Mengunggah dokumen CV berformat gambar. | Berkas: `foto.jpg` | Berkas tidak dapat dipilih karena dialog hanya menerima format `.pdf` dan `.docx`. | `profil_05_cv_format_salah.png` | Valid |
| 6 | Mengisi LinkedIn URL tanpa protokol http/https. | LinkedIn: `linkedin.com/in/gusti` | Muncul pesan: "Please enter a URL." | `profil_06_url_invalid.png` | Valid |
| 7 | Memperbarui Bio dan Industri yang Diminati saja. | Bio: `Mahasiswa tingkat akhir`; Industri: `Teknologi Informasi` | Data tersimpan, pesan sukses tampil dan hilang otomatis setelah 3 detik. | `profil_07_edit_bio.png` | Valid |

---

## 5. Form Ganti Password (Halaman Profil)

**Tabel 4.5** Pengujian pada form ganti password

| No | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Screenshot | Kesimpulan |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Mengisi seluruh field password dengan benar. | Password Saat Ini: `gusti123`; Password Baru: `gustibaru123`; Konfirmasi: `gustibaru123` | Muncul pesan: "Profil berhasil disimpan!" dan seluruh field password dikosongkan kembali. | `password_01_berhasil.png` | Valid |
| 2 | Mengisi Password Saat Ini yang salah. | Password Saat Ini: `salah123`; Password Baru: `gustibaru123`; Konfirmasi: `gustibaru123` | Password tidak diubah dan muncul pesan kesalahan: "Password saat ini salah." | `password_02_current_salah.png` | Valid |
| 3 | Mengisi password baru dan konfirmasi yang berbeda. | Password Baru: `gustibaru123`; Konfirmasi: `gustibaru456` | Muncul pesan kesalahan: "Konfirmasi password tidak cocok." | `password_03_tidak_cocok.png` | Valid |
| 4 | Mengisi password baru kurang dari 6 karakter. | Password Baru: `123`; Konfirmasi: `123` | Muncul pesan kesalahan: "Password baru minimal 6 karakter." | `password_04_terlalu_pendek.png` | Valid |
| 5 | Mengisi password baru yang sama dengan password saat ini. | Password Saat Ini: `gusti123`; Password Baru: `gusti123`; Konfirmasi: `gusti123` | Muncul pesan kesalahan: "Password baru harus berbeda dari password saat ini." | `password_05_sama_dengan_lama.png` | Valid |
| 6 | Mengisi hanya field Password Saat Ini. | Password Saat Ini: `gusti123`; Password Baru: (dikosongkan); Konfirmasi: (dikosongkan) | Muncul pesan kesalahan: "Semua field password harus diisi untuk update password." | `password_06_tidak_lengkap.png` | Valid |
| 7 | Mengisi Password Baru dan Konfirmasi tanpa mengisi Password Saat Ini. | Password Saat Ini: (dikosongkan); Password Baru: `gustibaru123`; Konfirmasi: `gustibaru123` | Muncul pesan kesalahan: "Semua field password harus diisi untuk update password." | `password_07_current_kosong.png` | Valid |
| 8 | Menyimpan profil tanpa mengisi field password sama sekali. | Seluruh field password dikosongkan | Proses penggantian password dilewati, data profil tetap tersimpan dengan pesan "Profil berhasil disimpan!" | `password_08_dilewati.png` | Valid |

---

## 6. Form Konfigurasi Simulasi Wawancara

**Tabel 4.6** Pengujian pada form konfigurasi simulasi wawancara

| No | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Screenshot | Kesimpulan |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Mengisi seluruh parameter wajib lalu menekan Mulai Sesi Interview. | Nama: `Gusti Randa`; Email: `gusti@uniska.ac.id`; Jenis: `Wawancara Kerja`; Kategori: `Technical Interview`; Posisi: `Frontend Developer` | Sesi berhasil dibuat dan pengguna dialihkan ke halaman Sesi Interview. | `setup_01_berhasil.png` | Valid |
| 2 | Menekan tombol Mulai Sesi Interview tanpa mengisi data apapun. | Seluruh field dikosongkan | Muncul pesan: "Please fill in this field" | `setup_02_kosong.png` | Valid |
| 3 | Mengisi data tanpa Nama Lengkap kandidat. | Nama: (dikosongkan) | Muncul pesan: "Please fill in this field" | `setup_03_nama_kosong.png` | Valid |
| 4 | Mengisi email kandidat dengan format salah. | Email: `gustigmail.com` | Muncul pesan: "Please include an '@' in the email address." | `setup_04_format_email.png` | Valid |
| 5 | Mengisi data tanpa Posisi yang Dilamar. | Posisi: (dikosongkan) | Muncul pesan: "Please fill in this field" | `setup_05_posisi_kosong.png` | Valid |
| 6 | Tidak memilih Kategori Modul wawancara. | Kategori Modul: (belum dipilih) | Muncul pesan: "Please select an item in the list." | `setup_06_kategori_kosong.png` | Valid |
| 7 | Mengunggah berkas CV dengan format tidak diizinkan. | Berkas: `cv_gusti.jpg` | Muncul pesan: "Hanya file PDF atau DOCX yang diperbolehkan." | `setup_07_cv_format_salah.png` | Valid |
| 8 | Mengunggah berkas CV berukuran lebih dari 10MB. | Berkas: `cv_besar.pdf` (12MB) | Muncul pesan: "Ukuran file maksimal 10MB." | `setup_08_cv_terlalu_besar.png` | Valid |
| 9 | Mengunggah berkas CV melalui _drag and drop_. | Berkas: `cv_gusti.pdf` (1,2MB) | Berkas diterima dan nama berkas tampil pada area unggah. | `setup_09_drag_drop.png` | Valid |
| 10 | Memulai sesi menggunakan akun yang belum diverifikasi. | Akun status: `pending` | Muncul pesan: "Gagal membuat sesi interview. Pastikan akun kamu sudah terverifikasi." | `setup_10_akun_belum_verifikasi.png` | Valid |

---

## 7. Form Sesi Simulasi Wawancara

**Tabel 4.7** Pengujian pada form sesi simulasi wawancara

| No | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Screenshot | Kesimpulan |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Menekan tombol Start Interview dengan mikrofon aktif. | Mikrofon: `Default Microphone` | Status sesi berubah dari "Ready" menjadi "Connected" dan AI mulai mengajukan pertanyaan. | `sesi_01_mulai.png` | Valid |
| 2 | Menekan Start Interview saat izin mikrofon ditolak peramban. | Izin mikrofon: `Blocked` | Sesi tidak terhubung dan muncul banner pesan kesalahan koneksi perangkat. | `sesi_02_mic_ditolak.png` | Valid |
| 3 | Mengubah pilihan perangkat Mikrofon dan Speaker. | Mikrofon: `Headset Microphone`; Speaker: `External Speaker` | Sistem memindahkan jalur audio ke perangkat yang dipilih. | `sesi_03_ganti_perangkat.png` | Valid |
| 4 | Menekan tombol End Interview. | — | Muncul dialog konfirmasi: "End Interview? Are you sure you want to end this interview session? Your progress will be saved." | `sesi_04_konfirmasi_akhiri.png` | Valid |
| 5 | Menekan tombol Cancel pada dialog konfirmasi. | — | Dialog tertutup dan sesi wawancara tetap berjalan. | `sesi_05_batal_akhiri.png` | Valid |
| 6 | Menekan tombol End Session pada dialog konfirmasi. | — | Muncul pesan "Menyimpan hasil interview..." lalu pengguna dialihkan ke halaman Penilaian Diri. | `sesi_06_akhiri_sesi.png` | Valid |

---

## 8. Form Penilaian Diri dan Umpan Balik

**Tabel 4.8** Pengujian pada form penilaian diri dan umpan balik

| No | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Screenshot | Kesimpulan |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Mengisi seluruh field wajib lalu menekan Lihat Laporan Lengkap. | Skor Diri: `4 bintang`; Kepercayaan Diri: `Cukup Percaya Diri`; Kepuasan Platform: `5 bintang` | Data penilaian diri tersimpan dan pengguna dialihkan ke halaman Laporan Hasil Wawancara. | `feedback_01_berhasil.png` | Valid |
| 2 | Menekan tombol submit tanpa mengisi field apapun. | Seluruh field dikosongkan | Tombol "Lihat Laporan Lengkap" berstatus nonaktif (_disabled_) sehingga data tidak dapat dikirim. | `feedback_02_kosong.png` | Valid |
| 3 | Mengisi skor diri namun belum memilih tingkat kepercayaan diri. | Skor Diri: `4 bintang`; Kepercayaan Diri: (belum dipilih) | Tombol submit tetap berstatus nonaktif. | `feedback_03_confidence_kosong.png` | Valid |
| 4 | Mengisi seluruh field kecuali rating kepuasan platform. | Kepuasan Platform: `0 bintang` | Tombol submit tetap berstatus nonaktif. | `feedback_04_rating_kosong.png` | Valid |
| 5 | Mengirim form tanpa mengisi field opsional. | Catatan refleksi dan saran dikosongkan | Data berhasil dikirim karena field bersifat opsional. | `feedback_05_opsional_kosong.png` | Valid |
| 6 | Menekan tautan "Lewati dan lihat laporan". | — | Pengguna langsung dialihkan ke halaman laporan tanpa menyimpan penilaian diri. | `feedback_06_lewati.png` | Valid |

---

## 9. Form Manajemen Kategori Modul (Administrator)

**Tabel 4.9** Pengujian pada form manajemen kategori modul

| No | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Screenshot | Kesimpulan |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Menambahkan kategori dengan seluruh input valid. | Nama: `Behavioral Interview`; Deskripsi: `Modul wawancara perilaku`; Tipe: `Kerja`; Kesulitan: `medium` | Kategori berhasil ditambahkan ke Daftar Kategori dan form dikosongkan kembali. | `kategori_01_berhasil.png` | Valid |
| 2 | Menambahkan kategori tanpa mengisi data apapun. | Seluruh field dikosongkan | Muncul pesan: "Please fill in this field" | `kategori_02_kosong.png` | Valid |
| 3 | Menambahkan kategori dengan hanya deskripsi terisi. | Nama: (dikosongkan); Deskripsi: `Modul percobaan` | Muncul pesan: "Please fill in this field" | `kategori_03_nama_kosong.png` | Valid |
| 4 | Menambahkan kategori dengan tipe modul dan tingkat kesulitan berbeda. | Tipe: `Beasiswa`; Kesulitan: `hard` | Kategori tersimpan sesuai tipe dan tingkat kesulitan yang dipilih. | `kategori_04_tipe_kesulitan.png` | Valid |
| 5 | Menambahkan kategori menggunakan akun tanpa hak akses Administrator. | Akun role: `student` | Muncul pesan kesalahan: "Gagal menambah kategori." | `kategori_05_tanpa_akses.png` | Valid |

---

## 10. Form Bank Pertanyaan (Administrator)

**Tabel 4.10** Pengujian pada form bank pertanyaan

| No | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Screenshot | Kesimpulan |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Menambahkan pertanyaan dengan seluruh input valid. | Kategori: `Technical Interview`; Pertanyaan: `Jelaskan perbedaan REST dan GraphQL.`; Keyword: `REST, GraphQL, endpoint` | Pertanyaan berhasil ditambahkan ke Daftar Soal dan field pertanyaan dikosongkan kembali. | `pertanyaan_01_berhasil.png` | Valid |
| 2 | Menambahkan pertanyaan tanpa mengisi teks pertanyaan. | Pertanyaan: (dikosongkan) | Muncul pesan: "Please fill in this field" | `pertanyaan_02_kosong.png` | Valid |
| 3 | Menambahkan pertanyaan tanpa memilih kategori. | Kategori: (belum dipilih) | Tombol "Tambah Soal" berstatus nonaktif sehingga data tidak dapat dikirim. | `pertanyaan_03_kategori_kosong.png` | Valid |
| 4 | Menambahkan pertanyaan tanpa mengisi keyword ideal. | Keyword: (dikosongkan) | Pertanyaan tetap tersimpan karena keyword bersifat opsional. | `pertanyaan_04_keyword_kosong.png` | Valid |
| 5 | Membuka form saat belum ada data kategori pada basis data. | Data kategori: kosong | Pilihan kategori menampilkan opsi "Tidak ada kategori" dan tombol tambah nonaktif. | `pertanyaan_05_tanpa_kategori.png` | Valid |

---

## 11. Form Kriteria Penilaian (Administrator)

**Tabel 4.11** Pengujian pada form kriteria penilaian

| No | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Screenshot | Kesimpulan |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Menambahkan kriteria dengan seluruh input valid. | Nama: `Communication`; Bobot: `25`; Keyword: `jelas, terstruktur` | Kriteria berhasil ditambahkan dan badge Total Bobot bertambah sesuai nilai. | `kriteria_01_berhasil.png` | Valid |
| 2 | Menambahkan kriteria tanpa mengisi nama kriteria. | Nama: (dikosongkan) | Muncul pesan: "Please fill in this field" | `kriteria_02_nama_kosong.png` | Valid |
| 3 | Mengisi bobot nilai lebih dari 100. | Bobot: `150` | Muncul pesan: "Value must be less than or equal to 100." | `kriteria_03_bobot_lebih.png` | Valid |
| 4 | Mengisi bobot nilai dengan angka negatif. | Bobot: `-10` | Muncul pesan: "Value must be greater than or equal to 0." | `kriteria_04_bobot_negatif.png` | Valid |
| 5 | Mengisi bobot nilai dengan huruf. | Bobot: `duapuluh` | Karakter huruf tidak dapat dimasukkan karena field bertipe angka. | `kriteria_05_bobot_huruf.png` | Valid |
| 6 | Menambahkan kriteria hingga total bobot tidak mencapai 100%. | Total bobot: `75` | Kriteria tersimpan dan badge Total Bobot berwarna amber sebagai penanda bobot belum genap 100%. | `kriteria_06_total_bobot.png` | Valid |

---

## 12. Form Data Dosen (Administrator)

**Tabel 4.12** Pengujian pada form data dosen

| No | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Screenshot | Kesimpulan |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Menambahkan data dosen dengan seluruh input valid. | Nama: `Dr. Ahmad Fauzi, M.Kom.`; Email: `ahmad@uniska.ac.id`; Jurusan: `Teknik Informatika`; Fakultas: `Teknologi Informasi` | Data dosen berhasil ditambahkan ke Daftar Dosen dan form dikosongkan kembali. | `dosen_01_berhasil.png` | Valid |
| 2 | Menambahkan data dosen tanpa mengisi data apapun. | Seluruh field dikosongkan | Muncul pesan: "Please fill in this field" | `dosen_02_kosong.png` | Valid |
| 3 | Mengisi email dosen dengan format salah. | Email: `ahmaduniska.ac.id` | Muncul pesan: "Please include an '@' in the email address." | `dosen_03_format_email.png` | Valid |
| 4 | Menambahkan data dosen tanpa mengisi jurusan, fakultas, dan nomor telepon. | Jurusan, Fakultas, Telepon: (dikosongkan) | Data tetap tersimpan karena ketiga field bersifat opsional. | `dosen_04_opsional_kosong.png` | Valid |
| 5 | Menambahkan data dosen dengan email yang sudah terdaftar. | Email: `ahmad@uniska.ac.id` | Muncul pesan kesalahan: "Gagal menambah data dosen." | `dosen_05_email_duplikat.png` | Valid |

---

## 13. Form Verifikasi Pengguna (Administrator)

**Tabel 4.13** Pengujian pada form verifikasi pengguna

| No | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Screenshot | Kesimpulan |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Menyetujui akun pengguna berstatus pending. | Menekan tombol Terima pada akun `gusti@uniska.ac.id` | Muncul konfirmasi "Apakah Anda yakin ingin mengubah status pengguna ini menjadi APPROVED?", status berubah menjadi approved dan email notifikasi terkirim. | `verifikasi_01_setujui.png` | Valid |
| 2 | Membatalkan proses persetujuan pada dialog konfirmasi. | Menekan tombol Cancel pada dialog konfirmasi | Status akun tidak berubah dan tetap bernilai pending. | `verifikasi_02_batal.png` | Valid |
| 3 | Menolak akun pengguna berstatus pending. | Menekan tombol Tolak pada akun `spam@mail.com` | Muncul konfirmasi "…menjadi REJECTED?" dan status akun berubah menjadi rejected. | `verifikasi_03_tolak.png` | Valid |
| 4 | Mengubah role pengguna melalui pilihan role. | Role diubah dari `student` menjadi `lecturer` | Muncul konfirmasi "Apakah Anda yakin ingin mengubah role pengguna ini menjadi lecturer?" dan role berhasil diperbarui. | `verifikasi_04_ubah_role.png` | Valid |
| 5 | Mencari pengguna berdasarkan nama atau email. | Kata kunci: `gusti` | Data pengguna yang relevan akan ditampilkan. | `verifikasi_05_cari.png` | Valid |
| 6 | Mencari pengguna dengan kata kunci yang tidak ada. | Kata kunci: `xyz123` | Muncul pesan: "Tidak ada pengguna yang ditemukan." | `verifikasi_06_cari_kosong.png` | Valid |
| 7 | Memfilter daftar pengguna berdasarkan status. | Filter: `pending` | Hanya akun berstatus pending yang ditampilkan sesuai jumlah pada badge. | `verifikasi_07_filter.png` | Valid |
| 8 | Mengakses halaman menggunakan akun bukan Administrator. | Akun role: `student` | Muncul pesan: "Akses Ditolak — Anda tidak memiliki izin untuk mengakses halaman ini." | `verifikasi_08_akses_ditolak.png` | Valid |

---

## 14. Form Pengaturan Sistem (Administrator)

**Tabel 4.14** Pengujian pada form pengaturan sistem

| No | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Screenshot | Kesimpulan |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Mengisi data pengesahan laporan lalu menekan Simpan Pengaturan. | Nama: `Prof. Dr. Hj. Silvia Ratna, S.Kom., M.Kom.`; NIP: `19750913 200501 2 001` | Muncul pesan: "Pengaturan berhasil disimpan." | `pengaturan_01_berhasil.png` | Valid |
| 2 | Menyimpan pengaturan tanpa mengisi data apapun. | Seluruh field dikosongkan | Muncul pesan: "Please fill in this field" | `pengaturan_02_kosong.png` | Valid |
| 3 | Menyimpan pengaturan dengan Nama dan NIP berisi spasi saja. | Nama: `(spasi)`; NIP: `(spasi)` | Muncul pesan kesalahan: "Nama lengkap & gelar dan NIP wajib diisi." | `pengaturan_03_hanya_spasi.png` | Valid |
| 4 | Mengisi NIP dengan huruf. | NIP: `19750913 abc` | Muncul pesan kesalahan: "NIP hanya boleh berisi angka dan spasi." | `pengaturan_04_nip_huruf.png` | Valid |
| 5 | Mengisi tautan tanda tangan tanpa protokol http/https. | URL: `example.com/signature.png` | Muncul pesan kesalahan: "Tautan URL tanda tangan tidak valid. Gunakan awalan http:// atau https://." | `pengaturan_05_url_invalid.png` | Valid |
| 6 | Menyimpan pengaturan tanpa mengisi field opsional. | URL Tanda Tangan & QR Code: (dikosongkan) | Data tersimpan dengan pesan "Pengaturan berhasil disimpan." | `pengaturan_06_opsional_kosong.png` | Valid |
| 7 | Menyimpan pengaturan saat koneksi basis data terganggu. | Koneksi: terputus | Muncul pesan kesalahan: "Gagal menyimpan pengaturan: …" beserta keterangan penyebabnya. | `pengaturan_07_gagal_simpan.png` | Valid |
| 8 | Mengakses halaman menggunakan akun bukan Administrator. | Akun role: `lecturer` | Muncul pesan: "Akses Ditolak" | `pengaturan_08_akses_ditolak.png` | Valid |

---

## 15. Form Bank Soal Wawancara (Lecturer)

**Tabel 4.15** Pengujian pada form bank soal wawancara

| No | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Screenshot | Kesimpulan |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Menambahkan butir soal dengan seluruh input valid. | Kategori: `Teknik Informatika`; Kesulitan: `Sedang (Medium)`; Pertanyaan: `Jelaskan situasi saat Anda memecahkan masalah teknis kompleks dalam tim.` | Muncul pesan: "Butir soal berhasil ditambahkan ke Bank Soal!" dan soal tampil pada daftar. | `banksoal_01_berhasil.png` | Valid |
| 2 | Menambahkan soal tanpa memilih kategori wawancara. | Kategori: (belum dipilih) | Muncul pesan: "Pilih kategori wawancara terlebih dahulu." | `banksoal_02_kategori_kosong.png` | Valid |
| 3 | Menambahkan soal dengan teks pertanyaan kosong. | Pertanyaan: (dikosongkan) | Muncul pesan: "Teks pertanyaan tidak boleh kosong." | `banksoal_03_pertanyaan_kosong.png` | Valid |
| 4 | Menambahkan soal dengan teks pertanyaan berisi spasi saja. | Pertanyaan: `(spasi)` | Muncul pesan: "Teks pertanyaan tidak boleh kosong." | `banksoal_04_hanya_spasi.png` | Valid |
| 5 | Menambahkan soal tanpa mengisi kata kunci jawaban ideal. | Kata Kunci: (dikosongkan) | Soal tetap tersimpan karena kata kunci bersifat opsional. | `banksoal_05_keyword_kosong.png` | Valid |
| 6 | Menambahkan soal saat hak akses basis data tidak mencukupi. | Akun role: `student` | Muncul pesan: "Gagal menyimpan soal baru. Periksa hak akses atau koneksi." | `banksoal_06_gagal_simpan.png` | Valid |

---

## 16. Form Kategori Baru (Lecturer)

**Tabel 4.16** Pengujian pada form kategori baru

| No | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Screenshot | Kesimpulan |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Menambahkan kategori baru dengan nama dan deskripsi valid. | Nama: `Akuntansi`; Deskripsi: `Wawancara bidang akuntansi` | Muncul pesan: "Kategori "Akuntansi" berhasil ditambahkan & dipilih!" dan kategori langsung terpilih. | `kategoribaru_01_berhasil.png` | Valid |
| 2 | Menekan tombol Simpan Kategori tanpa mengisi nama. | Nama: (dikosongkan) | Tombol "Simpan Kategori" berstatus nonaktif sehingga data tidak dapat dikirim. | `kategoribaru_02_kosong.png` | Valid |
| 3 | Mengisi nama kategori hanya dengan spasi. | Nama: `(spasi)` | Muncul pesan: "Nama kategori tidak boleh kosong." | `kategoribaru_03_hanya_spasi.png` | Valid |
| 4 | Menambahkan kategori tanpa mengisi deskripsi. | Deskripsi: (dikosongkan) | Kategori tersimpan dengan deskripsi bawaan "Kategori wawancara khusus dosen". | `kategoribaru_04_deskripsi_kosong.png` | Valid |
| 5 | Menambahkan kategori saat penyimpanan basis data terganggu. | Koneksi: terputus | Muncul pesan: "Kategori "Akuntansi" siap digunakan!" dan kategori tetap dapat dipakai secara lokal. | `kategoribaru_05_fallback.png` | Valid |

---

## 17. Form Validasi Pakar (Lecturer dan Dean)

**Tabel 4.17** Pengujian pada form validasi pakar

| No | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Screenshot | Kesimpulan |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Mengisi catatan pakar lalu menekan Setujui & Terbitkan Laporan. | Catatan: `Jawaban sudah terstruktur, perbaiki kontak mata.` | Muncul pesan: "Laporan berhasil divalidasi dan disetujui!" dan status laporan berubah menjadi terverifikasi. | `validasi_01_berhasil.png` | Valid |
| 2 | Menyetujui laporan tanpa mengisi catatan pakar. | Catatan: (dikosongkan) | Laporan tetap berhasil divalidasi karena catatan bersifat opsional. | `validasi_02_catatan_kosong.png` | Valid |
| 3 | Menyetujui laporan saat pembaruan basis data gagal. | Koneksi: terputus | Muncul pesan kesalahan: "Gagal memverifikasi laporan" | `validasi_03_gagal.png` | Valid |
| 4 | Membuka laporan yang sudah divalidasi sebelumnya. | Sesi status: `verified` | Form validasi tidak ditampilkan dan digantikan panel Catatan Validasi Dosen/Pakar. | `validasi_04_sudah_verified.png` | Valid |
| 5 | Membuka halaman laporan menggunakan akun Student. | Akun role: `student` | Form validasi pakar tidak ditampilkan kepada mahasiswa. | `validasi_05_akses_student.png` | Valid |

---

## 18. Form Filter Laporan

**Tabel 4.18** Pengujian pada form filter laporan

| No | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Screenshot | Kesimpulan |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Mengisi rentang tanggal laporan. | Dari: `01/07/2026`; Sampai: `31/07/2026` | Data laporan yang relevan dengan rentang tanggal akan ditampilkan. | `laporan_01_filter_tanggal.png` | Valid |
| 2 | Mengosongkan kembali rentang tanggal. | Dari & Sampai: (dikosongkan) | Seluruh data laporan ditampilkan tanpa penyaringan. | `laporan_02_filter_kosong.png` | Valid |
| 3 | Mengisi tanggal awal lebih besar dari tanggal akhir. | Dari: `31/07/2026`; Sampai: `01/07/2026` | Muncul pesan: "Belum ada data laporan untuk ditampilkan." | `laporan_03_tanggal_terbalik.png` | Valid |
| 4 | Memilih sesi wawancara tertentu pada laporan berbasis sesi. | Sesi: `05/08/2026 • Frontend Developer • Gusti Randa` | Laporan menampilkan data sesuai sesi wawancara yang dipilih. | `laporan_04_pilih_sesi.png` | Valid |
| 5 | Menekan tombol Export PDF. | — | Dialog cetak peramban terbuka dengan tata letak laporan berkop surat universitas. | `laporan_05_export_pdf.png` | Valid |
| 6 | Menekan tombol Export Excel. | — | Berkas laporan berformat CSV berhasil diunduh. | `laporan_06_export_excel.png` | Valid |

---

## Rekapitulasi Hasil Pengujian

**Tabel 4.19** Rekapitulasi hasil pengujian black box

| No | Form yang Diuji | Aktor | Jumlah Skenario | Valid | Tidak Valid |
| :-: | :--- | :--- | :-: | :-: | :-: |
| 1 | Form Login | Semua role | 8 | 8 | 0 |
| 2 | Form Registrasi Akun | Student | 7 | 7 | 0 |
| 3 | Form Lupa Password | Semua role | 4 | 4 | 0 |
| 4 | Form Edit Profil | Student | 7 | 7 | 0 |
| 5 | Form Ganti Password | Semua role | 8 | 8 | 0 |
| 6 | Form Konfigurasi Simulasi Wawancara | Student | 10 | 10 | 0 |
| 7 | Form Sesi Simulasi Wawancara | Student | 6 | 6 | 0 |
| 8 | Form Penilaian Diri dan Umpan Balik | Student | 6 | 6 | 0 |
| 9 | Form Manajemen Kategori Modul | Administrator | 5 | 5 | 0 |
| 10 | Form Bank Pertanyaan | Administrator | 5 | 5 | 0 |
| 11 | Form Kriteria Penilaian | Administrator | 6 | 6 | 0 |
| 12 | Form Data Dosen | Administrator | 5 | 5 | 0 |
| 13 | Form Verifikasi Pengguna | Administrator | 8 | 8 | 0 |
| 14 | Form Pengaturan Sistem | Administrator | 8 | 8 | 0 |
| 15 | Form Bank Soal Wawancara | Lecturer | 6 | 6 | 0 |
| 16 | Form Kategori Baru | Lecturer | 5 | 5 | 0 |
| 17 | Form Validasi Pakar | Lecturer, Dean | 5 | 5 | 0 |
| 18 | Form Filter Laporan | Semua role | 6 | 6 | 0 |
| | **Total** | | **115** | **115** | **0** |

Berdasarkan rekapitulasi pada Tabel 4.19, seluruh 109 skenario pengujian pada 18 form yang diuji menghasilkan keluaran yang sesuai dengan hasil yang diharapkan, sehingga persentase keberhasilan pengujian mencapai **100%**. Dengan demikian dapat disimpulkan bahwa seluruh form pada platform Intervox telah berfungsi sesuai dengan rancangan, baik dalam menangani masukan valid maupun dalam memberikan pesan kesalahan pada masukan yang tidak valid.
