// Builds the 2D Bike Village layout plan (HTML -> PDF + PNG) from the booth data in
// "FunRide Bike Village.html", so the printed plan always matches the 3D simulation.
//   node tools/build-layout-plan.js
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'FunRide Bike Village.html');
const OUT_HTML = path.join(__dirname, 'layout-plan.html');
const OUT_PDF = path.join(ROOT, 'FunRide Bike Village - Layout Plan.pdf');
const OUT_PNG = path.join(ROOT, 'FunRide Bike Village - Layout Plan.png');

/* ---------- read booth data from the 3D file ---------- */
const src = fs.readFileSync(SRC, 'utf8');
const m = src.match(/const FT = ([\d.]+);\s*const ITEMS = \[([\s\S]*?)\n\];/);
if (!m) throw new Error('Could not find ITEMS in ' + SRC);
const FT = parseFloat(m[1]);
const ITEMS = new Function('return [' + m[2] + '];')();
ITEMS.forEach(it => { if (it.ft) { it.w = it.ft[0] * FT; it.h = it.ft[1] * FT; } });
const BY = Object.fromEntries(ITEMS.map(it => [it.id, it]));

/* ---------- styling ---------- */
const TYPE = {
  back:   { fill: '#23219c', fg: '#ffffff', name: 'Tent with back siding' },
  open:   { fill: '#ffd23d', fg: '#1b1d6e', name: 'Open tent' },
  merch:  { fill: '#c3ef69', fg: '#1f3a12', name: 'Merchant (open tent)' },
  stall:  { fill: '#f472b6', fg: '#ffffff', name: 'Booth stall only' },
  big:    { fill: '#ff7a1d', fg: '#ffffff', name: 'Big booth' },
  aircon: { fill: '#3db2f0', fg: '#ffffff', name: 'Aircon tent (VIP)' },
  stage:  { fill: '#7c3aed', fg: '#ffffff', name: 'Stage' },
};
const typeOf = it => it.cat === 'merch' ? 'merch' : it.tent;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const f1 = n => String(Math.round(n * 10) / 10);
const FONT = "'Arial Narrow','Bahnschrift',Arial,sans-serif";

// Text that fits inside a w x h box (map px). Returns SVG <text>.
function fitText(lines, cx, cy, w, h, color, o = {}) {
  lines = lines.filter(l => l !== '');
  if (!lines.length) return '';
  const vert = o.vert;
  const W = vert ? h : w, H = vert ? w : h;
  const longest = Math.max(...lines.map(l => l.length));
  const lineH = 1.12;
  let fs = Math.min(o.max || 9, (W * .88) / (longest * .5), (H * .82) / (lines.length * lineH));
  fs = Math.max(fs, o.min || 2.6);
  const sub = o.sub; // index of first "size" line (smaller, lighter)
  const total = lines.length * fs * lineH;
  const rot = vert ? ` transform="rotate(-90 ${cx} ${cy})"` : '';
  const spans = lines.map((l, i) => {
    const y = cy - total / 2 + fs * lineH * (i + .5);
    const small = sub != null && i >= sub;
    return `<tspan x="${cx}" y="${y.toFixed(2)}" font-size="${(small ? fs * .82 : fs).toFixed(2)}" font-weight="${small ? 400 : 700}">${esc(l)}</tspan>`;
  }).join('');
  return `<text${rot} fill="${color}" text-anchor="middle" dominant-baseline="central" font-family="${FONT}">${spans}</text>`;
}

