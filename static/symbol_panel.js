//Dùng cho Live Trade, không liên quan đến trang chủ
// ---------------- symbol_panel.js (v2) ----------------
// Một file duy nhất: hiệu ứng UI + panel chọn symbol (Forex & Coin)
// Không cần sửa chat.html – đảm bảo file này được inject cuối body
// -------------------------------------------------------------------

/* ========== 0. danh sách coin mặc định ========== */
const COINS = [
  "BTCUSDT","ETHUSDT","BNBUSDT","SOLUSDT","XRPUSDT",
  "ADAUSDT","DOGEUSDT","AVAXUSDT","MATICUSDT","LINKUSDT"
];

/* ========== 1. Fade‑in trang ========== */
(()=>{const c="body.fadein0{opacity:0;transition:opacity .9s cubic-bezier(.21,1,.62,1)}body.fadein1{opacity:1}";if(!document.getElementById("fade-css")){const s=document.createElement("style");s.id="fade-css";s.textContent=c;document.head.appendChild(s);}document.body.classList.add("fadein0");window.addEventListener("load",()=>requestAnimationFrame(()=>document.body.classList.replace("fadein0","fadein1")));})();

/* ========== 2. Loader ========== */
(()=>{const c="#gloader{position:fixed;inset:0;background:rgba(6,10,24,.4);display:flex;align-items:center;justify-content:center;z-index:1200;backdrop-filter:blur(3px)}.ring{width:60px;height:60px;border:5px solid #38e2ee44;border-top-color:#38e2ee;border-radius:50%;animation:r 1s linear infinite}@keyframes r{to{transform:rotate(360deg)}}";if(!document.getElementById("ld-css")){const s=document.createElement("style");s.id="ld-css";s.textContent=c;document.head.appendChild(s);}window.showLoader=()=>{if(document.getElementById("gloader"))return;const d=document.createElement("div");d.id="gloader";d.innerHTML="<div class='ring'></div>";document.body.appendChild(d);};window.hideLoader=()=>{document.getElementById("gloader")?.remove();};})();

/* ========== 3. Toast ==========*/
(()=>{const c="#tbox{position:fixed;bottom:26px;right:26px;display:flex;flex-direction:column;gap:9px;z-index:1300}.t{min-width:180px;max-width:280px;padding:11px 16px;border-radius:12px;font-family:'Exo 2',sans-serif;font-size:.95rem;box-shadow:0 4px 22px #0008;opacity:0;transform:translateY(20px);animation:s .35s forwards}.ok{background:#241e42;color:#a7eaff;border-left:4px solid #38e2ee}.err{background:#40253a;color:#ffd1e8;border-left:4px solid #ff5f7d}@keyframes s{to{opacity:1;transform:none}}";if(!document.getElementById("ts-css")){const s=document.createElement("style");s.id="ts-css";s.textContent=c;document.head.appendChild(s);}window.toast=(m,t="ok",ms=2500)=>{let b=document.getElementById("tbox");if(!b){b=document.createElement("div");b.id="tbox";document.body.appendChild(b);}const d=document.createElement("div");d.className=`t ${t}`;d.textContent=m;b.appendChild(d);setTimeout(()=>d.remove(),ms);};})();

/* ========== 4. CSS glow nút =========*/
(()=>{const c=".glow-btn{position:relative;overflow:hidden;isolation:isolate}.glow-btn::after{content:'';position:absolute;inset:-120%;background:conic-gradient(#38e2ee 0deg,#6b3df7 180deg,#38e2ee 360deg);animation:g 4s linear infinite;filter:blur(12px);z-index:-1}@keyframes g{to{transform:rotate(360deg)}}";if(!document.getElementById("gl-css")){const s=document.createElement("style");s.id="gl-css";s.textContent=c;document.head.appendChild(s);}})();

