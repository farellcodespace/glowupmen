/* =========================================================
   GlowUp Men — jurnal.js  (PLACEHOLDER, Fase 1)
   Modul Jurnal: belum ada logika data. Hanya empty-state.
   (loaded after core.js)
========================================================= */
function renderJurnal(){
  const el=document.getElementById('page-jurnal'); if(!el)return;
  el.innerHTML=`<div class="empty" style="padding:60px 20px;">
    <span class="em-ico">📓</span>
    <div class="em-title">Jurnal — Segera hadir</div>
    <div class="em-sub">Mood, tidur &amp; jurnal harian akan ada di sini.</div>
  </div>`;
}
