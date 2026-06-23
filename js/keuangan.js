/* =========================================================
   GlowUp Men — keuangan.js
   Modul Keuangan: pemasukan/pengeluaran berkategori + ringkasan bulanan + budget.
   Data: gum_finance = [{id,date,type:'in'|'out',amount,category,note}]
         gum_finance_budget = number (budget pengeluaran/bulan, 0=nonaktif)
   (loaded after core.js, before beranda.js)
========================================================= */
const FIN_CATS={
  in:['Gaji','Bonus','Hadiah','Lainnya'],
  out:['Makan','Transport','Gym & Suplemen','Belanja','Tagihan','Hiburan','Kesehatan','Lainnya'],
};
let fMonth=null;        // 'YYYY-MM' yang sedang dilihat
let fTab='ringkasan';   // ringkasan | catat | riwayat
let fType='out';        // jenis transaksi di form

function fmtRp(n){ n=Math.round(+n||0); return 'Rp '+n.toLocaleString('id-ID'); }
function fMonthKeyOf(dateStr){ return (dateStr||todayStr()).slice(0,7); }
function fMonthLabel(mk){ const [y,m]=mk.split('-').map(Number); return MON[m-1]+' '+y; }
function fAddMonth(mk,delta){ let [y,m]=mk.split('-').map(Number); m+=delta; while(m<1){m+=12;y--;} while(m>12){m-=12;y++;} return y+'-'+String(m).padStart(2,'0'); }
function fTxOfMonth(mk){ return finance.filter(t=>fMonthKeyOf(t.date)===mk); }
function fSum(list,type){ return list.filter(t=>t.type===type).reduce((s,t)=>s+(+t.amount||0),0); }

function fPrevMonth(){ fMonth=fAddMonth(fMonth||fMonthKeyOf(),-1); renderKeuangan(); }
function fNextMonth(){ fMonth=fAddMonth(fMonth||fMonthKeyOf(),1); renderKeuangan(); }

function showKeuanganTab(tt){
  fTab=tt;
  document.querySelectorAll('#keuTabs .tab').forEach(x=>x.classList.toggle('active',x.dataset.kt===tt));
  ['ringkasan','catat','riwayat'].forEach(t=>{const el=document.getElementById('kt-'+t); if(el)el.style.display=t===tt?'':'none';});
}

function fSetType(t){
  fType=t;
  document.querySelectorAll('#fType .fseg-btn').forEach(b=>b.classList.toggle('active',b.dataset.t===t));
  const sel=document.getElementById('fCat');
  if(sel)sel.innerHTML=FIN_CATS[t].map(c=>`<option>${c}</option>`).join('');
}

function fSave(){
  const date=document.getElementById('fDate').value; if(!date){alert('Pilih tanggal dulu ya.');return;}
  const amount=Math.round(parseFloat(document.getElementById('fAmount').value));
  if(!(amount>0)){ alert('Isi jumlah (lebih dari 0) dulu ya.'); return; }
  const category=document.getElementById('fCat').value;
  const note=document.getElementById('fNote').value.trim();
  const id='f_'+date+'_'+Math.floor(performance.now())+'_'+finance.length;
  finance.push({id,date,type:fType,amount,category,note});
  LS.set('gum_finance',finance);
  document.getElementById('fAmount').value=''; document.getElementById('fNote').value='';
  showToast((fType==='in'?'Pemasukan':'Pengeluaran')+' '+fmtRp(amount)+' tersimpan ✅');
  fMonth=fMonthKeyOf(date);
  fTab='riwayat';
  renderKeuangan();
  if(typeof renderBeranda==='function')renderBeranda();
}
function fDelete(id){
  if(!confirm('Hapus transaksi ini?'))return;
  finance=finance.filter(t=>t.id!==id); LS.set('gum_finance',finance);
  renderKeuangan();
  if(typeof renderBeranda==='function')renderBeranda();
}
function fSetBudget(){
  const v=prompt('Budget pengeluaran per bulan (Rp). Isi 0 / kosong untuk menonaktifkan:', financeBudget||'');
  if(v===null)return;
  const n=Math.round(parseFloat(v))||0;
  financeBudget=n>0?n:0; LS.set('gum_finance_budget',financeBudget);
  renderKeuangan();
  if(typeof renderBeranda==='function')renderBeranda();
}

