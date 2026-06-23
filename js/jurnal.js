/* =========================================================
   GlowUp Men — jurnal.js
   Modul Jurnal: mood, energi, tidur & catatan harian.
   Data: gum_journal = { 'YYYY-MM-DD': {mood,energy,sleepH,note} }
   (loaded after core.js, before beranda.js)
========================================================= */
const J_MOODS=[
  {v:1,e:'😞',l:'Buruk'},
  {v:2,e:'😕',l:'Kurang'},
  {v:3,e:'😐',l:'Biasa'},
  {v:4,e:'🙂',l:'Baik'},
  {v:5,e:'😄',l:'Hebat'},
];
let jDate=null;       // tanggal yang sedang diisi di form
let jTab='catat';     // submenu aktif: catat | riwayat

function jMoodEmoji(v){ const m=J_MOODS.find(x=>x.v===+v); return m?m.e:'–'; }
function jMoodLabel(v){ const m=J_MOODS.find(x=>x.v===+v); return m?m.l:''; }

function jSetMood(v){ document.querySelectorAll('#jMood .mood-btn').forEach(b=>b.classList.toggle('active',+b.dataset.v===v)); }
function jSetEnergy(v){ document.querySelectorAll('#jEnergy .pill').forEach(b=>b.classList.toggle('active',+b.dataset.v===v)); }

function jFillForm(){
  const dInput=document.getElementById('jDate'); if(!dInput)return;
  const e=journal[dInput.value]||{};
  jSetMood(e.mood||0); jSetEnergy(e.energy||0);
  document.getElementById('jSleep').value=e.sleepH!=null?e.sleepH:'';
  document.getElementById('jNote').value=e.note||'';
}
function jPickDate(){ jDate=document.getElementById('jDate').value; jFillForm(); }

function jSave(){
  const date=document.getElementById('jDate').value; if(!date){alert('Pilih tanggal dulu ya.');return;}
  const moodEl=document.querySelector('#jMood .mood-btn.active');
  const enEl=document.querySelector('#jEnergy .pill.active');
  const mood=moodEl?+moodEl.dataset.v:0;
  const energy=enEl?+enEl.dataset.v:0;
  const sleepH=parseFloat(document.getElementById('jSleep').value);
  const note=document.getElementById('jNote').value.trim();
  if(!mood&&!energy&&!(sleepH>0)&&!note){ alert('Isi minimal satu: mood, energi, tidur, atau catatan.'); return; }
  journal[date]={mood,energy,sleepH:(sleepH>0?sleepH:null),note};
  LS.set('gum_journal',journal);
  showToast('Jurnal '+fmtShort(date)+' tersimpan ✅');
  jTab='riwayat';
  renderJurnal();
  if(typeof renderBeranda==='function')renderBeranda();
}
function jDelete(date){
  if(!confirm('Hapus jurnal '+fmtShort(date)+'?'))return;
  delete journal[date]; LS.set('gum_journal',journal);
  renderJurnal();
  if(typeof renderBeranda==='function')renderBeranda();
}
function showJurnalTab(tt){
  jTab=tt;
  document.querySelectorAll('#jurnalTabs .tab').forEach(x=>x.classList.toggle('active',x.dataset.jt===tt));
  ['catat','riwayat'].forEach(t=>{const el=document.getElementById('jt-'+t); if(el)el.style.display=t===tt?'':'none';});
}

function jHistoryHTML(){
  const dates=Object.keys(journal).sort().reverse();
  if(!dates.length){
    return `<div class="empty" style="padding:40px 16px;"><span class="em-ico">📓</span><div class="em-title">Belum ada jurnal</div><div class="em-sub">Catat mood, tidur &amp; refleksimu di tab Catat.</div></div>`;
  }
  // mini tren mood — 14 entri terakhir, urut lama → baru
  const recent=dates.slice(0,14).reverse();
  const spark=`<div class="card"><div class="section-title" style="margin-top:0;">Tren mood</div>
    <div class="jspark">${recent.map(d=>{const m=journal[d].mood||0;const h=m?m*16+6:3;return `<div class="jsb" title="${fmtShort(d)} · ${jMoodEmoji(m)}"><i style="height:${h}px;"></i></div>`;}).join('')}</div>
    <div class="micro" style="margin-top:8px;text-align:center;">${recent.length} catatan terakhir</div></div>`;
  let rows='';
  dates.forEach(d=>{
    const e=journal[d];
    const meta=[e.energy?'⚡ '+e.energy:'',e.sleepH?'😴 '+e.sleepH+'j':''].filter(Boolean).join(' · ');
    rows+=`<div class="jrow">
      <div class="jr-emo" title="${jMoodLabel(e.mood)}">${jMoodEmoji(e.mood)}</div>
      <div class="jr-mid">
        <div class="jr-top"><b>${fmtShort(d)}</b>${meta?` <span class="micro">${meta}</span>`:''}</div>
        ${e.note?`<div class="jr-note">${esc(e.note)}</div>`:''}
      </div>
      <button class="jr-del" onclick="jDelete('${d}')" aria-label="Hapus">✕</button>
    </div>`;
  });
  return spark+`<div class="section-title">Semua catatan</div><div class="card flat" style="padding:4px 6px;">${rows}</div>`;
}

function renderJurnal(){
  const el=document.getElementById('page-jurnal'); if(!el)return;
  const formDate=(document.getElementById('jDate')&&document.getElementById('jDate').value)||jDate||todayStr();
  el.innerHTML=`
  <div class="tabs" id="jurnalTabs">
    <button class="tab ${jTab==='catat'?'active':''}" data-jt="catat" onclick="showJurnalTab('catat')"><span class="ic" data-ic="edit" data-sz="16"></span>Catat</button>
    <button class="tab ${jTab==='riwayat'?'active':''}" data-jt="riwayat" onclick="showJurnalTab('riwayat')"><span class="ic" data-ic="clipboard" data-sz="16"></span>Riwayat</button>
  </div>

  <div id="jt-catat" style="${jTab==='catat'?'':'display:none;'}">
    <div class="card">
      <div class="field"><label>Tanggal</label><input type="date" class="input" id="jDate" value="${formDate}" onchange="jPickDate()"></div>
      <div class="field"><label>Mood hari ini</label>
        <div class="mood-pick" id="jMood">${J_MOODS.map(m=>`<button type="button" class="mood-btn" data-v="${m.v}" onclick="jSetMood(${m.v})" title="${m.l}"><span class="me">${m.e}</span><span class="ml">${m.l}</span></button>`).join('')}</div>
      </div>
      <div class="field"><label>Energi (1–5)</label>
        <div class="pill-pick" id="jEnergy">${[1,2,3,4,5].map(n=>`<button type="button" class="pill" data-v="${n}" onclick="jSetEnergy(${n})">${n}</button>`).join('')}</div>
      </div>
      <div class="field"><label>Tidur (jam)</label><input type="number" step="0.5" min="0" max="24" inputmode="decimal" class="input" id="jSleep" placeholder="cth. 7.5"></div>
      <div class="field"><label>Catatan</label><textarea class="input" id="jNote" placeholder="Apa yang terjadi hari ini? Syukur, tantangan, rencana esok…"></textarea></div>
      <button class="btn btn-primary btn-block" onclick="jSave()"><span class="ic" data-ic="save" data-sz="16"></span> Simpan jurnal</button>
    </div>
  </div>

  <div id="jt-riwayat" style="${jTab==='riwayat'?'':'display:none;'}">${jHistoryHTML()}</div>`;
  if(typeof paintIcons==='function')paintIcons();
  jFillForm();
}
