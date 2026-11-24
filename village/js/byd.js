// FunRide Bike Village 3D: BYD vehicles, showroom, test drive line-up and lane, barricades.
// Loaded in order by main.js once fonts and logos are ready; top-level names are shared across files.
"use strict";

/* ---------- BYD (from "BYD FunridePH 2026 _ Proposed Layout"): vehicles, showroom, test drive line-up,
   ---------- */
// side profiles (u along the car rear 0 -> front 1, v up), extruded across the width
const CAR_TYPES = {
  sedan:{lower:[[0,.2],[0,.56],[.06,.62],[.3,.64],[.78,.64],[.95,.56],[1,.46],[1,.22],[.9,.14],[.1,.14]], glass:[[.12,.6],[.36,.97],[.62,.99],[.8,.62]], wheels:[.18,.79]},
  suv:{lower:[[0,.2],[0,.6],[.02,.66],[.85,.66],[.97,.6],[1,.5],[1,.22],[.9,.13],[.1,.13]], glass:[[.03,.64],[.07,.96],[.62,.99],[.82,.64]], wheels:[.17,.8], clad:true},
  hatch:{lower:[[0,.2],[0,.6],[.03,.64],[.8,.64],[.96,.56],[1,.45],[1,.22],[.88,.13],[.12,.13]], glass:[[.03,.62],[.09,.97],[.6,.99],[.83,.62]], wheels:[.16,.82], clad:true},
  pickup:{lower:[[0,.18],[0,.6],[.39,.6],[.39,.63],[.8,.65],[.98,.62],[1,.52],[1,.2],[.88,.12],[.12,.12]], glass:[[.4,.62],[.43,.96],[.7,.99],[.81,.65]], wheels:[.17,.8], clad:true, bed:[.03,.37]}
};
const CAR_MODELS = {
  shark6:{type:'pickup', L:5.46, W:1.97, H:1.92, r:.4, name:'SHARK 6 DM-O'},
  seagull:{type:'hatch', L:3.78, W:1.72, H:1.54, r:.31, name:'SEAGULL'},
  atto2:{type:'suv', L:4.31, W:1.83, H:1.67, r:.34, name:'ATTO 2'},
  seal5:{type:'sedan', L:4.78, W:1.84, H:1.5, r:.33, name:'SEAL 5 DM-i'},
  seal:{type:'sedan', L:4.8, W:1.88, H:1.46, r:.35, name:'SEAL'},
  sealion6:{type:'suv', L:4.78, W:1.89, H:1.67, r:.36, name:'SEALION 6 DM-i'},
  sealion8:{type:'suv', L:5.04, W:1.96, H:1.76, r:.38, name:'SEALION 8'}
};
const CARM = {
  glass:new THREE.MeshStandardMaterial({color:col('#141a23'), metalness:.35, roughness:.1}),
  tire:solid('#121317', {roughness:.85}), rim:solid('#c9ced6', {metalness:.85, roughness:.25}), hub:solid('#2b2f36', {metalness:.5}),
  head:new THREE.MeshBasicMaterial({color:col('#f4f8ff')}), tail:new THREE.MeshBasicMaterial({color:col('#d0202c')}), trim:solid('#1b1d22', {roughness:.6})
};
function textArt(text, bg, fg, o){
  o = o || {};
  return (g, W, H) => { if (bg){ g.fillStyle = bg; g.fillRect(0, 0, W, H); } g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
    let fs = H * (o.fill || .6); g.font = `700 ${fs}px ${o.font || FONT}`; const m = g.measureText(text).width; if (m > W * .9){ fs *= W * .9 / m; g.font = `700 ${fs}px ${o.font || FONT}`; }
    g.fillText(text, W / 2, H * .54); };
}
// FunRide PH "Official Lead Vehicle" side wrap (transparent decal)
function leadWrap(g, W, H){
  logo(g, 'bydW', W * .27, H * .5, W * .3, H * .26);
  logo(g, 'frphW', W * .63, H * .44, W * .26, H * .72);
  g.fillStyle = '#ffffff'; g.font = `700 ${H * .09}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('OFFICIAL LEAD VEHICLE', W * .88, H * .2); g.fillText('OFFICIAL LEAD VEHICLE', W * .12, H * .2);
  const cols = ['#1b2a8a', '#d7262e', '#fcc419', '#ffffff'], n = 28, tw = W / n, th = H * .16;
  for (let i = 0; i < n; i++){ g.fillStyle = cols[(i * 7 + (i >> 1)) % 4]; g.beginPath(); const x = i * tw;
    if (i % 2){ g.moveTo(x, H - th); g.lineTo(x + tw, H - th); g.lineTo(x + tw / 2, H); } else { g.moveTo(x, H); g.lineTo(x + tw, H); g.lineTo(x + tw / 2, H - th); }
    g.fill(); }
}
// vehicle at true size, front toward +x, standing on the ground
function vehicle(key, color, o){
  o = o || {};
  const M = CAR_MODELS[key], T = CAR_TYPES[M.type], g = new THREE.Group(), L = M.L, W = M.W, H = M.H;
  const shape = pts => new THREE.Shape(pts.map(([u, v]) => new THREE.Vector2(u * L - L / 2, v * H)));
  const ext = (pts, w, mat, bev) => {
    const geo = new THREE.ExtrudeGeometry(shape(pts), {depth:w, bevelEnabled:!!bev, bevelThickness:bev || 0, bevelSize:bev || 0, bevelSegments:2, curveSegments:4});
    geo.translate(0, 0, -w / 2); return new THREE.Mesh(geo, mat);
  };
  const paint = new THREE.MeshStandardMaterial({color:col(color), metalness:.45, roughness:.3});
  const bev = .035;
  g.add(ext(T.lower, W - 2 * bev, paint, bev));
  g.add(ext(T.glass, W * .84, CARM.glass));
  const gl = T.glass;
  g.add(ext([gl[1], gl[2], [gl[2][0] - .015, gl[2][1] + .03], [gl[1][0] + .015, gl[1][1] + .03]], W * .8, o.roof ? solid(o.roof, {metalness:.4, roughness:.3}) : paint));
  const vAt = u => Math.max(...T.lower.filter(p => p[0] === u).map(p => p[1]));
  const fv = vAt(1), rv = vAt(0);
  // wheels with silver rims, black arches on SUVs / pickups
  T.wheels.forEach(u => [-1, 1].forEach(sd => {
    const x = u * L - L / 2, z = sd * (W / 2 - .12);
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(M.r, M.r, .24, 24), CARM.tire); tire.rotation.x = Math.PI / 2; tire.position.set(x, M.r, z); g.add(tire);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(M.r * .64, M.r * .64, .02, 20), CARM.rim); rim.rotation.x = Math.PI / 2; rim.position.set(x, M.r, z + sd * .12); g.add(rim);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(M.r * .17, M.r * .17, .03, 12), CARM.hub); hub.rotation.x = Math.PI / 2; hub.position.set(x, M.r, z + sd * .125); g.add(hub);
    for (let k = 0; k < 5; k++){ const sp = new THREE.Mesh(new THREE.BoxGeometry(M.r * .07, M.r * .5, .012), CARM.hub); sp.position.set(x, M.r, z + sd * .132); sp.rotation.z = k / 5 * Math.PI * 2; sp.translateY(M.r * .36); g.add(sp); }
    if (T.clad){ const arch = new THREE.Mesh(new THREE.RingGeometry(M.r * 1.04, M.r * 1.22, 20, 1, 0, Math.PI), CARM.trim); arch.position.set(x, M.r, sd * (W / 2 + .045)); if (sd < 0) arch.rotation.y = Math.PI; g.add(arch); }
  }));
  if (T.clad){ // black lower cladding strip
    const cl = new THREE.Mesh(new THREE.BoxGeometry(L * .94, H * .07, W + .06), CARM.trim); cl.position.set(0, H * .17, 0); g.add(cl);
  }
  // light bars, BYD badge and model name on the bumper
  const head = new THREE.Mesh(new THREE.BoxGeometry(.03, .05, W * .78), CARM.head); head.position.set(L / 2 + .02, (fv - .05) * H, 0); g.add(head);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(.03, .05, W * .86), CARM.tail); tail.position.set(-L / 2 - .02, (rv - .07) * H, 0); g.add(tail);
  const front = (w, h, y, mat) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); p.rotation.y = Math.PI / 2; p.position.set(L / 2 + .045, y, 0); g.add(p); };
  if (M.type === 'pickup') front(W * .55, .22, (fv - .17) * H, artMat(W * .55, .22, (gg, w, h) => { gg.fillStyle = '#1d2026'; gg.fillRect(0, 0, w, h); logo(gg, 'bydW', w / 2, h / 2, w * .5, h * .6); }));
  else front(.36, .09, (fv - .14) * H, new THREE.MeshBasicMaterial({map:artTex(.36, .09, (gg, w, h) => logo(gg, 'bydW', w / 2, h / 2, w * .95, h * .9)), transparent:true}));
  front(.55, .1, .3 * H, artMat(.55, .1, textArt(M.name, '#1d2026', '#ffffff', {fill:.62})));
  // mirrors
  [-1, 1].forEach(sd => { const m = new THREE.Mesh(new THREE.BoxGeometry(.13, .09, .11), paint); m.position.set((gl[3][0] - .03) * L - L / 2, (gl[3][1] + .03) * H, sd * (W / 2 + .07)); g.add(m); });
  if (T.bed){ // pickup: bed liner, roll bar, roof rails
    const bl = new THREE.Mesh(new THREE.BoxGeometry((T.bed[1] - T.bed[0]) * L, .02, W * .84), CARM.trim); bl.position.set(((T.bed[0] + T.bed[1]) / 2) * L - L / 2, .6 * H + .012, 0); g.add(bl);
    const rx = (T.bed[1] - .02) * L - L / 2, ry0 = .6 * H, ry1 = .9 * H;
    [-1, 1].forEach(sd => { const p = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, ry1 - ry0, 8), CARM.trim); p.position.set(rx, (ry0 + ry1) / 2, sd * W * .4); g.add(p); });
    const cb = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, W * .8, 8), CARM.trim); cb.rotation.x = Math.PI / 2; cb.position.set(rx, ry1, 0); g.add(cb);
    [-1, 1].forEach(sd => { const rr = new THREE.Mesh(new THREE.BoxGeometry((gl[2][0] - gl[1][0]) * L * .9, .03, .04), CARM.trim); rr.position.set(((gl[1][0] + gl[2][0]) / 2) * L - L / 2, (gl[2][1] + .045) * H, sd * W * .32); g.add(rr); });
  }
  if (o.wrap){
    const dw = L * .66, dh = H * .4, mat = new THREE.MeshStandardMaterial({map:artTex(dw, dh, leadWrap, 260), transparent:true, roughness:.4, polygonOffset:true, polygonOffsetFactor:-2});
    [-1, 1].forEach(sd => { const p = new THREE.Mesh(new THREE.PlaneGeometry(dw, dh), mat); p.position.set(L * .03, H * (.17 + .2), sd * (W / 2 + .004)); if (sd < 0) p.rotation.y = Math.PI; g.add(p); });
    const hood = new THREE.Mesh(new THREE.PlaneGeometry(L * .14, W * .55), new THREE.MeshBasicMaterial({map:artTex(L * .14, W * .55, (gg, w, h) => { gg.save(); gg.translate(w / 2, h / 2); gg.rotate(Math.PI / 2); logo(gg, 'frphW', 0, 0, h * .95, w * .95); gg.restore(); }), transparent:true}));
    hood.rotation.x = -Math.PI / 2; hood.position.set(L * .38, fv * H + .06 * H + .005, 0); g.add(hood);
  }
  g.userData.dims = [L, W];
  return g;
}
// flag banner on a pole (BYD slate with the white logo)
function bydFlag(h){
  const g = new THREE.Group(); h = h || 3.4;
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.022, .026, h, 6), solid('#2a2c33', {metalness:.4})); pole.position.y = h / 2; g.add(pole);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(.66, .025, .025), solid('#2a2c33')); arm.position.set(.33, h - .03, 0); g.add(arm);
  const ban = new THREE.Mesh(new THREE.PlaneGeometry(.62, 1.6), new THREE.MeshStandardMaterial({map:artTex(.62, 1.6, (gg, w, hh) => { gg.fillStyle = '#2d3742'; gg.fillRect(0, 0, w, hh); vlogo(gg, 'bydW', w / 2, hh * .5, w * .5, hh * .62); }), side:THREE.DoubleSide, roughness:.8}));
  ban.position.set(.34, h - .85, 0); g.add(ban);
  return g;
}
function flagStand(h){ const g = bydFlag(h); [0, Math.PI / 2].forEach(a => { const f = new THREE.Mesh(new THREE.BoxGeometry(.7, .04, .05), solid('#9aa0aa', {metalness:.5})); f.position.y = .02; f.rotation.y = a; g.add(f); }); return g; }
// box truss beam along x
const TRUSS_M = solid('#cfd3da', {metalness:.6, roughness:.35});
function truss(len, s){
  const g = new THREE.Group();
  [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([a, b]) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(.022, .022, len, 6), TRUSS_M); c.rotation.z = Math.PI / 2; c.position.set(0, a * s / 2, b * s / 2); g.add(c); });
  const n = Math.max(2, Math.round(len / .55)), step = len / n, ang = Math.atan2(s, step), dg = new THREE.CylinderGeometry(.011, .011, Math.hypot(step, s), 4);
  for (let i = 0; i < n; i++) [-1, 1].forEach(sd => { const d = new THREE.Mesh(dg, TRUSS_M); d.position.set(-len / 2 + step * (i + .5), 0, sd * s / 2); d.rotation.z = (i % 2 ? 1 : -1) * (Math.PI / 2 - ang); g.add(d); });
  return g;
}
function triRoof(x0, x1, z0, z1, y0, rh, mat){
  const ax = (x0 + x1) / 2, az = (z0 + z1) / 2, A = [ax, y0 + rh, az], g = new THREE.Group();
  [[[x0, y0, z1], [x1, y0, z1]], [[x1, y0, z1], [x1, y0, z0]], [[x1, y0, z0], [x0, y0, z0]], [[x0, y0, z0], [x0, y0, z1]]].forEach(([a, b]) => {
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...A], 3)); geo.computeVertexNormals(); g.add(new THREE.Mesh(geo, mat));
  });
  return g;
}
const FURN = {black:solid('#16171b', {roughness:.6}), white:solid('#f7f7f5', {roughness:.7}), navy:solid('#1f2c4c', {roughness:.8}), wood:solid('#c79a62', {roughness:.8}), grey:solid('#9aa0a8', {metalness:.3, roughness:.5})};
function barStool(x, z, y){
  const g = new THREE.Group(); y = y || 0;
  const seat = new THREE.Mesh(new THREE.BoxGeometry(.38, .06, .38), FURN.black); seat.position.y = .76; g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(.38, .3, .04), FURN.black); back.position.set(0, .95, -.17); g.add(back);
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => { const l = new THREE.Mesh(new THREE.BoxGeometry(.03, .76, .03), FURN.black); l.position.set(a * .16, .38, b * .16); g.add(l); });
  const ring = new THREE.Mesh(new THREE.BoxGeometry(.34, .02, .34), FURN.black); ring.position.y = .3; g.add(ring);
  g.position.set(x, y, z); return g;
}
function cafeTable(x, z, y){
  const g = new THREE.Group(); y = y || 0;
  const top = new THREE.Mesh(new THREE.CylinderGeometry(.36, .36, .03, 24), FURN.black); top.position.y = .74; g.add(top);
  for (let i = 0; i < 4; i++){ const a = i / 4 * Math.PI * 2 + Math.PI / 4, l = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, .78, 6), FURN.wood); l.position.set(Math.cos(a) * .12, .37, Math.sin(a) * .12); l.rotation.set(Math.sin(a) * .2, 0, -Math.cos(a) * .2); g.add(l); }
  g.position.set(x, y, z); return g;
}
function cube(x, z, y, c){ const m = new THREE.Mesh(new THREE.BoxGeometry(.4, .4, .4), c === 'navy' ? FURN.navy : FURN.white); m.position.set(x, (y || 0) + .2, z); return m; }
function campChair(x, z, ry){
  const g = new THREE.Group(), fab = solid('#d9dbde', {roughness:.9});
  const seat = new THREE.Mesh(new THREE.BoxGeometry(.5, .03, .44), fab); seat.position.y = .45; g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(.5, .45, .03), fab); back.position.set(0, .72, -.22); back.rotation.x = -.15; g.add(back);
  [-1, 1].forEach(sd => { [.35, -.35].forEach(t => { const l = new THREE.Mesh(new THREE.BoxGeometry(.02, .62, .02), FURN.grey); l.position.set(sd * .24, .3, 0); l.rotation.x = t; g.add(l); }); const arm = new THREE.Mesh(new THREE.BoxGeometry(.04, .03, .4), FURN.black); arm.position.set(sd * .26, .62, 0); g.add(arm); });
  g.position.set(x, 0, z); g.rotation.y = ry || 0; return g;
}
function campSet(x, z){
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(.55, .03, .55), solid('#e2e4e7')); top.position.y = .6; g.add(top);
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => { const l = new THREE.Mesh(new THREE.BoxGeometry(.02, .6, .02), FURN.grey); l.position.set(a * .24, .3, b * .24); g.add(l); });
  g.add(campChair(0, -.62, 0)); g.add(campChair(.62, .1, -Math.PI / 2 - .3)); g.add(campChair(-.62, .1, Math.PI / 2 + .3));
  g.position.set(x, 0, z); return g;
}
// digital standee: white frame with a screen
function standee(x, z, y, dark){
  const g = new THREE.Group(), body = dark ? solid('#3a3f47') : FURN.white;
  const frame = new THREE.Mesh(new THREE.BoxGeometry(.62, 1.85, .08), [body, body, body, body,
    artMat(.62, 1.85, (gg, w, h) => { gg.fillStyle = dark ? '#3a3f47' : '#ffffff'; gg.fillRect(0, 0, w, h);
      gg.fillStyle = lin(gg, 0, h * .14, 0, h * .82, [[0, '#0d2c63'], [1, '#2a6fc9']]); gg.fillRect(w * .07, h * .14, w * .86, h * .68);
      logo(gg, dark ? 'bydW' : 'byd', w / 2, h * .07, w * .5, h * .05); logo(gg, 'bydW', w / 2, h * .22, w * .5, h * .05);
      gg.fillStyle = '#ffffff'; gg.font = `700 ${h * .035}px ${FONT}`; gg.textAlign = 'center'; gg.fillText('BYD BLADE BATTERY', w / 2, h * .32);
      gg.fillStyle = 'rgba(255,255,255,.85)'; gg.beginPath(); gg.ellipse(w / 2, h * .55, w * .34, h * .07, 0, 0, Math.PI * 2); gg.fill();
      gg.fillStyle = '#9fc4ff'; [.28, .5, .72].forEach(t => gg.fillRect(w * (t - .1), h * .7, w * .2, h * .06));
      logo(gg, dark ? 'bydW' : 'byd', w / 2, h * .9, w * .3, h * .04); }), body]);
  frame.position.y = .1 + .925; g.add(frame);
  const base = new THREE.Mesh(new THREE.BoxGeometry(.66, .1, .42), body); base.position.y = .05; g.add(base);
  g.position.set(x, y || 0, z); return g;
}
function turfTex(w, d){
  return artTex(w, d, (g, W, H) => { g.fillStyle = '#4e9a35'; g.fillRect(0, 0, W, H);
    for (let i = 0; i < W * H / 40; i++){ g.fillStyle = Math.random() > .5 ? '#5cab3f' : '#43892d'; g.fillRect(Math.random() * W, Math.random() * H, 2, 3); } }, 60);
}

function bydShowroom(it){
  const g = new THREE.Group(), hw = it.w / S / 2, hd = it.h / S / 2;
  const tx = hw - .12, z0 = -hd + .1, z1 = hd - 1.6, zm = z0 + 3.8 * (z1 - z0) / 7.29, top = 3.3;   // tent x ±tx, z z0..z1; floor/turf split at zm
  // raised black floor (back) and turf (front)
  const edge = solid('#f2f3f5');
  const plat = new THREE.Mesh(new THREE.BoxGeometry(2 * tx, .15, zm - z0), [edge, edge, solid('#1f2024', {roughness:.85}), edge, edge, edge]);
  plat.position.set(0, .075, (z0 + zm) / 2); g.add(plat);
  const turf = new THREE.Mesh(new THREE.PlaneGeometry(2 * tx, z1 - zm), new THREE.MeshStandardMaterial({map:turfTex(2 * tx, z1 - zm), roughness:1}));
  turf.rotation.x = -Math.PI / 2; turf.position.set(0, .05, (zm + z1) / 2); g.add(turf);
  // truss structure: columns, box-truss beams, grey hip roof, BYD flags on six columns
  const xs = [-tx, 0, tx], zs = [z0, zm, z1];
  // steel box-truss towers on the corners and mid sides (front stays open), each on a base plate
  const STEEL = solid('#7d848e', {metalness:.75, roughness:.3});
  xs.forEach(x => zs.forEach(z => { if (x === 0) return;
    const tw = truss(top - .3, .3); tw.rotation.z = Math.PI / 2; tw.position.set(x, (top - .3) / 2 + .02, z); tw.traverse(m => { if (m.isMesh) m.material = STEEL; }); g.add(tw);
    const bp = new THREE.Mesh(new THREE.BoxGeometry(.6, .04, .6), STEEL); bp.position.set(x, .02, z); g.add(bp);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(.36, .06, .36), STEEL); cap.position.set(x, top - .3, z); g.add(cap); }));
  zs.forEach(z => { const b = truss(2 * tx, .3); b.position.set(0, top - .15, z); g.add(b); });
  xs.forEach(x => { const b = truss(z1 - z0, .3); b.rotation.y = Math.PI / 2; b.position.set(x, top - .15, (z0 + z1) / 2); g.add(b); });
  g.add(triRoof(-tx - .1, tx + .1, z0 - .1, z1 + .1, top, 1.5, solid('#cfd2d8', {side:THREE.DoubleSide, roughness:.8, transparent:true, opacity:.42, depthWrite:false})));
  [[-tx, z0, -1], [tx, z0, 1], [-tx, zm, -1], [tx, zm, 1], [-tx, z1, -1], [tx, z1, 1]].forEach(([x, z, sd]) => {
    const f = bydFlag(2.4); f.position.set(x, top, z); if (sd < 0) f.rotation.y = Math.PI; g.add(f);
  });
  const fy = .15;
  // back row counters: BYD Cafe (left), AC Health (centre), Test Drive Registration (right)
  const counter = (x, z, w, d, art) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, .98, d), [FURN.white, FURN.white, FURN.white, FURN.white, artMat(w, .98, art), FURN.white]); m.position.set(x, fy + .49, z); g.add(m); };
  counter(-tx + 1.15, z0 + .95, 1.9, .9, (gg, w, h) => { gg.fillStyle = '#ffffff'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#d5d8dd'; for (let x = w * .3; x < w; x += w * .035) gg.fillRect(x, 0, w * .012, h);
    gg.fillStyle = '#ffffff'; gg.fillRect(w * .02, h * .3, w * .26, h * .3); gg.fillStyle = '#1f2833'; gg.font = `700 ${h * .12}px ${FONT}`; gg.textAlign = 'center'; gg.fillText('BYD Cafe', w * .15, h * .42); gg.font = `500 ${h * .06}px ${FONT}`; gg.fillText('Powered by Ox Technology', w * .15, h * .53); });
  const sideL = new THREE.Mesh(new THREE.BoxGeometry(.08, .98, 1.1), FURN.white); sideL.position.set(-tx + .25, fy + .49, z0 + .45); g.add(sideL);
  counter(0, z0 + .7, 1.8, .62, (gg, w, h) => { gg.fillStyle = '#ffffff'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#28c8d8'; gg.fillRect(0, h * .04, w, h * .05);
    gg.fillStyle = '#1b2a8a'; gg.font = `700 ${h * .2}px ${FONT}`; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillText('✕ AC Health', w / 2, h * .38); gg.font = `500 ${h * .07}px ${FONT}`; gg.fillText('An Ayala Company', w / 2, h * .55); });
  counter(tx - .75, z0 + .7, 1.1, .62, (gg, w, h) => { gg.fillStyle = '#ffffff'; gg.fillRect(0, 0, w, h); logo(gg, 'byd', w / 2, h * .32, w * .55, h * .16);
    gg.fillStyle = '#3a3f47'; gg.font = `600 ${h * .065}px ${FONT}`; gg.textAlign = 'center'; gg.fillText('TEST DRIVE REGISTRATION', w / 2, h * .5); });
  [-.5, .5].forEach(x => g.add(barStool(x, z0 + 1.35, fy)));
  // staff behind the three counters, a guest at each counter front
  [[-tx + 1.0, z0 + .25], [0, z0 + .16], [tx - .75, z0 + .16]].forEach(([x, z]) => BRAND_PEOPLE.push({base:it.id, x, z, ry:0}));
  [[-tx + 1.5, z0 + 1.7], [0, z0 + 1.35], [tx - .75, z0 + 1.4]].forEach(([x, z]) => BRAND_PEOPLE.push({base:it.id, x, z, ry:Math.PI}));
  // centre digital totem, cafe tables with cube seats, standees at the floor edge
  g.add(standee(0, z0 + 1.9, fy, true));
  [-3.1, -1.25, 1.25, 3.1].forEach((x, i) => { g.add(cafeTable(x, zm - 1.55, fy)); g.add(cube(x - .55, zm - 1.45, fy, i % 2 ? 'navy' : 'white')); g.add(cube(x + .55, zm - 1.65, fy, i % 2 ? 'white' : 'navy')); });
  g.add(standee(-tx + .45, zm - .35, fy)); g.add(standee(tx - .45, zm - .35, fy));
  // visitors browsing the floor and sitting area
  [[-2.2, z0 + 3.0, 0, z0 + 1.9], [1.9, z0 + 3.5, 0, z0 + 1.9], [-.6, z0 + 4.4, 0, z0 + 1.9], [-1.25, zm - .95, -1.25, zm - 1.55], [3.1, zm - .95, 3.1, zm - 1.55], [2.3, zm - 2.4, tx - .45, zm - .35]].forEach(([x, z, lx, lz]) => BRAND_PEOPLE.push({base:it.id, x, z, ry:Math.atan2(lx - x, lz - z)}));
  // turf: Shark 6 on display, camping sets, high table + stool
  const shark = vehicle('shark6', '#3f5f8f'); shark.position.set(-.3, 0, (zm + z1) / 2 - .05); shark.rotation.y = Math.PI + .26; g.add(shark);
  g.add(campSet(-tx + .85, zm + .9)); g.add(campSet(tx - .95, zm + .9));
  const side = new THREE.Group(); const oct = new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, .98, 8), FURN.grey); oct.position.y = .49; side.add(oct);
  const wt = new THREE.Mesh(new THREE.CylinderGeometry(.26, .26, .04, 8), FURN.wood); wt.position.y = 1.0; side.add(wt); side.position.set(tx - .45, 0, z1 - .45); g.add(side);
  g.add(barStool(tx - 1.05, z1 - .55, 0));
  // people on the turf around the Shark 6 and the camping sets
  [[3.0, (zm + z1) / 2 - 1.2], [-3.9, (zm + z1) / 2 + 1.2], [3.1, z1 - 1.5], [-tx + .85, zm + 1.75], [tx - .95, zm + 1.75]].forEach(([x, z]) => BRAND_PEOPLE.push({base:it.id, x, z, ry:Math.atan2(-.3 - x, (zm + z1) / 2 - z)}));   // looking at the Shark 6
  // front: lit BYD letters sign, inflatable arch, inflatable tubes
  const sign = new THREE.Group();
  const pl = new THREE.Mesh(new THREE.BoxGeometry(2.3, .42, .5), solid('#33363d')); pl.position.y = .21; sign.add(pl);
  const strip = new THREE.Mesh(new THREE.BoxGeometry(2.3, .03, .02), new THREE.MeshBasicMaterial({color:col('#4aa8ff')})); strip.position.set(0, .3, .26); sign.add(strip);
  const lt = new THREE.MeshStandardMaterial({map:artTex(2.2, .5, (gg, w, h) => logo(gg, 'bydW', w / 2, h / 2, w * .98, h * .95)), transparent:true, alphaTest:.4, side:THREE.DoubleSide, roughness:.4});
  for (let k = 0; k < 4; k++){ const p = new THREE.Mesh(new THREE.PlaneGeometry(2.2, .5), lt); p.position.set(0, .42 + .25, -.04 + k * .025); sign.add(p); }
  sign.position.set(0, 0, z1 + .45); g.add(sign);
  const archZ = z1 + 1.05, ax = 3.5, inflM = solid('#141518', {roughness:.55});
  const path = new THREE.CurvePath();
  path.add(new THREE.LineCurve3(new V3(-ax, 0, 0), new V3(-ax, 3.3, 0)));
  path.add(new THREE.QuadraticBezierCurve3(new V3(-ax, 3.3, 0), new V3(-ax, 4.6, 0), new V3(-ax + 1.2, 4.6, 0)));
  path.add(new THREE.LineCurve3(new V3(-ax + 1.2, 4.6, 0), new V3(ax - 1.2, 4.6, 0)));
  path.add(new THREE.QuadraticBezierCurve3(new V3(ax - 1.2, 4.6, 0), new V3(ax, 4.6, 0), new V3(ax, 3.3, 0)));
  path.add(new THREE.LineCurve3(new V3(ax, 3.3, 0), new V3(ax, 0, 0)));
  const arch = new THREE.Mesh(new THREE.TubeGeometry(path, 160, .42, 16, false), inflM); arch.position.z = archZ; g.add(arch);
  const redBand = artTex(1, 1, (gg, w, h) => { gg.fillStyle = lin(gg, 0, 0, 0, h, [[0, '#141518'], [.45, '#c41f2a'], [.8, '#e8323c'], [.82, '#141518'], [1, '#141518']]); gg.fillRect(0, 0, w, h);
    gg.strokeStyle = 'rgba(255,255,255,.6)'; gg.lineWidth = w * .01; for (let i = 0; i < 3; i++){ gg.beginPath(); gg.moveTo(w * (.1 + i * .05), h * .2); gg.quadraticCurveTo(w * .5, h * (.45 + i * .04), w * (.9 - i * .05), h * .3); gg.stroke(); } }, 256);
  const bandM = new THREE.MeshStandardMaterial({map:redBand, roughness:.5});
  [-ax, ax].forEach(x => { const s = new THREE.Mesh(new THREE.CylinderGeometry(.43, .43, 2.6, 20, 1, true), bandM); s.position.set(x, 1.5, archZ); g.add(s);
    const ft = new THREE.Mesh(new THREE.BoxGeometry(.9, .2, .9), inflM); ft.position.set(x, .1, archZ); g.add(ft); });
  const bann = artMat(3.6, .62, (gg, w, h) => { gg.fillStyle = '#141518'; gg.fillRect(0, 0, w, h); logo(gg, 'bydW', w / 2, h / 2, w * .5, h * .62);
    gg.strokeStyle = 'rgba(255,255,255,.55)'; gg.lineWidth = h * .025; [[.12, 1], [.88, -1]].forEach(([c, d]) => { for (let i = 0; i < 3; i++){ gg.beginPath(); gg.moveTo(w * c + d * i * w * .015, h * .1); gg.quadraticCurveTo(w * (c + d * .05), h * .5, w * c + d * i * w * .015, h * .9); gg.stroke(); } }); });
  [1, -1].forEach(sd => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, .62), bann); b.position.set(0, 4.6, archZ + sd * .43); if (sd < 0) b.rotation.y = Math.PI; g.add(b); });
  [-tx + .35, tx - .35].forEach((x, i) => {   // inflatable tubes beside the arch
    const tb = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(.32, .32, 4.0, 18), inflM); body.position.y = 2.1; tb.add(body);
    const sl = new THREE.Mesh(new THREE.CylinderGeometry(.33, .33, 2.0, 18, 1, true), bandM); sl.position.y = 1.6; tb.add(sl);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(.32, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), solid('#d9dde3')); cap.position.y = 4.1; tb.add(cap);
    [[2.9, 1], [3.3, -1]].forEach(([y, s]) => { const a = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .85, 10), inflM); a.position.set(s * .4, y, 0); a.rotation.z = s * -.9; tb.add(a); });
    const base = new THREE.Mesh(new THREE.BoxGeometry(.75, .12, .75), inflM); base.position.y = .06; tb.add(base);
    tb.position.set(x, 0, archZ + .1); tb.rotation.y = i ? .3 : -.3; g.add(tb);
  });
  it.top = top + 1.6;
  return g;
}

// test drive line-up: shallow white tents (3 m deep) on the north half of Independence Road, open to the north
function bydLineup(it, which){
  const g = new THREE.Group(), w = it.w / S, d = it.h / S, hd = d / 2;
  const n = Math.round(w / 7), tw = w / n;
  const mat = new THREE.Mesh(new THREE.PlaneGeometry(w - .1, d - .1), solid('#5b5f68', {roughness:1})); mat.rotation.x = -Math.PI / 2; mat.position.y = .02; g.add(mat);
  for (let i = 0; i < n; i++){
    const cx = -w / 2 + tw * (i + .5), eave = 2.7, white = solid('#f6f7f9', {roughness:.7});
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => { const p = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, eave, 8), poleMat); p.position.set(cx + a * (tw / 2 - .08), eave / 2, b * (hd - .08)); g.add(p); });
    const val = new THREE.Mesh(new THREE.BoxGeometry(tw - .06, .4, d - .06), white); val.position.set(cx, eave + .2, 0); g.add(val);
    g.add(triRoof(cx - tw / 2 + .03, cx + tw / 2 - .03, -hd + .03, hd - .03, eave + .4, .55, solid('#ffffff', {side:THREE.DoubleSide, roughness:.7})));
    const vf = new THREE.Mesh(new THREE.PlaneGeometry(1.2, .3), new THREE.MeshBasicMaterial({map:artTex(1.2, .3, (gg, ww, hh) => logo(gg, 'byd', ww / 2, hh / 2, ww * .9, hh * .8)), transparent:true}));
    vf.position.set(cx, eave + .2, -hd + .025); vf.rotation.y = Math.PI; g.add(vf);
    // BYD flags on the outer corners of each tent
    [[-1, 1], [1, 1]].forEach(([a, b]) => { const f = bydFlag(2.1); f.position.set(cx + a * (tw / 2 - .08), eave + .4, b * (hd - .08)); f.rotation.y = a < 0 ? Math.PI : 0; g.add(f); });
  }
  // cars parked side-on (nose east) so the village sees their full length
  const park = (key, color, x, o) => { const c = vehicle(key, color, o); c.position.set(x, 0, 0); g.add(c); };
  if (which === 'garage'){
    const tbl = new THREE.Mesh(new THREE.BoxGeometry(2.4, .76, .75), [FURN.black, FURN.black, FURN.black, FURN.black, artMat(2.4, .76, (gg, ww, hh) => { gg.fillStyle = '#16171b'; gg.fillRect(0, 0, ww, hh); logo(gg, 'bydW', ww / 2, hh * .45, ww * .3, hh * .3); }), FURN.black]);
    tbl.position.set(.3, .38, -.35); tbl.rotation.y = Math.PI; g.add(tbl);
    [-.5, .5].forEach(dx => { const ch = barStool(.3 + dx, .45, 0); ch.rotation.y = Math.PI; g.add(ch); });
    [-.5, .5].forEach(dx => BRAND_PEOPLE.push({base:it.id, x:.3 + dx, z:.95, ry:Math.PI}));   // facing the table / road
    const fs = flagStand(3.2); fs.position.set(-w / 2 + .35, 0, -hd + .35); fs.rotation.y = Math.PI; g.add(fs);
  } else {
    const line = [['shark6', '#3f5f8f'], ['seal', '#f4f5f7'], ['atto2', '#c9d98f']];
    const gap = (w - line.reduce((a, [k]) => a + CAR_MODELS[k].L, 0)) / (line.length + 1);
    let x = -w / 2 + gap;
    line.forEach(([k, c]) => { const L = CAR_MODELS[k].L; park(k, c, x + L / 2, k === 'atto2' ? {roof:'#1c1e22'} : null); x += L + gap; });
  }
  it.top = 3.7;
  return g;
}

// test drive lane: edge lines, painted lettering and arrows, cones at the start
function tdLane(it){
  const g = new THREE.Group(), w = it.w / S, d = it.h / S;
  const surf = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({map:artTex(w, d, (gg, W, H) => {
    gg.fillStyle = '#62676f'; gg.fillRect(0, 0, W, H);
    gg.fillStyle = '#ffffff'; gg.fillRect(0, H * .04, W, H * .04); gg.fillRect(0, H * .92, W, H * .04);
    gg.font = `700 ${H * .34}px ${FONT}`; gg.textAlign = 'center'; gg.textBaseline = 'middle';
    [.22, .62].forEach(t => gg.fillText('BYD TEST DRIVE', W * t, H * .5));
    [.42, .82].forEach(t => { const x = W * t, y = H * .5, l = H * .9; gg.beginPath(); gg.moveTo(x - l / 2, y - H * .06); gg.lineTo(x + l * .2, y - H * .06); gg.lineTo(x + l * .2, y - H * .18); gg.lineTo(x + l / 2, y); gg.lineTo(x + l * .2, y + H * .18); gg.lineTo(x + l * .2, y + H * .06); gg.lineTo(x - l / 2, y + H * .06); gg.fill(); });
  }, 40), roughness:1}));
  surf.rotation.x = -Math.PI / 2; surf.position.y = .02; g.add(surf);
  const coneM = solid('#f26a1b'), stripe = solid('#ffffff');
  [[-w / 2 + .4, -d / 2 + .5], [-w / 2 + .4, d / 2 - .5], [-w / 2 + .4, 0]].forEach(([x, z]) => {
    const c = new THREE.Mesh(new THREE.ConeGeometry(.16, .5, 12), coneM); c.position.set(x, .27, z); g.add(c);
    const s2 = new THREE.Mesh(new THREE.CylinderGeometry(.095, .115, .07, 12), stripe); s2.position.set(x, .3, z); g.add(s2);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(.36, .03, .36), solid('#1b1d22')); b2.position.set(x, .015, z); g.add(b2);
  });
  it.top = .6;
  return g;
}

// metal crowd-control barriers (2 m panels, 1.1 m high) along a map-pixel path, in the item's local frame
function barricade(it){
  const g = new THREE.Group(), m = solid('#b9bec7', {metalness:.7, roughness:.35}), P = [];
  for (let i = 1; i < it.path.length; i++){
    const a = new V3(X(it.path[i-1][0]) - X(it.x), 0, Z(it.path[i-1][1]) - Z(it.y)), b = new V3(X(it.path[i][0]) - X(it.x), 0, Z(it.path[i][1]) - Z(it.y));
    const L = a.distanceTo(b), n = Math.max(1, Math.round(L / 2.05)), dir = b.clone().sub(a).normalize(), ang = Math.atan2(-dir.z, dir.x);
    for (let k = 0; k < n; k++) P.push({p:a.clone().addScaledVector(dir, (k + .5) * L / n), ang, len:L / n - .06});
  }
  const bars = new THREE.InstancedMesh(new THREE.CylinderGeometry(.01, .01, .86, 5), m, P.length * 15), o = new THREE.Object3D(); let bi = 0;
  P.forEach(({p, ang, len}) => {
    const pn = new THREE.Group(); pn.position.copy(p); pn.rotation.y = ang;
    [1.1, .22].forEach(y => { const r = new THREE.Mesh(new THREE.BoxGeometry(len, .035, .035), m); r.position.y = y; pn.add(r); });
    [-1, 1].forEach(sd => { const post = new THREE.Mesh(new THREE.BoxGeometry(.035, 1.1, .035), m); post.position.set(sd * len / 2, .55, 0); pn.add(post);
      const foot = new THREE.Mesh(new THREE.BoxGeometry(.06, .03, .7), m); foot.position.set(sd * (len / 2 - .15), .015, 0); pn.add(foot); });
    g.add(pn); pn.updateMatrix();
    for (let k = 1; k <= 15; k++){ o.position.set(-len / 2 + k * len / 16, .66, 0); o.rotation.set(0, 0, 0); o.updateMatrix(); o.matrix.premultiply(pn.matrix); bars.setMatrixAt(bi++, o.matrix); }
  });
  bars.count = bi; g.add(bars);
  it.top = 1.2;
  return g;
}
