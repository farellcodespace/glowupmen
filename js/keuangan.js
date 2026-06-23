/* =========================================================
   GlowUp Men — keuangan.js  (PLACEHOLDER, Fase 1)
   Modul Keuangan: belum ada logika data. Hanya empty-state.
   (loaded after core.js)
========================================================= */
function renderKeuangan(){
  const el=document.getElementById('page-keuangan'); if(!el)return;
  el.innerHTML=`<div class="empty" style="padding:60px 20px;">
    <span class="em-ico">💰</span>
    <div class="em-title">Keuangan — Segera hadir</div>
    <div class="em-sub">Catatan pemasukan, pengeluaran &amp; anggaran akan ada di sini.</div>
  </div>`;
}