/* ---------- site base drawing (roads, lawn, fences, lanes) ---------- */
const VENUE = [[362,378],[655,352],[815,380],[1065,380],[1065,790],[1010,905],[640,905],[550,812],[362,748]];
const pts = a => a.map(p => p.join(',')).join(' ');
function base(detail) {
  const s = [];
  const r = (x1, y1, x2, y2, fill, extra = '') => s.push(`<rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" fill="${fill}" ${extra}/>`);
  r(-400, -400, 1800, 1500, '#e9ebe6');
  r(93, 0, 1293, 32, '#a9d48d');
  r(162, 98, 1232, 922, '#cfe8bd');
  const A = '#8b9099';
  r(93, 32, 1293, 98, A); r(93, 98, 162, 990, A); r(1232, 98, 1262, 990, A); r(93, 922, 1262, 990, A);
  r(105, 1000, 282, 1077, '#d4d8dd'); r(1152, 1000, 1287, 1077, '#d4d8dd');
  r(566, 100, 1015, 185, '#efe4cf');
  // road centre lines
  const dash = 'stroke="#ffffff" stroke-width="1.6" stroke-dasharray="16 14"';
  s.push(`<line x1="100" y1="65" x2="1290" y2="65" ${dash}/>`, `<line x1="133" y1="110" x2="133" y2="915" ${dash}/>`,
         `<line x1="1247" y1="110" x2="1247" y2="915" ${dash}/>`, `<line x1="100" y1="956" x2="1255" y2="956" ${dash}/>`);
  // venue floor
  s.push(`<polygon points="${pts(VENUE)}" fill="#f7f8fb"/>`);
  // grid on the floor: 10 ft squares (detail page only)
  if (detail) {
    s.push(`<clipPath id="vclip"><polygon points="${pts(VENUE)}"/></clipPath><g clip-path="url(#vclip)" stroke="#e3e6ef" stroke-width=".5">`);
    for (let x = 362; x <= 1065; x += FT * 10) s.push(`<line x1="${x}" y1="340" x2="${x}" y2="910"/>`);
    for (let y = 352; y <= 905; y += FT * 10) s.push(`<line x1="355" y1="${y}" x2="1070" y2="${y}"/>`);
    s.push('</g>');
  }
  // fences
  const fence = 'fill="none" stroke="#1b1e4a" stroke-width="2.4" stroke-linejoin="round"';
  [[[655,352],[362,378],[362,668]], [[362,700],[362,748],[550,812]], [[815,381],[1065,381],[1065,790]], [[375,1022],[628,1055]]]
    .forEach(p => s.push(`<polyline points="${pts(p)}" ${fence}/>`));
  // hedge (south edge)
  [[[550,812],[599,863]], [[645,905],[985,905]], [[1065,790],[1032,859]]]
    .forEach(p => s.push(`<polyline points="${pts(p)}" fill="none" stroke="#4f9a3a" stroke-width="7" stroke-linecap="round"/>`));
  // barrier beside the ops column
  s.push(`<line x1="868" y1="455" x2="868" y2="865" stroke="#1b1e4a" stroke-width="1.4" stroke-dasharray="2 8" stroke-linecap="round"/>`);
  // rider-flow lanes
  const FLOW = [
    // the y 587 lane stops at the ops barrier (x 868) so it doesn't block the Registration booths
    [[684,300],[684,443]], [[868,587],[572,587],[572,443],[945,443],[945,587]],
    [[688,443],[688,765]], [[793,443],[793,587]],
    [[572,587],[572,765],[800,765]], [[798,587],[798,682]], [[695,682],[800,682],[800,742],[858,742],[858,830],[645,830],[645,870]],
    [[945,587],[945,795],[1000,795],[1000,850]]
  ];
  FLOW.forEach(p => s.push(`<polyline points="${pts(p)}" fill="none" stroke="#d3202f" stroke-width="1.8" stroke-dasharray="4.5 4.5"/>`));
  // artists path
  s.push(`<polyline points="370,684 272,684 252,740 252,905" fill="none" stroke="#2a2c3a" stroke-width="9" stroke-linejoin="round"/>`,
         `<polyline points="370,684 272,684 252,740 252,905" fill="none" stroke="#fff" stroke-width="1.2" stroke-dasharray="5 5"/>`);
  // grandstand
  s.push(`<polygon points="${pts([[472,998],[1118,998],[1118,1040],[1000,1075],[600,1075],[472,1040]])}" fill="#efe2d2" stroke="#c8202f" stroke-width="1.5"/>`);
  // trees
  [[749,226,26],[797,212,24],[844,238,21],[737,281,28],[790,266,31],[838,292,24],[761,330,25],[811,333,24],[856,346,19]]
    .forEach(([x, y, rr]) => s.push(`<circle cx="${x}" cy="${y}" r="${rr * .9}" fill="#6bb24f" stroke="#4c9a35" stroke-width="1.5"/>`));
  // road / place labels
  const lab = (t, x, y, size, o = {}) => s.push(`<text x="${x}" y="${y}" ${o.rot ? `transform="rotate(${o.rot} ${x} ${y})"` : ''} fill="${o.fill || '#ffffff'}" font-family="${FONT}" font-weight="700" font-size="${size}" letter-spacing="${size * .12}" text-anchor="middle" dominant-baseline="central">${esc(t)}</text>`);
  lab('RIZAL PARK', 769, 16, 13, { fill: '#2f5b2c' });
  lab('ROXAS BOULEVARD', 769, 48, 16);
  lab('KATIGBAK PARKWAY', 116, 440, 13, { rot: -90 });
  lab('SOUTH DRIVE', 1247, 300, 12, { rot: 90 });
  lab('INDEPENDENCE ROAD', 230, 940, 14);
  lab('KM 0 PLAZA', 600, 115, 10, { fill: '#8a6d3b' });
  lab('QUIRINO GRANDSTAND', 795, 1040, 18, { fill: '#8a3d2b' });
  lab('PARKING', 192, 1040, 12, { fill: '#6b7080' });
  lab('PARKING', 1219, 1040, 12, { fill: '#6b7080' });
  lab('PHOTOWALL', 797, 425, 7.5, { fill: '#16183f' });
  lab('MERCHANTS', 727, 836, 7.5, { fill: '#16183f' });
  return s.join('\n');
}

