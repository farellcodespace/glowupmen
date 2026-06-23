/* =========================================================
   GlowUp Men — latihan.js
   Jadwal (hero/streak/schedule), Panduan (guide + plate calc),
   Kalender + day detail, Progres/Overload, Volume, Ukuran,
   Modal Catat Latihan + Rest Timer.
   (loaded after core.js)
========================================================= */

/* =========================================================
   JADWAL
========================================================= */
const WEEK_GOAL=5; // 5 hari latihan per minggu (Sen, Sel, Kam, Jum, Sab)
function mondayOf(d){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());const off=(x.getDay()+6)%7;x.setDate(x.getDate()-off);return x;}
function renderStreak(){
  const el=document.getElementById('streakCard'); if(!el)return;
  const counts={};
  sessions.forEach(s=>{const k=fmtKey(mondayOf(parseKey(s.date)));counts[k]=(counts[k]||0)+1;});
  const todayMon=mondayOf(new Date()), thisKey=fmtKey(todayMon);
  const thisWeek=counts[thisKey]||0;
  // streak: minggu beruntun dgn ≥1 sesi (minggu berjalan diberi kelonggaran)
  let streak=0; const cur=new Date(todayMon);
  if(!counts[fmtKey(cur)])cur.setDate(cur.getDate()-7);
  while(counts[fmtKey(cur)]){streak++;cur.setDate(cur.getDate()-7);}
  // 6 minggu terakhir
  const weeks=[]; const w=new Date(todayMon);
  for(let i=0;i<6;i++){const k=fmtKey(w);weeks.unshift({k,n:counts[k]||0,cur:k===thisKey});w.setDate(w.getDate()-7);}
  const pct=Math.min(100,Math.round(thisWeek/WEEK_GOAL*100));
  el.innerHTML=`<div class="card">
    <div class="streak-top">
      <div class="streak-flame"><div class="num" style="display:flex;align-items:center;justify-content:center;gap:5px;">${svg('flame',24)}${streak}</div><div class="lbl">minggu beruntun</div></div>
      <div class="streak-week">
        <div class="label">Sesi minggu ini</div>
        <div class="wk-val"><b>${thisWeek}</b> / ${WEEK_GOAL} <small>· total ${sessions.length} sesi</small></div>
        <div class="pbar"><i style="width:${pct}%"></i></div>
      </div>
    </div>
    <div class="micro" style="margin:14px 0 7px;">6 minggu terakhir</div>
    <div class="streak-weeks">
      ${weeks.map(wk=>`<div class="wk ${wk.n>=WEEK_GOAL?'full':wk.n>0?'has':''}" title="Minggu ${fmtShort(wk.k)}${wk.cur?' (ini)':''}">${wk.n}</div>`).join('')}
    </div>
  </div>`;
}
function renderHero(){
  const el=document.getElementById('heroToday'); if(!el)return;
  const now=new Date(), w=now.getDay(), type=SCHEDULE[w];
  const dateStr=DAY_ID[w]+', '+now.getDate()+' '+MON[now.getMonth()];
  if(type==='rest'){
    el.innerHTML=`<div class="hero hero-rest">
      <div class="hero-eyebrow">Hari ini · ${dateStr}</div>
      <div class="hero-title">Rest Day</div>
      <div class="hero-sub">Recovery — otot tumbuh saat istirahat. Tidur cukup &amp; cukupi protein.</div>
    </div>`;
    return;
  }
  const T=TYPES[type], n=WORKOUTS[type].length;
  el.innerHTML=`<div class="hero">
    <div class="hero-eyebrow">Hari ini · ${dateStr}</div>
    <div class="hero-title">${T.label}</div>
    <div class="hero-sub">${T.focus} · ${n} gerakan</div>
    <button class="hero-btn" onclick="openModal(todayStr(),'${type}')">Catat latihan →</button>
  </div>`;
}
function renderSchedule(){
  const todayW=new Date().getDay();
  let html='';
  [1,2,3,4,5,6,0].forEach(w=>{
    const type=SCHEDULE[w];
    const isToday=w===todayW;
    if(type==='rest'){
      html+=`<div class="daycard ${isToday?'today':''}">
        <div class="daycard-head" style="cursor:default;">
          <span class="accent-bar"></span>
          <div style="flex:1;"><div class="dayname">${DAY_ID[w]}</div><div class="daytype" style="display:flex;align-items:center;gap:7px;">${svg('moon',17)}Rest Day</div><div class="dayfocus">Recovery — istirahat penuh</div></div>
          ${isToday?'<span class="todaypill">Hari ini</span>':''}
        </div></div>`;
      return;
    }
    const T=TYPES[type];
    const exs=WORKOUTS[type];
    html+=`<div class="daycard ${T.tcls} ${isToday?'today':''}" data-day="${w}">
      <button class="daycard-head" onclick="this.parentElement.classList.toggle('open')">
        <span class="accent-bar"></span>
        <div style="flex:1;min-width:0;">
          <div class="dayname">${DAY_ID[w]}${isToday?' · <span style="color:var(--accent-ink)">Hari ini</span>':''}</div>
          <div class="daytype">${T.label}</div>
          <div class="dayfocus">${T.focus} · ${exs.length} gerakan</div>
        </div>
        <span class="chev">▼</span>
      </button>
      <div class="daycard-body">
        <div class="day-legend">RIR 1–2 untuk semua set · Warmup = 50% beban kerja</div>
        ${exs.map((e,i)=>`<div class="exline">
          <span class="num">${i+1}</span>
          <div><div class="ex-n">${e.n}${e.u?' <span style="color:var(--orange)">↔</span>':''}</div><div class="ex-m">${e.m} · ${e.eq}</div>${e.rec?`<span class="rec-pill">${e.rec}</span>`:''}</div>
        </div>`).join('')}
      </div>
    </div>`;
  });
  document.getElementById('scheduleList').innerHTML=html;
  const open=document.querySelector('.daycard.today[data-day]');
  if(open)open.classList.add('open');
}

/* =========================================================
   PANDUAN
========================================================= */
let guideType='upper';
const GUIDE_ORDER=['upper','lower','push','pull','legs'];
function renderGuideTabs(){
  document.getElementById('guideTabs').innerHTML=GUIDE_ORDER.map(k=>
    `<button class="subtab ${k===guideType?'active':''}" data-gt="${k}">${TYPES[k].label}</button>`).join('');
  document.querySelectorAll('#guideTabs .subtab').forEach(b=>b.addEventListener('click',()=>{guideType=b.dataset.gt;renderGuideTabs();renderGuide();}));
}
function renderGuide(){
  const exs=WORKOUTS[guideType];
  document.getElementById('guideContent').innerHTML=exs.map((e,i)=>`
    <div class="acc">
      <button class="acc-head" onclick="this.parentElement.classList.toggle('open')">
        <span class="num">${i+1}</span>
        <div style="flex:1;min-width:0;"><div class="at">${e.n}</div><div class="am">${e.m} · ${e.eq}</div></div>
        <span class="chev">▼</span>
      </button>
      <div class="acc-body">
        <div class="acc-meta">
          <span class="meta-chip" style="display:inline-flex;align-items:center;gap:5px;">${svg('target',13)}${e.m}</span>
          <span class="meta-chip" style="display:inline-flex;align-items:center;gap:5px;">${svg('dumbbell',13)}${e.eq}</span>
          <span class="meta-chip">${e.c?'Compound':'Isolation'}</span>
        </div>
        ${e.u?`<div class="uni-tag">↔ ${uni}</div>`:''}
        <div class="guide-block"><h5 style="display:flex;align-items:center;gap:6px;">${svg('clipboard',13)}Cara melakukan</h5><p>${e.how}</p></div>
        <div class="guide-block"><h5 style="display:flex;align-items:center;gap:6px;">${svg('bulb',13)}Tips kunci</h5><p>${e.tip}</p></div>
        <div class="guide-block why"><h5 style="display:flex;align-items:center;gap:6px;">${svg('beaker',13)}Kenapa efektif</h5><p>${e.why}</p></div>
      </div>
    </div>`).join('');
}

