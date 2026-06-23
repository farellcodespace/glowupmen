/* =========================================================
   GlowUp Men — gizi.js
   Panduan gizi (jadwal makan, sumber protein) + Tracker Berat.
   (loaded after core.js)
========================================================= */

/* ============ GIZI (panduan makan) ============ */
function renderGizi(){
  document.getElementById('mealTimeline').innerHTML=MEALS.map(m=>`
    <div class="meal"><div class="mtime">${m.t}</div><div class="mname">${m.n}</div><div class="mdesc">${m.d}</div></div>`).join('');
  document.getElementById('proteinSources').innerHTML=PROTEINS.map(p=>`
    <div class="src-row"><span>${p.n}</span><b>${p.v}</b></div>`).join('');
}

/* ============ TRACKER BERAT ============ */
/* ---- Weight ---- */
function renderWeight(){
  const sorted=[...weights].sort((a,b)=>a.date<b.date?-1:1);
  const cur=sorted.length?sorted[sorted.length-1].weight:START_W;
  const gain=cur-START_W;
  const pct=Math.max(0,Math.min(100,((cur-START_W)/(TARGET_W-START_W))*100));
  document.getElementById('wCur').textContent=cur;
  document.getElementById('wStatCur').innerHTML=cur+'<small> kg</small>';
  document.getElementById('wStatGain').innerHTML=(gain>=0?'+':'')+(+gain.toFixed(1))+'<small> kg</small>';
  setTimeout(()=>{document.getElementById('wProgress').style.width=pct+'%';},60);
  const remain=(TARGET_W-cur).toFixed(1);
  document.getElementById('wProgressTxt').innerHTML = cur>=TARGET_W ? `<span class="ic" style="color:var(--green);vertical-align:-2px;">${svg('trophy',14)}</span> Target tercapai!` : `${pct.toFixed(0)}% menuju target · kurang <b>${remain} kg</b> lagi`;

  drawWeightChart();

  const wrap=document.getElementById('wHistory');
  if(!sorted.length){
    wrap.innerHTML=`<div class="empty" style="padding:24px 10px;"><span class="em-ico" style="display:inline-flex;justify-content:center;color:var(--faint);">${svg('scale',40)}</span><div class="em-title">Belum ada data</div><div class="em-sub">Catat berat badanmu rutin (mis. tiap pagi) untuk lihat tren bulking.</div></div>`;
    return;
  }
  let rows='';
  for(let i=sorted.length-1;i>=0;i--){
    const e=sorted[i];
    let chg='<span style="color:var(--faint)">–</span>';
    if(i>0){const d=+(e.weight-sorted[i-1].weight).toFixed(1);chg=d>0?`<span class="up">▲ ${d}</span>`:d<0?`<span class="down">▼ ${Math.abs(d)}</span>`:chg;}
    rows+=`<tr><td>${fmtShort(e.date)}</td><td><b>${e.weight}</b> kg</td><td>${chg}</td>
      <td style="text-align:right;"><button class="micro" style="color:var(--red);" onclick="delWeight('${e.date}')">✕</button></td></tr>`;
  }
  wrap.innerHTML=`<table class="htable"><thead><tr><th>Tanggal</th><th>Berat</th><th>Perubahan</th><th></th></tr></thead><tbody>${rows}</tbody></table>`;
}
function delWeight(date){weights=weights.filter(w=>w.date!==date);LS.set('gum_weights',weights);renderWeight();}
function drawWeightChart(){
  const cv=document.getElementById('wChart'); if(!cv)return;
  const card=document.getElementById('wChartCard');
  const sorted=[...weights].sort((a,b)=>a.date<b.date?-1:1);
  if(sorted.length<2){ if(card)card.style.display='none'; return; } // butuh min 2 titik
  if(card)card.style.display='';
  const wrap=cv.parentElement, cssW=wrap.clientWidth, cssH=wrap.clientHeight;
  if(!cssW){ return; } // tab tersembunyi; akan digambar saat tab dibuka
  const dpr=window.devicePixelRatio||1;
  cv.width=cssW*dpr; cv.height=cssH*dpr;
  const ctx=cv.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,cssW,cssH);
  const cs=getComputedStyle(document.documentElement), col=n=>(cs.getPropertyValue(n)||'').trim();
  const cAccent=col('--accent')||'#2F6BFF', cMuted=col('--muted')||'#888', cBorder=col('--border-2')||'#ddd',
        cGreen=col('--green')||'#16a34a', cSurface=col('--surface')||'#fff';
  const padL=32,padR=14,padT=16,padB=22, plotW=cssW-padL-padR, plotH=cssH-padT-padB;
  const vals=sorted.map(w=>w.weight);
  let ymin=Math.min(START_W,TARGET_W,...vals), ymax=Math.max(START_W,TARGET_W,...vals);
  const padY=(ymax-ymin)*0.12||1; ymin-=padY; ymax+=padY;
  const X=i=> sorted.length===1? padL+plotW/2 : padL+plotW*i/(sorted.length-1);
  const Y=v=> padT+plotH*(1-(v-ymin)/(ymax-ymin));
  ctx.font='10px Inter,sans-serif'; ctx.textBaseline='middle';
  // gridlines + label sumbu Y
  for(let s=0;s<=4;s++){
    const v=ymin+(ymax-ymin)*s/4, yy=Y(v);
    ctx.strokeStyle=cBorder; ctx.globalAlpha=.45; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(padL,yy); ctx.lineTo(cssW-padR,yy); ctx.stroke();
    ctx.globalAlpha=1; ctx.fillStyle=cMuted; ctx.textAlign='right'; ctx.fillText(v.toFixed(0),padL-5,yy);
  }
  // garis target (78kg) putus-putus hijau
  const yt=Y(TARGET_W);
  ctx.setLineDash([4,4]); ctx.strokeStyle=cGreen; ctx.globalAlpha=.85; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(padL,yt); ctx.lineTo(cssW-padR,yt); ctx.stroke();
  ctx.setLineDash([]); ctx.globalAlpha=1;
  ctx.fillStyle=cGreen; ctx.textAlign='left'; ctx.fillText('Target '+TARGET_W,padL+3,yt-7);
  // garis data
  ctx.strokeStyle=cAccent; ctx.lineWidth=2.5; ctx.lineJoin='round';
  ctx.beginPath(); sorted.forEach((w,i)=>{const xx=X(i),yy=Y(w.weight); i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}); ctx.stroke();
  // titik
  sorted.forEach((w,i)=>{
    const xx=X(i),yy=Y(w.weight);
    ctx.beginPath(); ctx.arc(xx,yy,3.5,0,Math.PI*2); ctx.fillStyle=cAccent; ctx.fill();
    ctx.lineWidth=2; ctx.strokeStyle=cSurface; ctx.stroke();
  });
  // label tanggal pertama & terakhir
  ctx.fillStyle=cMuted;
  ctx.textAlign='left';  ctx.fillText(fmtShort(sorted[0].date),padL,cssH-9);
  ctx.textAlign='right'; ctx.fillText(fmtShort(sorted[sorted.length-1].date),cssW-padR,cssH-9);
}
window.addEventListener('resize',()=>{ const w=document.getElementById('gt-weight'); if(w&&w.style.display!=='none')drawWeightChart(); });
document.getElementById('wSave').onclick=()=>{
  const date=document.getElementById('wDate').value;
  const val=parseFloat(document.getElementById('wInput').value);
  if(!date||!val){alert('Isi tanggal & berat dulu ya.');return;}
  weights=weights.filter(w=>w.date!==date);
  weights.push({date,weight:+val.toFixed(1)});
  weights.sort((a,b)=>a.date<b.date?-1:1);
  LS.set('gum_weights',weights);
  document.getElementById('wInput').value='';
  renderWeight();
};

/* =========================================================
   GIZI — submenu tabs (Gizi · Berat)
========================================================= */
function showGiziTab(tt){
  document.querySelectorAll('#giziTabs .tab').forEach(x=>x.classList.toggle('active',x.dataset.gz===tt));
  ['gizi','weight'].forEach(t=>{const el=document.getElementById('gt-'+t); if(el)el.style.display=t===tt?'':'none';});
  if(tt==='weight')renderWeight();
}
document.querySelectorAll('#giziTabs .tab').forEach(b=>b.addEventListener('click',()=>showGiziTab(b.dataset.gz)));
