# Greener — rancangan prototype yang disetujui

Satu admin menilai satu kantor; tanpa login atau backend. Lima halaman: Dashboard, Penilaian, Hasil, Rencana perbaikan, Riwayat. UI bahasa Indonesia, desktop dan ponsel, warna hijau.

Lima kategori (energi, air, sampah, kertas, transportasi), masing-masing tiga pertanyaan positif. Belum = 0, Sebagian = 50, Sudah = 100. Semua wajib dijawab. Setiap kategori berbobot sama; skor kategori adalah rata-rata tiga jawaban dan skor total rata-rata lima kategori. Angka tampilan dibulatkan; perhitungan memakai angka asli. Skor simulasi, bukan sertifikasi atau pengukuran emisi.

Penilaian bulanan mengikuti waktu Asia/Jakarta. Satu catatan per bulan; hanya bulan berjalan yang dapat diedit. Riwayat dapat dilihat kembali. Demo awal berisi tiga bulan sebelumnya. Tiga saran dipilih dari jawaban bernilai paling rendah; urutan pertanyaan memecahkan nilai seri. Jika semua praktik sudah dilakukan, tidak ada rekomendasi tertunda. Tindakan selesai disimpan per penilaian dan tidak mengubah skor. Saat mengedit, pertahankan penyelesaian hanya untuk jawaban yang tidak berubah.

Penyimpanan memakai localStorage dengan validasi data dan pemberitahuan jika penyimpanan gagal. Draf tetap tersedia saat berganti halaman atau memuat ulang. Reset memerlukan dialog konfirmasi dan memulihkan data contoh. Tidak ada integrasi eksternal, peran tambahan, atau dashboard emisi.

Validasi: tes perhitungan, kelengkapan, urutan prioritas, dan data contoh; pemeriksaan browser untuk input, simpan, riwayat, persistensi, reset, dan tata letak ponsel.

## Redesign playful — 5 November 2026

Menggunakan referensi Duolingo dari Mobbin MCP: [jalur misi](https://mobbin.com/screens/02544e61-aefd-4d89-815e-ffcc83d83539), [perayaan selesai](https://mobbin.com/screens/92705902-10f2-4dd7-b46f-21fe7732cfff), dan [Refero style](https://styles.refero.design/style/7088d695-362b-4e09-b325-fa8136d4f350). Canvas putih, Nunito, hijau cerah, aksen biru, border tebal, tombol timbul. Maskot tunas adalah ilustrasi SVG orisinal untuk Greener.

Lima halaman tetap. Penilaian memakai lima tahap kategori, masing-masing tiga pertanyaan. Navigasi tahap dan draf dapat dilanjutkan tanpa kehilangan jawaban. XP dihitung dari jumlah catatan bulanan (50 XP masing-masing) dan tindakan prioritas yang selesai (10 XP masing-masing); mengedit bulan yang sama tidak menambah XP. Membatalkan tindakan menyesuaikan XP. XP terpisah dari skor green office, termasuk pada data contoh. Level 1 di bawah 150 XP, level 2 dari 150, level 3 dari 300. Tiga pencapaian berasal dari satu penilaian, tiga bulan tercatat, dan satu tindakan selesai.

Microinteractions: tombol tertekan, pilihan jawaban memantul singkat saat interaksi pointer, progres via transform, feedback Tunas, konfirmasi misi selesai dengan confetti dan dialog hasil. Tidak ada animasi loop atau audio otomatis. Semua motion dinonaktifkan saat prefers-reduced-motion.
