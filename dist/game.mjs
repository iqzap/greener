import { priorities } from './domain.mjs';

export function gameStats(records) {
  const completed = records.reduce((sum, r) => sum + priorities(r.answers).filter(q => r.completed.includes(q.id)).length, 0);
  const xp = records.length * 50 + completed * 10;
  const level = xp >= 300 ? 3 : xp >= 150 ? 2 : 1;
  return { xp, completed, level, title: ['Penjelajah hijau', 'Sahabat bumi', 'Pahlawan hijau'][level - 1], next: level === 1 ? 150 : level === 2 ? 300 : null };
}

