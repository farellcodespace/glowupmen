/* =========================================================
   GlowUp Men — app.js  (loaded LAST)
   Router init() + service worker registration.
========================================================= */
function init(){
  paintIcons();
  applyTheme();
  // Jadwal (di dalam modul Latihan)
  renderHero();renderSchedule();renderStreak();
  // Panduan gerakan (di dalam modul Latihan)
  renderGuideTabs();renderGuide();
  // Gizi
  renderGizi();
  // Glow Up
  renderGlow();
  // Kalender + day detail (di dalam modul Latihan)
  selDate=todayStr();
  renderCalendar();renderDayDetail();
  // Placeholder modul
  if(typeof renderJurnal==='function')renderJurnal();
  if(typeof renderKeuangan==='function')renderKeuangan();
  if(typeof renderPengaturan==='function')renderPengaturan();
  // Tab default tiap modul ber-submenu
  if(typeof showLatihanTab==='function')showLatihanTab('sched');
  if(typeof showGiziTab==='function')showGiziTab('gizi');
  // input tanggal default
  const wd=document.getElementById('wDate'); if(wd)wd.value=todayStr();
  const md=document.getElementById('meDate'); if(md)md.value=todayStr();
  matchMedia('(prefers-color-scheme:dark)').addEventListener('change',()=>{if(!LS.get('gum_theme',null))applyTheme();});
  // Dashboard
  if(typeof renderBeranda==='function')renderBeranda();
  // kembali ke halaman terakhir setelah refresh; default ke Beranda bila belum ada
  const savedPage=LS.get('gum_page','beranda');
  go(PAGE_META[savedPage]?savedPage:'beranda');
}
init();

/* PWA service worker */
if('serviceWorker' in navigator){
  // Saat SW baru mengambil alih, reload sekali agar konten terbaru tampil.
  let reloaded=false;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
    if(reloaded)return; reloaded=true; location.reload();
  });
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('/sw.js').then(reg=>{
      reg.update(); // cek versi SW baru tiap kunjungan; skipWaiting di sw.js yang mengaktifkannya
    }).catch(()=>{/* offline cache optional */});
  });
}
