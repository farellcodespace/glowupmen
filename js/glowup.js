/* =========================================================
   GlowUp Men — glowup.js
   Glow Up content (skincare/hair/style) + Do&Don't + Habits.
   (loaded after core.js)
========================================================= */

/* =========================================================
   GLOW UP
========================================================= */
const GLOW={
  skin:`
    <div class="section-title" style="margin-top:0;">${svg('sun',18)}Rutinitas Pagi</div>
    <div class="card"><div class="routine">
      <div class="rstep"><span class="rn"></span><div><div class="rt">Facewash</div><div class="rd">Bersihkan wajah dari minyak & keringat semalam</div></div></div>
      <div class="rstep"><span class="rn"></span><div><div class="rt">Moisturizer</div><div class="rd">Kunci kelembapan kulit</div></div></div>
      <div class="rstep"><span class="rn"></span><div><div class="rt">Sunscreen (min SPF 30)</div><div class="rd">Wajib tiap pagi — proteksi UV anti kusam & penuaan dini</div></div></div>
    </div></div>
    <div class="section-title">${svg('moon',18)}Rutinitas Malam</div>
    <div class="card"><div class="routine">
      <div class="rstep"><span class="rn"></span><div><div class="rt">Facewash</div><div class="rd">Angkat kotoran, debu & sunscreen seharian</div></div></div>
      <div class="rstep"><span class="rn"></span><div><div class="rt">Moisturizer</div><div class="rd">Regenerasi kulit saat tidur</div></div></div>
      <div class="rstep"><span class="rn"></span><div><div class="rt">Lip balm</div><div class="rd">Bibir lembap, tidak pecah-pecah</div></div></div>
    </div></div>
    <div class="section-title">${svg('bag',18)}Rekomendasi produk</div>
    <div class="card">
      <div class="src-row"><span>Facewash</span><b style="color:var(--accent-ink)">Cetaphil / Hada Labo</b></div>
      <div class="src-row"><span>Moisturizer</span><b style="color:var(--accent-ink)">Hada Labo Gokujyun / Azarine</b></div>
      <div class="src-row"><span>Lip balm</span><b style="color:var(--accent-ink)">Vaseline</b></div>
    </div>`,
  hair:`
    <div class="card">
      <div class="section-title" style="margin-top:0;">${svg('target',18)}Target</div>
      <p style="font-size:13px;color:var(--muted);">Medium length — tidak terlalu panjang, tidak shaggy. Rapi tapi tetap natural.</p>
    </div>
    <div class="section-title">${svg('scissors',18)}Perawatan</div>
    <div class="card">
      <div class="tipline" style="padding-top:0;"><span class="ni">${svg('scissors',18)}</span><p><b>Trim tiap 6–8 minggu</b> — cukup 0.5–1cm di ujung saja agar bentuk terjaga.</p></div>
      <div class="tipline" style="border-top:1px solid var(--border);"><span class="ni">${svg('bottle',18)}</span><p><b>Kondisioner tiap keramas</b> — aplikasikan dari tengah ke ujung saja, hindari akar.</p></div>
    </div>
    <div class="section-title">${svg('scissors',18)}Pilihan gaya</div>
    <div class="card"><div class="chiplist">
      <span class="tagchip">Curtain bangs</span>
      <span class="tagchip">Slicked back</span>
      <span class="tagchip">Wolf cut</span>
    </div></div>`,
  style:`
    <div class="card">
      <div class="section-title" style="margin-top:0;">${svg('shirt',18)}Prinsip</div>
      <div class="tipline" style="padding-top:0;"><span class="ni">${svg('ruler',18)}</span><p><b>Fit over brand</b> — baju yang pas badan selalu menang dari sekadar merek mahal.</p></div>
      <div class="tipline" style="border-top:1px solid var(--border);"><span class="ni">${svg('footprints',18)}</span><p><b>White sneakers</b> sebagai fondasi — cocok dengan hampir semua outfit.</p></div>
    </div>
    <div class="section-title">${svg('palette',18)}Warna netral dulu</div>
    <div class="card"><div class="chiplist">
      <span class="tagchip">Black</span><span class="tagchip">White</span><span class="tagchip">Grey</span><span class="tagchip">Navy</span><span class="tagchip">Cream</span>
    </div></div>
    <div class="section-title">${svg('glow',18)}Detail grooming</div>
    <div class="card">
      <div class="src-row"><span>Kuku</span><b style="color:var(--accent-ink)">Selalu bersih & rapi</b></div>
      <div class="src-row"><span>Alis</span><b style="color:var(--accent-ink)">Rapi, tidak berantakan</b></div>
      <div class="src-row"><span>Parfum</span><b style="color:var(--accent-ink)">Woody / aquatic</b></div>
    </div>`,
  habit:`
    <div id="habitTracker"></div>
    <div class="section-title">${svg('leaf',18)}Kebiasaan harian</div>
    <div class="card">
      <div class="tipline" style="padding-top:0;"><span class="ni">${svg('moon',18)}</span><p><b>Tidur 7–8 jam</b> — recovery & hormon pertumbuhan terjadi saat tidur.</p></div>
      <div class="tipline" style="border-top:1px solid var(--border);"><span class="ni">${svg('droplet',18)}</span><p><b>Minum 3–4 liter/hari</b> untuk hidrasi & kulit sehat.</p></div>
      <div class="tipline" style="border-top:1px solid var(--border);"><span class="ni">${svg('person',18)}</span><p><b>Postur tegak</b> — bahu ke belakang, langsung terlihat lebih percaya diri.</p></div>
      <div class="tipline" style="border-top:1px solid var(--border);"><span class="ni">${svg('smile',18)}</span><p><b>Sikat gigi 2×/hari</b> — senyum bersih bagian dari glow up.</p></div>
    </div>
    <div class="section-title">${svg('jadwal',18)}Timeline glow up</div>
    <div class="card">
      <div class="tl-step"><span class="tw">Minggu 1–2</span><p>Mulai rutin: skincare, tidur cukup, hidrasi. Kulit mulai lebih segar.</p></div>
      <div class="tl-step"><span class="tw">Bulan 1–2</span><p>Postur membaik, baju mulai terasa pas, otot mulai terbentuk.</p></div>
      <div class="tl-step"><span class="tw">Bulan 3–4</span><p>Perubahan fisik terlihat jelas, kulit lebih cerah & konsisten.</p></div>
      <div class="tl-step"><span class="tw">Bulan 6+</span><p>Transformasi nyata — bentuk badan, kulit, gaya, dan percaya diri.</p></div>
    </div>`,
  dd:`
    <div class="subtabs" id="ddTabs">
      <button class="subtab active" data-dd="makan"><span class="ic">${svg('utensils',15)}</span>Makan</button>
      <button class="subtab" data-dd="gym"><span class="ic">${svg('dumbbell',15)}</span>Gym</button>
      <button class="subtab" data-dd="glowup"><span class="ic">${svg('glow',15)}</span>Glow Up</button>
    </div>
    <div id="ddContent"></div>`,
};
const DD={
  makan:{
    do:["Makan surplus kalori bertahap","Prioritaskan protein tiap waktu makan","Rebus / kukus daripada goreng","Minum susu full cream untuk kalori","Makan sayur & buah tiap hari"],
    dont:["Skip sarapan atau waktu makan","Bulking kotor (junk food berlebih)","Minum manis berlebihan","Gorengan tiap hari","Begadang lalu makan tengah malam"]
  },
  gym:{
    do:["Pakai RIR 1–2 di 4–6 minggu awal","Form dulu, baru tambah beban","Mulai sisi kanan (yang lemah) dulu","Progressive overload tiap minggu","Compound → isolasi → accessory"],
    dont:["Ego lifting / beban kebablasan","Skip warmup set","Latih sisi kiri lebih dulu","Loncat-loncat program","Latihan saat sakit / kurang tidur"]
  },
  glowup:{
    do:["Sunscreen tiap pagi","Konsisten skincare pagi & malam","Tidur 7–8 jam","Jaga postur tegak","Grooming detail (kuku, alis, parfum)"],
    dont:["Pencet jerawat","Skip sunscreen","Begadang terus-menerus","Pakai baju kebesaran / kekecilan","Ganti-ganti produk skincare terlalu sering"]
  }
};
let glowSec='skin', ddSec='makan';
function renderGlow(){
  document.querySelectorAll('#glowTabs .subtab').forEach(b=>b.classList.toggle('active',b.dataset.glow===glowSec));
  document.getElementById('glowContent').innerHTML=GLOW[glowSec];
  if(glowSec==='habit')renderHabits();
  if(glowSec==='dd'){
    document.querySelectorAll('#ddTabs .subtab').forEach(b=>b.addEventListener('click',()=>{ddSec=b.dataset.dd;renderDD();}));
    renderDD();
  }
}
const HABITS=[
  {id:'air',ic:svg('droplet',18),t:'Minum 3–4 liter air'},
  {id:'tidur',ic:svg('moon',18),t:'Tidur 7–8 jam'},
  {id:'sunscreen',ic:svg('sun',18),t:'Sunscreen pagi'},
  {id:'skincare',ic:svg('bottle',18),t:'Skincare malam'},
  {id:'gigi',ic:svg('smile',18),t:'Sikat gigi 2×'},
  {id:'postur',ic:svg('person',18),t:'Postur tegak'},
];
function habitData(){return LS.get('gum_habits',{});}
function toggleHabit(id){
  const all=habitData(), t=todayStr(), day=all[t]||{};
  if(day[id])delete day[id]; else day[id]=true;
  if(Object.keys(day).length)all[t]=day; else delete all[t];
  LS.set('gum_habits',all);
  renderHabits();
}
function renderHabits(){
  const host=document.getElementById('habitTracker'); if(!host)return;
  const all=habitData(), t=todayStr(), day=all[t]||{};
  const done=HABITS.filter(h=>day[h.id]).length, pct=Math.round(done/HABITS.length*100);
  const now=new Date(), days=[];
  for(let i=6;i>=0;i--){
    const dd=new Date(now.getFullYear(),now.getMonth(),now.getDate()-i), k=fmtKey(dd);
    const c=HABITS.filter(h=>(all[k]||{})[h.id]).length;
    const lvl=c===0?0:c>=HABITS.length?3:c>=HABITS.length/2?2:1;
    days.push({k,c,lvl,cur:k===t,d:dd.getDate()});
  }
  host.innerHTML=`<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <div class="section-title" style="margin:0;">${svg('check',18)}Checklist hari ini</div>
      <span class="micro"><b style="color:var(--accent-ink);font-size:14px;">${done}</b>/${HABITS.length}</span>
    </div>
    <div class="pbar" style="margin:9px 0 14px;"><i style="width:${pct}%"></i></div>
    <div class="habit-list">
      ${HABITS.map(h=>`<button class="habit ${day[h.id]?'on':''}" data-h="${h.id}">
        <span class="hk-ic">${h.ic}</span><span class="hk-t">${h.t}</span><span class="hk-box">${day[h.id]?'✓':''}</span>
      </button>`).join('')}
    </div>
    <div class="micro" style="margin:16px 0 8px;">7 hari terakhir</div>
    <div class="habit-week">
      ${days.map(x=>`<div class="hw ${x.cur?'cur':''}" title="${fmtShort(x.k)}: ${x.c}/${HABITS.length}"><i data-lvl="${x.lvl}"></i><span>${x.d}</span></div>`).join('')}
    </div>
  </div>`;
  host.querySelectorAll('.habit').forEach(b=>b.addEventListener('click',()=>toggleHabit(b.dataset.h)));
}
function renderDD(){
  document.querySelectorAll('#ddTabs .subtab').forEach(b=>b.classList.toggle('active',b.dataset.dd===ddSec));
  const d=DD[ddSec];
  document.getElementById('ddContent').innerHTML=`<div class="card"><div class="dd-grid">
    <div class="dolist do"><h5>✓ DO</h5><ul>${d.do.map(x=>`<li>${x}</li>`).join('')}</ul></div>
    <div class="dolist dont"><h5>✕ DON'T</h5><ul>${d.dont.map(x=>`<li>${x}</li>`).join('')}</ul></div>
  </div></div>`;
}
document.querySelectorAll('#glowTabs .subtab').forEach(b=>b.addEventListener('click',()=>{glowSec=b.dataset.glow;renderGlow();}));