/* ---------- other (unsized) site features ---------- */
function features(detail) {
  const s = [];
  const box = (it, fill, stroke, fg, txt, o = {}) => {
    const x = it.x - it.w / 2, y = it.y - it.h / 2;
    const t = it.rot ? ` transform="rotate(${-it.rot} ${it.x} ${it.y})"` : '';
    s.push(`<g${t}><rect x="${x}" y="${y}" width="${it.w}" height="${it.h}" rx="${o.rx || 1.5}" fill="${fill}" stroke="${stroke}" stroke-width="${o.sw || .8}" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''}/>`
      + fitText(txt, it.x, it.y, it.w, it.h, fg, { vert: o.vert, max: o.max || 9, sub: o.sub }) + '</g>');
  };
  box(BY['standby'], '#1fae4a', '#127a32', '#fff', ['STANDBY PER WAVE'], { max: 14 });
  box(BY['exit-to-start'], '#ffffff', '#16183f', '#16183f', ['EXIT TO START'], { vert: true });
  box(BY['ramp'], '#1fae4a', '#127a32', '#fff', ['RAMP'], { vert: true });
  box(BY['bike-rack'], '#c9ccd6', '#4a4e60', '#16183f', ['BIKE RACK'], { vert: true, max: 14 });
  ['pw-21', 'pw-10', 'pw-5'].forEach(id => box(BY[id], '#ffffff', '#23219c', '#23219c', [BY[id].label, 'SIZE TBA'], { dash: '3 2', sub: 1, sw: 1 }));
  box(BY['vip-portalets'], '#3db2f0', '#1b6fa0', '#fff', ['VIP PORTALETS'], { vert: true });
  box(BY['common-portalets-1'], '#3db2f0', '#1b6fa0', '#fff', ['COMMON PORTALETS']);
  box(BY['common-portalets-2'], '#3db2f0', '#1b6fa0', '#fff', ['COMMON PORTALETS']);
  box(BY['byd-td'], '#5cd6df', '#1d8b94', '#132060', ['BYD TEST DRIVE']);
  box(BY['byd-garage'], '#5cd6df', '#1d8b94', '#132060', ['BYD GARAGE']);
  box(BY['artists-entrance'], '#5cd6df', '#1d8b94', '#132060', ['ARTISTS', 'ENTRANCE']);
  box(BY['cardinal'], '#2f5b2c', '#1c3a1a', '#fff', ['CARDINAL']);
  box(BY['km21'], '#23219c', '#16187a', '#fff', ['21 KM']);
  // start / finish arches
  ['start', 'finish'].forEach(id => box(BY[id], '#861a1d', '#5c0f12', '#fff', [BY[id].label], { vert: true }));
  // restricted
  const rs = BY['restricted'];
  s.push(`<circle cx="${rs.x}" cy="${rs.y}" r="${rs.w / 2}" fill="#141414"/><path d="M${rs.x - 35} ${rs.y - 35}L${rs.x + 35} ${rs.y + 35}M${rs.x + 35} ${rs.y - 35}L${rs.x - 35} ${rs.y + 35}" stroke="#7bd23a" stroke-width="9"/>`);
  s.push(`<text x="${rs.x}" y="${rs.y + rs.w / 2 + 9}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="8" fill="#141414">RESTRICTED · NO SETUP</text>`);
  // gates
  [['entrance', [[985,905],[1032,859]]], ['exit', [[599,863],[645,905]]]].forEach(([id, [a, b]]) => {
    s.push(`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#ffffff" stroke-width="5"/><line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#16183f" stroke-width="1" stroke-dasharray="3 3"/>`);
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    s.push(`<g transform="translate(${mx + (id === 'exit' ? -18 : 20)} ${my + 18})"><rect x="-24" y="-7" width="48" height="14" rx="7" fill="#16183f"/><text text-anchor="middle" dominant-baseline="central" font-family="${FONT}" font-weight="700" font-size="8" fill="#fff" letter-spacing="1">${id.toUpperCase()}</text></g>`);
  });
  return s.join('\n');
}

