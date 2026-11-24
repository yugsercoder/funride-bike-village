// FunRide Bike Village 3D: Branded sponsor setups: DOT, Oxecure / Dr. O, BDO, Specialign.
// Loaded in order by main.js once fonts and logos are ready; top-level names are shared across files.
"use strict";

/* ---------- branded sponsor setups (DOT, Oxecure / Dr. O, BDO, Specialign) ----------
   Built from the sample tent designs: peaked branded canopy, backdrop, main table (4 x 2 x 3 ft),
   cocktail table, covered monoblock chairs, monitor, feather banners on both sides, carpet,
   and beside the tent an 8 x 4 ft photo wall with 3D letters on a plinth. */
const LOGO = {};
{
  const imgs = window.FR_LOGO_IMG || {};
  const greyInvert = (d, i) => { const mx = Math.max(d[i], d[i+1], d[i+2]), mn = Math.min(d[i], d[i+1], d[i+2]); if (mx - mn < 46){ const v = 255 - (mx + mn) / 2; d[i] = d[i+1] = d[i+2] = v; } };
  const blueToWhite = (d, i) => { if (d[i+2] > d[i] + 40 && d[i+2] >= d[i+1]){ d[i] = d[i+1] = d[i+2] = 255; } };
  const prep = (key, from, map) => {
    const img = imgs[from]; if (!img || !img.naturalWidth) return;
    const w = img.naturalWidth, h = img.naturalHeight;
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const g = cv.getContext('2d'); g.drawImage(img, 0, 0);
    const id = g.getImageData(0, 0, w, h), d = id.data;
    // opaque background (a few px in from the corner): knock out the white paper
    const paper = d[((Math.floor(h * .03) * w) + Math.floor(w * .03)) * 4 + 3] > 250;
    let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++){
      const i = (y * w + x) * 4;
      if (paper){ const m = Math.min(d[i], d[i+1], d[i+2]); if (m > 205) d[i+3] = Math.round(d[i+3] * Math.max(0, (245 - m) / 40)); }
      if (d[i+3] > 24){ if (map) map(d, i); if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    if (x1 < 0) return;
    g.putImageData(id, 0, 0);
    const out = document.createElement('canvas'); out.width = x1 - x0 + 1; out.height = y1 - y0 + 1;
    out.getContext('2d').drawImage(cv, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
    LOGO[key] = out;
  };
  prep('frph', 'frph'); prep('frphW', 'frph', blueToWhite);
  prep('bdo', 'bdo'); prep('bdoW', 'bdo', blueToWhite);
  prep('spec', 'specialign'); prep('specW', 'specialign', greyInvert);
  prep('dro', 'dro'); prep('droW', 'dro', greyInvert);
  prep('oxecure', 'oxecure');
  prep('byd', 'byd'); prep('bydW', 'byd', greyInvert);
}
// Department of Tourism mark: gold seal + wordmark (drawn, no logo file in 00 - LOGOS)
const DOTC = {navy:'#1b2a8a', red:'#d7262e', yellow:'#fcc419', blue:'#1f3fb5', gold:'#e9a90c'};
{
  const cv = document.createElement('canvas'), g = cv.getContext('2d'), H = 220;
  g.font = `700 56px ${FONT}`;
  const tw = Math.max(...['DEPARTMENT','OF TOURISM','PHILIPPINES'].map(s => g.measureText(s).width));
  cv.width = H + 24 + tw + 4; cv.height = H;
  const c = H / 2, P = Math.PI;
  g.fillStyle = DOTC.gold; g.beginPath(); g.arc(c, c, c - 4, 0, 2 * P); g.fill();
  g.fillStyle = '#fff8e1'; g.beginPath(); g.arc(c, c, c * .74, 0, 2 * P); g.fill();
  g.fillStyle = '#ffffff'; for (let i = 0; i < 28; i++){ const a = i / 28 * 2 * P; g.beginPath(); g.arc(c + Math.cos(a) * c * .87, c + Math.sin(a) * c * .87, 3.2, 0, 2 * P); g.fill(); }
  g.strokeStyle = DOTC.gold; g.lineWidth = 7; g.lineCap = 'round';
  for (let i = 0; i < 8; i++){ const a = i / 8 * 2 * P; g.beginPath(); g.moveTo(c + Math.cos(a) * c * .28, c + Math.sin(a) * c * .28); g.lineTo(c + Math.cos(a) * c * .6, c + Math.sin(a) * c * .6); g.stroke(); }
  g.fillStyle = DOTC.gold; g.beginPath(); g.arc(c, c, c * .2, 0, 2 * P); g.fill();
  g.fillStyle = DOTC.navy; g.textAlign = 'left'; g.textBaseline = 'middle'; g.font = `700 56px ${FONT}`;
  ['DEPARTMENT','OF TOURISM','PHILIPPINES'].forEach((s, i) => g.fillText(s, H + 24, c + (i - 1) * 62));
  LOGO.dot = cv;
  // "DISCOVER | MORE TO LOVE" pill
  const p = document.createElement('canvas'), q = p.getContext('2d'); p.width = 1000; p.height = 170;
  const rr = (x, y, w, h, r) => { q.beginPath(); if (q.roundRect) q.roundRect(x, y, w, h, r); else q.rect(x, y, w, h); };
  q.fillStyle = DOTC.navy; rr(4, 4, 992, 162, 81); q.fill();
  q.fillStyle = '#ffffff'; rr(420, 18, 562, 134, 67); q.fill();
  q.textAlign = 'center'; q.textBaseline = 'middle'; q.font = `700 88px ${FONT}`;
  q.fillStyle = '#ffffff'; q.fillText('DISCOVER', 212, 88);
  q.fillStyle = DOTC.navy; q.fillText('MORE TO LOVE', 701, 88);
  LOGO.dtl = p;
}

function artTex(wM, hM, draw, ppm){
  ppm = ppm || 230;
  let cw = Math.round(wM * ppm), ch = Math.round(hM * ppm);
  const k = Math.min(1, 2048 / Math.max(cw, ch)); cw = Math.max(16, Math.round(cw * k)); ch = Math.max(16, Math.round(ch * k));
  const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
  draw(cv.getContext('2d'), cw, ch);
  const t = new THREE.CanvasTexture(cv); t.encoding = THREE.sRGBEncoding; t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
}
const artMat = (wM, hM, draw, o) => new THREE.MeshStandardMaterial(Object.assign({map:artTex(wM, hM, draw), roughness:.8}, o || {}));
const solid = (c, o) => new THREE.MeshStandardMaterial(Object.assign({color:col(c), roughness:.75}, o || {}));
// draw a logo fitted inside a (mw x mh) box centred on (cx, cy); returns the drawn width
function logo(g, key, cx, cy, mw, mh){
  const L = LOGO[key]; if (!L) return 0;
  const s = Math.min(mw / L.width, mh / L.height), w = L.width * s, h = L.height * s;
  g.drawImage(L, cx - w / 2, cy - h / 2, w, h); return w;
}
function vlogo(g, key, cx, cy, mw, mh){ g.save(); g.translate(cx, cy); g.rotate(-Math.PI / 2); logo(g, key, 0, 0, mh, mw); g.restore(); }
// FunRide PH logo | sponsor logo, centred on (cx, cy), h = FunRide logo height
function lockup(g, cx, cy, h, right, o){
  o = o || {};
  const fr = LOGO[o.fr || 'frph'], R = LOGO[right];
  const fw = fr ? fr.width / fr.height * h : 0, rh = h * (o.rh || .6);
  let rw = R ? R.width / R.height * rh : 0;
  if (o.maxW){ const room = o.maxW - fw - h * .5; if (rw > room) rw = Math.max(0, room); }
  const gap = h * .2, tot = fw + gap * 2 + rw;
  let x = cx - tot / 2;
  if (fr) g.drawImage(fr, x, cy - h / 2, fw, h);
  x += fw + gap;
  g.fillStyle = o.line || '#16183f'; g.fillRect(x - h * .012, cy - h * .36, Math.max(2, h * .024), h * .72);
  x += gap;
  if (R){ const rH = rw * R.height / R.width; g.drawImage(R, x, cy - rH / 2, rw, rH); }
}
function band(g, color, p){
  g.fillStyle = color; g.beginPath(); g.moveTo(p[0], p[1]); g.quadraticCurveTo(p[2], p[3], p[4], p[5]);
  g.lineTo(p[6], p[7]); g.quadraticCurveTo(p[8], p[9], p[10], p[11]); g.closePath(); g.fill();
}
const lin = (g, x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; };
// red / yellow / blue Philippine wave along the bottom (DOT)
function waves(g, W, H, y0, flip){
  const h = H - y0;
  [[DOTC.yellow, 0], [DOTC.red, .3], [DOTC.blue, .55]].forEach(([c, o]) => {
    g.fillStyle = c; g.beginPath();
    const a = y0 + h * o, b = y0 + h * (o + .25);
    if (flip){ g.moveTo(0, b); g.bezierCurveTo(W * .35, a - h * .2, W * .65, b + h * .25, W, a); }
    else { g.moveTo(0, a); g.bezierCurveTo(W * .35, b + h * .25, W * .65, a - h * .2, W, b); }
    g.lineTo(W, H); g.lineTo(0, H); g.closePath(); g.fill();
  });
}
function stepRepeat(g, x0, y0, x1, y1, pw){
  const ph = pw * .17, cols = Math.max(1, Math.floor((x1 - x0) / (pw * 1.35))), rows = Math.max(1, Math.floor((y1 - y0) / (ph * 2.2)));
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++){
    const sx = (x1 - x0) / cols, x = x0 + sx * (c + .5) + (r % 2 ? sx * .25 : -sx * .25);
    logo(g, 'dtl', x, y0 + (y1 - y0) * (r + .5) / rows, pw, ph);
  }
}
function cyclist(g, x, y, s, c){
  g.strokeStyle = c; g.fillStyle = c; g.lineWidth = s * .07; g.lineCap = 'round';
  [[-.42, 0], [.42, 0]].forEach(([dx]) => { g.beginPath(); g.arc(x + dx * s, y, s * .3, 0, Math.PI * 2); g.stroke(); });
  g.beginPath(); g.moveTo(x - .42 * s, y); g.lineTo(x - .08 * s, y - .45 * s); g.lineTo(x + .3 * s, y - .42 * s); g.lineTo(x + .42 * s, y);
  g.moveTo(x - .08 * s, y - .45 * s); g.lineTo(x, y); g.lineTo(x + .3 * s, y - .42 * s); g.stroke();
  g.lineWidth = s * .13; g.beginPath(); g.moveTo(x - .1 * s, y - .55 * s); g.lineTo(x + .22 * s, y - .85 * s); g.lineTo(x + .38 * s, y - .5 * s); g.stroke();
  g.beginPath(); g.moveTo(x - .05 * s, y - .5 * s); g.lineTo(x + .05 * s, y - .18 * s); g.stroke();
  g.beginPath(); g.arc(x + .3 * s, y - .98 * s, s * .11, 0, Math.PI * 2); g.fill();
}
// sunset city skyline with two riders (photo-wall artwork)
function cityScene(g, x, y, w, h, o){
  o = o || {};
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = lin(g, 0, y, 0, y + h, [[0, '#7fb6e6'], [.55, '#f9d48b'], [.75, '#f6a95b'], [1, '#f6a95b']]); g.fillRect(x, y, w, h);
  g.fillStyle = 'rgba(255,240,190,.9)'; g.beginPath(); g.arc(x + w * .62, y + h * .62, w * .12, 0, Math.PI * 2); g.fill();
  const sky = [.1,.18,.08,.26,.14,.34,.2,.12,.3,.16,.22,.1,.28,.15];
  g.fillStyle = '#4d6f9c';
  sky.forEach((k, i) => { const bw = w / sky.length; g.fillRect(x + i * bw, y + h * (.68 - k * .9), bw * .86, h * k * .9 + h * .02); });
  if (o.church){ g.fillStyle = '#6b5a4c'; g.fillRect(x + w * .72, y + h * .42, w * .2, h * .3); g.beginPath(); g.moveTo(x + w * .72, y + h * .42); g.lineTo(x + w * .82, y + h * .3); g.lineTo(x + w * .92, y + h * .42); g.fill(); }
  g.fillStyle = '#3c4048'; g.beginPath(); g.moveTo(x, y + h); g.lineTo(x + w * .38, y + h * .7); g.lineTo(x + w * .62, y + h * .7); g.lineTo(x + w, y + h); g.fill();
  g.fillStyle = '#ffffff'; for (let i = 0; i < 4; i++){ const t = i / 4; g.fillRect(x + w * (.49 - .01), y + h * (.72 + t * .26), w * .02, h * .045); }
  g.fillStyle = '#8a9099'; g.fillRect(x, y + h * .68, w, h * .025);
  cyclist(g, x + w * .32, y + h * .66, h * .16, '#15171d'); cyclist(g, x + w * .58, y + h * .64, h * .13, '#15171d');
  g.restore();
}

const BRANDS = {
  bdo: {
    canopy:'#0f3d99', carpet:'#123f9a', border:'#fdb913', plinth:'#0f3d99', glow:'#ffc928', lamps:2, size:'s',
    letters:[['B', .61, .914, '#ffffff', '#cfd6e6'], ['D', .61, .914, '#ffffff', '#cfd6e6'], ['O', .61, .914, '#fdb913', '#d49a07']],
    roof:(g, W, H) => { g.fillStyle = '#0f3d99'; g.fillRect(0, 0, W, H);
      band(g, '#fdb913', [0, H, W * .1, H * .82, W * .24, H * .74, W * .3, H * .8, W * .14, H * .9, W * .06, H]);
      band(g, '#fdb913', [W, H, W * .9, H * .82, W * .76, H * .74, W * .7, H * .8, W * .86, H * .9, W * .94, H]);
      logo(g, 'bdoW', W / 2, H * .7, W * .34, H * .34); },
    valance:(g, W, H) => { g.fillStyle = '#0f3d99'; g.fillRect(0, 0, W, H);
      g.fillStyle = '#fdb913'; g.beginPath(); g.moveTo(0, H); g.lineTo(W * .16, 0); g.lineTo(W * .22, 0); g.lineTo(W * .06, H); g.fill();
      g.beginPath(); g.moveTo(W, H); g.lineTo(W * .84, 0); g.lineTo(W * .78, 0); g.lineTo(W * .94, H); g.fill();
      logo(g, 'bdoW', W / 2, H / 2, W * .4, H * .72); },
    back:(g, W, H) => { g.fillStyle = lin(g, 0, 0, W, H, [[0, '#1a4fc0'], [1, '#0b2f80']]); g.fillRect(0, 0, W, H);
      lockup(g, W / 2, H * .26, H * .24, 'bdoW', {fr:'frphW', line:'#ffffff', rh:.42});
      band(g, '#fdb913', [0, H * .72, W * .5, H * .6, W, H * .38, W, H * .43, W * .5, H * .66, 0, H * .78]);
      cyclist(g, W * .74, H * .52, H * .14, '#fdb913'); },
    table:(g, W, H) => { g.fillStyle = '#0f3d99'; g.fillRect(0, 0, W, H);
      band(g, '#fdb913', [W * .45, H, W * .75, H * .7, W, H * .45, W, H * .62, W * .78, H * .85, W * .65, H]);
      logo(g, 'bdoW', W / 2, H * .42, W * .62, H * .42); },
    wall:(g, W, H) => { g.fillStyle = '#0f3d99'; g.fillRect(0, 0, W, H);
      lockup(g, W / 2, H * .12, H * .12, 'bdoW', {fr:'frphW', line:'#ffffff', rh:.42, maxW:W * .9});
      cityScene(g, W * .05, H * .24, W * .9, H * .66, {church:true}); },
    flags:[(g, W, H) => { g.fillStyle = '#0f3d99'; g.fillRect(0, 0, W, H);
      band(g, '#fdb913', [0, H * .78, W * .5, H * .7, W, H * .52, W, H * .62, W * .5, H * .8, 0, H * .88]);
      vlogo(g, 'bdoW', W * .48, H * .33, W * .78, H * .5); }],
    screen:(g, W, H) => { g.fillStyle = '#0f3d99'; g.fillRect(0, 0, W, H); band(g, '#fdb913', [W * .5, H, W * .8, H * .75, W, H * .6, W, H * .75, W * .85, H * .9, W * .7, H]); logo(g, 'bdoW', W / 2, H * .45, W * .6, H * .5); },
    sign:(g, W, H) => { g.fillStyle = '#0f3d99'; g.fillRect(0, 0, W, H); g.fillStyle = '#ffffff'; g.font = `700 ${H * .1}px ${FONT}`; g.textAlign = 'center'; g.fillText('Open a', W / 2, H * .14); g.fillText('BDO Account', W / 2, H * .26); g.fillText('Today!', W / 2, H * .38); qr(g, W * .2, H * .46, W * .6); }
  },
  specialign: {
    canopy:'#ffffff', carpet:'#3b3e46', border:'#f7c600', plinth:'#f4f5f7', glow:'#f7c600', lamps:2, size:'s',
    letters:[['S', .61, .914, '#f7c600', '#d1a700']],
    roof:(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); lockup(g, W / 2, H * .68, H * .36, 'spec', {rh:.42, maxW:W * .62}); },
    valance:(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); g.fillStyle = '#f7c600'; g.fillRect(0, H * .84, W, H * .16); },
    back:(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
      band(g, '#f7c600', [0, H * .02, W * .12, H * .04, W * .4, 0, W * .3, H * .03, W * .1, H * .12, 0, H * .22]);
      band(g, '#f7c600', [0, H * .3, W * .2, H * .14, W * .55, H * .04, W * .42, H * .08, W * .18, H * .2, 0, H * .36]);
      band(g, '#f7c600', [W * .1, H, W * .55, H * .66, W, H * .56, W, H * .62, W * .6, H * .74, W * .3, H]);
      band(g, '#fbe38a', [W * .45, H, W * .75, H * .8, W, H * .74, W, H * .8, W * .8, H * .9, W * .62, H]);
      logo(g, 'spec', W / 2, H * .42, W * .78, H * .24); },
    table:(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
      band(g, '#f7c600', [W * .4, H, W * .75, H * .72, W, H * .62, W, H * .72, W * .8, H * .86, W * .6, H]);
      logo(g, 'spec', W / 2, H * .4, W * .78, H * .3); },
    wall:(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
      lockup(g, W / 2, H * .11, H * .1, 'spec', {rh:.4, maxW:W * .92});
      cityScene(g, 0, H * .22, W, H * .78); },
    flags:[(g, W, H) => { g.fillStyle = '#15161a'; g.fillRect(0, 0, W, H);
      band(g, '#f7c600', [0, H * .86, W * .5, H * .8, W, H * .7, W, H * .76, W * .5, H * .86, 0, H * .92]);
      vlogo(g, 'specW', W * .48, H * .4, W * .7, H * .72); }],
    screen:(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); logo(g, 'spec', W / 2, H / 2, W * .84, H * .5); },
    sign:(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); g.fillStyle = '#15161a'; g.font = `700 ${H * .1}px ${FONT}`; g.textAlign = 'center'; g.fillText('Learn More', W / 2, H * .14); g.fillText('About', W / 2, H * .26); g.fillText('Specialign', W / 2, H * .38); qr(g, W * .2, H * .46, W * .6); }
  },
  dot: {
    canopy:'#ffffff', carpet:'#1f3fb5', border:'#fcc419', plinth:'#1b2a8a', glow:'#ffc928', lamps:3, size:'m',
    letters:[['D', .61, .914, '#ffffff', '#c9d0e6'], ['O', .61, .914, '#ffffff', '#c9d0e6'], ['T', .61, .914, '#ffffff', '#c9d0e6']],
    roof:(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); lockup(g, W / 2, H * .62, H * .36, 'dot', {rh:.7, maxW:W * .6}); waves(g, W, H, H * .82); },
    valance:(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); waves(g, W, H, 0, true); },
    back:(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
      lockup(g, W / 2, H * .2, H * .25, 'dot', {rh:.7});
      logo(g, 'dtl', W / 2, H * .45, W * .46, H * .13);
      stepRepeat(g, W * .04, H * .54, W * .96, H * .8, W * .1);
      waves(g, W, H, H * .84); },
    table:(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
      logo(g, 'dot', W * .3, H * .4, W * .42, H * .36); g.fillStyle = DOTC.navy; g.fillRect(W * .535, H * .2, Math.max(2, W * .006), H * .4); logo(g, 'dtl', W * .76, H * .4, W * .4, H * .2); waves(g, W, H, H * .72); },
    wall:(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
      g.fillStyle = DOTC.blue; g.beginPath(); g.moveTo(0, 0); g.lineTo(W, 0); g.lineTo(W, H * .02); g.bezierCurveTo(W * .6, H * .07, W * .3, 0, 0, H * .06); g.fill();
      lockup(g, W / 2, H * .13, H * .09, 'dot', {rh:.7, maxW:W * .92});
      logo(g, 'dtl', W / 2, H * .25, W * .86, H * .07);
      stepRepeat(g, W * .04, H * .32, W * .96, H * .82, W * .26);
      waves(g, W, H, H * .86); },
    flags:[(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); vlogo(g, 'dtl', W * .5, H * .36, W * .7, H * .62); waves(g, W, H, H * .72); }],
    screen:(g, W, H) => { // destination loop: islands and sea
      g.fillStyle = lin(g, 0, 0, 0, H, [[0, '#8fd0ff'], [.45, '#cdeeff'], [.46, '#1fb5c9'], [1, '#0c7fa8']]); g.fillRect(0, 0, W, H);
      g.fillStyle = '#2f6b3a'; [[.2, .46, .16, .3], [.5, .46, .12, .38], [.78, .46, .14, .26]].forEach(([x, y, w, h]) => { g.beginPath(); g.moveTo(W * (x - w), H * y); g.quadraticCurveTo(W * (x - w * .6), H * (y - h), W * x, H * (y - h)); g.quadraticCurveTo(W * (x + w * .6), H * (y - h), W * (x + w), H * y); g.fill(); });
      g.fillStyle = '#ffffff'; g.fillRect(W * .62, H * .6, W * .12, H * .04); },
    sign:(g, W, H) => { g.fillStyle = DOTC.navy; g.fillRect(0, 0, W, H); g.fillStyle = '#ffffff'; g.font = `700 ${H * .1}px ${FONT}`; g.textAlign = 'center'; g.fillText('DISCOVER', W / 2, H * .14); g.fillText('MORE TO', W / 2, H * .26); g.fillText('LOVE', W / 2, H * .38); qr(g, W * .2, H * .46, W * .6); }
  },
  oxdro: {
    canopy:'#ffffff', carpet:'#6b6e77', border:'#2a2c33', plinth:'#141416', glow:'#ffffff', lamps:2, size:'m', split:true,
    letters:[['D', .61, .61, '#ffffff', '#b9bcc4'], ['r', .457, .457, '#ffffff', '#b9bcc4'], ['O', .914, .914, '#ffffff', '#b9bcc4']],
    plinthArt:(g, W, H) => { g.fillStyle = '#141416'; g.fillRect(0, 0, W, H); g.fillStyle = '#ffffff'; g.font = `700 ${H * .62}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; if (g.letterSpacing !== undefined) g.letterSpacing = `${H * .25}px`; g.fillText('SKIN LAB', W / 2, H * .54); },
    roof:(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); logo(g, 'frph', W / 2, H * .66, W * .3, H * .48); },
    valance:(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
      logo(g, 'oxecure', W * .25, H / 2, W * .36, H * .62); logo(g, 'dro', W * .75, H / 2, W * .36, H * .74);
      g.fillStyle = '#16183f'; g.fillRect(W / 2 - 1, H * .15, 2, H * .7); },
    backL:(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
      band(g, '#22b24c', [0, H * .4, W * .3, H * .75, W * .62, H, W * .45, H, W * .2, H * .82, 0, H * .62]);
      band(g, '#22b24c', [W * .62, 0, W * .85, H * .22, W, H * .26, W, H * .36, W * .82, H * .3, W * .5, 0]);
      logo(g, 'oxecure', W * .52, H * .34, W * .76, H * .2); },
    backR:(g, W, H) => { g.fillStyle = lin(g, 0, 0, W, 0, [[0, '#ffffff'], [1, '#eceef1']]); g.fillRect(0, 0, W, H);
      band(g, '#26272c', [W * .58, 0, W * .82, H * .35, W, H * .52, W, H * .64, W * .76, H * .45, W * .42, 0]);
      band(g, '#9a9da5', [W * .8, H, W * .9, H * .86, W, H * .8, W, H * .9, W * .95, H * .95, W * .9, H]);
      logo(g, 'dro', W * .46, H * .34, W * .56, H * .4); },
    tables:[(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); logo(g, 'oxecure', W / 2, H * .45, W * .8, H * .34); },
            (g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); logo(g, 'dro', W / 2, H * .45, W * .5, H * .62); }],
    wall:(g, W, H) => { g.fillStyle = lin(g, 0, 0, W, H, [[0, '#f4f5f7'], [1, '#d9dce2']]); g.fillRect(0, 0, W, H);
      band(g, '#26272c', [0, 0, W * .25, H * .15, W * .5, H * .3, W * .3, H * .32, W * .1, H * .2, 0, H * .12]);
      band(g, '#7b7e86', [W, H * .62, W * .7, H * .75, W * .45, H, W * .62, H, W * .82, H * .84, W, H * .74]);
      logo(g, 'dro', W / 2, H * .28, W * .72, H * .3);
      [[.38, .7, .2], [.66, .62, .14]].forEach(([x, y, r]) => { g.fillStyle = 'rgba(255,255,255,.7)'; g.strokeStyle = '#b8bcc6'; g.lineWidth = W * .012; g.beginPath(); g.arc(W * x, H * y, W * r, 0, Math.PI * 2); g.fill(); g.stroke(); }); },
    flags:[(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); g.fillStyle = '#22b24c'; g.fillRect(W * .82, 0, W * .18, H); vlogo(g, 'oxecure', W * .45, H * .38, W * .62, H * .66); },
           (g, W, H) => { g.fillStyle = '#141416'; g.fillRect(0, 0, W, H); vlogo(g, 'droW', W * .48, H * .36, W * .72, H * .5); }],
    screen:(g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); logo(g, 'dro', W / 2, H / 2, W * .5, H * .8); }
  }
};
function qr(g, x, y, s){ // stand-in QR code
  g.fillStyle = '#ffffff'; g.fillRect(x, y, s, s); g.fillStyle = '#111';
  const n = 9, c = s / n; let seed = 7;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++){ seed = (seed * 9301 + 49297) % 233280; if (seed / 233280 > .52) g.fillRect(x + i * c, y + j * c, c, c); }
  [[0, 0], [n - 3, 0], [0, n - 3]].forEach(([i, j]) => { g.fillRect(x + i * c, y + j * c, c * 3, c * 3); g.fillStyle = '#fff'; g.fillRect(x + (i + .6) * c, y + (j + .6) * c, c * 1.8, c * 1.8); g.fillStyle = '#111'; g.fillRect(x + (i + 1) * c, y + (j + 1) * c, c, c); });
}

// 3D letter outlines (x 0..w, y 0..h)
function glyph(ch, w, h){
  const P = Math.PI, t = Math.min(w, h) * .27, s = new THREE.Shape(), out = [s];
  const hole = () => { const p = new THREE.Path(); s.holes.push(p); return p; };
  if (ch === 'O'){
    s.absellipse(w / 2, h / 2, w / 2, h / 2, 0, 2 * P, false);
    hole().absellipse(w / 2, h / 2, w / 2 - t, h / 2 - t, 0, 2 * P, true);
  } else if (ch === 'D'){
    const rx = Math.min(w * .62, h / 2);
    s.moveTo(0, 0); s.lineTo(w - rx, 0); s.absellipse(w - rx, h / 2, rx, h / 2, -P / 2, P / 2, false); s.lineTo(0, h); s.lineTo(0, 0);
    const p = hole(); p.moveTo(t, t); p.lineTo(w - rx, t); p.absellipse(w - rx, h / 2, rx - t, h / 2 - t, -P / 2, P / 2, false); p.lineTo(t, h - t); p.lineTo(t, t);
  } else if (ch === 'B'){
    const hb = h * .52, rB = w * .48, rT = w * .42, cB = w - rB, cT = w * .95 - rT;
    s.moveTo(0, 0); s.lineTo(cB, 0); s.absellipse(cB, hb / 2, rB, hb / 2, -P / 2, P / 2, false);
    s.lineTo(cT, hb); s.absellipse(cT, (hb + h) / 2, rT, (h - hb) / 2, -P / 2, P / 2, false); s.lineTo(0, h); s.lineTo(0, 0);
    const bowl = (y0, y1, cx, rx) => { const p = hole(); p.moveTo(t, y0); p.lineTo(cx, y0); p.absellipse(cx, (y0 + y1) / 2, rx, (y1 - y0) / 2, -P / 2, P / 2, false); p.lineTo(t, y1); p.lineTo(t, y0); };
    bowl(t, hb - t / 2, cB, rB - t); bowl(hb + t / 2, h - t, cT, rT - t);
  } else if (ch === 'T'){
    const a = w / 2 - t / 2, b = w / 2 + t / 2;
    s.moveTo(0, h); s.lineTo(w, h); s.lineTo(w, h - t); s.lineTo(b, h - t); s.lineTo(b, 0); s.lineTo(a, 0); s.lineTo(a, h - t); s.lineTo(0, h - t); s.lineTo(0, h);
  } else if (ch === 'r'){
    const tt = w * .34;
    s.moveTo(0, 0); s.lineTo(tt, 0); s.lineTo(tt, h * .5); s.quadraticCurveTo(tt * 1.15, h - tt * .9, w, h - tt * .8);
    s.lineTo(w, h); s.quadraticCurveTo(tt * 1.6, h * 1.02, tt, h * .86); s.lineTo(tt, h); s.lineTo(0, h); s.lineTo(0, 0);
  } else if (ch === 'S'){
    const ts = w * .3, ry = (h / 2 + ts / 2) / 2, rx = w / 2;
    const top = new THREE.Shape(), bot = new THREE.Shape();
    top.absellipse(w / 2, h - ry, rx, ry, .12 * P, 1.5 * P, false); top.absellipse(w / 2, h - ry, rx - ts, ry - ts, 1.5 * P, .12 * P, true); top.closePath();
    bot.absellipse(w / 2, ry, rx, ry, .5 * P, -.88 * P, true); bot.absellipse(w / 2, ry, rx - ts, ry - ts, -.88 * P, .5 * P, false); bot.closePath();
    return [top, bot];
  }
  return out;
}
function letterMesh(ch, w, h, face, side){
  const geo = new THREE.ExtrudeGeometry(glyph(ch, w, h), {depth:.22, bevelEnabled:false, curveSegments:28});
  return new THREE.Mesh(geo, [new THREE.MeshStandardMaterial({color:col(face), roughness:.45}), new THREE.MeshStandardMaterial({color:col(side), roughness:.6})]);
}
const FLAG_GEO = (() => {
  const s = new THREE.Shape();
  s.moveTo(0, .5); s.lineTo(0, 2.75); s.quadraticCurveTo(.02, 3.06, .32, 3.0); s.quadraticCurveTo(.66, 2.9, .62, 2.2); s.lineTo(.56, .6); s.quadraticCurveTo(.3, .44, 0, .5);
  const g = new THREE.ShapeGeometry(s, 18), p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / .66, (p.getY(i) - .44) / 2.62);
  return g;
})();
function featherBanner(art, mirror){
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.018, .022, 3.05, 6), solid('#2a2c33', {metalness:.4, roughness:.4})); pole.position.y = 1.525; g.add(pole);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(.28, .3, .06, 16), solid('#1d1f25')); base.position.y = .03; g.add(base);
  const flag = new THREE.Mesh(FLAG_GEO, new THREE.MeshStandardMaterial({map:artTex(.66, 2.62, art, 200), side:THREE.DoubleSide, roughness:.85}));
  flag.position.x = .02; g.add(flag);
  if (mirror){   // flies the other way; flip the print back so it still reads correctly
    flag.scale.x = -1; flag.position.x = -.02;
    const t = flag.material.map; t.wrapS = THREE.RepeatWrapping; t.repeat.x = -1; t.offset.x = 1;
  }
  return g;
}
const CHAIR = {cover:solid('#fbfbfa', {roughness:.9})};
function chair(x, z, ry){
  const g = new THREE.Group();
  const skirt = new THREE.Mesh(new THREE.BoxGeometry(.44, .44, .44), CHAIR.cover); skirt.position.y = .22; g.add(skirt);
  const back = new THREE.Mesh(new THREE.BoxGeometry(.44, .5, .07), CHAIR.cover); back.position.set(0, .69, -.19); back.rotation.x = -.08; g.add(back);
  g.position.set(x, 0, z); g.rotation.y = ry || 0; return g;
}
function cocktail(x, z, flower){
  const g = new THREE.Group(), white = solid('#fbfbfa', {roughness:.9});
  const sk = new THREE.Mesh(new THREE.CylinderGeometry(.2, .34, 1.02, 20), white); sk.position.y = .51; g.add(sk);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(.36, .3, .08, 24), white); top.position.y = 1.06; g.add(top);
  const vase = new THREE.Mesh(new THREE.CylinderGeometry(.05, .04, .1, 10), white); vase.position.y = 1.15; g.add(vase);
  const fl = new THREE.Mesh(new THREE.IcosahedronGeometry(.1, 1), solid(flower || '#ffd23d', {flatShading:true})); fl.position.y = 1.25; g.add(fl);
  g.position.set(x, 0, z); return g;
}
function plant(x, z){
  const g = new THREE.Group();
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(.2, .15, .5, 14), solid('#f4f4f2', {roughness:.5})); pot.position.y = .25; g.add(pot);
  const leafM = solid('#3e9a36', {flatShading:true, roughness:.9});
  [[0, .85, 0, .34], [.1, 1.12, .05, .24], [-.1, 1.05, -.06, .22]].forEach(([lx, ly, lz, r]) => { const l = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), leafM); l.position.set(lx, ly, lz); l.scale.y = 1.25; g.add(l); });
  g.position.set(x, 0, z); return g;
}
const BRAND_PEOPLE = [];   // staff and visitors, spawned once makePerson exists

function brandBooth(it){
  const B = BRANDS[it.brand], mate = it.mate ? BY[it.mate] : null;
  const w = (it.w + (mate ? mate.w : 0)) / S, d = it.h / S;
  const outer = new THREE.Group(), g = new THREE.Group();
  const cx = mate ? (mate.x - it.x) / 2 / S : 0;          // shared tent: centre between the two halves
  g.position.x = cx; outer.add(g);
  const right = id => o => { if (mate) o.traverse(m => { if (m.isMesh) m.userData.pickAs = id; }); return o; };
  const toMate = right(mate ? mate.id : null);
  const dispItem = mate || it;
  const eave = 2.3, valH = .32, roofH = .95, y0 = eave + valH, hw = w / 2, hd = d / 2;

  // carpet with a coloured border
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(w + .24, d + .24), solid(B.border, {roughness:1}));
  rug.rotation.x = -Math.PI / 2; rug.position.y = .046; g.add(rug);
  const rug2 = new THREE.Mesh(new THREE.PlaneGeometry(w - .06, d - .06), solid(B.carpet, {roughness:1}));
  rug2.rotation.x = -Math.PI / 2; rug2.position.y = .05; g.add(rug2);

  // frame: corner poles (+ middle poles on 15 ft tents)
  const xs = B.size === 'm' ? [-1, 0, 1] : [-1, 1];
  xs.forEach(sx => [-1, 1].forEach(sz => {
    if (sx === 0 && sz === 1) return;          // no middle pole across the open front
    const p = new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, eave, 8), poleMat);
    p.position.set(sx * (hw - .04), eave / 2, sz * (hd - .04)); g.add(p);
  }));
  // valance (front / back / sides printed), then the peaked roof
  const vf = artMat(w, valH, B.valance), vs = artMat(d, valH, B.valance), plainC = solid(B.canopy, {roughness:.7});
  const val = new THREE.Mesh(new THREE.BoxGeometry(w, valH, d), [vs, vs, plainC, solid('#e9ebf0'), vf, vf]);
  val.position.y = eave + valH / 2; g.add(val);
  const roofTex = artTex(w, roofH, B.roof, 200);
  const roofFront = new THREE.MeshStandardMaterial({map:roofTex, roughness:.7, side:THREE.DoubleSide});
  const roofSide = solid(B.canopy, {side:THREE.DoubleSide, roughness:.7});
  const apex = [0, y0 + roofH, 0];
  const triMesh = (a, b, c, mat, uvf) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c], 3));
    if (uvf) geo.setAttribute('uv', new THREE.Float32BufferAttribute([...uvf(a), ...uvf(b), ...uvf(c)], 2));
    geo.computeVertexNormals(); return new THREE.Mesh(geo, mat);
  };
  const uvF = p => [(p[0] + hw) / w, (p[1] - y0) / roofH], uvB = p => [(hw - p[0]) / w, (p[1] - y0) / roofH];
  const FL = [-hw, y0, hd], FM = [0, y0, hd], FR = [hw, y0, hd], BL = [-hw, y0, -hd], BM = [0, y0, -hd], BR = [hw, y0, -hd];
  g.add(triMesh(FL, FM, apex, roofFront, uvF)); g.add(toMate(triMesh(FM, FR, apex, roofFront, uvF)));
  g.add(triMesh(BM, BL, apex, roofFront, uvB)); g.add(toMate(triMesh(BR, BM, apex, roofFront, uvB)));
  g.add(triMesh(BL, FL, apex, roofSide)); g.add(toMate(triMesh(FR, BR, apex, roofSide)));
  // lamps under the front valance
  const lampM = new THREE.MeshStandardMaterial({color:col('#2a2c33'), emissive:col('#ffd27a'), emissiveIntensity:.0});
  const bulbM = new THREE.MeshBasicMaterial({color:col('#fff1c4')});
  for (let i = 0; i < B.lamps; i++){
    const lx = (i - (B.lamps - 1) / 2) * (w / B.lamps) * (B.lamps === 2 ? 1.1 : 1);
    const l = new THREE.Mesh(new THREE.CylinderGeometry(.06, .13, .16, 12), lampM); l.position.set(lx, eave - .1, hd - .55); g.add(l);
    const b = new THREE.Mesh(new THREE.CircleGeometry(.1, 12), bulbM); b.rotation.x = Math.PI / 2; b.position.set(lx, eave - .185, hd - .55); g.add(b);
  }

  // backdrop: 8 ft high; 8 x 8 ft on 10 ft tents, full width on 15 ft tents
  const bh = 2.44, bz = -hd + .12;
  if (B.split){
    const half = w / 2;
    [[-half / 2, B.backL, null], [half / 2, B.backR, true]].forEach(([x, art, r]) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(half, bh, .05), [plainC, plainC, plainC, plainC, artMat(half, bh, art), solid('#f4f5f7')]);
      m.position.set(x, bh / 2, bz); g.add(r ? toMate(m) : m);
    });
  } else {
    const bw = B.size === 'm' ? w : 2.44;
    const m = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, .05), [plainC, plainC, plainC, plainC, artMat(bw, bh, B.back), solid('#f4f5f7')]);
    m.position.set(0, bh / 2, bz); g.add(m);
  }
  // monitor on the backdrop (c/o client)
  const monX = B.split ? hw * .62 : B.size === 'm' ? hw * .64 : .72;
  const mon = new THREE.Mesh(new THREE.BoxGeometry(1.0, .6, .06), [solid('#111'), solid('#111'), solid('#111'), solid('#111'),
    new THREE.MeshStandardMaterial({map:artTex(.94, .54, B.screen), emissive:col('#ffffff'), emissiveIntensity:.25, emissiveMap:null, roughness:.3}), solid('#111')]);
  mon.position.set(monX, 1.72, bz + .07); g.add(B.split ? toMate(mon) : mon);

  // furniture: main table(s) 4 x 2 x 3 ft, cocktail table, covered chairs, plants
  const table = (x, art, r) => {
    const t = new THREE.Mesh(new THREE.BoxGeometry(1.22, .91, .61), [tableMat, tableMat, tableMat, tableMat, artMat(1.22, .91, art), tableMat]);
    t.position.set(x, .455, hd - .62); g.add(r ? toMate(t) : t);
    // a few brochures / products on top
    [[-.35, '#ffffff'], [-.15, B.border], [.1, '#ffffff']].forEach(([dx, c], i) => { const p = new THREE.Mesh(new THREE.BoxGeometry(.12, .06 + i * .03, .09), solid(c)); p.position.set(x + dx, .94 + i * .015, hd - .62); g.add(r ? toMate(p) : p); });
    BRAND_PEOPLE.push({base:it.id, x:x + cx, z:hd - 1.15, ry:0});   // behind the table, facing visitors
  };
  let chairs;
  if (B.split){
    table(-hw + .95, B.tables[0]); table(hw - .95, B.tables[1], true);
    g.add(cocktail(0, -.1, '#ffffff'));
    chairs = [[-.62, -.45, Math.PI / 2], [-.62, .25, Math.PI / 2], [-1.15, -.75, 0], [-1.85, -.75, 0],
              [.62, -.45, -Math.PI / 2, 1], [.62, .25, -Math.PI / 2, 1], [1.15, -.75, 0, 1], [1.85, -.75, 0, 1]];
  } else if (B.size === 'm'){
    table(-hw + .95, B.table);
    // spread the lounge with the tent size (layout drawn for 15 x 10 ft)
    const kx = hw / 2.286, kz = hd / 1.524;
    g.add(cocktail(-.15 * kx, -.15 * kz));
    chairs = [[-.8, -.15, Math.PI / 2], [-.15, .5, Math.PI], [.75, .4, 0], [1.25, .4, 0], [1.75, .4, 0], [.75, -.35, 0], [1.25, -.35, 0], [1.75, -.35, 0]]
      .map(([x, z, r]) => [x * kx, z * kz, r]);
  } else {
    table(-hw + .82, B.table);
    g.add(cocktail(.5, -.2));
    chairs = [[.5, -.85, 0], [.5, .45, Math.PI], [1.15, -.2, -Math.PI / 2], [-.15, -.2, Math.PI / 2], [1.15, .5, -Math.PI / 2]];
  }
  chairs.forEach(([x, z, r, m]) => g.add(m ? toMate(chair(x, z, r)) : chair(x, z, r)));
  g.add(plant(-hw + .26, -hd + .4)); g.add(toMate(plant(hw - .26, -hd + .4)));
  if (B.sign){
    const sg = new THREE.Mesh(new THREE.BoxGeometry(.24, .34, .02), [tableMat, tableMat, tableMat, tableMat, artMat(.24, .34, B.sign), tableMat]);
    sg.position.set(-hw + .45, 1.09, hd - .66); sg.rotation.x = -.12; g.add(sg);
  }

  // feather banners on both sides (c/o client)
  const flags = B.flags.length > 1 ? B.flags : [B.flags[0], B.flags[0]];
  // they frame the tent's front corners and fly inward, so the photo wall and letters stay clear
  const fz = hd + .3;
  const fl = featherBanner(flags[0]); fl.position.set(-hw - .1, 0, fz); g.add(fl);
  const fr = featherBanner(flags[1], true); fr.position.set(hw + .1, 0, fz); g.add(toMate(fr));

  // photo wall (8 x 4 ft) + 3D letters on a plinth, 1 ft east of the tent
  if (dispItem.disp){
    const D = new THREE.Group(), dw = dispItem.disp.w * FT / S;
    D.position.x = hw + FT / S + dw / 2;
    const pw = new THREE.Mesh(new THREE.BoxGeometry(1.22, 2.44, .1), [solid('#f4f5f7'), solid('#f4f5f7'), solid('#f4f5f7'), solid('#f4f5f7'), artMat(1.22, 2.44, B.wall), solid('#e6e8ee')]);
    pw.position.set(0, 1.22 + .06, -.42); D.add(pw);
    const pf = new THREE.Mesh(new THREE.BoxGeometry(1.3, .06, .5), solid('#d9dce3')); pf.position.set(0, .03, -.42); D.add(pf);
    const gap = .02, Lw = B.letters.reduce((a, l) => a + l[1], 0) + gap * (B.letters.length - 1);
    const ph = B.plinthArt ? .26 : .16, pwid = Lw + .1;
    const pm = solid(B.plinth, {roughness:.6});
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(pwid, ph, .62), [pm, pm, pm, pm, B.plinthArt ? artMat(pwid, ph, B.plinthArt) : pm, pm]);
    plinth.position.set(0, ph / 2, .16); D.add(plinth);
    const glow = new THREE.Mesh(new THREE.BoxGeometry(pwid, .03, .02), new THREE.MeshBasicMaterial({color:col(B.glow)}));
    glow.position.set(0, .02, .48); D.add(glow);
    let lx = -Lw / 2;
    B.letters.forEach(([ch, lw, lh, face, side]) => {
      const m = letterMesh(ch, lw, lh, face, side);
      m.position.set(lx, ph, .02); D.add(m); lx += lw + gap;
    });
    g.add(mate ? toMate(D) : D);
  }

  it.top = y0 + roofH; if (mate) mate.top = it.top;
  return outer;
}
