# 4.3 Tampilan Antarmuka Sistem

Bagian ini menyajikan hasil implementasi antarmuka platform Intervox yang telah selesai dibangun. Tampilan dikelompokkan menjadi dua bagian, yaitu antarmuka masukan sistem (_input_) yang digunakan pengguna untuk berinteraksi dan memasukkan data, serta antarmuka keluaran sistem (_output_) yang berupa dokumen laporan siap cetak yang dihasilkan sistem.
    
## 4.3.1 Tampilan Antarmuka Masukan Sistem

Antarmuka masukan sistem merupakan halaman-halaman yang digunakan pengguna untuk memasukkan, mengubah, dan mengelola data di dalam platform Intervox. Antarmuka ini dibedakan berdasarkan hak akses masing-masing peran, yaitu general (belum masuk sistem), student, lecturer, administrator, dan dean.

1. Tampilan Landing Page (general)

Pada tampilan ini pengguna dapat melihat informasi singkat mengenai platform Intervox sebelum memutuskan untuk masuk atau mendaftar ke dalam sistem.

Gambar 4.1 Tampilan Landing Page (general)

2. Tampilan Form Login (general)

Pada tampilan ini pengguna memasukkan email dan password agar sistem dapat memverifikasi akun dan mengarahkannya ke halaman dashboard sesuai perannya.

Gambar 4.2 Tampilan Form Login (general)

3. Tampilan Form Register (general)

Pada tampilan ini pengguna memasukkan nama, email, dan password untuk membuat akun baru agar dapat menggunakan fitur-fitur di dalam aplikasi Intervox.

Gambar 4.3 Tampilan Form Register (general)

4. Tampilan Halaman Dashboard (student)

Pada tampilan ini student dapat melihat ringkasan aktivitas, jumlah sesi yang telah dilakukan, dan metrik riwayat latihan agar dapat memantau perkembangannya.

Gambar 4.4 Tampilan Halaman Dashboard (student)

5. Tampilan Profil (student)

Pada tampilan ini student dapat melihat dan mengubah informasi pribadi serta pengaturan akunnya agar data dirinya tetap aktual.

Gambar 4.5 Tampilan Profil (student)

6. Tampilan Persiapan Interview (student)

Pada tampilan ini student memilih kategori modul dan mengatur parameter simulasi agar sistem dapat menyiapkan skenario interview yang sesuai.

Gambar 4.6 Tampilan Persiapan Interview (student)

7. Tampilan Sesi Interview (student)

Pada tampilan ini student berinteraksi langsung dengan agen AI menggunakan suara dan teks agar dapat melatih kemampuan wawancaranya secara waktu-nyata.

Gambar 4.7 Tampilan Sesi Interview (student)

8. Tampilan Ringkasan Sesi (student)

Pada tampilan ini student dapat melihat skor dan hasil evaluasi singkat sesaat setelah simulasi selesai agar segera mengetahui letak kekurangannya.

Gambar 4.8 Tampilan Ringkasan Sesi (student)

9. Tampilan Menu Laporan (student)

Pada tampilan ini student dapat melihat daftar semua jenis laporan analitik yang tersedia agar dapat mengunduh atau meninjaunya lebih lanjut.

Gambar 4.9 Tampilan Menu Laporan (student)

10. Tampilan Dashboard (lecturer)

Pada tampilan ini lecturer dapat memantau ringkasan performa dan tingkat partisipasi student bimbingannya agar mengetahui progres kelas secara umum.

Gambar 4.10 Tampilan Dashboard (lecturer)

11. Tampilan Bank Soal (lecturer)

Pada tampilan ini lecturer dapat menambahkan dan mengelola pertanyaan interview agar student mendapatkan materi latihan yang bervariasi.

Gambar 4.11 Tampilan Bank Soal (lecturer)

12. Tampilan Menu Laporan (lecturer)

Pada tampilan ini lecturer dapat melihat daftar laporan analitik kelas agar dapat memantau dan mengevaluasi perkembangan seluruh student yang dibimbingnya.

Gambar 4.12 Tampilan Menu Laporan (lecturer)

13. Tampilan Profil (lecturer)

Pada tampilan ini lecturer dapat melihat dan mengubah informasi akun atau profilnya agar data yang ditampilkan di sistem tetap valid.

Gambar 4.13 Tampilan Profil (lecturer)

14. Tampilan Dashboard (administrator)

Pada tampilan ini administrator dapat melihat metrik data seluruh pengguna dan kondisi sistem agar mengetahui status penggunaan aplikasi secara keseluruhan.

