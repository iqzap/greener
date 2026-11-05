import { categories, questions, isComplete, scores, priorities, level, currentMonth, monthName, seedRecords, validRecord } from './domain.mjs';
import { icon } from './icons.mjs';
import { questionCopy, nextUnanswered, questionIndex } from './mobile.mjs';

const $ = s => document.querySelector(s);
const STORE = 'greener-office-v1', DRAFT = 'greener-draft-v1';
const answerLabels = { 0: 'Belum', 50: 'Sebagian', 100: 'Sudah' };
const ordered = () => [...records].sort((a,b) => a.month.localeCompare(b.month));
const latest = () => ordered().at(-1);
let storageWarning = false, records = seedRecords(), draft = {}, currentQuestion = 0;
let pointerInput = false, pendingCelebration = null, toastTimer;

try {
  const raw = localStorage.getItem(STORE);
  if (raw) {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(validRecord) || new Set(parsed.map(r => r.month)).size !== parsed.length) throw new Error('Invalid records');
    records = parsed;
  } else localStorage.setItem(STORE, JSON.stringify(records));
} catch { storageWarning = true; }
try {
  const raw = JSON.parse(localStorage.getItem(DRAFT) || 'null');
  if (raw?.month === currentMonth()) draft = Object.fromEntries(questions.filter(q => [0,50,100].includes(raw.answers?.[q.id])).map(q => [q.id, raw.answers[q.id]]));
  else draft = { ...records.find(r => r.month === currentMonth())?.answers };
} catch { draft = { ...records.find(r => r.month === currentMonth())?.answers }; }

function toast(message, pose) {
  const notice = $('#toast');
  notice.textContent = message;
  if (pose) notice.insertAdjacentHTML('afterbegin', mascot(pose));
  notice.classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3500);
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { storageWarning = true; toast('Belum tersimpan. Penyimpanan browser tidak tersedia.'); return false; }
}
const actionLink = (label, route, variant = 'primary') => `<a class="btn ${variant}" href="#${route}">${label}${icon('arrow')}</a>`;
const progress = (value, label, extra = '') => `<div class="progress-track ${extra}" role="progressbar" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(value*100)}"><i style="transform:scaleX(${value})"></i></div>`;
const title = (text, subtitle = '') => `<div class="page-heading"><h1>${text}</h1>${subtitle?`<p>${subtitle}</p>`:''}</div>`;
const scoreRing = score => `<div class="score-ring" style="--score:${score}" role="img" aria-label="Skor ${Math.round(score)} dari 100"><div><strong>${Math.round(score)}</strong><span>dari 100</span></div></div>`;
const categoryIcon = c => `<span class="category-icon" style="--category:${c.color}">${icon(c.icon)}</span>`;
const mascot = pose => `<img class="mascot mascot-${pose}" src="./mascots/sprout-${pose}.png" alt="" width="128" height="128" decoding="async">`;

function splash() {
  return `<section class="splash-content">
    ${mascot('splash')}
    <h1 class="splash-brand">greener<span>.</span></h1>
    <p>Langkah kecil untuk kantor lebih hijau.</p>
  </section><div class="splash-start">${actionLink('Mulai', 'dashboard')}</div>`;
}

function home() {
  const record = latest(), current = records.find(r => r.month === currentMonth());
  const count = questions.filter(q => draft[q.id] !== undefined).length;
  const resume = nextUnanswered(draft), label = current ? 'Tinjau misi' : count ? 'Lanjutkan misi' : 'Mulai misi';
  return `<div class="home-intro">${title('Langkah kecil,<br>dampak besar.', 'Misi hijau kantor kita.')}${mascot('home')}</div>
    <section class="mission-card"><div class="mission-top"><span class="eyebrow">MISI ${monthName(currentMonth(),true).toUpperCase()}</span><span class="question-count">${count}/15</span></div><h2>Seberapa hijau<br>kantor kita?</h2><p>15 pertanyaan singkat</p>${progress(count/15,'Jawaban tersimpan')}${actionLink(label,`penilaian/${resume+1}`)}</section>
    ${record?`<a class="home-score" href="#hasil/${record.month}" aria-label="Lihat hasil ${monthName(record.month)}"><div><span class="card-label">Skor terakhir</span><span class="score-month">${monthName(record.month)}${record.demo?' · contoh':''}</span><div class="score-value"><strong>${Math.round(scores(record.answers).total)}</strong><span>/100</span></div></div><span class="score-arrow">${icon('arrow')}</span></a>`:''}
    <span class="home-note">Progres otomatis tersimpan.</span>`;
}

