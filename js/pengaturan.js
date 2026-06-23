/* =========================================================
   GlowUp Men — pengaturan.js
   Tema, notifikasi, Backup/Restore (export/import), reset data.
   (loaded after core.js & latihan.js — pakai toggleTheme, rt* helpers)
========================================================= */

/* ---- Backup: export / import (dipindah dari Tracker→Berat) ---- */
function exportData(){
  const d=new Date();
  const stamp=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  const payload={
    _app:'glowupmen', _v:2, _exported:d.toISOString(),
    gum_sessions:sessions,
    gum_weights:weights,
    gum_measures:measures,
    gum_habits:LS.get('gum_habits',{}),
    gum_theme:LS.get('gum_theme',null),
    gum_page:LS.get('gum_page','beranda'),
    gum_order:exOrder,        // urutan exercise per jenis sesi (v2)
    gum_rest_auto:restAuto,   // preferensi auto rest timer (v2)
  };
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download='glowupmen-backup-'+stamp+'.json';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
function importData(file){
  const reader=new FileReader();
  reader.onload=()=>{
    let d;
    try{ d=JSON.parse(reader.result); }catch(e){ alert('File tidak valid atau rusak.'); return; }
    if(!d || (!Array.isArray(d.gum_sessions) && !Array.isArray(d.gum_weights))){ alert('File ini bukan backup GlowUp Men.'); return; }
    if(!confirm('Pulihkan data dari file ini? Semua data saat ini akan ditimpa.')) return;
    if(Array.isArray(d.gum_sessions)){ sessions=d.gum_sessions; LS.set('gum_sessions',sessions); }
    if(Array.isArray(d.gum_weights)){ weights=d.gum_weights; LS.set('gum_weights',weights); }
    if(Array.isArray(d.gum_measures)){ measures=d.gum_measures; LS.set('gum_measures',measures); }
    if(d.gum_habits && typeof d.gum_habits==='object'){ LS.set('gum_habits',d.gum_habits); }
    if(d.gum_theme==='light'||d.gum_theme==='dark'){ LS.set('gum_theme',d.gum_theme); } else { localStorage.removeItem('gum_theme'); }
    if(d.gum_order && typeof d.gum_order==='object' && !Array.isArray(d.gum_order)){ exOrder=d.gum_order; LS.set('gum_order',exOrder); } // v2
    if(typeof d.gum_rest_auto==='boolean'){ restAuto=d.gum_rest_auto; LS.set('gum_rest_auto',restAuto); const ab=document.getElementById('rtAuto'); if(ab)ab.setAttribute('aria-pressed',restAuto?'true':'false'); } // v2
    applyTheme();
    renderCalendar(); renderDayDetail(); renderWeight(); renderOverload(); renderVolume(); renderMeasures(); renderStreak();
    if(glowSec==='habit')renderHabits();
    alert('Data berhasil dipulihkan ✅');
  };
  reader.readAsText(file);
}
document.getElementById('btnExport').onclick=exportData;
document.getElementById('btnImport').onclick=()=>document.getElementById('importFile').click();
document.getElementById('importFile').addEventListener('change',e=>{
  if(e.target.files[0])importData(e.target.files[0]);
  e.target.value='';
});

/* ---- Notifikasi: test / izinkan (pakai helper rest-timer di latihan.js) ---- */
async function setTestNotif(){
  if(!('Notification' in window)){ alert('Browser ini tidak mendukung notifikasi.'); return; }
  let ok=false;
  if(typeof rtEnsurePerm==='function'){ ok=await rtEnsurePerm(); }
  else { try{ ok=(await Notification.requestPermission())==='granted'; }catch(e){ ok=false; } }
  if(!ok){ alert('Izin notifikasi belum diberikan. Aktifkan dari pengaturan browser bila perlu.'); return; }
  if(typeof rtNotifyNow==='function'){ rtNotifyNow(); }
  else { try{ new Notification('GlowUp Men',{body:'Notifikasi aktif ✅'}); }catch(e){} }
  showToast('Notifikasi diizinkan ✅');
}

/* ---- Reset semua data ---- */
function resetAllData(){
  if(!confirm('Hapus SEMUA data GlowUp Men di perangkat ini? Tindakan ini tidak bisa dibatalkan. Disarankan Export backup dulu.'))return;
  if(!confirm('Yakin? Semua log latihan, berat, ukuran, kebiasaan & pengaturan akan hilang.'))return;
  Object.keys(localStorage).filter(k=>k.indexOf('gum_')===0).forEach(k=>localStorage.removeItem(k));
  location.reload();
}

/* ---- Render halaman Pengaturan ---- */
function renderPengaturan(){
  // konten halaman statis di shell HTML; ini hanya menyinkronkan ikon & label tema.
  if(typeof applyTheme==='function')applyTheme();
}

/* ---- Bindings ---- */
(function(){
  const tb=document.getElementById('setThemeBtn'); if(tb)tb.addEventListener('click',toggleTheme);
  const nb=document.getElementById('setNotifBtn'); if(nb)nb.addEventListener('click',setTestNotif);
  const rb=document.getElementById('setResetBtn'); if(rb)rb.addEventListener('click',resetAllData);
})();