Gambar 4.14 Tampilan Dashboard (administrator)

15. Tampilan Verifikasi Pengguna (administrator)

Pada tampilan ini administrator dapat menyetujui, menolak, dan mengatur hak akses (_role_) pengguna baru agar keamanan dan ketertiban sistem tetap terjaga.

Gambar 4.15 Tampilan Verifikasi Pengguna (administrator)


1.  Tampilan Menu Laporan (administrator)

Pada tampilan ini administrator dapat mengakses pusat laporan sistem yang memiliki kapabilitas analitik tertinggi agar dapat mengevaluasi efektivitas platform secara utuh.

Gambar 4.18 Tampilan Menu Laporan (administrator)

19. Tampilan Profil (administrator)

Pada tampilan ini administrator dapat mengatur profil dan kredensial akunnya agar keamanan akun pengelola tetap terjamin.

Gambar 4.19 Tampilan Profil (administrator)

20. Tampilan Pengaturan Sistem (administrator)

Pada tampilan ini administrator dapat memperbarui data pengesahan dan tanda tangan Dekan agar dokumen sertifikat dan laporan resmi dapat diterbitkan dengan sah.

Gambar 4.20 Tampilan Pengaturan Sistem (administrator)

21. Tampilan Dashboard (dean)

Pada tampilan ini dean dapat melihat ringkasan eksekutif seluruh aktivitas sistem dan metrik partisipasi agar dapat mengambil keputusan strategis berbasis data.

Gambar 4.21 Tampilan Dashboard (dean)

22. Tampilan Menu Laporan (dean)

Pada tampilan ini dean dapat mengakses laporan-laporan tingkat institusi yang diperlukan untuk pelaporan formal dan evaluasi program studi.

Gambar 4.22 Tampilan Menu Laporan (dean)

23. Tampilan Profil (dean)

Pada tampilan ini dean dapat melihat dan mengatur data profil akunnya di dalam sistem.

Gambar 4.23 Tampilan Profil (dean)

---

## 4.3.2 Tampilan Antarmuka Keluaran Sistem

Antarmuka keluaran sistem merupakan dokumen laporan yang dihasilkan Intervox berdasarkan data sesi wawancara dan aktivitas pengguna. Seluruh laporan disajikan dengan kop surat universitas serta dapat diekspor ke format PDF maupun Excel sesuai kebutuhan masing-masing peran.

1. Tampilan Cetak Transkrip Sesi (student)

Pada tampilan ini sistem menampilkan dokumen rekaman transkrip percakapan utuh antara student dan AI agar pengguna dapat membaca ulang seluruh dialog latihan.

Gambar 4.24 Tampilan Cetak Transkrip Sesi (student)

2. Tampilan Cetak Evaluasi Skor (student)

Pada tampilan ini sistem menampilkan hasil penilaian kuantitatif dari latihan yang memuat detail poin agar student mengetahui seberapa baik jawabannya.

Gambar 4.25 Tampilan Cetak Evaluasi Skor (student)

3. Tampilan Cetak Kelebihan dan Kekurangan (student)

Pada tampilan ini sistem menampilkan evaluasi kualitatif mengenai kekuatan dominan dan kelemahan spesifik agar student mengetahui aspek apa yang perlu diperbaiki.

Gambar 4.26 Tampilan Cetak Kelebihan dan Kekurangan (student)

4. Tampilan Cetak Perbandingan Jawaban (student)

Pada tampilan ini sistem menampilkan komparasi poin-per-poin antara jawaban student dengan standar respons AI agar student mengetahui jawaban ideal yang diharapkan.

Gambar 4.27 Tampilan Cetak Perbandingan Jawaban (student)

5. Tampilan Cetak Grafik Perkembangan (student)

Pada tampilan ini sistem menampilkan visualisasi grafik garis yang melacak perkembangan keterampilan agar student dapat melihat tren performanya dari waktu ke waktu.

Gambar 4.28 Tampilan Cetak Grafik Perkembangan (student)

6. Tampilan Cetak Rekomendasi Pengembangan (student)

Pada tampilan ini sistem menampilkan rekomendasi tindak lanjut (_actionable feedback_) agar student memiliki panduan konkret untuk pengembangan dirinya.

Gambar 4.29 Tampilan Cetak Rekomendasi Pengembangan (student)

7. Tampilan Cetak Sertifikat (student)

Pada tampilan ini sistem menampilkan lembar sertifikat penghargaan berformat lanskap agar student memiliki bukti otentik telah menyelesaikan simulasi dengan baik.

Gambar 4.30 Tampilan Cetak Sertifikat (student)

