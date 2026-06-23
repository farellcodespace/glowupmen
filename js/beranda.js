/* =========================================================
   GlowUp Men — beranda.js  (Dashboard home, DEFAULT page)
   Greeting + stat widgets (data nyata) + grid 7 modul + shortcut draft.
   (loaded after core.js; memakai util/state global dari core & modul lain)
========================================================= */
const BD_MODULES=[
  {p:'latihan',   ic:'latihan',   n:'Latihan'},
  {p:'gizi',      ic:'gizi',      n:'Gizi & Berat'},
  {p:'glowup',    ic:'glowup',    n:'Glow Up'},
  {p:'jurnal',    ic:'jurnal',    n:'Jurnal'},
  {p:'keuangan',  ic:'keuangan',  n:'Keuangan'},
  {p:'pengaturan',ic:'pengaturan',n:'Pengaturan'},
];
// streak minggu-beruntun (sama logika dgn renderStreak di latihan.js)
function bdStreak(){
  const counts={};
  sessions.forEach(s=>{const k=fmtKey(mondayOf(parseKey(s.date)));counts[k]=(counts[k]||0)+1;});
  const todayMon=mondayOf(new Date());
  let streak=0; const cur=new Date(todayMon);
  if(!counts[fmtKey(cur)])cur.setDate(cur.getDate()-7);
  while(counts[fmtKey(cur)]){streak++;cur.setDate(cur.getDate()-7);}
  return streak;
}
function bdLatestWeight(){
  if(!weights.length)return START_W;
  const sorted=[...weights].sort((a,b)=>a.date<b.date?-1:1);
  return sorted[sorted.length-1].weight;
}
function bdHabitsToday(){
  const all=(typeof habitData==='function')?habitData():LS.get('gum_habits',{});
  const day=all[todayStr()]||{};
  const total=(typeof HABITS!=='undefined')?HABITS.length:0;
  const done=(typeof HABITS!=='undefined')?HABITS.filter(h=>day[h.id]).length:Object.keys(day).length;
  return {done,total};
}
function bdGreeting(){
  const h=new Date().getHours();
  if(h<11)return'Selamat pagi';
  if(h<15)return'Selamat siang';
  if(h<19)return'Selamat sore';
  return'Selamat malam';
}
function renderBeranda(){
  const el=document.getElementById('page-beranda'); if(!el)return;
  const now=new Date();
  const dateStr=DAY_ID[now.getDay()]+', '+now.getDate()+' '+MON[now.getMonth()]+' '+now.getFullYear();
  const streak=bdStreak();
  const w=bdLatestWeight();
  const hb=bdHabitsToday();
  const draft=drafts[todayStr()];
  const stat=(ic,v,l,extra)=>`<div class="bd-stat ${extra||''}">
    <span class="bs-ic">${svg(ic,18)}</span>
    <div class="bs-v">${v}</div><div class="bs-l">${l}</div></div>`;
  let html=`<div class="bd-greet">
    <div class="bd-hi">${bdGreeting()} 👋</div>
    <div class="bd-date">${dateStr}</div>
  </div>`;
  if(draft){
    html+=`<button class="bd-draft" onclick="openModal(todayStr())">
      <span class="bd-ic">${svg('edit',20)}</span>
      <span class="bd-tt"><b>Lanjutkan draft latihan</b><span>Ada catatan latihan hari ini yang belum disimpan</span></span>
      <span class="bd-go">→</span>
    </button>`;
  }
  html+=`<div class="bd-stats">
    ${stat('flame',streak,'minggu beruntun')}
    ${stat('scale',w+'<small> kg</small>','target '+TARGET_W+' kg')}
    ${stat('check',hb.done+'<small>/'+hb.total+'</small>','kebiasaan hari ini')}
    ${stat('smile','Mood <span class="bd-tag-soon">segera</span>','Jurnal','soon')}
  </div>`;
  html+=`<div class="bd-stats" style="margin-top:-8px;">
    ${stat('banknote','Budget <span class="bd-tag-soon">segera</span>','Keuangan','soon')}
  </div>`;
  html+=`<div class="section-title">Modul</div>
  <div class="bd-modgrid">
    ${BD_MODULES.map(m=>`<button class="bd-mod" onclick="go('${m.p}')">
      <span class="bm-ic">${svg(m.ic,22)}</span><span class="bm-n">${m.n}</span>
    </button>`).join('')}
  </div>`;
  el.innerHTML=html;
}