/* ---------- sized booths ---------- */
const SHARED = [
  { ids: ['dro', 'oxecure'], label: 'DR. O / OXECURE · 10 × 15 FT SHARED', side: 'top' },
  { ids: ['gatorade', 'pepsi'], label: 'SHARED 10 × 10 FT', side: 'right' },
];
const sharedIds = new Set(SHARED.flatMap(g => g.ids));
function sizeLine(it) {
  if (sharedIds.has(it.id)) return '';
  if (it.tent === 'stage') return `${f1(it.ft[1])} × ${f1(it.ft[0])} FT · 3 FT H`;
  // write as the short side first, like the booking sheet
  const [a, b] = [it.ft[0], it.ft[1]].sort((p, q) => p - q);
  return `${f1(a)} × ${f1(b)} FT`;
}
// detail: names + sizes + dimension lines; names: names + sizes only (site overview)
function booths(detail, names) {
  const s = [];
  ITEMS.filter(it => it.ft).forEach(it => {
    const T = TYPE[typeOf(it)];
    const x = it.x - it.w / 2, y = it.y - it.h / 2;
    const t = it.rot ? ` transform="rotate(${-it.rot} ${it.x} ${it.y})"` : '';
    let g = `<g${t}>`;
    g += `<rect x="${x}" y="${y}" width="${it.w}" height="${it.h}" fill="${T.fill}" stroke="#16183f" stroke-width=".9"${it.cat === 'merch' && !it.label ? ' fill-opacity=".55" stroke-dasharray="3 2"' : ''}/>`;
    if (it.tent === 'back') {
      // thick line = back siding
      const b = it.back || 'n';
      const L = { n: [x, y, x + it.w, y], s: [x, y + it.h, x + it.w, y + it.h], w: [x, y, x, y + it.h], e: [x + it.w, y, x + it.w, y + it.h] }[b];
      g += `<line x1="${L[0]}" y1="${L[1]}" x2="${L[2]}" y2="${L[3]}" stroke="#ffc928" stroke-width="3"/>`;
    }
    if (it.tent === 'aircon') {
      const b = it.back || 'n';
      const ax = b === 'w' ? x - 5 : b === 'e' ? x + it.w + 1 : it.x - 4, ay = b === 'n' ? y - 5 : b === 's' ? y + it.h + 1 : it.y - 4;
      g += `<rect x="${ax}" y="${ay}" width="${b === 'w' || b === 'e' ? 4 : 8}" height="${b === 'w' || b === 'e' ? 8 : 4}" fill="#8f96a8"/>`;
    }
    if (detail || names) {
      let name = it.label != null && it.label !== '' ? it.label : it.name.toUpperCase();
      if (it.cat === 'merch' && !it.label) name = 'MERCHANT\n' + it.name.replace(/\D/g, '');
      name = name.replace(/REGIS-\nTRATION/, 'REGISTRATION');
      const lines = name.split('\n');
      const sz = sizeLine(it);
      const vert = it.h > it.w * 1.6;
      const all = sz ? lines.concat([sz]) : lines;
      g += fitText(all, it.x, it.y, it.w, it.h, T.fg, { vert, sub: sz ? lines.length : null, max: it.tent === 'big' ? 11 : 7.5, min: 2.4 });
    }
    g += '</g>';
    s.push(g);
  });
  if (detail) {
    // shared tent outlines + notes
    SHARED.forEach(grp => {
      const its = grp.ids.map(id => BY[id]);
      const x1 = Math.min(...its.map(i => i.x - i.w / 2)), x2 = Math.max(...its.map(i => i.x + i.w / 2));
      const y1 = Math.min(...its.map(i => i.y - i.h / 2)), y2 = Math.max(...its.map(i => i.y + i.h / 2));
      s.push(`<rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" fill="none" stroke="#16183f" stroke-width="1.6"/>`);
      if (grp.side === 'top') s.push(`<text x="${(x1 + x2) / 2}" y="${y1 - 4}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="5.2" fill="#16183f">${esc(grp.label)}</text>`);
      else s.push(`<text x="${x2 + 3}" y="${(y1 + y2) / 2}" text-anchor="start" dominant-baseline="central" font-family="${FONT}" font-weight="700" font-size="4.6" fill="#16183f"><tspan x="${x2 + 3}" dy="-3">SHARED</tspan><tspan x="${x2 + 3}" dy="5.6">10 × 10 FT</tspan></text>`);
    });
    // dimension lines on the big booths and stage
    // AC Health / AC Mobility and BYD Showroom are two separate 32 x 24.5 ft booths
    ['ac', 'byd-showroom'].forEach(id => {
      const b = BY[id], bx1 = b.x - b.w / 2, bx2 = b.x + b.w / 2, by1 = b.y - b.h / 2, by2 = b.y + b.h / 2;
      if (id === 'ac') s.push(dim(bx1, by1 - 5, bx2, by1 - 5, '32 FT'));
      s.push(dimV(bx1 - 5, by1, bx1 - 5, by2, '24.5 FT'));
    });
    const st = BY['stage'];
    s.push(dimV(st.x + st.w / 2 + 7, st.y - st.h / 2, st.x + st.w / 2 + 7, st.y + st.h / 2, '20 FT'));
    const kc = BY['kit'];
    s.push(dimV(kc.x + kc.w / 2 + 6, kc.y - kc.h / 2, kc.x + kc.w / 2 + 6, kc.y + kc.h / 2, '30 FT'));
    const bg = BY['baggage'];
    s.push(dimV(bg.x + bg.w / 2 + 6, bg.y - bg.h / 2, bg.x + bg.w / 2 + 6, bg.y + bg.h / 2, '30 FT'));
  }
  return s.join('\n');
}
function dim(x1, y, x2, _y, txt) {
  const mx = (x1 + x2) / 2;
  return `<g stroke="#16183f" stroke-width=".7" fill="#16183f"><line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/><line x1="${x1}" y1="${y - 3}" x2="${x1}" y2="${y + 3}"/><line x1="${x2}" y1="${y - 3}" x2="${x2}" y2="${y + 3}"/></g>`
    + `<rect x="${mx - 11}" y="${y - 4}" width="22" height="8" fill="#f7f8fb"/><text x="${mx}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family="${FONT}" font-weight="700" font-size="6" fill="#16183f">${txt}</text>`;
}
function dimV(x, y1, _x, y2, txt) {
  const my = (y1 + y2) / 2;
  return `<g stroke="#16183f" stroke-width=".7"><line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}"/><line x1="${x - 3}" y1="${y1}" x2="${x + 3}" y2="${y1}"/><line x1="${x - 3}" y1="${y2}" x2="${x + 3}" y2="${y2}"/></g>`
    + `<g transform="rotate(-90 ${x} ${my})"><rect x="${x - 11}" y="${my - 4}" width="22" height="8" fill="#f7f8fb"/><text x="${x}" y="${my}" text-anchor="middle" dominant-baseline="central" font-family="${FONT}" font-weight="700" font-size="6" fill="#16183f">${txt}</text></g>`;
}