/* ============ KALKULATOR PLAT ============ */
const PLATES=[20,15,10,5,2.5,1.25];
function calcPlates(){
  const out=document.getElementById('plResult'); if(!out)return;
  const total=parseFloat(document.getElementById('plTotal').value);
  const bar=+document.getElementById('plBar').value;
  if(!total){ out.textContent='Masukkan total beban di atas.'; return; }
  if(total<bar){ out.innerHTML=`<span style="color:var(--orange);">Total kurang dari berat bar (${bar}kg).</span>`; return; }
  let rem=+((total-bar)/2).toFixed(3); const perSide=rem, parts=[];
  PLATES.forEach(p=>{ const n=Math.floor(rem/p+1e-9); if(n>0){ parts.push(n+' × '+p+'kg'); rem=+(rem-n*p).toFixed(3); } });
  let html=`<b>Per sisi (${perSide}kg):</b> `+(parts.length?parts.join(' + '):'kosong / hanya bar');
  if(rem>0.01)html+=`<br><span style="color:var(--orange);">sisa ${+rem.toFixed(2)}kg tak bisa dipasang dengan plat standar</span>`;
  out.innerHTML=html;
}
['plTotal','plBar'].forEach(id=>{const el=document.getElementById(id); if(el)el.addEventListener('input',calcPlates);});

/* =========================================================
   LATIHAN — submenu tabs
   (Jadwal · Catat/Kalender · Progres · Volume · Ukuran · Panduan)
========================================================= */
const LATIHAN_TABS=['sched','cal','overload','volume','measures','panduan'];
function showLatihanTab(tt){
  document.querySelectorAll('#latihanTabs .tab').forEach(x=>x.classList.toggle('active',x.dataset.tt===tt));
  LATIHAN_TABS.forEach(t=>{const el=document.getElementById('lt-'+t); if(el)el.style.display=t===tt?'':'none';});
  if(tt==='cal'){renderCalendar();renderDayDetail();}
  if(tt==='overload')renderOverload();
  if(tt==='volume')renderVolume();
  if(tt==='measures')renderMeasures();
}
document.querySelectorAll('#latihanTabs .tab').forEach(b=>b.addEventListener('click',()=>showLatihanTab(b.dataset.tt)));