8. Tampilan Cetak Penggunaan Bank Soal (lecturer)

Pada tampilan ini sistem menampilkan statistik frekuensi kemunculan pertanyaan agar lecturer mengetahui soal mana yang paling sering digunakan oleh student.

Gambar 4.31 Tampilan Cetak Penggunaan Bank Soal (lecturer)

9. Tampilan Cetak Ringkasan Kompetensi (lecturer)

Pada tampilan ini sistem menampilkan agregasi kompetensi seluruh kelas agar lecturer dapat mengukur tingkat kemampuan rata-rata student-nya.

Gambar 4.32 Tampilan Cetak Ringkasan Kompetensi (lecturer)

10. Tampilan Cetak Analisis Kesalahan Kelas (lecturer)

Pada tampilan ini sistem menampilkan data titik kesalahan yang paling sering dilakukan agar lecturer dapat memberikan materi perbaikan yang tepat sasaran.

Gambar 4.33 Tampilan Cetak Analisis Kesalahan Kelas (lecturer)

11. Tampilan Cetak Evaluasi Tingkat Kesulitan (lecturer)

Pada tampilan ini sistem menampilkan kalibrasi tingkat kesulitan soal berdasarkan skor rata-rata agar lecturer dapat menyesuaikan bobot pertanyaan.

Gambar 4.34 Tampilan Cetak Evaluasi Tingkat Kesulitan (lecturer)

12. Tampilan Cetak Presensi Latihan (lecturer)

Pada tampilan ini sistem menampilkan rekapitulasi partisipasi student agar lecturer dapat memantau kedisiplinan student-nya dalam berlatih.

Gambar 4.35 Tampilan Cetak Presensi Latihan (lecturer)

13. Tampilan Cetak Ringkasan Pembimbingan (lecturer)

Pada tampilan ini sistem menampilkan evaluasi akhir terkait kemajuan aktivitas pembimbingan agar lecturer memiliki arsip performa selama satu semester.

Gambar 4.36 Tampilan Cetak Ringkasan Pembimbingan (lecturer)

14. Tampilan Cetak Partisipan Aktif (administrator)

Pada tampilan ini sistem menampilkan  rekapbulanan jumlah student, lecturer, dan staf aktif agar administrator dapat menilai tingkat adopsi sistem.

Gambar 4.37 Tampilan Cetak Partisipan Aktif (administrator)

15. Tampilan Cetak Statistik Modul (administrator)

Pada tampilan ini sistem menampilkan statistik popularitas dan utilitas tiap kategori modul agar administrator dapat mengevaluasi minat pengguna terhadap topik tertentu.

Gambar 4.38 Tampilan Cetak Statistik Modul (administrator)

16. Tampilan Cetak Analisis Kesulitan Sistem (administrator)

Pada tampilan ini sistem menampilkan metrik komprehensif terkait kesulitan soal di seluruh fakultas agar administrator memiliki gambaran kualitas bank soal secara global.

Gambar 4.39 Tampilan Cetak Analisis Kesulitan Sistem (administrator)

17. Tampilan Cetak Statistik Sistem (administrator)

Pada tampilan ini sistem menampilkan performa aplikasi dan konsumsi sistem agar administrator dapat melakukan optimasi server dan sumber daya.

Gambar 4.40 Tampilan Cetak Statistik Sistem (administrator)

18. Tampilan Cetak Umpan Balik Pengguna (administrator)

Pada tampilan ini sistem menampilkan ringkasan saran dan keluhan pengguna terhadap performa AI agar administrator dapat merencanakan peningkatan fitur Intervox ke depannya.

Gambar 4.41 Tampilan Cetak Umpan Balik Pengguna (administrator)

19. Tampilan Cetak Partisipan Aktif (dean)

Pada tampilan ini sistem menampilkan rekap bulanan jumlah student, lecturer, dan staf aktif agar dean dapat menilai tingkat adopsi sistem.

Gambar 4.42 Tampilan Cetak Partisipan Aktif (dean)

20. Tampilan Cetak Statistik Modul (dean)

Pada tampilan ini sistem menampilkan statistik popularitas dan utilitas tiap kategori modul agar dean dapat mengevaluasi minat pengguna terhadap topik tertentu.

Gambar 4.43 Tampilan Cetak Statistik Modul (dean)

21. Tampilan Cetak Statistik Sistem (dean)

Pada tampilan ini sistem menampilkan performa aplikasi dan konsumsi sistem agar dean dapat memantau efektivitas penggunaan platform Intervox secara luas.

Gambar 4.44 Tampilan Cetak Statistik Sistem (dean)
