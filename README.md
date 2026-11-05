# Greener

Prototype green office tracker, bahasa Indonesia. Lima tampilan, form lima tahap, 15 pertanyaan, skor simulasi 0–100, tiga prioritas perbaikan, dan riwayat bulanan. Data dan draf tersimpan di localStorage browser. Tanpa backend dan tanpa login aplikasi. Tampilan playful terinspirasi Duolingo, dengan maskot Tunas, jalur misi, badge, XP, dan perayaan hasil. XP aktivitas terpisah dari skor kantor; mengedit penilaian tidak menggandakan XP. Mendukung prefers-reduced-motion.

## Jalankan

`npm run dev` lalu buka http://localhost:4173. Tidak perlu instalasi dependensi.

## Validasi

`npm test` menguji bobot kategori, rentang skor, input tidak lengkap, prioritas, data contoh lintas tahun, dan penyelesaian tindakan.

File aplikasi berada di `dist/`; dapat dihosting sebagai situs statis. Font Google bersifat opsional dengan fallback lokal. Bulan penilaian menggunakan zona waktu Asia/Jakarta. Skor mengukur jawaban checklist, bukan emisi aktual atau sertifikasi lingkungan.