function assessment() {
  const q = questions[currentQuestion], c = categories.find(c => c.id === q.category);
  const count = questions.filter(q => draft[q.id] !== undefined).length, selected = draft[q.id];
  return `<div class="quiz-toolbar"><button class="icon-button" data-back aria-label="${currentQuestion?'Pertanyaan sebelumnya':'Kembali ke beranda'}">${icon('back')}</button>${progress(count/15,'Jawaban tersimpan')}<a class="icon-button" href="#dashboard" aria-label="Simpan draf dan tutup misi">${icon('close')}</a></div>
    <div class="quiz-body"><div class="quiz-meta"><span class="category-label" style="--category:${c.color}">${categoryIcon(c)}${c.name}</span><span class="step-count">${currentQuestion+1}/15</span></div><h1 id="question-title" tabindex="-1">${questionCopy[q.id][0]}</h1>
    <details class="question-help"><summary>${icon('info')}<span>Contoh</span>${icon('down')}</summary><div class="question-example">${mascot('help')}<p id="question-hint">${q.hint}</p></div></details>
    <form id="assessment-form" novalidate><fieldset class="question-options" aria-labelledby="question-title"><legend class="sr-only">Pilih sesuai kebiasaan kantor</legend>${[[0,'minus'],[50,'partial'],[100,'check']].map(([value,symbol])=>`<label class="answer"><input type="radio" name="${q.id}" value="${value}" ${selected===value?'checked':''} required aria-label="${answerLabels[value]}"><span><span class="answer-icon">${icon(symbol)}</span><strong>${answerLabels[value]}</strong><span class="selected-check">${icon('check')}</span></span></label>`).join('')}</fieldset><span id="form-error" role="alert"></span><div class="quiz-footer"><button type="submit" class="btn primary" id="continue-button" ${selected===undefined?'disabled':''}>${currentQuestion===14?'Selesai':'Lanjutkan'}</button></div></form></div>`;
}

function result(record) {
  const s = scores(record.answers);
  return `${title('Skor kantor',monthName(record.month)+(record.demo?' · contoh':''))}
    <section class="result-score"><div class="result-score-visual">${scoreRing(s.total)}${mascot(Math.round(s.total) >= 70 ? 'proud' : 'encourage')}</div><span class="score-level">${level(s.total)}</span></section>
    <div class="category-list">${s.categories.map(c=>`<details class="category-detail"><summary>${categoryIcon(c)}<strong>${c.name}</strong><span class="category-score">${Math.round(c.score)}</span>${icon('down')}</summary><ul>${questions.filter(q=>q.category===c.id).map(q=>`<li><span>${questionCopy[q.id][0]}</span><strong>${answerLabels[record.answers[q.id]]}</strong></li>`).join('')}</ul></details>`).join('')}</div>
    <div class="result-actions">${actionLink('Lihat aksi',`perbaikan/${record.month}`)}${record.month===currentMonth()?'<a class="text-button" href="#penilaian/1">Edit jawaban</a>':''}</div><span class="fine-note">Skor simulasi, bukan sertifikasi.</span>`;
}