/* ========== 5. Panel chọn symbol =========*/
function ensurePanelCSS(){if(document.getElementById('p-css'))return;const c="#ov{position:fixed;inset:0;background:rgba(6,10,24,.35);backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;z-index:1000}#pa{min-width:340px;max-width:90vw;max-height:66vh;background:rgba(24,24,48,.98);border:2px solid #38e2ee99;border-radius:16px;padding:28px 28px 18px;display:flex;flex-direction:column;animation:f .28s cubic-bezier(.21,1,.67,1)}#pa h3{font-family:Orbitron,sans-serif;color:#a7eaff;text-align:center;font-size:1.3rem;margin-bottom:16px}#ps{margin-bottom:12px;padding:8px 12px;border-radius:9px;border:1.3px solid #6b3df7aa;background:#181830;color:#a7eaff;font-size:1.03rem;width:100%}#pl{flex:1;display:flex;flex-wrap:wrap;gap:10px;overflow-y:auto;max-height:260px;margin-bottom:15px;padding-right:4px}.sb{padding:7px 14px;border-radius:10px;border:none;cursor:pointer;background:#241e42;color:#a7eaff;font-family:Orbitron,sans-serif;font-size:1.04rem;transition:background .2s,color .2s,box-shadow .2s}.sb:hover{background:#38e2ee;color:#181830;box-shadow:0 0 14px #38e2ee80}#cls{align-self:flex-end;background:#353366;color:#bde8fa;border:none;border-radius:8px;padding:6px 18px;cursor:pointer;font-family:'Exo 2',sans-serif;font-size:1rem}@keyframes f{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}";const s=document.createElement('style');s.id='p-css';s.textContent=c;document.head.appendChild(s);} 
function showSymbolsPanel(list, isCoin = false) {
  // Danh sách top coin sẽ hiện mặc định khi chưa search
  const TOP_COINS = [
    "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT",
    "ADAUSDT", "DOGEUSDT", "AVAXUSDT", "MATICUSDT", "LINKUSDT"
  ];

  // Đảm bảo CSS cho panel
  if (!document.getElementById('p-css')) {
    const c = "#ov{position:fixed;inset:0;background:rgba(6,10,24,.35);backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;z-index:1000}#pa{min-width:340px;max-width:90vw;max-height:66vh;background:rgba(24,24,48,.98);border:2px solid #38e2ee99;border-radius:16px;padding:28px 28px 18px;display:flex;flex-direction:column;animation:f .28s cubic-bezier(.21,1,.67,1)}#pa h3{font-family:Orbitron,sans-serif;color:#a7eaff;text-align:center;font-size:1.3rem;margin-bottom:16px}#ps{margin-bottom:12px;padding:8px 12px;border-radius:9px;border:1.3px solid #6b3df7aa;background:#181830;color:#a7eaff;font-size:1.03rem;width:100%}#pl{flex:1;display:flex;flex-wrap:wrap;gap:10px;overflow-y:auto;max-height:260px;margin-bottom:15px;padding-right:4px}.sb{padding:7px 14px;border-radius:10px;border:none;cursor:pointer;background:#241e42;color:#a7eaff;font-family:Orbitron,sans-serif;font-size:1.04rem;transition:background .2s,color .2s,box-shadow .2s}.sb:hover{background:#38e2ee;color:#181830;box-shadow:0 0 14px #38e2ee80}#cls{align-self:flex-end;background:#353366;color:#bde8fa;border:none;border-radius:8px;padding:6px 18px;cursor:pointer;font-family:'Exo 2',sans-serif;font-size:1rem}@keyframes f{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}";
    const s = document.createElement('style'); s.id = 'p-css'; s.textContent = c; document.head.appendChild(s);
  }

  // Tạo overlay panel
  const ov = document.createElement('div'); ov.id = 'ov';
  const pa = document.createElement('div'); pa.id = 'pa';
  pa.innerHTML = `<h3>Chọn ${isCoin ? "coin" : "cặp giao dịch"}</h3>
      <input id='ps' placeholder='Tìm kiếm...'>
      <div id='pl'></div>
      <button id='cls'>Đóng</button>`;
  ov.appendChild(pa); document.body.appendChild(ov);
  const pl = pa.querySelector('#pl');

  // Hàm lọc và hiển thị danh sách
  function filt(k = '') {
    const key = k.trim().toUpperCase();
    let symbolsToShow;
    if (!key && isCoin) {
      symbolsToShow = TOP_COINS;
    } else {
      symbolsToShow = list.filter(s => !key || s.toUpperCase().includes(key));
    }
    pl.innerHTML = '';
    symbolsToShow.forEach(sym => {
      const b = document.createElement('button');
      b.className = 'sb';
      b.textContent = sym;
      b.onclick = () => {
        document.body.removeChild(ov);
        if (isCoin) analyzeCoin(sym);
        else analyzeSymbol(sym);
      };
      pl.appendChild(b);
    });
    if (!pl.children.length)
      pl.innerHTML = '<div style="color:#a7eaff;opacity:.6;text-align:center;padding:20px 0;">Không tìm thấy.</div>';
  }

  // Gán sự kiện cho các control
  pa.querySelector('#ps').oninput = e => filt(e.target.value);
  pa.querySelector('#cls').onclick = () => document.body.removeChild(ov);
  ov.onclick = e => { if (e.target === ov) document.body.removeChild(ov); };
  filt();
  pa.querySelector('#ps').focus();
}

