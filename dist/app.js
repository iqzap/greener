import { gameStats, mascot, medal } from './game.mjs';
import { categories, questions, isComplete, scores, priorities, level, currentMonth, monthName, seedRecords, validRecord } from './domain.mjs';

const paths = {
  leaf: '<path d="M5 20C3 8 12 4 21 3c0 11-5 17-16 17Z"/><path d="m5 20 11-11"/>',
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="m9 13 2 2 4-4"/>',
  chart: '<path d="M4 3v17h17M8 15v-4m5 4V7m5 8V4"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  history: '<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7m2-4v6l4 2"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
  drop: '<path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z"/><path d="M9 15a3 3 0 0 0 3 3"/>',
  recycle: '<path d="m9 5 3-3 5 8m-4-1 4 1 1-4M20 12l2 4-4 5H9m3-3-3 3 3 3M6 19H2l-1-5 5-8m-1 5 1-5 5 1" transform="translate(1 0) scale(.9)"/>',
  paper: '<path d="M14 3H5v18h14V8l-5-5Z"/><path d="M14 3v6h5M8 13h8m-8 4h6"/>',
  bike: '<circle cx="5" cy="17" r="4"/><circle cx="19" cy="17" r="4"/><path d="m5 17 5-9 5 9H5m10 0 4-12h-4M8 8h5"/>',
  office: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1m-4 6v-3h2v3"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18m-13 4h2m4 0h2"/>',
  trend: '<path d="m3 17 6-6 4 4 8-10m-6 0h6v6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.5"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>'
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.leaf}</svg>`;
const $ = s => document.querySelector(s);
const STORE = 'greener-office-v1', DRAFT = 'greener-draft-v1';
let storageWarning = false;
let records = seedRecords();
try { const raw = localStorage.getItem(STORE); if (raw) { const data = JSON.parse(raw); if (!Array.isArray(data) || !data.every(validRecord) || new Set(data.map(r => r.month)).size !== data.length) throw new Error('Data tidak valid'); records = data; } else localStorage.setItem(STORE, JSON.stringify(records)); } catch { storageWarning = true; }
let draft = {}, showErrors = false;
try { const raw = JSON.parse(localStorage.getItem(DRAFT) || 'null'); if (raw?.month === currentMonth()) draft = Object.fromEntries(questions.filter(q => [0,50,100].includes(raw.answers?.[q.id])).map(q => [q.id, raw.answers[q.id]])); else draft = { ...records.find(r => r.month === currentMonth())?.answers }; } catch { draft = { ...records.find(r => r.month === currentMonth())?.answers }; }
let toastTimer;
function toast(text) { $('#toast').textContent = text; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4200); }
function write(key, data) { try { localStorage.setItem(key, JSON.stringify(data)); return true; } catch { storageWarning = true; toast('Penyimpanan browser tidak tersedia. Perubahan hanya bertahan selama halaman ini terbuka.'); return false; } }
const ordered = () => [...records].sort((a,b) => a.month.localeCompare(b.month));
const latest = () => ordered().at(-1);
const badge = (n) => `<span class="badge ${n >= 70 ? 'good' : n < 40 ? 'low' : ''}"><i></i>${level(n)}</span>`;
const button = (text, href, type = 'primary') => `<a class="btn ${type}" href="#${href}">${text}${icon('arrow')}</a>`;
const monthChip = month => `<span class="month-chip">${icon('calendar')}${monthName(month)}</span>`;
function heading(eyebrow, title, subtitle, action = '') { return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${subtitle}</p></div>${action}</div>`; }
function scoreRing(score, size = '') { return `<div class="score-ring ${size}" style="--score:${score}" role="img" aria-label="Skor ${Math.round(score)} dari 100"><div><strong>${Math.round(score)}</strong><span>dari 100 poin</span></div></div>`; }
function tasksPreview(record) { const tasks = priorities(record.answers); return tasks.length ? tasks.map((q,i) => {const c=categories.find(c=>c.id===q.category);return `<a class="preview-task" href="#perbaikan/${record.month}"><span class="task-number">0${i+1}</span><div><strong>${q.action}</strong><span>${c.name} <span class="dot-separator">·</span> ${record.completed.includes(q.id) ? 'Selesai' : 'Belum selesai'}</span></div>${icon('chevron')}</a>`;}).join('') : `<div class="empty-inline">${icon('check')} Semua praktik sudah dijalankan. Pertahankan kebiasaan baik ini.</div>`; }
function dashboard() {
  const r=latest(); if(!r) return heading('SELAMAT DATANG', 'Petualangan hijaumu dimulai di sini!', 'Satu langkah kecil untuk kantor yang lebih baik.', button('Mulai misi','penilaian'));
  const s=scores(r.answers), stats=gameStats(records), hasCurrent=records.some(r=>r.month===currentMonth()), count=questions.filter(q=>draft[q.id]!==undefined).length;
  return `${heading('KANTOR KITA, BUMI KITA', 'Yuk, jadi tim yang lebih hijau!', 'Kebiasaan kecil. Perubahan besar. Kita mulai bersama.')}
  <div class="game-layout"><div class="game-main">
    <section class="quest-hero"><div class="quest-hero-copy"><span class="hero-kicker">MISI BULAN INI · ${monthName(currentMonth()).toUpperCase()}</span><h2>Kantor hijau?<br>Kita bisa!</h2><p>Kenali 15 kebiasaan kantor, temukan<br>langkah baik berikutnya.</p>${button(hasCurrent?'Tinjau misiku':count?'Lanjutkan misiku':'Mulai misi bulanan','penilaian')}</div>${mascot('hero-mascot')}<span class="hero-spark spark-one">✦</span><span class="hero-spark spark-two">✧</span></section>
    <div class="journey-heading"><div><h2>Petualangan hijau</h2><p>5 misi kecil untuk perubahan yang berarti.</p></div><span class="unit-tag">BAB 01</span></div>
    <section class="mission-map" aria-label="Lima misi penilaian"><div class="map-line" aria-hidden="true"></div>${categories.map((c,i)=>{const answered=questions.filter(q=>q.category===c.id&&draft[q.id]!==undefined).length;return `<a class="mission-stop stop-${i} ${answered===3?'is-done':''}" href="#penilaian/${c.id}" style="--mission:${c.color}" aria-label="Misi ${i+1}: ${c.name}, ${answered} dari 3 dijawab"><span class="mission-node">${icon(answered===3?'check':c.icon)}<span class="node-stars">${answered===3?'★★★':'★'}</span></span><span class="mission-label"><span class="mission-index">MISI 0${i+1}</span><strong>${c.name}</strong><small>${answered===3?'Misi terjawab!':answered?`${answered}/3 terjawab`:'3 kebiasaan baik'}</small></span>${i===0?'<span class="start-bubble">MULAI DI SINI</span>':''}</a>`;}).join('')}<div class="map-finish">${medal('leaf')}<span>Satu kantor, banyak dampak baik.</span></div></section>
    <section class="panel priorities-panel"><div class="section-top"><div><h2>Misi aksi nyata</h2><p>Giliran kebiasaan baik jadi tindakan.</p></div><a class="text-link" href="#perbaikan/${r.month}">LIHAT MISI ${icon('arrow')}</a></div><div class="preview-tasks">${tasksPreview(r)}</div></section>
  </div><aside class="game-aside">
    <section class="panel score-mini"><div class="section-top"><h2>Skor kantor kita</h2>${icon('leaf')}</div><span class="subtle">${monthName(r.month)}${r.demo?' · contoh':''}</span><div class="mini-score-body">${scoreRing(s.total)}<div>${badge(s.total)}<p>Lihat yang sudah baik.<br>Temukan yang bisa lebih baik.</p></div></div><a class="btn secondary" href="#hasil/${r.month}">LIHAT HASIL ${icon('arrow')}</a></section>
    <section class="panel xp-panel"><div class="section-top"><h2>Level ${stats.level}</h2><span class="xp-total">${icon('bolt')}${stats.xp} XP</span></div><div class="level-title">${medal('star')}<div><strong>${stats.title}</strong><span>${stats.next?`${stats.next-stats.xp} XP menuju level berikutnya`:'Level tertinggi tercapai!'}</span></div></div><div class="bar-track"><i style="transform:scaleX(${stats.next?stats.xp/stats.next:1});--cat:#ffc800"></i></div><p>+50 XP per penilaian bulanan<br>+10 XP per tindakan selesai</p><span class="xp-disclaimer">XP adalah progres aktivitas, bukan skor lingkungan.</span></section>
    <section class="panel achievement-panel"><div class="section-top"><h2>Koleksi langkah baik</h2><span class="subtle">${1+(records.length>=3?1:0)+(stats.completed>0?1:0)}/3</span></div><div class="achievements"><div title="Selesaikan satu penilaian">${medal('leaf')}<strong>Langkah<br>pertama</strong></div><div class="${records.length>=3?'':'locked'}" title="Catat tiga bulan penilaian">${medal('star')}<strong>Terus<br>bertumbuh</strong></div><div class="${stats.completed>0?'':'locked'}" title="Selesaikan satu tindakan perbaikan">${medal('check')}<strong>Jago<br>aksi</strong></div></div></section>
    <div class="coach-note">${mascot('mini-mascot')}<div><strong>Hai, aku Tunas!</strong><p>Nggak perlu sempurna.<br>Yang penting, mulai dulu.</p></div></div>
  </aside></div><div class="local-note">${icon('info')} Progres tersimpan di browser ini. Data awal adalah contoh untuk mencoba prototype.</div>`;
}
let assessmentStep=0;
function assessment() {
  const count=questions.filter(q=>draft[q.id]!==undefined).length, c=categories[assessmentStep];
  return `${heading('MISI BULANAN', 'Satu kebiasaan, satu langkah baik.', 'Jawab jujur, ya. Ini titik mulai kita bertumbuh.',monthChip(currentMonth()))}
  <div class="quest-stepper" aria-label="Tahap penilaian">${categories.map((cat,i)=>{const done=questions.filter(q=>q.category===cat.id).every(q=>draft[q.id]!==undefined);return `<button type="button" data-step="${i}" class="quest-tab ${i===assessmentStep?'active':''} ${done?'done':''}" ${i===assessmentStep?'aria-current="step"':''}>${icon(done?'check':cat.icon)}<span>${cat.name}</span></button>`;}).join('')}</div>
  <div class="assessment-layout"><div><form id="assessment-form" novalidate><section class="panel question-section"><div class="question-section-header"><span class="category-icon" style="--cat:${c.color}">${icon(c.icon)}</span><div><span class="eyebrow">MISI ${assessmentStep+1} DARI 5</span><h2>${c.name}</h2><p>${c.description}</p></div><span class="question-section-count">3 praktik</span></div>${questions.filter(q=>q.category===c.id).map((q,i)=>`<fieldset id="field-${q.id}" class="question ${showErrors&&draft[q.id]===undefined?'invalid':''}"><legend><span class="q-number">${String(assessmentStep*3+i+1).padStart(2,'0')}</span>${q.text}</legend><p id="hint-${q.id}">${q.hint}</p><div class="answers">${[[0,'Belum'],[50,'Sebagian'],[100,'Sudah']].map(([value,label])=>`<label class="answer"><input type="radio" name="${q.id}" value="${value}" ${draft[q.id]===value?'checked':''} aria-describedby="hint-${q.id}" required><span><i>${value===0?'−':value===50?'~':'✓'}</i>${label}<small>${value} poin</small></span></label>`).join('')}</div><span class="field-error" ${showErrors&&draft[q.id]===undefined?'':'hidden'}>Pilih satu jawaban untuk praktik ini.</span></fieldset>`).join('')}</section><div class="step-actions">${assessmentStep>0?`<button type="button" class="btn secondary" data-step="${assessmentStep-1}">KEMBALI</button>`:'<a class="text-link" href="#dashboard">Kembali ke beranda</a>'}<div class="form-submit"><span id="form-error" role="alert">${showErrors?'Lengkapi jawaban yang ditandai.':''}</span>${assessmentStep<4?'<button class="btn primary" type="button" data-next>LANJUTKAN '+icon('arrow')+'</button>':'<button class="btn primary" type="submit">SELESAIKAN MISI '+icon('check')+'</button>'}</div></div></form><div class="answer-note">${icon('info')} Tidak ada jawaban salah. Pilih yang paling sesuai dengan kantor kita.</div></div><aside class="assessment-aside"><section class="panel"><div class="eyebrow">SEDIKIT LAGI, SEMANGAT!</div><h2>Progres misimu</h2><div class="progress-number"><strong id="answered-count">${count}</strong><span>/ 15 terjawab</span></div><div class="bar-track"><i id="form-progress" style="transform:scaleX(${count/15});--cat:var(--green)"></i></div><div class="assessment-coach">${mascot()}<p id="coach-feedback" aria-live="polite">${count===15?'Lengkap! Siap lihat hasilnya?':'Jujur soal hari ini,<br>lebih baik untuk hari esok.'}</p></div><p>Draf otomatis tersimpan. Kamu bisa lanjut kapan saja.</p><div class="aside-divider"></div><h3>Skor ≠ XP</h3><p>Skor kantor adalah rata-rata 5 kategori. Selesaikan penilaian untuk mendapatkan <strong>50 XP</strong>, apa pun jawabanmu.</p><div class="scoring-key"><span>Belum <strong>0 poin</strong></span><span>Sebagian <strong>50 poin</strong></span><span>Sudah <strong>100 poin</strong></span></div><p class="fine-print">Simulasi edukatif, bukan sertifikasi lingkungan.</p></section></aside></div>`;
}
function result(r) {
  const s=scores(r.answers), previous=ordered().filter(x=>x.month<r.month).at(-1), diff=previous?s.total-scores(previous.answers).total:null;
  return `${heading('SKOR KANTOR','Lihat langkah baik yang sudah kita buat!', 'Inilah gambaran praktik green office kantor Anda.',monthChip(r.month))}<div class="result-summary panel">${scoreRing(s.total,'large')}<div>${badge(s.total)}<h2>${s.total>=90?'Kebiasaan baik sudah menjadi budaya.':s.total>=70?'Langkah baik untuk kantor yang lebih hijau.':'Ada langkah sederhana yang bisa kita mulai.'}</h2><p>Skor ini merangkum 15 praktik di lima kategori. Gunakan hasilnya untuk menentukan perubahan yang paling masuk akal bagi kantor.</p>${diff!==null?`<div class="comparison">${icon('trend')} ${diff>=0?'+':''}${Math.round(diff)} poin dibanding ${monthName(previous.month)}</div>`:''}<span class="subtle">${r.demo?'Penilaian contoh · ':''}Skor simulasi, bukan sertifikasi</span></div></div><div class="section-heading"><div><h2>Lima aspek, satu tujuan.</h2><p>Skor kategori adalah rata-rata tiga praktik di dalamnya.</p></div></div><div class="result-categories">${s.categories.map(c=>`<section class="panel result-category"><div class="result-category-title"><span class="category-icon" style="--cat:${c.color}">${icon(c.icon)}</span><h2>${c.name}</h2><strong>${Math.round(c.score)}<small>/100</small></strong></div><div class="bar-track"><i style="transform:scaleX(${c.score/100});--cat:${c.color}"></i></div><ul>${questions.filter(q=>q.category===c.id).map(q=>`<li><span>${q.text}</span><span class="answer-status v${r.answers[q.id]}">${{0:'Belum',50:'Sebagian',100:'Sudah'}[r.answers[q.id]]}</span></li>`).join('')}</ul></section>`).join('')}</div><div class="next-banner"><div>${icon('target')}<div><h2>Ubah hasil menjadi langkah nyata.</h2><p>Mulai dari tiga prioritas yang sesuai dengan jawaban Anda.</p></div></div>${button('Lihat rencana perbaikan',`perbaikan/${r.month}`)}</div>${r.month===currentMonth()?`<div class="center-link"><a class="text-link" href="#penilaian">Edit penilaian bulan ini ${icon('arrow')}</a></div>`:''}`;
}
function improvements(r) {
  const tasks=priorities(r.answers), done=tasks.filter(q=>r.completed.includes(q.id)).length;
  return `${heading('MISI AKSI NYATA','Aksi kecilmu layak dirayakan!', 'Fokus pada langkah yang sederhana dan bisa dimulai hari ini.',monthChip(r.month))}<div class="action-summary"><div class="action-summary-icon">${icon('target')}</div><div><h2>${done} dari ${tasks.length} tindakan selesai</h2><p>Prioritas dipilih dari praktik dengan skor terendah pada penilaian ini.</p></div><div class="action-progress"><div class="bar-track"><i style="transform:scaleX(${tasks.length?done/tasks.length:1});--cat:var(--green)"></i></div><span>${tasks.length?Math.round(done/tasks.length*100):100}% selesai</span></div></div><div class="action-list">${tasks.length?tasks.map((q,i)=>{const c=categories.find(c=>c.id===q.category),checked=r.completed.includes(q.id);return `<article class="panel action-card ${checked?'completed':''}"><div class="action-card-top"><span class="category-tag" style="--cat:${c.color}">${icon(c.icon)}${c.name}</span><span class="action-xp">+10 XP</span></div><h2>${q.action}</h2><p>${q.advice}</p><div class="action-context">Dari penilaian Anda: <strong>${r.answers[q.id]===0?'Belum':'Sebagian'}</strong><span>${q.text}</span></div><label class="task-check"><input type="checkbox" data-task="${q.id}" data-month="${r.month}" ${checked?'checked':''}><span>${checked?'Misi selesai. Hebat!':'Tandai misi selesai'}</span></label></article>`;}).join(''):`<section class="panel empty-state">${icon('leaf')}<h2>Semua praktik sudah dijalankan.</h2><p>Pertahankan kebiasaan baik dan tinjau lagi pada penilaian bulan berikutnya.</p></section>`}</div><div class="form-guide action-guide">${icon('info')}<p><strong>Tindakan selesai tidak langsung mengubah skor.</strong> Catat kebiasaan terbaru saat penilaian bulan berikutnya untuk melihat perkembangannya.</p></div><div class="bottom-links"><a class="text-link" href="#hasil/${r.month}">Kembali ke hasil ${icon('arrow')}</a>${button('Ke dashboard','dashboard','secondary')}</div>`;
}
function history() {
  const data=ordered().reverse(), first=ordered()[0], last=latest(), growth=last&&first?scores(last.answers).total-scores(first.answers).total:0;
  return `${heading('RIWAYAT PENILAIAN','Lihat seberapa jauh kita tumbuh.', 'Catatan kecil dari perjalanan kantor yang lebih hijau.',button(records.some(r=>r.month===currentMonth())?'Perbarui penilaian':'Mulai penilaian','penilaian'))}<div class="history-overview"><section class="panel history-stat"><span class="eyebrow">BULAN TERCATAT</span><strong>${data.length}<small>penilaian bulanan</small></strong></section><section class="panel history-stat"><span class="eyebrow">PERUBAHAN SEJAK AWAL</span><strong>${growth>=0?'+':''}${Math.round(growth)}<small>poin perjalanan</small></strong></section></div><section class="panel history-panel"><div class="section-top"><div><h2>Semua penilaian</h2><p>Satu bulan, satu kesempatan untuk lebih baik.</p></div><span class="badge neutral">${data.length} catatan</span></div><div class="table-wrap"><table><thead><tr><th>Periode penilaian</th><th>Skor total</th><th>Perubahan</th><th>Status</th><th><span class="sr-only">Aksi</span></th></tr></thead><tbody>${data.map(r=>{const s=scores(r.answers).total,prev=ordered().filter(x=>x.month<r.month).at(-1),diff=prev?s-scores(prev.answers).total:null;return `<tr><td><span class="table-period">${icon('calendar')}<span><strong>${monthName(r.month)}</strong><small>${r.demo?'Data contoh':'Penilaian kantor'}</small></span></span></td><td><strong class="table-score">${Math.round(s)}</strong><small> / 100</small></td><td><span class="${diff!==null&&diff>=0?'positive':''}">${diff===null?'—':`${diff>=0?'+':''}${Math.round(diff)} poin`}</span></td><td>${badge(s)}</td><td><a class="text-link" href="#hasil/${r.month}">Lihat hasil ${icon('arrow')}</a></td></tr>`;}).join('')}</tbody></table></div></section><div class="local-note">${icon('info')} Penilaian bulan berjalan dapat diedit. Bulan sebelumnya disimpan sebagai riwayat.</div>`;
}
const navItems=[['dashboard','dashboard','Petualangan'],['penilaian','clipboard','Misi bulanan'],['hasil','chart','Skor kantor'],['perbaikan','target','Misi aksi nyata'],['riwayat','history','Perjalanan']];
function render() {
  const [page='dashboard',month] = (location.hash.slice(1)||'dashboard').split('/');
  const known=navItems.find(x=>x[0]===page), active=known?.[0]||'dashboard';
  $('#navigation').innerHTML=navItems.map(([route,i,label])=>`<a href="#${route}" ${route===active?'aria-current="page"':''}>${icon(i)}<span>${label}</span>${route==='penilaian'?'<span class="nav-small-dot"></span>':''}</a>`).join('');
  $('#breadcrumb').textContent=known?.[2]||'Petualangan';
  const gs=gameStats(records);$('#game-stats').innerHTML=`<span class="top-xp">${icon('bolt')}${gs.xp} XP</span><span class="top-level">${icon('leaf')}Level ${gs.level}</span>`;
  document.title=`${known?.[2]||'Dashboard'} — Greener`;
  const record = month ? records.find(r=>r.month===month) : latest();
  let html;
  if(active==='penilaian') { if(categories.some(c=>c.id===month))assessmentStep=categories.findIndex(c=>c.id===month); html=assessment(); }
  else if(active==='hasil'||active==='perbaikan') html=record?(active==='hasil'?result(record):improvements(record)):`${heading('BELUM ADA HASIL','Mulai perjalanan hijau Anda.',month?'Penilaian untuk periode ini tidak ditemukan.':'Isi penilaian untuk mendapatkan skor dan saran perbaikan.',button('Mulai penilaian','penilaian'))}`;
  else html=active==='riwayat'?history():dashboard();
  $('#main').innerHTML=(storageWarning?'<div class="storage-warning" role="alert">Penyimpanan browser tidak tersedia atau data sebelumnya tidak dapat dibaca. Periksa pengaturan browser agar perubahan tetap tersimpan.</div>':'')+html;
}
$('#brand-icon').innerHTML=icon('leaf');$('#office-icon').innerHTML=icon('office');$('#note-icon').innerHTML=icon('leaf');
let pendingCelebration=null, pointerInteraction=false;
document.addEventListener('pointerdown',()=>pointerInteraction=true);
document.addEventListener('keydown',()=>pointerInteraction=false);
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);$('#main').focus({preventScroll:true});if(pendingCelebration){showCelebration(pendingCelebration);pendingCelebration=null;}});
document.addEventListener('change',e=>{
  const input=e.target;
  if(input.matches('#assessment-form input[type="radio"]')) {
    draft[input.name]=Number(input.value);write(DRAFT,{month:currentMonth(),answers:draft});
    const count=questions.filter(q=>draft[q.id]!==undefined).length;
    $('#answered-count').textContent=count;$('#form-progress').style.transform=`scaleX(${count/15})`;
    input.closest('fieldset').classList.remove('invalid');input.closest('fieldset').querySelector('.field-error').hidden=true;
    if(pointerInteraction){input.closest('label').classList.remove('choice-pop');void input.offsetWidth;input.closest('label').classList.add('choice-pop');}
    const currentDone=questions.filter(q=>q.category===categories[assessmentStep].id).every(q=>draft[q.id]!==undefined);
    $('#coach-feedback').textContent=count===15?'15 jawaban lengkap!':currentDone?'Misi ini terjawab. Kamu keren!':'Satu langkah lagi. Terima kasih sudah jujur!';
    if(count===15)$('#coach-feedback').textContent='15 jawaban lengkap. Siap lihat hasilnya?';
    const tab=document.querySelector(`[data-step="${assessmentStep}"]`);if(currentDone)tab?.classList.add('done');
    if(currentDone)$('#form-error').textContent='';
  }
  if(input.matches('[data-task]')) { const record=records.find(r=>r.month===input.dataset.month);if(!record)return;record.completed=record.completed.filter(id=>id!==input.dataset.task);if(input.checked)record.completed.push(input.dataset.task);const success=write(STORE,records);const checked=input.checked;render();const replacement=document.querySelector(`[data-task="${input.dataset.task}"]`);replacement?.focus({preventScroll:true});if(success)toast(checked?'+10 XP · Aksi baik tercatat! Skor kantor tetap.':'Status tindakan diperbarui. XP menyesuaikan progres.');if(checked&&pointerInteraction)document.querySelector('.action-summary')?.classList.add('success-pop'); }
});
document.addEventListener('submit',e=>{
  if(e.target.id!=='assessment-form')return;e.preventDefault();
  if(!isComplete(draft)){showErrors=true;const missing=questions.find(q=>draft[q.id]===undefined);assessmentStep=categories.findIndex(c=>c.id===missing.category);if(location.hash.split('/')[1])window.history.replaceState(null,'','#penilaian');render();$(`#field-${missing.id}`).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});$(`#field-${missing.id} input`).focus({preventScroll:true});return;}
  const month=currentMonth(), old=records.find(r=>r.month===month), record={month,answers:{...draft},completed:(old?.completed||[]).filter(id=>old.answers[id]===draft[id]),demo:false};
  records=records.filter(r=>r.month!==month);records.push(record);const saved=write(STORE,records);write(DRAFT,{month,answers:draft});showErrors=false;pendingCelebration=old?'updated':'new';location.hash=`hasil/${month}`;if(!saved)pendingCelebration=null;
});
$('.skip').addEventListener('click',e=>{e.preventDefault();$('#main').focus();$('#main').scrollIntoView();});
for(const id of ['#reset-demo','#reset-demo-mobile'])$(id).addEventListener('click',()=>$('#reset-dialog').showModal());
$('#reset-dialog').addEventListener('close',()=>{if($('#reset-dialog').returnValue!=='reset')return;records=seedRecords();draft={};showErrors=false;const saved=write(STORE,records);write(DRAFT,{month:currentMonth(),answers:{}});assessmentStep=0;if(location.hash==='#dashboard')render();else location.hash='dashboard';if(saved)toast('Data contoh dipulihkan. Siap menjelajahi lagi.');});
render();

