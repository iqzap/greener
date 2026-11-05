export const categories = [
  { id: 'energy', name: 'Energi', icon: 'bolt', color: '#c29739', description: 'Gunakan energi dengan lebih bijak.', questions: [
    ['Peralatan dimatikan saat tidak digunakan.', 'Komputer, lampu, dan perangkat kerja tidak dibiarkan menyala setelah jam kantor.', 'Buat checklist mematikan perangkat', 'Tunjuk petugas terakhir untuk mengecek lampu, komputer, dan perangkat sebelum pulang.'],
    ['Lampu hemat energi digunakan di ruang kerja.', 'Sebagian besar titik lampu menggunakan LED atau teknologi hemat energi.', 'Mulai beralih ke lampu LED', 'Catat titik lampu yang belum hemat energi. Prioritaskan penggantian di ruang yang paling sering digunakan.'],
    ['Penggunaan AC diatur secara konsisten.', 'Ada pengaturan suhu, jadwal penggunaan, dan perawatan AC yang dijalankan.', 'Tetapkan kebiasaan penggunaan AC', 'Sepakati pengaturan suhu dan jam operasional, tutup pintu saat AC menyala, serta jadwalkan perawatan.']
  ] },
  { id: 'water', name: 'Air', icon: 'drop', color: '#558aa0', description: 'Setiap tetes punya peran.', questions: [
    ['Keran dan saluran air diperiksa secara rutin.', 'Kebocoran dicari dan segera dilaporkan untuk diperbaiki.', 'Jadwalkan pemeriksaan kebocoran', 'Lakukan pengecekan keran dan toilet mingguan. Sediakan satu kanal pelaporan kebocoran.'],
    ['Perangkat penghemat air sudah digunakan.', 'Misalnya aerator keran atau toilet dengan pilihan volume siram.', 'Coba perangkat penghemat air', 'Mulai dari keran yang paling sering digunakan dan evaluasi kebutuhan aerator atau pengatur aliran.'],
    ['Karyawan menerapkan kebiasaan hemat air.', 'Ada pengingat dan kebiasaan menutup keran setelah digunakan.', 'Pasang pengingat hemat air', 'Tempatkan pengingat sederhana di dekat wastafel dan sampaikan kebiasaan hemat air kepada tim.']
  ] },
  { id: 'waste', name: 'Sampah', icon: 'recycle', color: '#a77762', description: 'Kurangi, pilah, dan kelola.', questions: [
    ['Sampah dipilah sejak dari sumbernya.', 'Tempat sampah berlabel tersedia dan digunakan sesuai jenis sampah.', 'Mulai memilah sampah kantor', 'Sediakan tempat terpisah untuk sampah organik, material daur ulang, dan residu dengan label yang jelas.'],
    ['Barang sekali pakai sudah dikurangi.', 'Tim memakai botol minum, gelas, dan alat makan yang dapat digunakan kembali.', 'Ganti kebiasaan sekali pakai', 'Sediakan gelas dan alat makan bersama. Ajak tim membawa botol minum saat bekerja.'],
    ['Sampah daur ulang disalurkan secara terpisah.', 'Ada pengumpulan dan penyaluran ke bank sampah atau mitra pengelola.', 'Hubungkan kantor dengan pengelola daur ulang', 'Tentukan area pengumpulan material bersih dan jadwalkan penyaluran ke bank sampah atau mitra setempat.']
  ] },
  { id: 'paper', name: 'Kertas', icon: 'paper', color: '#71966d', description: 'Lebih sedikit cetak, lebih banyak manfaat.', questions: [
    ['Dokumen dibagikan dan disimpan secara digital.', 'Dokumen kerja harian tidak perlu dicetak untuk dibaca atau dibagikan.', 'Utamakan dokumen digital', 'Gunakan folder bersama untuk dokumen kerja dan bagikan tautan sebagai pengganti salinan cetak.'],
    ['Pencetakan menggunakan dua sisi bila memungkinkan.', 'Pengaturan cetak dua sisi diterapkan pada dokumen yang sesuai.', 'Atur cetak dua sisi', 'Jadikan cetak dua sisi sebagai pengaturan awal printer dan beri panduan singkat di area cetak.'],
    ['Kertas bekas yang masih layak digunakan kembali.', 'Kertas satu sisi dikumpulkan untuk kebutuhan catatan internal.', 'Sediakan tempat kertas pakai ulang', 'Kumpulkan kertas satu sisi yang tidak memuat informasi rahasia untuk catatan internal.']
  ] },
  { id: 'transport', name: 'Transportasi', icon: 'bike', color: '#8c83a5', description: 'Perjalanan kerja yang lebih bijak.', questions: [
    ['Moda perjalanan rendah emisi didukung.', 'Ada dukungan untuk berjalan kaki, bersepeda, atau transportasi umum.', 'Dukung perjalanan rendah emisi', 'Bagikan pilihan rute transportasi umum dan identifikasi kebutuhan parkir sepeda atau fasilitas pendukung.'],
    ['Berbagi kendaraan dilakukan jika memungkinkan.', 'Karyawan dengan rute searah dapat mengatur perjalanan bersama.', 'Coba perjalanan bersama', 'Ajak tim yang memiliki rute searah mencoba berbagi kendaraan pada hari yang disepakati.'],
    ['Perjalanan dinas diganti pertemuan daring bila sesuai.', 'Pertemuan yang tidak perlu dilakukan langsung menggunakan panggilan video.', 'Tinjau kebutuhan perjalanan dinas', 'Sebelum menjadwalkan perjalanan, cek apakah tujuan pertemuan bisa dicapai secara daring.']
  ] }
];
export const questions = categories.flatMap(c => c.questions.map((q, i) => ({ id: `${c.id}-${i}`, category: c.id, text: q[0], hint: q[1], action: q[2], advice: q[3] })));
export function isComplete(answers) { return questions.every(q => [0, 50, 100].includes(answers?.[q.id])); }
export function scores(answers) {
  if (!isComplete(answers)) throw new Error('Lengkapi seluruh jawaban terlebih dahulu.');
  const byCategory = categories.map(c => ({ ...c, score: questions.filter(q => q.category === c.id).reduce((n, q) => n + answers[q.id], 0) / 3 }));
  return { total: byCategory.reduce((n, c) => n + c.score, 0) / 5, categories: byCategory };
}
export function priorities(answers) { return questions.filter(q => answers[q.id] < 100).sort((a, b) => answers[a.id] - answers[b.id]).slice(0, 3); }
export function level(score) { return score >= 90 ? 'Praktik baik terjaga' : score >= 70 ? 'Langkah baik' : score >= 40 ? 'Terus bertumbuh' : 'Awal perjalanan'; }
export function currentMonth() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit' }).format(new Date()).slice(0, 7); }
export function monthName(month, short = false) { return new Intl.DateTimeFormat('id-ID', { month: short ? 'short' : 'long', year: short ? undefined : 'numeric', timeZone: 'UTC' }).format(new Date(`${month}-01T00:00:00Z`)); }
export function seedRecords(month = currentMonth()) {
  const samples = [[50,50,50,50,0,50,0,0,50,100,100,50,0,50,50], [100,50,50,50,50,50,50,0,50,100,100,50,50,50,0], [100,100,50,50,50,50,50,0,50,100,100,100,50,100,50]];
  const [year, m] = month.split('-').map(Number);
  return samples.map((sample, i) => {
    const d = new Date(Date.UTC(year, m - 4 + i, 1));
    return { month: d.toISOString().slice(0, 7), answers: Object.fromEntries(questions.map((q, k) => [q.id, sample[k]])), completed: [], demo: true };
  });
}
export function validRecord(r) { return r && /^\d{4}-(0[1-9]|1[0-2])$/.test(r.month) && isComplete(r.answers) && Array.isArray(r.completed) && r.completed.every(id => questions.some(q => q.id === id)); }
