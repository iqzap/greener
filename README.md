# Greener

Prototype green office tracker berbahasa Indonesia. Layout khusus ponsel (maksimum 430 px), termasuk saat dibuka di desktop.

Tujuh tampilan mencakup layar sambutan, Beranda, Penilaian, Hasil, Aksi, Riwayat, dan Profil. Empat tab bergambar mengarah ke Beranda, Aksi, Riwayat, dan Profil. Profil pengguna dan perusahaan bersifat opsional dan disimpan di browser. Penilaian menampilkan satu dari 15 pertanyaan per layar. Contoh, detail kategori, dan petunjuk aksi dibuka saat dibutuhkan. Sprout punya tujuh pose untuk sambutan, bantuan, hasil, dan umpan balik.

## Jalankan

`npm run dev` lalu buka http://localhost:4173. Tidak perlu instalasi dependensi.

GitHub Pages memakai `npm run build:pages` dan menerbitkan `build/pages/`. Build menambahkan versi rilis pada URL JavaScript, semua impor modul lokal, dan CSS agar browser tidak mencampur file cache lama dengan halaman baru.

## Validasi

`npm test` memeriksa skor, prioritas, dan navigasi/resume pertanyaan.

Data dan draf memakai localStorage dengan kunci yang sama seperti versi sebelumnya. Skor 0–100 dari lima kategori berbobot sama. Skor hijau adalah satu-satunya skor. Checklist aksi mencatat progres perbaikan.

File aplikasi berada di `dist/`; dapat dihosting sebagai situs statis. Font Nunito dari Google dengan fallback lokal. Ikon memakai subset Hugeicons Stroke Rounded dari `@hugeicons/core-free-icons` 4.4.0; lisensi di `dist/hugeicons-LICENSE.md`. Mendukung `prefers-reduced-motion`. Bulan penilaian memakai Asia/Jakarta.