/* ---- Calendar ---- */
const MONTHS=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
function sessionsOn(key){return sessions.filter(s=>s.date===key);}
function renderCalendar(){
  const y=calRef.getFullYear(), m=calRef.getMonth();
  document.getElementById('calMonth').textContent=MONTHS[m]+' '+y;
  const first=new Date(y,m,1).getDay();
  const days=new Date(y,m+1,0).getDate();
  let html=['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map(d=>`<div class="cal-dow">${d}</div>`).join('');
  for(let i=0;i<first;i++)html+=`<div class="cal-cell pad"></div>`;
  for(let d=1;d<=days;d++){
    const key=fmtKey(new Date(y,m,d)), w=new Date(y,m,d).getDay();
    const train=SCHEDULE[w]!=='rest';
    const has=sessionsOn(key).length>0;
    let c='cal-cell';
    if(train)c+=' train';
    if(key===todayStr())c+=' today';
    if(key===selDate)c+=' sel';
    html+=`<div class="${c}" onclick="selectDay('${key}')">${d}${has?'<span class="dot"></span>':''}</div>`;
  }
  document.getElementById('calGrid').innerHTML=html;
}
function selectDay(key){selDate=key;renderCalendar();renderDayDetail();}
function renderDayDetail(){
  const el=document.getElementById('dayDetail');
  if(!selDate){el.innerHTML='';return;}
  const w=parseKey(selDate).getDay();
  const sched=SCHEDULE[w];
  const logged=sessionsOn(selDate);
  let html=`<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:10px;flex-wrap:wrap;">
    <div><div class="label">${selDate===todayStr()?'Hari ini':'Tanggal dipilih'}</div><div style="font-size:15px;font-weight:600;">${fmtNice(selDate)}</div></div>`;
  html += sched!=='rest' ? `<span class="badge ${TYPES[sched].cls}">${TYPES[sched].label}</span>` : `<span class="badge b-rest">${svg('moon',12)}Rest</span>`;
  html+=`</div>`;

  if(logged.length){
    logged.forEach(s=>{
      const T=TYPES[s.type];
      html+=`<div style="margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--border);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span class="badge ${T.cls}">${T.label}</span>
          <div style="display:flex;gap:14px;">
            <button class="micro" style="color:var(--accent-ink);font-weight:600;" onclick="openEdit('${s.id}')">Edit</button>
            <button class="micro" style="color:var(--red);font-weight:600;" onclick="delSession('${s.id}')">Hapus</button>
          </div>
        </div>`;
      s.exercises.forEach(ex=>{
        const pr=isPR(ex,s.date,s.id)?` <span class="ic" title="Rekor berat baru" style="color:var(--accent-ink);vertical-align:-2px;">${svg('trophy',14)}</span>`:'';
        html+=`<div class="logged-ex"><div class="len">${esc(ex.name)}${exUnilateral(ex.name)?'<span class="micro" style="color:var(--faint);font-weight:500;margin-left:6px;">· per sisi</span>':''}${pr}</div><div class="setline">
          ${ex.sets.map(st=>`<span class="setchip ${st.label==='WU'?'wu':''}"><b>${esc(st.label)}</b> ${esc(st.reps)||'–'}×${esc(st.weight)||'–'}${st.weight?'kg':''}</span>`).join('')}
        </div></div>`;
      });
      if(s.notes)html+=`<div class="micro" style="margin-top:8px;background:var(--surface-2);padding:9px 11px;border-radius:9px;"><span class="ic" style="vertical-align:-2px;margin-right:5px;">${svg('edit',13)}</span>${esc(s.notes)}</div>`;
      html+=`</div>`;
    });
  } else {
    html+=`<div class="empty" style="padding:24px 10px;">
      <span class="em-ico" style="display:inline-flex;justify-content:center;color:var(--faint);">${sched==='rest'?svg('moon',40):svg('edit',40)}</span>
      <div class="em-title">${sched==='rest'?'Hari istirahat':'Belum ada catatan'}</div>
      <div class="em-sub">${sched==='rest'?'Nikmati recovery-mu. Tetap bisa catat sesi kalau kamu latihan.':'Catat latihanmu hari ini untuk lacak progressive overload.'}</div>
    </div>`;
    if(sched!=='rest')html+=`<button class="btn btn-primary btn-block" onclick="openModal('${selDate}','${sched}')">+ Catat latihan</button>`;
  }
  html+=`</div>`;
  el.innerHTML=html;
}
function delSession(id){
  if(!confirm('Hapus catatan sesi ini?'))return;
  sessions=sessions.filter(s=>s.id!==id);LS.set('gum_sessions',sessions);
  renderCalendar();renderDayDetail();renderStreak();
}
document.getElementById('calPrev').onclick=()=>{calRef=new Date(calRef.getFullYear(),calRef.getMonth()-1,1);renderCalendar();};
document.getElementById('calNext').onclick=()=>{calRef=new Date(calRef.getFullYear(),calRef.getMonth()+1,1);renderCalendar();};
document.getElementById('calToday').onclick=()=>{calRef=new Date();selectDay(todayStr());};

/* ---- Progressive overload helpers + PR detection ---- */
/* ---- Progressive overload ---- */
function exCompound(name){
  for(const t in WORKOUTS){const f=WORKOUTS[t].find(e=>e.n===name);if(f)return f.c;}
  return false;
}
function getSW(name){
  for(const t in WORKOUTS){const f=WORKOUTS[t].find(e=>e.n===name);if(f&&f.sw!=null)return f.sw;}
  return 0;
}
function exUnilateral(name){
  for(const t in WORKOUTS){const f=WORKOUTS[t].find(e=>e.n===name);if(f)return !!f.u;}
  return false;
}
function getRec(name){ // teks rekomendasi (mis. "1 warmup + 3×8–10 rep") dari definisi exercise
  for(const t in WORKOUTS){const f=WORKOUTS[t].find(e=>e.n===name);if(f&&f.rec)return f.rec;}
  return null;
}
// Parse target working set & rentang rep dari teks rec. Bagian "warmup" diabaikan.
// "3×8–10 rep" → {targetSets:3,repMin:8,repMax:10}; "3×10 rep" → {3,10,10}. null bila tak terbaca.
function parseRec(rec){
  if(!rec)return null;
  const m=rec.match(/(\d+)\s*[×x]\s*(\d+)\s*(?:[–-]\s*(\d+))?/);
  if(!m)return null;
  const sets=+m[1], repMin=+m[2], repMax=m[3]?+m[3]:+m[2];
  return {targetSets:sets,repMin,repMax};
}
function maxWork(ex){
  let max=0;ex.sets.forEach(s=>{if(s.label!=='WU'&&+s.weight>max)max=+s.weight;});return max;
}
// rekor berat terberat untuk `name` dari sesi BERTANGGAL LEBIH AWAL (null = belum ada rekor sebelumnya)
function prevBestWeight(name,beforeDate,excludeId){
  let best=0,seen=false;
  sessions.forEach(s=>{
    if(s.id===excludeId)return;
    if(!(s.date<beforeDate))return;
    s.exercises.forEach(ex=>{ if(ex.name===name){ const m=maxWork(ex); if(m>0){seen=true; if(m>best)best=m;} } });
  });
  return seen?best:null;
}
// apakah gerakan ini PR pada tanggalnya (mengalahkan rekor sebelumnya — bukan pertama kali)
function isPR(ex,date,sid){
  const cur=maxWork(ex); if(cur<=0)return false;
  const prev=prevBestWeight(ex.name,date,sid);
  return prev!=null && cur>prev;
}

function renderOverload(){
  const map={};
  const sorted=[...sessions].sort((a,b)=>a.date<b.date?-1:1);
  sorted.forEach(s=>s.exercises.forEach(ex=>{
    if(!ex.sets.some(st=>st.weight))return;
    (map[ex.name]=map[ex.name]||[]).push({date:s.date,ex});
  }));
  const names=Object.keys(map);
  const list=document.getElementById('overloadList');
  if(!names.length){
    list.innerHTML=`<div class="empty"><span class="em-ico" style="display:inline-flex;justify-content:center;color:var(--faint);">${svg('trend',40)}</span><div class="em-title">Belum ada data overload</div><div class="em-sub">Catat beberapa sesi latihan di tab Kalender. Saran kenaikan beban muncul otomatis di sini.</div></div>`;
    return;
  }
  list.innerHTML=names.map(name=>{
    const hist=map[name];
    const last=hist[hist.length-1].ex;
    const comp=exCompound(name);
    const inc=comp?2.5:1.5;
    const setSum=last.sets.filter(s=>s.label!=='WU').map(s=>`${esc(s.label)}: ${esc(s.reps)||'–'}×${esc(s.weight)||'–'}kg`).join(' · ');
    const topNow=maxWork(last);
    // double progression: rep dulu sampai puncak rentang, baru naik beban
    const sugg=overloadHintFor(name) || (topNow?`Naik bertahap +${inc}kg saat semua set tembus rep atas`:'Catat reps & beban dulu');
    const pills=hist.slice(-5).map((h,i,arr)=>`<span class="histpill ${i===arr.length-1?'last':''}">${maxWork(h.ex)||'–'}kg</span>`).join('');
    return `<div class="ol-card">
      <div class="oh"><div class="on">${esc(name)}${exUnilateral(name)?'<span class="micro" style="color:var(--faint);font-weight:500;margin-left:6px;">· per sisi</span>':''}</div><span class="badge ${comp?'b-pull':'b-push'}">${comp?'Compound':'Isolasi'}</span></div>
      <div class="micro">Sesi terakhir · ${fmtShort(hist[hist.length-1].date)}</div>
      <div style="font-size:13px;margin-top:4px;">${setSum||'–'}</div>
      <div class="ol-suggest"><span class="ic">${svg('arrowUp',16)}</span> ${esc(sugg)}</div>
      <div class="pillrow"><span class="micro" style="margin-right:2px;">Tren:</span>${pills}</div>
    </div>`;
  }).join('');
}

/* ---- Volume per otot (set kerja per minggu) ---- */
const MEV=9; // minimum effective volume — 9+ set/minggu cukup untuk pertumbuhan maksimal pemula
const VOL_GROUPS=[
  {key:'dada',     label:'Dada',          ex:["Iso-Lateral Chest Press","Incline Dumbbell Press","Pec Deck","Smith Machine Bench Press"]},
  {key:'punggung', label:'Punggung',      ex:["Lat Pulldown","Lat Pulldown Wide Grip","Seated Cable Row","Seated Cable Row (Close Grip)","Cable Pullover"]},
  {key:'bahu',     label:'Bahu',          ex:["Shoulder Press Machine (Plates)","Single Arm Cable Lateral Raise","Facepull"]},
  {key:'biceps',   label:'Biceps',        ex:["Behind the Back Dumbbell Curl","Bayesian Curl","Cable Hammer Curl"]},
  {key:'triceps',  label:'Triceps',       ex:["Overhead Cable Triceps Extension","Triceps Pushdown"]},
  {key:'forearm',  label:'Lengan Bawah',  ex:["Cable Wrist Curl","Reverse Cable Curl","Sam Sulek Curl"]},
  {key:'quads',    label:'Paha Depan',    ex:["Hack Squat","Leg Press Lying (kaki rendah)"]},
  {key:'hamstring',label:'Hamstring',     ex:["Lying Leg Curl"]},
  {key:'glutes',   label:'Glutes/Pinggul',ex:["Hip Abductor Machine (open)","Hip Adductor Machine (close)"]},
  {key:'betis',    label:'Betis',         ex:["Standing Calf Raise (Leg Press Berdiri)"]},
  {key:'core',     label:'Perut/Core',    ex:["Weighted Sit Up","Rotary Torso Machine"]},
];
const EX_GROUP={}; VOL_GROUPS.forEach(g=>g.ex.forEach(n=>EX_GROUP[n]=g.key));
function renderVolume(){
  const host=document.getElementById('volumeList'); if(!host)return;
  const monKey=fmtKey(mondayOf(new Date()));
  const counts={}; let other=0, totalSets=0;
  sessions.forEach(s=>{
    if(fmtKey(mondayOf(parseKey(s.date)))!==monKey)return; // hanya minggu berjalan
    s.exercises.forEach(ex=>{
      const work=ex.sets.filter(st=>st.label!=='WU').length; // set kerja saja, warmup tidak dihitung
      if(!work)return;
      totalSets+=work;
      const g=EX_GROUP[ex.name];
      if(g)counts[g]=(counts[g]||0)+work; else other+=work; // gerakan custom → "Lainnya"
    });
  });
  const mon=mondayOf(new Date()), sun=new Date(mon); sun.setDate(sun.getDate()+6);
  const range=mon.getDate()+' '+MON[mon.getMonth()]+' – '+sun.getDate()+' '+MON[sun.getMonth()];
  const hit=VOL_GROUPS.filter(g=>(counts[g.key]||0)>=MEV).length;
  const rows=VOL_GROUPS.map(g=>{
    const c=counts[g.key]||0, done=c>=MEV, pct=Math.min(100,Math.round(c/MEV*100));
    const cColor=c===0?'var(--faint)':done?'var(--green)':'var(--accent-ink)';
    const barStyle=done?'background:var(--green);':'';
    return `<div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
        <span style="font-size:13px;font-weight:500;">${g.label}</span>
        <span style="font-size:12px;font-weight:600;color:${cColor};display:inline-flex;align-items:center;gap:3px;">${c} / ${MEV} set${done?`<span class="ic" style="color:var(--green);">${svg('check',13)}</span>`:''}</span>
      </div>
      <div class="pbar"><i style="width:${pct}%;${barStyle}"></i></div>
    </div>`;
  }).join('');
  host.innerHTML=`<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:10px;">
      <div class="section-title" style="margin:0;">${svg('dumbbell',18)}Set per otot</div>
      <span class="micro" style="display:inline-flex;align-items:center;gap:3px;"><b style="color:var(--green);">${hit}</b>/${VOL_GROUPS.length} grup <span class="ic" style="color:var(--green);">${svg('check',13)}</span></span>
    </div>
    <div class="micro" style="margin:2px 0 16px;">Minggu ini · ${range} · ${totalSets} set kerja</div>
    ${rows}
    ${other?`<div class="micro" style="margin-top:4px;">+ ${other} set gerakan lain (di luar program)</div>`:''}
  </div>`;
}

/* ---- Ukuran tubuh ---- */
/* ---- Ukuran tubuh ---- */
const MEAS_PARTS=[{k:'lengan',label:'Lengan'},{k:'dada',label:'Dada'},{k:'pinggang',label:'Pinggang'},{k:'paha',label:'Paha'}];
function drawSpark(cv,vals){
  const w=cv.clientWidth||64, h=cv.clientHeight||24, dpr=window.devicePixelRatio||1;
  cv.width=w*dpr; cv.height=h*dpr;
  const ctx=cv.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
  if(vals.length<2)return;
  const col=(getComputedStyle(document.documentElement).getPropertyValue('--accent')||'#2F6BFF').trim();
  let mn=Math.min(...vals), mx=Math.max(...vals); if(mx===mn){mx+=1;mn-=1;}
  const pad=3, X=i=>pad+(w-2*pad)*i/(vals.length-1), Y=v=>pad+(h-2*pad)*(1-(v-mn)/(mx-mn));
  ctx.strokeStyle=col; ctx.lineWidth=1.5; ctx.lineJoin='round'; ctx.beginPath();
  vals.forEach((v,i)=>{const x=X(i),y=Y(v); i?ctx.lineTo(x,y):ctx.moveTo(x,y);}); ctx.stroke();
  ctx.beginPath(); ctx.arc(X(vals.length-1),Y(vals[vals.length-1]),2,0,Math.PI*2); ctx.fillStyle=col; ctx.fill();
}
function renderMeasures(){
  const statsEl=document.getElementById('measStats'); if(!statsEl)return;
  const sorted=[...measures].sort((a,b)=>a.date<b.date?-1:1);
  statsEl.innerHTML=`<div class="card"><div class="section-title" style="margin-top:0;">${svg('ruler',18)}Ukuran tubuh</div>`+
    MEAS_PARTS.map(p=>{
      const vals=sorted.map(m=>m[p.k]).filter(v=>v!=null&&v!=='').map(Number);
      const latest=vals.length?vals[vals.length-1]:null, first=vals.length?vals[0]:null;
      const d=(latest!=null&&first!=null)?+(latest-first).toFixed(1):null;
      const delta=d==null?'':d>0?`<span class="up">▲ ${d}</span>`:d<0?`<span class="down">▼ ${Math.abs(d)}</span>`:'<span class="micro">–</span>';
      return `<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-top:1px solid var(--border);">
        <span style="flex:1;font-size:13px;font-weight:500;">${p.label}</span>
        <canvas data-spark="${p.k}" style="width:64px;height:24px;"></canvas>
        <span style="font-size:14px;font-weight:600;min-width:64px;text-align:right;">${latest!=null?latest+' <small style="font-size:11px;color:var(--muted);font-weight:500;">cm</small>':'<span style="color:var(--faint)">–</span>'}</span>
        <span style="min-width:48px;text-align:right;font-size:12px;font-weight:600;">${delta}</span>
      </div>`;
    }).join('')+`</div>`;
  MEAS_PARTS.forEach(p=>{
    const cv=statsEl.querySelector(`canvas[data-spark="${p.k}"]`); if(!cv)return;
    drawSpark(cv,sorted.map(m=>m[p.k]).filter(v=>v!=null&&v!=='').map(Number));
  });
  const wrap=document.getElementById('meHistory');
  if(!sorted.length){
    wrap.innerHTML=`<div class="empty" style="padding:24px 10px;"><span class="em-ico" style="display:inline-flex;justify-content:center;color:var(--faint);">${svg('ruler',40)}</span><div class="em-title">Belum ada ukuran</div><div class="em-sub">Catat lingkar tubuh tiap 2–4 minggu untuk lihat progres bulking.</div></div>`;
    return;
  }
  let rows='';
  for(let i=sorted.length-1;i>=0;i--){const m=sorted[i];
    rows+=`<tr><td>${fmtShort(m.date)}</td>`+MEAS_PARTS.map(p=>`<td>${m[p.k]!=null&&m[p.k]!==''?m[p.k]:'–'}</td>`).join('')+`<td style="text-align:right;"><button class="micro" style="color:var(--red);" onclick="delMeasure('${m.date}')">✕</button></td></tr>`;
  }
  wrap.innerHTML=`<table class="htable"><thead><tr><th>Tgl</th>${MEAS_PARTS.map(p=>`<th>${p.label}</th>`).join('')}<th></th></tr></thead><tbody>${rows}</tbody></table>`;
}
function delMeasure(date){ if(!confirm('Hapus ukuran tanggal ini?'))return; measures=measures.filter(m=>m.date!==date); LS.set('gum_measures',measures); renderMeasures(); }
document.getElementById('meSave').onclick=()=>{
  const date=document.getElementById('meDate').value;
  if(!date){alert('Pilih tanggal dulu ya.');return;}
  const rec={date}; let any=false;
  MEAS_PARTS.forEach(p=>{const v=parseFloat(document.getElementById('me_'+p.k).value); if(!isNaN(v)){rec[p.k]=+v.toFixed(1);any=true;}});
  if(!any){alert('Isi minimal satu ukuran dulu ya.');return;}
  measures=measures.filter(m=>m.date!==date); measures.push(rec); measures.sort((a,b)=>a.date<b.date?-1:1);
  LS.set('gum_measures',measures);
  MEAS_PARTS.forEach(p=>document.getElementById('me_'+p.k).value='');
  renderMeasures();
};

/* =========================================================
   SESSION MODAL
========================================================= */
const modal=document.getElementById('modal');
function setRowHTML(label,reps,weight,wph,rph){
  const wu=label==='WU';
  const ph=wph!=null?wph:'kg';
  const rPh=rph!=null&&rph!==''?rph:'reps'; // saran reps dari sesi lalu → tampil sbg placeholder abu samar
  return `<div class="setrow">
    <div class="sb ${wu?'wu':'ws'}">${label}</div>
    <input class="mini r" type="number" inputmode="numeric" placeholder="${esc(rPh)}" value="${reps||''}">
    <input class="mini w" type="number" inputmode="decimal" placeholder="${esc(ph)}" value="${weight||''}">
    <button class="delset" onclick="delRow(this)">✕</button>
  </div>`;
}
function restFor(name){ // saran istirahat berbasis tipe gerakan
  return exCompound(name) ? {label:'2–3 menit',sec:180} : {label:'60–90 detik',sec:90};
}
// Rekomendasi overload (double progression murni) berdasar sesi terakhir gerakan ini.
// Kembalikan teks saran, atau null bila tak ada data / tak ada target rec.
function overloadHintFor(name){
  const rec=parseRec(getRec(name)); if(!rec)return null;       // gerakan custom tanpa target → lewati
  const last=lastSessionFor(name); if(!last)return null;
  const work=last.sets.filter(s=>s.label!=='WU'&&s.reps&&s.weight).map(s=>({reps:+s.reps,weight:+s.weight}));
  if(!work.length)return null;
  const inc=exCompound(name)?2.5:1.5;
  if(work.length<rec.targetSets){
    const top=Math.max(...work.map(w=>w.weight));
    return `Sesi lalu ${work.length}/${rec.targetSets} set @${top}kg — lengkapi dulu sebelum naik beban`;
  }
  const top=Math.max(...work.map(w=>w.weight));
  const atTop=work.filter(w=>w.weight===top);
  const minRep=Math.min(...atTop.map(w=>w.reps));
  if(atTop.length>=rec.targetSets&&minRep>=rec.repMax){
    return `Sesi lalu ${rec.targetSets}×${rec.repMax}+ rep @${top}kg — coba naik ke ${(top+inc).toFixed(1).replace(/\.0$/,'')}kg`;
  }
  return `Sesi lalu @${top}kg — kejar ${rec.repMax} rep tiap set di beban ini sebelum naik`;
}
function exBlockHTML(name,sets,hint){
  const r=restFor(name);
  const sw=getSW(name);
  const wuPh=sw>0?String(Math.round(sw*0.5/2.5)*2.5):'kg';
  const wkPh=sw>0?String(sw):'kg';
  const ov = !editingId ? overloadHintFor(name) : null;
  return `<div class="exblock" data-name="${esc(name)}">
    <div class="exblock-head"><span class="drag-handle" title="Tahan & geser untuk atur urutan" aria-label="Atur urutan">${svg('menu',16)}</span><span class="en">${esc(name)}</span><span class="ex-prog"></span><button class="rm" onclick="this.closest('.exblock').remove();renderOrderFromDom();updateProgress();draftDirty()" aria-label="Hapus gerakan" style="display:inline-flex;align-items:center;">${svg('trash',16)}</button></div>
    ${hint?`<div class="exhint">↩︎ Saran dari sesi ${hint} — angka abu samar, ketik untuk pakai</div>`:''}
    ${ov?`<div class="exhint">${svg('arrowUp',13)} ${esc(ov)}</div>`:''}
    <button type="button" class="rest-rec" onclick="rtStart(${r.sec})" title="Ketuk untuk mulai timer">${svg('timer',13)}Istirahat ~${r.label} · ketuk untuk mulai</button>
    <div class="setrow-h"><span>Set</span><span>Reps</span><span>Berat</span><span></span></div>
    <div class="sets">${sets.map(s=>{
      const dflW=s.label==='WU'?wuPh:wkPh;
      // set "saran" (rPh/wPh) → input kosong + placeholder abu (tak hitung progress/timer); set asli → value
      if(s.rPh!=null||s.wPh!=null) return setRowHTML(s.label,'','',s.wPh!=null&&s.wPh!==''?s.wPh:dflW,s.rPh);
      return setRowHTML(s.label,s.reps,s.weight,dflW);
    }).join('')}</div>
    <div class="set-actions">
      <button class="linkbtn wu" onclick="addSet(this,'WU')">+ Warmup</button>
      <button class="linkbtn" onclick="addSet(this,'S')">+ Set</button>
    </div>
  </div>`;
}
function delRow(btn){ // hapus 1 set, lalu re-label & simpan draft
  const block=btn.closest('.exblock');
  btn.closest('.setrow').remove();
  const any=block&&block.querySelector('.setrow');
  if(any)relabel(any);
  updateProgress();
  draftDirty();
}
function relabel(node){
  const block=node.closest('.exblock'); if(!block)return;
  let n=0;
  block.querySelectorAll('.setrow').forEach(r=>{
    const sb=r.querySelector('.sb');
    if(sb.classList.contains('wu')){sb.textContent='WU';}
    else{n++;sb.textContent='S'+n;}
  });
}
function addSet(btn,kind){
  const block=btn.closest('.exblock');const sets=block.querySelector('.sets');
  const name=block.querySelector('.en').textContent;
  const sw=getSW(name);
  const wuPh=sw>0?String(Math.round(sw*0.5/2.5)*2.5):'kg';
  const wkPh=sw>0?String(sw):'kg';
  if(kind==='WU'){
    sets.insertAdjacentHTML('afterbegin',setRowHTML('WU','','',wuPh));
    sets.firstElementChild.classList.add('rowin');
  }else{
    sets.insertAdjacentHTML('beforeend',setRowHTML('S','','',wkPh));
    sets.lastElementChild.classList.add('rowin');
  }
  relabel(block.querySelector('.setrow'));
  updateProgress();
  draftDirty();
}
function roundTo(x,step){return Math.round(x/step)*step;}
function topWorking(block){ // beban kerja terberat yang sudah diisi di satu exblock
  let top=0;
  block.querySelectorAll('.setrow').forEach(r=>{
    if(r.querySelector('.sb').classList.contains('wu'))return;
    const w=+r.querySelector('.w').value; if(w>top)top=w;
  });
  return top;
}
function autoWarmup(block){ // isi WU = 50% beban kerja terberat (dibulatkan 2.5kg)
  const wuRow=[...block.querySelectorAll('.setrow')].find(r=>r.querySelector('.sb').classList.contains('wu'));
  if(!wuRow)return;
  const wuW=wuRow.querySelector('.w');
  if(wuW.dataset.manual==='1')return;            // user sudah isi WU manual → jangan timpa
  if(wuW.value && wuW.dataset.auto!=='1')return; // nilai dari template/last session → hormati
  const top=topWorking(block);
  if(top>0){ wuW.value=roundTo(top*0.5,2.5); wuW.dataset.auto='1'; }
}
// listener terdelegasi untuk input set: auto-warmup + auto rest timer + progress + simpan draft
(function(){
  const mEx=document.getElementById('mExercises');
  if(!mEx)return;
  mEx.addEventListener('input',e=>{
    const inp=e.target;
    const isRW=inp.classList&&(inp.classList.contains('w')||inp.classList.contains('r'));
    if(isRW){
      const row=inp.closest('.setrow'), block=inp.closest('.exblock');
      if(row&&block){
        const isWU=row.querySelector('.sb').classList.contains('wu');
        if(inp.classList.contains('w')){ if(isWU) inp.dataset.manual='1'; else autoWarmup(block); }
        if(!isWU){ // auto rest timer: working set lengkap (reps+beban) pertama kali memicu
          const r=row.querySelector('.r').value, w=row.querySelector('.w').value;
          if(r&&w){ if(restAuto&&!editingId&&row.dataset.rested!=='1'){ row.dataset.rested='1'; rtStart(restFor(block.dataset.name).sec); } }
          else { row.dataset.rested=''; } // dikosongkan lagi → boleh memicu ulang nanti
        }
      }
    }
    updateProgress();
    draftDirty();
  });
})();
/* ---- Progress % (sesi + per-exercise) ---- */
function exTarget(block){ // target working set: dari rec, atau jumlah baris working bila custom
  const rec=parseRec(getRec(block.dataset.name));
  if(rec)return rec.targetSets;
  return [...block.querySelectorAll('.setrow')].filter(r=>!r.querySelector('.sb').classList.contains('wu')).length;
}
function exDone(block){ // working set yang sudah terisi reps + beban
  let done=0;
  block.querySelectorAll('.setrow').forEach(r=>{
    if(r.querySelector('.sb').classList.contains('wu'))return;
    if(r.querySelector('.r').value&&r.querySelector('.w').value)done++;
  });
  return done;
}
function updateProgress(){
  let totTarget=0, totDone=0;
  document.querySelectorAll('#mExercises .exblock').forEach(block=>{
    const target=exTarget(block), done=exDone(block);
    const cap=Math.min(done,target);
    totTarget+=target; totDone+=cap;
    const el=block.querySelector('.ex-prog');
    if(el){
      if(target>0){ el.textContent=done+'/'+target+' set'; el.classList.toggle('done',done>=target); }
      else el.textContent='';
    }
  });
  const wrap=document.getElementById('sessProgress');
  if(!wrap)return;
  if(totTarget>0){
    const pct=Math.round(totDone/totTarget*100);
    wrap.hidden=false;
    const fill=document.getElementById('spFill');
    fill.style.width=pct+'%'; fill.classList.toggle('done',pct>=100);
    document.getElementById('spLabel').textContent=totDone+'/'+totTarget+' set · '+pct+'%';
  }else wrap.hidden=true;
}
/* ---- Urutan exercise (drag & drop) tersimpan per jenis sesi ---- */
function applyOrder(type,baseNames){ // urutkan baseNames sesuai gum_order[type]; custom tersimpan ikut tampil
  const saved=exOrder[type];
  if(!saved||!saved.length)return baseNames;
  const tplHas=n=>(WORKOUTS[type]||[]).some(e=>e.n===n);
  const seen=new Set(), out=[];
  saved.forEach(n=>{ if(seen.has(n))return; if(baseNames.includes(n)||!tplHas(n)){ out.push(n); seen.add(n); } });
  baseNames.forEach(n=>{ if(!seen.has(n)){ out.push(n); seen.add(n); } });
  return out;
}
function renderOrderFromDom(){ // simpan urutan saat ini ke gum_order untuk jenis sesi aktif
  const type=document.getElementById('mType').value;
  exOrder[type]=[...document.querySelectorAll('#mExercises .exblock')].map(b=>b.dataset.name);
  LS.set('gum_order',exOrder);
}
(function(){ // drag & drop pointer-based (touch-friendly) via handle ≡
  const host=document.getElementById('mExercises');
  if(!host)return;
  host.addEventListener('pointerdown',e=>{
    const h=e.target.closest('.drag-handle'); if(!h)return;
    const block=h.closest('.exblock'); if(!block)return;
    e.preventDefault();
    block.classList.add('dragging');
    try{ h.setPointerCapture(e.pointerId); }catch(_){}
    const move=ev=>{
      const y=ev.clientY;
      const sibs=[...host.querySelectorAll('.exblock:not(.dragging)')];
      let before=null;
      for(const s of sibs){ const rc=s.getBoundingClientRect(); if(y<rc.top+rc.height/2){ before=s; break; } }
      if(before){ if(before!==block.nextElementSibling)host.insertBefore(block,before); }
      else if(host.lastElementChild!==block)host.appendChild(block);
    };
    const up=()=>{
      h.removeEventListener('pointermove',move);
      h.removeEventListener('pointerup',up);
      h.removeEventListener('pointercancel',up);
      block.classList.remove('dragging');
      renderOrderFromDom(); draftDirty();
    };
    h.addEventListener('pointermove',move);
    h.addEventListener('pointerup',up);
    h.addEventListener('pointercancel',up);
  });
})();
/* ---- Toggle Auto rest timer ---- */
(function(){
  const btn=document.getElementById('rtAuto'); if(!btn)return;
  const sync=()=>btn.setAttribute('aria-pressed',restAuto?'true':'false');
  btn.onclick=()=>{ restAuto=!restAuto; LS.set('gum_rest_auto',restAuto); sync(); };
  sync();
})();
function lastSessionFor(name){
  // sesi terbaru yang memuat latihan ini (dengan set terisi)
  const sorted=[...sessions].sort((a,b)=>a.date<b.date?1:-1);
  for(const s of sorted){
    const ex=s.exercises.find(e=>e.name===name&&e.sets&&e.sets.length);
    if(ex)return{date:s.date,sets:ex.sets};
  }
  return null;
}
// default set rows untuk sesi BARU tanpa riwayat: WU hanya untuk gerakan COMPOUND
function defaultSets(name){
  const base=[{label:'S1'},{label:'S2'},{label:'S3'}];
  return exCompound(name) ? [{label:'WU'},...base] : base;
}
function loadTemplate(type){
  const ex=WORKOUTS[type]||[];
  const names=applyOrder(type, ex.map(e=>e.n)); // hormati urutan tersimpan + custom
  document.getElementById('mExercises').innerHTML=names.map(name=>{
    const last=lastSessionFor(name);
    // sesi baru: reps/beban sesi lalu jadi SARAN (placeholder abu samar), bukan value —
    // agar tidak ikut dihitung progress % & tidak memicu auto rest timer sampai user ketik.
    const sets=last?last.sets.map(s=>({label:s.label,rPh:s.reps,wPh:s.weight}))
                   :defaultSets(name);
    return exBlockHTML(name,sets,last?fmtShort(last.date):null);
  }).join('');
  updateProgress();
}
/* ---- Draft auto-save (catat latihan sementara) ---- */
let draftTimer=null, draftTouched=false, closeTimer=null;
function readModalDraft(){
  const exercises=[];
  document.querySelectorAll('#mExercises .exblock').forEach(b=>{
    const sets=[];
    b.querySelectorAll('.setrow').forEach(r=>{
      sets.push({label:r.querySelector('.sb').textContent,reps:r.querySelector('.r').value,weight:r.querySelector('.w').value});
    });
    exercises.push({name:b.querySelector('.en').textContent,sets});
  });
  return {type:document.getElementById('mType').value,notes:document.getElementById('mNotes').value,exercises};
}
function draftHasContent(d){
  if(d.notes&&d.notes.trim())return true;
  return d.exercises.some(ex=>ex.sets.some(s=>s.reps||s.weight));
}
function saveDraft(){
  if(!modal.classList.contains('show')||editingId||!draftTouched)return;
  const date=document.getElementById('mDate').value; if(!date)return;
  const d=readModalDraft();
  if(draftHasContent(d))drafts[date]=d; else delete drafts[date];
  LS.set('gum_drafts',drafts);
}
function draftDirty(){ draftTouched=true; clearTimeout(draftTimer); draftTimer=setTimeout(saveDraft,400); } // debounce
function flushDraft(){ clearTimeout(draftTimer); saveDraft(); } // simpan langsung tanpa tunggu debounce
// App ditutup / berpindah ke background → simpan draft seketika agar input terakhir tak hilang
window.addEventListener('pagehide',flushDraft);
document.addEventListener('visibilitychange',()=>{ if(document.hidden)flushDraft(); });
function showDraftNote(on){
  const el=document.getElementById('draftNote');
  el.innerHTML = on ? `<div class="draft-note">${svg('edit',15)}<span>Melanjutkan draft tersimpan</span><button type="button" onclick="discardDraft()">Mulai ulang</button></div>` : '';
}
function discardDraft(){
  const date=document.getElementById('mDate').value;
  delete drafts[date]; LS.set('gum_drafts',drafts);
  draftTouched=false;
  showDraftNote(false);
  loadTemplate(document.getElementById('mType').value);
}
let editingId=null;
function openModal(date,type){
  date=date||todayStr();
  const existing=sessionsOn(date)[0];
  if(existing){ openEdit(existing.id); return; } // maks 1 sesi/hari → edit yang sudah ada
  editingId=null; draftTouched=false; clearTimeout(closeTimer);
  document.getElementById('modalTitle').textContent='Catat Latihan';
  document.getElementById('mDate').value=date;
  document.getElementById('mNewEx').value='';
  const d=drafts[date];
  if(d){ // lanjutkan draft
    document.getElementById('mType').value=d.type||type||'pull';
    document.getElementById('mNotes').value=d.notes||'';
    document.getElementById('mExercises').innerHTML=d.exercises.map(ex=>exBlockHTML(ex.name,ex.sets)).join('');
    showDraftNote(true);
    updateProgress();
  }else{
    document.getElementById('mType').value=type||'pull';
    document.getElementById('mNotes').value='';
    showDraftNote(false);
    loadTemplate(type||'pull');
  }
  modal.classList.remove('closing');
  modal.classList.add('show');
  document.body.style.overflow='hidden';
}
function openEdit(id){
  const s=sessions.find(x=>x.id===id); if(!s)return;
  editingId=id; draftTouched=false; clearTimeout(closeTimer);
  document.getElementById('modalTitle').textContent='Edit Latihan';
  document.getElementById('mDate').value=s.date;
  document.getElementById('mType').value=s.type;
  document.getElementById('mNotes').value=s.notes||'';
  document.getElementById('mNewEx').value='';
  // tampilkan template lengkap: gerakan yang sudah dicatat tetap dengan datanya,
  // gerakan template yang belum diisi tampil kosong (tidak hilang)
  const tpl=WORKOUTS[s.type]||[];
  const loggedMap={}; s.exercises.forEach(ex=>{loggedMap[ex.name]=ex;});
  let names=applyOrder(s.type, tpl.map(e=>e.n)); // urutan tersimpan + custom yang sudah pernah diatur
  s.exercises.forEach(ex=>{ if(!names.includes(ex.name)) names.push(ex.name); }); // custom dicatat tapi belum di urutan
  document.getElementById('mExercises').innerHTML=names.map(name=>{
    const lg=loggedMap[name];
    // edit: data tercatat tetap value asli (bukan placeholder). Gerakan template yg belum diisi → default (WU hanya compound)
    const sets=lg?lg.sets:defaultSets(name);
    return exBlockHTML(name,sets);
  }).join('');
  showDraftNote(false);
  updateProgress();
  modal.classList.remove('closing');
  modal.classList.add('show');
  document.body.style.overflow='hidden';
}
function closeModal(){
  saveDraft(); // simpan progres sebelum tutup
  modal.classList.add('closing');
  clearTimeout(closeTimer);
  closeTimer=setTimeout(()=>{ modal.classList.remove('show','closing'); },240);
  document.body.style.overflow='';editingId=null;rtStopTimer();
}
document.getElementById('mType').addEventListener('change',e=>{ showDraftNote(false); loadTemplate(e.target.value); draftDirty(); });
document.getElementById('mDate').addEventListener('change',draftDirty);
document.getElementById('mNotes').addEventListener('input',draftDirty);
document.getElementById('mAddEx').onclick=()=>{
  const inp=document.getElementById('mNewEx');const v=inp.value.trim();if(!v)return;
  const host=document.getElementById('mExercises');
  host.insertAdjacentHTML('beforeend',exBlockHTML(v,[{label:'S1'},{label:'S2'},{label:'S3'}]));
  host.lastElementChild.classList.add('rowin');
  inp.value='';
  renderOrderFromDom(); updateProgress();
  draftDirty();
};
document.getElementById('mNewEx').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();document.getElementById('mAddEx').click();}});
document.getElementById('modalClose').onclick=closeModal;
document.getElementById('mCancel').onclick=closeModal;
modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
document.getElementById('mSave').onclick=()=>{
  const date=document.getElementById('mDate').value;
  const type=document.getElementById('mType').value;
  if(!date){alert('Pilih tanggal dulu ya.');return;}
  const exercises=[];
  document.querySelectorAll('#mExercises .exblock').forEach(b=>{
    const name=b.querySelector('.en').textContent;
    const sets=[];
    b.querySelectorAll('.setrow').forEach(r=>{
      const reps=r.querySelector('.r').value;
      const weight=r.querySelector('.w').value;
      const label=r.querySelector('.sb').textContent;
      if(reps||weight)sets.push({label,reps,weight});
    });
    if(sets.length)exercises.push({name,sets});
  });
  if(!exercises.length){alert('Isi minimal satu set (reps / berat) dulu ya.');return;}
  const notes=document.getElementById('mNotes').value.trim();
  // deteksi PR SEBELUM menyimpan (bandingkan dengan rekor sebelumnya; saat edit, abaikan sesi ini sendiri)
  const prs=[];
  exercises.forEach(ex=>{
    const cur=maxWork(ex); if(cur<=0)return;
    const prev=prevBestWeight(ex.name,date,editingId);
    if(prev!=null && cur>prev)prs.push({name:ex.name,cur,prev});
  });
  const targetId = editingId || (sessionsOn(date)[0] && sessionsOn(date)[0].id); // maks 1 sesi/hari
  if(targetId){
    const i=sessions.findIndex(x=>x.id===targetId);
    if(i>-1)sessions[i]={...sessions[i],date,type,exercises,notes};
  }else{
    const id='s_'+date+'_'+Math.floor(performance.now())+'_'+sessions.length;
    sessions.push({id,date,type,exercises,notes});
  }
  LS.set('gum_sessions',sessions);
  delete drafts[date]; LS.set('gum_drafts',drafts); draftTouched=false; // draft selesai → buang
  closeModal();
  selDate=date;
  calRef=parseKey(date);
  renderCalendar();renderDayDetail();renderStreak();
  if(prs.length){
    const items=prs.map(p=>`<b>${esc(p.name)}</b> ${p.cur}kg <span style="color:var(--muted);">(sebelumnya ${p.prev}kg)</span>`).join('<br>');
    showToast(`<div style="font-weight:600;color:var(--accent-ink);display:flex;align-items:center;gap:6px;${prs.length>1?'margin-bottom:6px;':''}">${svg('trophy',16)}Rekor baru!</div>${items}`);
  }
};