/* ========== 6. Hàm backend ==========*/
function analyzeSymbol(sym){showLoader();appendMsg('user',`📊 Phân tích: ${sym}`);loadChart(sym);postJSON('/analyze_symbol',{symbol:sym}).then(({reply})=>{appendMsg('ai',reply);hideLoader();}).catch(e=>{toast('Lỗi','err');hideLoader();});}
function analyzeCoin(sym){showLoader();appendMsg('user',`📊 Phân tích Coin: ${sym}`);loadChartCoin(sym);postJSON('/analyze_coin',{symbol:sym}).then(({reply})=>{appendMsg('ai',reply);hideLoader();}).catch(e=>{toast('Lỗi','err');hideLoader();});}

/* ========== 7. Load chart coin ==========*/
function loadChartCoin(sym) {
  document.getElementById('tvchart').classList.remove('loaded');
  clearSignalLines(); // Xoá line trước khi vẽ data mới

  fetch(`/ohlcv_coin?symbol=${encodeURIComponent(sym)}&n=1000`)
    .then(r => r.json())
    .then(d => {
      const o = d.ohlcv || [];
      if (!o.length) return toast('Không có dữ liệu', 'err');

      // Đếm số lẻ của close (vd: 1.09283 là 5 lẻ)
      const decimals = Math.max(2, Math.min(5, (o[0].close.toString().split('.')[1] || '').length));
      const minMove = Number((10 ** -decimals).toFixed(decimals));

      chart.removeSeries(series); // Xoá series cũ
      series = chart.addCandlestickSeries({
        priceFormat: {
          type: 'price',
          precision: decimals,
          minMove: minMove
        }
      });

      // *** DÒNG QUAN TRỌNG ĐỂ HIỂN THỊ ĐỦ SỐ LẺ ***
      chart.applyOptions({
        localization: {
          priceFormatter: p => p.toFixed(decimals)
        }
      });

      // Vẽ lại dữ liệu
      series.setData(o.map(x => ({
        time: x.time,
        open: x.open,
        high: x.high,
        low: x.low,
        close: x.close
      })));
      chart.timeScale().fitContent();
      document.getElementById('tvchart').classList.add('loaded');
    })
    .catch(e => toast('Lỗi chart', 'err'));
}
/* ========== 8. DOM load: gắn sự kiện =========*/
document.addEventListener('DOMContentLoaded',()=>{
  const btnFx=document.getElementById('btnAnalyze');btnFx?.classList.add('glow-btn');
  if(btnFx){btnFx.onclick=async()=>{showLoader();try{const r=await fetch('/symbols');const {symbols=[]}=await r.json();hideLoader();if(!symbols.length)return toast('Không lấy được symbol','err');showSymbolsPanel(symbols,false);}catch{hideLoader();toast('API lỗi','err');}}}
  const row=document.getElementById('inputrow');if(row){const b=document.createElement('button');b.id='btnCoin';b.textContent='Phân tích Coin';b.className='glow-btn';row.appendChild(b);b.onclick = async () => {
  showLoader();
  try {
    const res = await fetch('/coins');
    const { coins = [] } = await res.json();
    hideLoader();
    if(!coins.length) return toast('Không lấy được danh sách coin','err');
    showSymbolsPanel(coins, true);
  } catch (e) {
    hideLoader();
    toast('API coin lỗi','err');
  }
};
}
});

// -------------------------------------------------------------------