function actions(record) {
  const tasks = priorities(record.answers), done = tasks.filter(q=>record.completed.includes(q.id)).length;
  return `${title('Aksi kecil,<br>perubahan baik.',monthName(record.month)+(record.demo?' · contoh':''))}
    <section class="actions-progress"><div><strong>${done}/${tasks.length} selesai</strong></div>${progress(tasks.length?done/tasks.length:1,'Aksi selesai')}</section>
    <div class="action-list">${tasks.length?tasks.map(q=>{const c=categories.find(c=>c.id===q.category),checked=record.completed.includes(q.id);return `<article class="action-item ${checked?'completed':''}" data-action="${q.id}"><label class="task-toggle"><input type="checkbox" data-task="${q.id}" data-month="${record.month}" ${checked?'checked':''} aria-label="Tandai ${questionCopy[q.id][1]} selesai"><span>${icon('check')}</span></label><details class="action-detail" data-detail="${q.id}"><summary><span><strong>${questionCopy[q.id][1]}</strong><small>${c.name}</small></span>${icon('down')}</summary><p>${q.advice}</p></details></article>`;}).join(''):`<div class="empty-state">${icon('checkCircle')}<h2>Semua sudah baik!</h2><p>Pertahankan kebiasaanmu.</p></div>`}</div>
    <p class="fine-note action-note">Skor diperbarui lewat penilaian berikutnya.</p><a class="text-button" href="#hasil/${record.month}">Lihat skor kantor ${icon('arrow')}</a>`;
}

function historyPage() {
  const data = ordered().reverse();
  return `${title('Perjalanan kita',`${data.length} bulan tercatat`)}<div class="history-list">${data.map(r=>`<a class="history-row" href="#hasil/${r.month}"><span><strong>${monthName(r.month)}</strong><small>${r.demo?'Data contoh':'Penilaian kantor'}</small></span><span class="history-score">${Math.round(scores(r.answers).total)}</span>${icon('arrow')}</a>`).join('')}</div><span class="fine-note">Ketuk bulan untuk melihat hasil.</span>`;
}

const pages = { splash:'Selamat datang', dashboard:'Beranda', penilaian:'Misi bulanan', hasil:'Skor kantor', perbaikan:'Aksi', riwayat:'Riwayat' };
const nav = [['dashboard','home','Beranda'],['perbaikan','task','Aksi'],['riwayat','history','Riwayat']];
function render() {
  const [route, segment] = (location.hash.slice(1)||'splash').split('/');
  const page = Object.hasOwn(pages,route) ? route : 'dashboard';
  const quiz = page === 'penilaian';
  document.body.classList.toggle('in-quiz',quiz);
  const immersive = quiz || page === 'splash';
  $('#app-header').hidden = immersive;
  $('#navigation').hidden = immersive;
  $('#main').className = immersive ? `${page === 'splash' ? 'splash' : 'quiz'}-page` : `page ${page}-page`;
  document.title=`${pages[page]} — Greener`;
  const active=page==='perbaikan'?'perbaikan':page==='riwayat'?'riwayat':'dashboard';
  $('#navigation').innerHTML=nav.map(([route,name,label])=>`<a href="#${route}" ${active===route?'aria-current="page"':''}>${icon(name)}<span>${label}</span></a>`).join('');
  let html;
  if (page === 'splash') html = splash();
  else if (quiz) { currentQuestion=questionIndex(segment,draft);html=assessment(); }
  else if (page==='hasil'||page==='perbaikan') {
    const record=segment?records.find(r=>r.month===segment):latest();
    html=record?(page==='hasil'?result(record):actions(record)):`${title('Belum ada hasil','Mulai dari misi pertamamu.')}${actionLink('Mulai misi','penilaian')}`;
  } else html=page==='riwayat'?historyPage():home();
  $('#main').innerHTML=(storageWarning?'<p class="storage-warning" role="alert">Data belum bisa disimpan di browser ini.</p>':'')+html;
}
function goQuestion(index) {
  window.history.replaceState(null,'',`#penilaian/${index+1}`);
  render(); window.scrollTo(0,0); $('#question-title').focus({preventScroll:true});
}
function celebrate(kind) {
  $('#success-icon').innerHTML = mascot('complete');
  $('#celebration-title').textContent=kind==='new'?'Misi selesai!':'Misi diperbarui!';
  $('#celebration-score').textContent=`${Math.round(scores(latest().answers).total)}/100`;
  $('#celebration-copy').textContent=kind==='new'?'Ini skor hijau kantor kita.':'Skor hijau sudah diperbarui.';
  $('#confetti').innerHTML=Array.from({length:12},(_,i)=>`<i style="--x:${i*37%100}%;--rot:${i*43}deg;--color:${['#58cc02','#1cb0f6','#ffc800'][i%3]}"></i>`).join('');
  $('#celebration-dialog').showModal();
}
function saveAssessment() {
  if (!isComplete(draft)) { goQuestion(nextUnanswered(draft));toast('Lengkapi jawaban ini dulu.');return; }
  const month=currentMonth(),old=records.find(r=>r.month===month);
  const record={month,answers:{...draft},completed:(old?.completed||[]).filter(id=>old.answers[id]===draft[id]),demo:false};
  records=records.filter(r=>r.month!==month);records.push(record);
  const saved=write(STORE,records);write(DRAFT,{month,answers:draft});
  pendingCelebration=saved?(old?'updated':'new'):null;
  location.hash=`hasil/${month}`;
}

