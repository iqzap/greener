# Greener — rancangan prototype yang disetujui

Satu admin menilai satu kantor; tanpa login atau backend. Lima halaman: Dashboard, Penilaian, Hasil, Rencana perbaikan, Riwayat. UI bahasa Indonesia, desktop dan ponsel, warna hijau.

Lima kategori (energi, air, sampah, kertas, transportasi), masing-masing tiga pertanyaan positif. Belum = 0, Sebagian = 50, Sudah = 100. Semua wajib dijawab. Setiap kategori berbobot sama; skor kategori adalah rata-rata tiga jawaban dan skor total rata-rata lima kategori. Angka tampilan dibulatkan; perhitungan memakai angka asli. Skor simulasi, bukan sertifikasi atau pengukuran emisi.

Penilaian bulanan mengikuti waktu Asia/Jakarta. Satu catatan per bulan; hanya bulan berjalan yang dapat diedit. Riwayat dapat dilihat kembali. Demo awal berisi tiga bulan sebelumnya. Tiga saran dipilih dari jawaban bernilai paling rendah; urutan pertanyaan memecahkan nilai seri. Jika semua praktik sudah dilakukan, tidak ada rekomendasi tertunda. Tindakan selesai disimpan per penilaian dan tidak mengubah skor. Saat mengedit, pertahankan penyelesaian hanya untuk jawaban yang tidak berubah.

Penyimpanan memakai localStorage dengan validasi data dan pemberitahuan jika penyimpanan gagal. Draf tetap tersedia saat berganti halaman atau memuat ulang. Reset memerlukan dialog konfirmasi dan memulihkan data contoh. Tidak ada integrasi eksternal, peran tambahan, atau dashboard emisi.

Validasi: tes perhitungan, kelengkapan, urutan prioritas, dan data contoh; pemeriksaan browser untuk input, simpan, riwayat, persistensi, reset, dan tata letak ponsel.
