# Greener

Prototype green office tracker, bahasa Indonesia. Lima tampilan, 15 pertanyaan, skor simulasi 0–100, tiga prioritas perbaikan, dan riwayat bulanan. Data dan draf tersimpan di localStorage browser. Tanpa backend dan tanpa login aplikasi.

## Jalankan

`npm run dev` lalu buka http://localhost:4173. Tidak perlu instalasi dependensi.

## Validasi

`npm test` menguji bobot kategori, rentang skor, input tidak lengkap, prioritas, data contoh lintas tahun, dan penyelesaian tindakan.

File aplikasi berada di `dist/`; dapat dihosting sebagai situs statis. Font Google bersifat opsional dengan fallback lokal. Bulan penilaian menggunakan zona waktu Asia/Jakarta. Skor mengukur jawaban checklist, bukan emisi aktual atau sertifikasi lingkungan.