function northArrow(x, y, k) {
  return `<g transform="translate(${x} ${y}) scale(${k})"><circle r="16" fill="#fff" stroke="#16183f" stroke-width="1.2"/><path d="M0 -12 L6 8 L0 4 L-6 8Z" fill="#16183f"/><text y="-20" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="11" fill="#16183f">N</text></g>`;
}
function scaleBar(x, y) {
  // 0-10-20-30-40-50 ft
  const seg = FT * 10, s = [];
  for (let i = 0; i < 5; i++) s.push(`<rect x="${x + i * seg}" y="${y}" width="${seg}" height="5" fill="${i % 2 ? '#fff' : '#16183f'}" stroke="#16183f" stroke-width=".6"/>`);
  for (let i = 0; i <= 5; i++) s.push(`<text x="${x + i * seg}" y="${y + 13}" text-anchor="middle" font-family="${FONT}" font-size="7" fill="#16183f">${i * 10}</text>`);
  s.push(`<text x="${x + 5 * seg + 6}" y="${y + 4}" font-family="${FONT}" font-weight="700" font-size="7" fill="#16183f" dominant-baseline="central">FT</text>`);
  return s.join('');
}

/* ---------- page bodies ---------- */
const legendRows = Object.entries(TYPE).map(([k, T]) =>
  `<li><span class="sw" style="background:${T.fill}"></span>${T.name}</li>`).join('');

