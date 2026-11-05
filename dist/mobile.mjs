import { questions } from './domain.mjs';

export const questionCopy = {
  'energy-0': ['Perangkat dimatikan setelah dipakai?', 'Matikan perangkat'],
  'energy-1': ['Sudah pakai lampu hemat energi?', 'Beralih ke lampu LED'],
  'energy-2': ['Penggunaan AC sudah diatur?', 'Atur penggunaan AC'],
  'water-0': ['Kebocoran air diperiksa rutin?', 'Periksa kebocoran air'],
  'water-1': ['Sudah pakai penghemat air?', 'Pasang penghemat air'],
  'water-2': ['Tim terbiasa menghemat air?', 'Ingatkan hemat air'],
  'waste-0': ['Sampah kantor sudah dipilah?', 'Mulai pilah sampah'],
  'waste-1': ['Barang sekali pakai sudah dikurangi?', 'Kurangi sekali pakai'],
  'waste-2': ['Sampah daur ulang disalurkan terpisah?', 'Salurkan daur ulang'],
  'paper-0': ['Dokumen kerja sudah digital?', 'Utamakan dokumen digital'],
  'paper-1': ['Sudah terbiasa cetak dua sisi?', 'Cetak dua sisi'],
  'paper-2': ['Kertas satu sisi dipakai ulang?', 'Pakai ulang kertas'],
  'transport-0': ['Transportasi rendah emisi didukung?', 'Dukung transportasi hijau'],
  'transport-1': ['Tim berbagi kendaraan jika memungkinkan?', 'Coba berbagi kendaraan'],
  'transport-2': ['Rapat daring menggantikan perjalanan bila sesuai?', 'Utamakan rapat daring']
};

export function nextUnanswered(answers) {
  const index = questions.findIndex(q => ![0, 50, 100].includes(answers[q.id]));
  return index === -1 ? 0 : index;
}

export function questionIndex(segment, answers) {
  if (/^([1-9]|1[0-5])$/.test(segment || '')) return Number(segment) - 1;
  const categoryStart = questions.findIndex(q => q.category === segment);
  return categoryStart === -1 ? nextUnanswered(answers) : categoryStart;
}