function fSummaryHTML(tx,income,expense,net){
  let h=`<div class="card">
    <div class="fmonth-nav">
      <button onclick="fPrevMonth()" aria-label="Bulan sebelumnya">‹</button>
      <b>${fMonthLabel(fMonth)}</b>
      <button onclick="fNextMonth()" aria-label="Bulan berikutnya">›</button>
    </div>
    <div class="statgrid" style="margin-top:10px;">
      <div class="statcard"><div class="sv" style="color:var(--green);font-size:16px;">${fmtRp(income)}</div><div class="sl">Pemasukan</div></div>
      <div class="statcard"><div class="sv" style="color:var(--red);font-size:16px;">${fmtRp(expense)}</div><div class="sl">Pengeluaran</div></div>
      <div class="statcard"><div class="sv" style="font-size:16px;color:${net>=0?'var(--green)':'var(--red)'};">${fmtRp(net)}</div><div class="sl">Saldo</div></div>
    </div>
  </div>`;
  if(financeBudget>0){
    const pct=Math.min(100,Math.round(expense/financeBudget*100));
    const remain=financeBudget-expense;
    h+=`<div class="card">
      <div class="label" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span>Budget pengeluaran</span><button class="micro" style="color:var(--accent-ink);font-weight:700;" onclick="fSetBudget()">Ubah</button></div>
      <div class="pbar"><i style="width:${pct}%;${expense>financeBudget?'background:var(--red);':''}"></i></div>
      <div class="micro" style="margin-top:8px;">${fmtRp(expense)} / ${fmtRp(financeBudget)} · ${remain>=0?'sisa <b>'+fmtRp(remain)+'</b>':'lebih <b style="color:var(--red);">'+fmtRp(-remain)+'</b>'}</div>
    </div>`;
  }else{
    h+=`<div class="card" style="text-align:center;"><button class="btn btn-ghost btn-sm" onclick="fSetBudget()">+ Atur budget bulanan</button></div>`;
  }
  const byCat={};
  tx.filter(t=>t.type==='out').forEach(t=>{byCat[t.category]=(byCat[t.category]||0)+(+t.amount||0);});
  const cats=Object.keys(byCat).sort((a,b)=>byCat[b]-byCat[a]);
  if(cats.length){
    const max=Math.max(...cats.map(c=>byCat[c]));
    h+=`<div class="section-title">Pengeluaran per kategori</div><div class="card">${cats.map(c=>`
      <div class="fcat"><div class="fc-top"><span>${esc(c)}</span><b>${fmtRp(byCat[c])}</b></div>
      <div class="fc-bar"><i style="width:${Math.max(4,Math.round(byCat[c]/max*100))}%;"></i></div></div>`).join('')}</div>`;
  }else if(!income){
    h+=`<div class="empty" style="padding:36px 16px;"><span class="em-ico">💰</span><div class="em-title">Belum ada transaksi</div><div class="em-sub">Catat pemasukan &amp; pengeluaran di tab Catat.</div></div>`;
  }
  return h;
}

function fFormHTML(){
  return `<div class="card">
    <div class="field"><label>Tanggal</label><input type="date" class="input" id="fDate" value="${todayStr()}"></div>
    <div class="field"><label>Jenis</label>
      <div class="fseg" id="fType">
        <button type="button" class="fseg-btn out" data-t="out" onclick="fSetType('out')">− Pengeluaran</button>
        <button type="button" class="fseg-btn in" data-t="in" onclick="fSetType('in')">+ Pemasukan</button>
      </div>
    </div>
    <div class="field"><label>Jumlah (Rp)</label><input type="number" inputmode="numeric" min="0" class="input" id="fAmount" placeholder="cth. 50000"></div>
    <div class="field"><label>Kategori</label><select class="input" id="fCat"></select></div>
    <div class="field"><label>Catatan</label><input type="text" class="input" id="fNote" placeholder="cth. makan siang, beli whey…"></div>
    <button class="btn btn-primary btn-block" onclick="fSave()"><span class="ic" data-ic="save" data-sz="16"></span> Simpan transaksi</button>
  </div>`;
}

function fHistoryHTML(tx){
  if(!tx.length){
    return `<div class="empty" style="padding:40px 16px;"><span class="em-ico">💰</span><div class="em-title">Belum ada transaksi ${fMonthLabel(fMonth)}</div><div class="em-sub">Catat di tab Catat, atau ganti bulan di Ringkasan.</div></div>`;
  }
  const sorted=[...tx].sort((a,b)=>a.date<b.date?1:(a.date>b.date?-1:0));
  let rows='';
  sorted.forEach(t=>{
    const sign=t.type==='in'?'+':'−';
    const col=t.type==='in'?'var(--green)':'var(--red)';
    rows+=`<div class="frow">
      <div class="fr-mid"><div class="fr-top"><b>${esc(t.category)}</b> <span class="micro">${fmtShort(t.date)}</span></div>${t.note?`<div class="fr-note">${esc(t.note)}</div>`:''}</div>
      <div class="fr-amt" style="color:${col};">${sign}${fmtRp(t.amount)}</div>
      <button class="fr-del" onclick="fDelete('${t.id}')" aria-label="Hapus">✕</button>
    </div>`;
  });
  return `<div class="section-title" style="margin-top:4px;">${fMonthLabel(fMonth)}</div><div class="card flat" style="padding:4px 6px;">${rows}</div>`;
}

function renderKeuangan(){
  const el=document.getElementById('page-keuangan'); if(!el)return;
  if(!fMonth)fMonth=fMonthKeyOf();
  const tx=fTxOfMonth(fMonth);
  const income=fSum(tx,'in'), expense=fSum(tx,'out'), net=income-expense;
  el.innerHTML=`
  <div class="tabs" id="keuTabs">
    <button class="tab ${fTab==='ringkasan'?'active':''}" data-kt="ringkasan" onclick="showKeuanganTab('ringkasan')"><span class="ic" data-ic="trend" data-sz="16"></span>Ringkasan</button>
    <button class="tab ${fTab==='catat'?'active':''}" data-kt="catat" onclick="showKeuanganTab('catat')"><span class="ic" data-ic="edit" data-sz="16"></span>Catat</button>
    <button class="tab ${fTab==='riwayat'?'active':''}" data-kt="riwayat" onclick="showKeuanganTab('riwayat')"><span class="ic" data-ic="clipboard" data-sz="16"></span>Riwayat</button>
  </div>
  <div id="kt-ringkasan" style="${fTab==='ringkasan'?'':'display:none;'}">${fSummaryHTML(tx,income,expense,net)}</div>
  <div id="kt-catat" style="${fTab==='catat'?'':'display:none;'}">${fFormHTML()}</div>
  <div id="kt-riwayat" style="${fTab==='riwayat'?'':'display:none;'}">${fHistoryHTML(tx)}</div>`;
  if(typeof paintIcons==='function')paintIcons();
  fSetType(fType); // sinkronkan toggle jenis & isi dropdown kategori
}