const svgDetail = `<svg viewBox="318 296 790 646" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
${base(true)}
${features(true)}
${booths(true)}
${northArrow(1090, 360, 1)}
<rect x="330" y="905" width="196" height="26" rx="3" fill="#ffffff" opacity=".9"/>
${scaleBar(338, 910)}
</svg>`;

const svgSite = `<svg viewBox="80 -5 1225 1095" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
${base(false)}
${features(false)}
${booths(false, true)}
${northArrow(1275, 140, 1.4)}
</svg>`;

/* ---------- size schedule (as booked) ---------- */
const SCHEDULE = [
  ['Tents with back siding', 'back', [
    ['EMS', '10 × 10', 1], ['Command Center', '10 × 10', 1], ['Info / Lost & Found', '10 × 10', 1],
    ['Kit Claiming', '10 × 30', 1], ['Registration', '10 × 10', 2], ['Baggage Area', '10 × 30', 1]]],
  ['Open tents', 'open', [
    ['Bikes and Coffee (near bike rack)', '10 × 10', 1], ['Neutra K', '10 × 10', 1], ['Wert PH', '10 × 10', 1],
    ['Fitbar', '10 × 10', 1], ['Cargo Boss', '10 × 10', 1], ['Espace Wellness (booth stall only)', '5 × 5', 1, 'stall'],
    ['Gatorade / Pepsi (shared)', '10 × 10', 1], ['Popcycle', '10 × 10', 1], ['Specialign', '10 × 10', 1], ['BDO', '10 × 10', 1],
    ['Dr. O / Oxecure (shared)', '10 × 15', 1], ['Myriad', '10 × 10', 1], ['ARF', '10 × 10', 1], ['Smoke10', '10 × 10', 1],
    ['Tech', '10 × 20', 1], ['Bike Check Station', '10 × 10', 1], ['BYD Test Drive Registration', '10 × 10', 1]]],
  ['Big booths', 'big', [
    ['DOT', '10 × 20', 1], ['AC Health / AC Mobility', '24.5 × 32', 1], ['BYD Showroom', '24.5 × 32', 1]]],
  ['Aircon tents (VIPs)', 'aircon', [
    ['Artists & other sponsors', '12 × 24', 1], ['DOT', '12 × 12', 1], ['BYD', '12 × 12', 1]]],
  ['Merchants', 'merch', [['Merchant booth', '10 × 10', 10]]],
  ['Photowall', null, [['5 km', 'to follow', 1], ['10 km', 'to follow', 1], ['21 km', 'to follow', 1]]],
  ['Stages', 'stage', [['Main Stage (H 3 ft)', '20 × 12', 1], ['Satellite Stage, KM 0 (H 3 ft)', '12 × 12', 1]]],
];
let grandQty = 0, grandArea = 0;
const schedRows = SCHEDULE.map(([grp, type, rows]) => {
  let gq = 0, ga = 0;
  const body = rows.map(([name, size, qty, t2]) => {
    const n = size.match(/([\d.]+) × ([\d.]+)/);
    const each = n ? parseFloat(n[1]) * parseFloat(n[2]) : null;
    gq += qty; if (each) ga += each * qty;
    const T = TYPE[t2 || type];
    return `<tr><td><span class="sw" style="background:${T ? T.fill : '#fff'};${T ? '' : 'border:1px dashed #23219c'}"></span>${esc(name)}</td><td class="n">${size === 'to follow' ? '<em>To follow</em>' : size + ' ft'}</td><td class="n">${qty}</td><td class="n">${each ? each.toLocaleString('en-US') : '–'}</td><td class="n">${each ? (each * qty).toLocaleString('en-US') : '–'}</td></tr>`;
  }).join('');
  grandQty += gq; grandArea += ga;
  return `<tr class="grp"><th colspan="5">${esc(grp)}</th></tr>${body}<tr class="sub"><td>Subtotal</td><td></td><td class="n">${gq}</td><td></td><td class="n">${ga ? ga.toLocaleString('en-US') : '–'}</td></tr>`;
}).join('');