$('#about-button').innerHTML=icon('more');
$('#about-button').addEventListener('click',()=>$('#about-dialog').showModal());
$('#reset-button').addEventListener('click',()=>{$('#about-dialog').close();$('#reset-dialog').showModal();});
$('#reset-dialog').addEventListener('close',()=>{
  if($('#reset-dialog').returnValue!=='reset')return;
  records=seedRecords();draft={};currentQuestion=0;
  const saved=write(STORE,records);write(DRAFT,{month:currentMonth(),answers:{}});
  if(location.hash==='#dashboard')render();else location.hash='dashboard';
  if(saved)toast('Data contoh dipulihkan.');
});
$('.skip').addEventListener('click',e=>{e.preventDefault();$('#main').focus();});
window.addEventListener('hashchange',()=>{
  render();window.scrollTo(0,0);$('#main').focus({preventScroll:true});
  if(pendingCelebration){celebrate(pendingCelebration);pendingCelebration=null;}
});
document.addEventListener('pointerdown',()=>pointerInput=true);
document.addEventListener('keydown',()=>pointerInput=false);
document.addEventListener('click',e=>{
  if(e.target.closest('[data-back]')){if(currentQuestion)goQuestion(currentQuestion-1);else location.hash='dashboard';}
});
document.addEventListener('change',e=>{
  const input=e.target;
  if(input.matches('#assessment-form input[type="radio"]')) {
    draft[input.name]=Number(input.value);write(DRAFT,{month:currentMonth(),answers:draft});
    $('#continue-button').disabled=false;$('#form-error').textContent='';
    const count=questions.filter(q=>draft[q.id]!==undefined).length,track=$('.quiz-toolbar .progress-track');
    track.querySelector('i').style.transform=`scaleX(${count/15})`;track.setAttribute('aria-valuenow',Math.round(count/15*100));
    if(pointerInput){input.closest('label').classList.remove('choice-pop');void input.offsetWidth;input.closest('label').classList.add('choice-pop');}
  }
  if(input.matches('[data-task]')) {
    const record=records.find(r=>r.month===input.dataset.month);if(!record)return;
    const expanded=[...document.querySelectorAll('.action-detail[open]')].map(el=>el.dataset.detail);
    record.completed=record.completed.filter(id=>id!==input.dataset.task);if(input.checked)record.completed.push(input.dataset.task);
    const checked=input.checked,saved=write(STORE,records);render();
    for(const id of expanded)document.querySelector(`[data-detail="${id}"]`)?.setAttribute('open','');
    const replacement=document.querySelector(`[data-task="${input.dataset.task}"]`);replacement?.focus({preventScroll:true});
    if (saved) toast(checked ? 'Aksi baik tercatat!' : 'Status aksi diperbarui.', checked ? 'action' : undefined);
    if(checked&&pointerInput)replacement?.closest('.action-item').classList.add('success-pop');
  }
});
document.addEventListener('submit',e=>{
  if(e.target.id!=='assessment-form')return;e.preventDefault();
  const q=questions[currentQuestion];
  if(draft[q.id]===undefined){$('#form-error').textContent='Pilih satu jawaban dulu.';$('#assessment-form input').focus();return;}
  if(currentQuestion<14)goQuestion(currentQuestion+1);else saveAssessment();
});
render();