function showCelebration(kind) {
  const dialog=$('#celebration-dialog');
  $('#celebration-title').textContent=kind==='new'?'Misi bulanan selesai!':'Misi berhasil diperbarui!';
  $('#celebration-reward').textContent=kind==='new'?'+50 XP':'Progres tersimpan';
  $('#celebration-copy').textContent=kind==='new'?'Langkah pertama menuju perubahan? Mengenali kebiasaan kita. Kamu sudah melakukannya!':'Jawaban terbaru sudah masuk. XP dihitung sekali untuk setiap bulan penilaian.';
  $('#celebration-character').innerHTML=mascot('celebrating-mascot');
  $('#confetti').innerHTML=Array.from({length:20},(_,i)=>`<i style="--x:${(i*37)%100}%;--rot:${i*53}deg;--delay:${i%5*30}ms;--color:${['#58cc02','#1cb0f6','#ffc800','#ce82ff','#ff9600'][i%5]}"></i>`).join('');
  dialog.showModal();
}
document.addEventListener('click',e=>{
  const step=e.target.closest('[data-step]'), next=e.target.closest('[data-next]');
  if(!step&&!next)return;
  if(next){const missing=questions.find(q=>q.category===categories[assessmentStep].id&&draft[q.id]===undefined);if(missing){showErrors=true;window.history.replaceState(null,'','#penilaian');render();$(`#field-${missing.id} input`).focus();return;}assessmentStep=Math.min(4,assessmentStep+1);}
  else assessmentStep=Number(step.dataset.step);
  showErrors=false;window.history.replaceState(null,'','#penilaian');render();window.scrollTo({top:0,behavior:'instant'});$('#main').focus({preventScroll:true});
});
