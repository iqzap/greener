import { priorities } from './domain.mjs';

export function gameStats(records) {
  const completed = records.reduce((sum, r) => sum + priorities(r.answers).filter(q => r.completed.includes(q.id)).length, 0);
  const xp = records.length * 50 + completed * 10;
  const level = xp >= 300 ? 3 : xp >= 150 ? 2 : 1;
  return { xp, completed, level, title: ['Penjelajah hijau', 'Sahabat bumi', 'Pahlawan hijau'][level - 1], next: level === 1 ? 150 : level === 2 ? 300 : null };
}

// Original Greener sprout character, shared across encouragement and completion states.
export function mascot(className = '') {
  return `<svg class="mascot ${className}" viewBox="0 0 240 230" fill="none" aria-hidden="true">
    <ellipse cx="123" cy="213" rx="66" ry="9" fill="#d9edc6"/>
    <path class="mascot-arm" d="M66 133C42 136 29 117 28 99c0-9 12-12 16-4l14 23 16-2" fill="#58cc02"/>
    <path d="M176 132c23 6 31 23 29 32-2 10-13 10-17 1l-13-16" fill="#58cc02"/>
    <path d="M99 192 87 208c-3 8 12 11 21 3l12-13m24-6 14 16c6 10-9 15-20 5l-12-14" fill="#3e9f00"/>
    <path d="M120 56c-44 0-69 38-62 82 4 42 25 66 65 66s68-25 69-66c1-34-22-75-72-82Z" fill="#58cc02"/>
    <path d="M122 60c-31 6-53 28-54 63 0 40 13 54 25 65-19-9-32-28-35-50-7-44 18-82 62-82l2 4Z" fill="#46b600"/>
    <path d="M120 62c-29 0-48-23-44-43 29-2 47 15 44 43Z" fill="#89df37"/>
    <path d="M121 60c-4-35 17-52 43-49 0 29-16 48-43 49Z" fill="#58cc02"/>
    <path d="m121 60 24-28" stroke="#3fa900" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="98" cy="116" rx="18" ry="24" fill="white"/><ellipse cx="149" cy="116" rx="18" ry="24" fill="white"/>
    <g class="mascot-eyes"><ellipse cx="103" cy="120" rx="8" ry="12" fill="#294936"/><ellipse cx="144" cy="120" rx="8" ry="12" fill="#294936"/><circle cx="106" cy="115" r="3" fill="white"/><circle cx="147" cy="115" r="3" fill="white"/></g>
    <ellipse cx="80" cy="146" rx="11" ry="6" fill="#a2ea62"/><ellipse cx="165" cy="146" rx="11" ry="6" fill="#a2ea62"/>
    <path d="M111 148c2 13 21 14 25 0h-25Z" fill="#294936"/><path d="M118 156c5-4 10-3 13 0-4 4-10 4-13 0Z" fill="#ff9d9d"/>
    <path d="m204 65 3 10 10 3-10 3-3 10-3-10-10-3 10-3 3-10Z" fill="#ffc800"/><path d="m37 54 2 7 7 2-7 3-2 7-3-7-7-3 7-2 3-7Z" fill="#1cb0f6"/>
  </svg>`;
}

export function medal(kind = 'star') {
  const symbols = { star: '<path d="m32 16 4.5 9 10 1.5-7.3 7.1L41 44l-9-4.8L23 44l1.8-10.4-7.3-7.1 10-1.5L32 16Z" fill="#fff4ab"/>', leaf: '<path d="M23 41c-3-18 9-23 22-24 0 18-8 25-22 24Z" fill="white"/><path d="m23 41 14-15" stroke="#32a004" stroke-width="3" stroke-linecap="round"/>', check: '<path d="m20 30 8 8 16-17" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' };
  return `<svg viewBox="0 0 64 72" class="medal" aria-hidden="true"><path d="m18 49-2 22 16-8 16 8-2-22" fill="#1cb0f6"/><circle cx="32" cy="31" r="29" fill="#ffb100"/><circle cx="32" cy="29" r="25" fill="#ffd642"/><circle cx="32" cy="29" r="20" fill="#ffc800"/>${symbols[kind] || symbols.star}</svg>`;
}