/* =========================================================
   REST TIMER (di dalam modal catat latihan)
========================================================= */
let rtInterval=null, rtCtx=null, rtEndAt=null, rtDone=false;
function rtFmt(s){const m=Math.floor(s/60),ss=s%60;return m>0?(m+':'+String(ss).padStart(2,'0')):(ss+'s');}
function rtAudio(){
  try{ if(!rtCtx)rtCtx=new (window.AudioContext||window.webkitAudioContext)();
    if(rtCtx.state==='suspended')rtCtx.resume(); }catch(e){}
  return rtCtx;
}
function rtBeep(){
  const ctx=rtAudio(); if(!ctx)return;
  [0,0.18].forEach(off=>{
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.type='sine';o.frequency.value=880;o.connect(g);g.connect(ctx.destination);
    const t=ctx.currentTime+off;
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(0.35,t+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001,t+0.14);
    o.start(t);o.stop(t+0.15);
  });
}
/* ---- Notifikasi alarm istirahat (tetap berbunyi walau pindah aplikasi) ---- */
const RT_NTAG='rt-rest-done';
const RT_HAS_TRIGGER=('Notification' in window)&&('showTrigger' in Notification.prototype)&&('TimestampTrigger' in window);
const RT_NOPTS={body:'Waktunya lanjut set berikutnya 💪',icon:'/icon-192.png',badge:'/icon-192.png',vibrate:[200,100,200],tag:RT_NTAG,renotify:true};
async function rtEnsurePerm(){
  if(!('Notification' in window))return false;
  if(Notification.permission==='granted')return true;
  if(Notification.permission==='denied')return false;
  try{ return (await Notification.requestPermission())==='granted'; }catch(e){ return false; }
}
async function rtSwReg(){
  if(!('serviceWorker' in navigator))return null;
  try{ return await navigator.serviceWorker.ready; }catch(e){ return null; }
}
async function rtClearNotif(){
  const reg=await rtSwReg(); if(!reg)return;
  try{ (await reg.getNotifications({tag:RT_NTAG,includeTriggered:true})).forEach(n=>n.close()); }catch(e){}
}
// Jadwalkan notifikasi pada waktu target — TimestampTrigger membuatnya tetap muncul walau app ditutup/background.
async function rtScheduleNotif(endAt){
  if(!RT_HAS_TRIGGER)return;          // tanpa dukungan trigger → pakai fallback di rtFinish
  if(!(await rtEnsurePerm()))return;
  const reg=await rtSwReg(); if(!reg)return;
  await rtClearNotif();
  try{ await reg.showNotification('Istirahat selesai!',{...RT_NOPTS,showTrigger:new TimestampTrigger(endAt)}); }catch(e){}
}
// Tampilkan notifikasi sekarang juga (fallback saat TimestampTrigger tak didukung).
async function rtNotifyNow(){
  if(!(await rtEnsurePerm()))return;
  const reg=await rtSwReg(); if(!reg)return;
  try{ await reg.showNotification('Istirahat selesai!',RT_NOPTS); }catch(e){}
}
function rtStopTimer(){
  if(rtInterval){clearInterval(rtInterval);rtInterval=null;}
  rtEndAt=null;rtDone=false;
  rtClearNotif(); // batalkan notifikasi terjadwal bila timer dihentikan lebih awal
  const d=document.getElementById('rtDisplay');
  if(d){d.textContent='Rest';d.classList.remove('run','done');}
  document.querySelectorAll('.rt-presets button').forEach(b=>b.classList.remove('active'));
}
function rtFinish(){
  if(rtInterval){clearInterval(rtInterval);rtInterval=null;}
  rtDone=true;
  const d=document.getElementById('rtDisplay');
  if(d){d.classList.remove('run');d.classList.add('done');d.textContent='Selesai!';}
  rtBeep(); if(navigator.vibrate)navigator.vibrate([200,100,200]);
  if(!RT_HAS_TRIGGER)rtNotifyNow(); // OS sudah menangani via trigger; ini hanya untuk browser tanpa dukungan trigger
}
// hitung sisa dari waktu target (jam dinding) — tahan throttle saat tab di-background
function rtSync(){
  if(rtEndAt==null||rtDone)return;
  const remain=Math.ceil((rtEndAt-Date.now())/1000);
  if(remain<=0){ rtFinish(); return; }
  const d=document.getElementById('rtDisplay');
  if(d)d.textContent=rtFmt(remain);
}
function rtStart(sec){
  rtStopTimer();
  rtAudio(); // siapkan audio dari gesture klik agar bunyi tak diblokir
  rtEndAt=Date.now()+sec*1000;rtDone=false;
  const d=document.getElementById('rtDisplay');
  if(d){d.classList.add('run');d.textContent=rtFmt(sec);}
  rtInterval=setInterval(rtSync,1000);
  rtEnsurePerm();            // minta izin notifikasi mumpung masih dalam gesture klik
  rtScheduleNotif(rtEndAt);  // jadwalkan alarm sistem ke waktu target
}
document.querySelectorAll('.rt-presets button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.rt-presets button').forEach(x=>x.classList.toggle('active',x===b));
  rtStart(+b.dataset.sec);
}));
document.getElementById('rtStop').onclick=rtStopTimer;
// saat kembali dari aplikasi lain (tab di-foreground lagi), segera samakan tampilan dengan waktu nyata
document.addEventListener('visibilitychange',()=>{ if(!document.hidden)rtSync(); });