const today = new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
const html = `<!doctype html><html><head><meta charset="utf-8"><title>FunRide Bike Village · Layout Plan</title>
<style>
@page{size:420mm 297mm;margin:0}
*{box-sizing:border-box}
html,body{margin:0;background:#fff;color:#16183f;font-family:'Segoe UI',Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:420mm;height:297mm;padding:10mm;display:grid;grid-template-columns:1fr 92mm;gap:8mm;page-break-after:always;overflow:hidden;position:relative}
.page:last-child{page-break-after:auto}
.plan{border:1.2mm solid #16187a;border-radius:3mm;overflow:hidden;background:#e9ebe6;display:flex}
.plan svg{width:100%;height:100%;display:block}
aside{display:flex;flex-direction:column;gap:5mm;min-height:0}
.title{background:#16187a;color:#fff;border-radius:3mm;padding:6mm 6mm 5mm}
.eyebrow{font:700 9pt 'Arial Narrow',sans-serif;letter-spacing:.18em;color:#ffc928;text-transform:uppercase}
h1{margin:2mm 0 1mm;font:700 26pt/1 'Arial Narrow','Bahnschrift',sans-serif;text-transform:uppercase;letter-spacing:.02em}
.title p{margin:0;font-size:9pt;opacity:.85}
.stripe{display:flex;gap:1.5mm;margin-top:3mm}.stripe i{height:1.4mm;width:10mm;border-radius:1mm}
.stripe i:nth-child(1){background:#5a58e0}.stripe i:nth-child(2){background:#c8202f}.stripe i:nth-child(3){background:#ffc928}
.box{border:.4mm solid #dfe2ef;border-radius:3mm;padding:4mm 5mm}
.box h2{margin:0 0 2.5mm;font:700 11pt 'Arial Narrow',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#16187a}
ul{list-style:none;margin:0;padding:0;display:grid;gap:1.8mm;font-size:9pt}
li{display:flex;align-items:center;gap:2.5mm}
.sw{display:inline-block;width:4.5mm;height:4.5mm;border-radius:.8mm;flex:none;border:.25mm solid rgba(0,0,0,.25);vertical-align:-1mm;margin-right:2mm}
.ln{display:inline-block;width:9mm;flex:none;border-top:.7mm dashed #d3202f}
.notes{font-size:8.5pt;line-height:1.45;margin:0;padding-left:4mm}
.notes li{display:list-item}
.foot{margin-top:auto;font-size:7.5pt;color:#5b5f86;border-top:.3mm solid #dfe2ef;padding-top:2mm;display:flex;justify-content:space-between}
table{width:100%;border-collapse:collapse;font-size:9.5pt}
th,td{padding:1.15mm 2.5mm;text-align:left}
thead th{background:#16187a;color:#fff;font:700 9pt 'Arial Narrow',sans-serif;letter-spacing:.08em;text-transform:uppercase}
tr.grp th{background:#eef0fb;color:#16187a;font:700 10pt 'Arial Narrow',sans-serif;letter-spacing:.06em;text-transform:uppercase;padding-top:2.2mm}
tr.sub td{border-top:.3mm solid #c5c9de;font-weight:600;color:#5b5f86;font-size:8.5pt}
td{border-bottom:.2mm solid #eef0f5}
.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
tfoot td{background:#16187a;color:#fff;font-weight:700}
.sched{grid-template-columns:1fr 1fr;align-content:start}
.sched .col{display:flex;flex-direction:column;gap:5mm;min-height:0}
.kpis{display:grid;grid-template-columns:1fr 1fr;gap:3mm}
.kpi{background:#eef0fb;border-radius:2.5mm;padding:3mm 4mm}.kpi b{display:block;font:700 20pt 'Arial Narrow',sans-serif;color:#16187a}.kpi span{font-size:8pt;color:#5b5f86}
</style></head><body>

<section class="page">
  <div class="plan">${svgSite}</div>
  <aside>
    <div class="title">
      <div class="eyebrow">FunRide PH · Rizal Park, Manila</div>
      <h1>Site<br>Overview</h1>
      <p>Whole event site from KM 0 on Roxas Boulevard to the finish on Independence Road. The red dotted lines are the rider / guest flow lanes.</p>
      <div class="stripe"><i></i><i></i><i></i></div>
    </div>
    <div class="box">
      <h2>Booth type</h2>
      <ul>${legendRows}</ul>
    </div>
    <div class="box">
      <h2>Key points</h2>
      <ol class="notes">
        <li><b>Start</b>: KM 0, Roxas Boulevard. Satellite Stage (12 × 12 ft, 3 ft high) on the KM 0 plaza.</li>
        <li><b>Standby per Wave</b> feeds Exit to Start and the ramp up to KM 0.</li>
        <li><b>Entrance</b> southeast corner, <b>Exit</b> southwest corner.</li>
        <li><b>Finish</b> on Independence Road, beside BYD Garage and BYD Test Drive.</li>
        <li><b>BYD Test Drive</b> stays on Independence Road and stops at the South Drive corner.</li>
        <li><b>AC Health / AC Mobility</b> and <b>BYD Showroom</b> are two separate 24.5 × 32 ft big booths.</li>
        <li>Artists come in through the Artists Entrance and follow the path to the aircon tents.</li>
      </ol>
    </div>
    <div class="foot"><span>Site overview</span><span>${today}</span></div>
  </aside>
</section>
</body></html>`;


fs.writeFileSync(OUT_HTML, html);
console.log('wrote', OUT_HTML);

/* ---------- print with Edge (or Chrome) ---------- */
const browsers = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
];
const exe = browsers.find(p => fs.existsSync(p));
if (!exe) { console.log('No Edge/Chrome found; open the HTML and print to PDF (A3 landscape).'); process.exit(0); }
const url = 'file:///' + OUT_HTML.replace(/\\/g, '/');
const common = ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars', '--virtual-time-budget=4000'];
execFileSync(exe, [...common, '--no-pdf-header-footer', `--print-to-pdf=${OUT_PDF}`, url], { stdio: 'inherit' });
console.log('wrote', OUT_PDF);
// page 1 as an image: A3 at 96 dpi = 1587 x 1123, rendered at 2x
execFileSync(exe, [...common, '--force-device-scale-factor=2', '--window-size=1587,1123', `--screenshot=${OUT_PNG}`, url], { stdio: 'inherit' });
console.log('wrote', OUT_PNG);
