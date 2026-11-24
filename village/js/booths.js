// FunRide Bike Village 3D: Generic booth builders and true-size tents with crew.
// Loaded in order by main.js once fonts and logos are ready; top-level names are shared across files.
"use strict";

/* ---------- builders ---------- */
const pickables = [];
const ROOT = {};
function register(it, group){ group.traverse(o => { if (o.isMesh){ o.userData.item = o.userData.pickAs ? BY[o.userData.pickAs] : it; pickables.push(o); o.castShadow = true; o.receiveShadow = true; } }); ROOT[it.id] = group; }

function boxBooth(it, opt){
  const c = CATS[it.cat], w = it.w / S, d = it.h / S, h = (opt && opt.ht) || it.ht || 2.2;
  const label = it.label != null ? it.label : it.name.toUpperCase();
  const flat = label.replace(/\n/g, ' ');
  const mats = [
    faceMat(flat, d, h, c.bg, c.fg), faceMat(flat, d, h, c.bg, c.fg),
    new THREE.MeshStandardMaterial({map:textCanvas(label, w, d, {bg:c.bg, fg:c.fg, vert:it.vert}), roughness:.7}),
    new THREE.MeshStandardMaterial({color:col(c.bg)}),
    faceMat(flat, w, h, c.bg, c.fg), faceMat(flat, w, h, c.bg, c.fg)
  ];
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats);
  m.position.y = h / 2;
  return m;
}
/* ---------- tents at true size: open, back siding, aircon, stall ---------- */
const poleMat = new THREE.MeshStandardMaterial({color:col('#d9dce6'), roughness:.4, metalness:.3});
const tableMat = new THREE.MeshStandardMaterial({color:col('#f7f7f4'), roughness:.8});
const BACKDIR = {n:[0, -1], s:[0, 1], e:[1, 0], w:[-1, 0]};
// booth crew: staff stand behind the front table/counter facing out (front = fx, fz), and some booths get a
// customer on the outside facing in. half = booth half-depth toward the front, len = table length, back = table back edge from the front
function boothCrew(it, fx, fz, half, len, back){
  const out = Math.atan2(fx, fz), sx = fz, sz = -fx;   // sx, sz: along the table
  const n = len > 2.6 ? 2 : 1, inner = half - back - .25, outer = half + .45;
  for (let i = 0; i < n; i++){
    const t = n === 1 ? 0 : (i ? 1 : -1) * len / 4;
    BRAND_PEOPLE.push({base:it.id, x:fx * inner + sx * t, z:fz * inner + sz * t, ry:out});
  }
  if (Math.random() < .6){ const t = (Math.random() - .5) * len * .5;
    BRAND_PEOPLE.push({base:it.id, x:fx * outer + sx * t, z:fz * outer + sz * t, ry:out + Math.PI}); }
}
function tentBooth(it){
  // topLogo: white branded canopy with the sponsor logo printed on the roof
  const c = it.topLogo ? {bg:'#ffffff', fg:'#1b1d22'} : CATS[it.cat], w = it.w / S, d = it.h / S, g = new THREE.Group();
  const label = it.label != null ? it.label : it.name.toUpperCase();
  const flat = label.replace(/\n/g, ' ');
  const [bx, bz] = BACKDIR[it.back || 'n'];
  const plain = new THREE.MeshStandardMaterial({color:col(c.bg), roughness:.7});
  const topMat = it.topLogo
    ? artMat(w, d, (gg, W, H) => { gg.fillStyle = '#ffffff'; gg.fillRect(0, 0, W, H); logo(gg, it.topLogo, W / 2, H * .42, W * .82, H * .32);
        gg.fillStyle = '#1b1d22'; gg.font = `700 ${H * .085}px ${FONT}`; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillText('TEST DRIVE REGISTRATION', W / 2, H * .74); })
    : new THREE.MeshStandardMaterial({map:textCanvas(label, w, d, {bg:c.bg, fg:c.fg, vert:it.vert}), roughness:.7});
  // footprint on the ground, so the real size reads in top view too
  const pad = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({color:col(c.bg), roughness:1, transparent:true, opacity:.35}));
  pad.rotation.x = -Math.PI / 2; pad.position.y = .045; g.add(pad);

  if (it.tent === 'stall'){
    // booth stall only: counter + back panel with header
    const counter = new THREE.Mesh(new THREE.BoxGeometry(w * .9, 1, .5), [plain, plain, topMat, plain, faceMat(flat, w * .9, 1, c.bg, c.fg), faceMat(flat, w * .9, 1, c.bg, c.fg)]);
    counter.position.set(0, .5, d / 2 - .35); g.add(counter);
    const panel = new THREE.Mesh(new THREE.BoxGeometry(w, 2.2, .08), [plain, plain, plain, plain, faceMat(flat, w, 2.2, c.bg, c.fg), plain]);
    panel.position.set(0, 1.1, -d / 2 + .1); g.add(panel);
    boothCrew(it, 0, 1, d / 2, w * .9, .6);
    it.top = 2.2; return g;
  }

  if (it.tent === 'aircon'){
    // enclosed VIP tent: white walls, peaked roof, door on the front, AC unit at the back
    const wallH = 2.5, white = new THREE.MeshStandardMaterial({color:col('#f4f6fb'), roughness:.6});
    const wallFace = (a, b) => faceMat(flat, a, b, '#f4f6fb', '#16187a');
    const box = new THREE.Mesh(new THREE.BoxGeometry(w, wallH, d), [wallFace(d, wallH), wallFace(d, wallH), white, white, wallFace(w, wallH), wallFace(w, wallH)]);
    box.position.y = wallH / 2; g.add(box);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(w + .3, .22, d + .3), [plain, plain, topMat, plain, plain, plain]);
    roof.position.y = wallH + .11; g.add(roof);
    const door = new THREE.Mesh(new THREE.PlaneGeometry(1, 2.1), new THREE.MeshStandardMaterial({color:col('#2a2c3a')}));
    door.position.set(-bx * (w / 2 + .01), 1.05, -bz * (d / 2 + .01)); door.rotation.y = Math.atan2(-bx, -bz); g.add(door);
    const ac = new THREE.Mesh(new THREE.BoxGeometry(.9, .7, .5), new THREE.MeshStandardMaterial({color:col('#c9ced8'), roughness:.5}));
    ac.position.set(bx * (w / 2 + .3), .35, bz * (d / 2 + .3)); ac.rotation.y = Math.atan2(bx, bz); g.add(ac);
    it.top = wallH + .3; return g;
  }

  // pop-up canopy (open tent / tent with back siding)
  const eave = 2.3, valH = .3;
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sz]) => {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, eave, 6), poleMat);
    p.position.set(sx * (w / 2 - .05), eave / 2, sz * (d / 2 - .05)); g.add(p);
  });
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(w, valH, d), [
    faceMat(flat, d, valH * 3, c.bg, c.fg), faceMat(flat, d, valH * 3, c.bg, c.fg), topMat, plain,
    faceMat(flat, w, valH * 3, c.bg, c.fg), faceMat(flat, w, valH * 3, c.bg, c.fg)]);
  canopy.position.y = eave + valH / 2; g.add(canopy);
  if (it.tent === 'back'){
    const along = bx !== 0 ? d : w;
    const wall = new THREE.Mesh(new THREE.BoxGeometry(along, eave, .05), plain);
    wall.position.set(bx * (w / 2 - .03), eave / 2, bz * (d / 2 - .03));
    wall.rotation.y = bx !== 0 ? Math.PI / 2 : 0; g.add(wall);
  }
  // service table along the front
  const fx = -bx, fz = -bz, tl = (fx !== 0 ? d : w) * .8;
  const table = new THREE.Mesh(new THREE.BoxGeometry(tl, .75, .6), tableMat);
  table.position.set(fx * (w / 2 - .5), .375, fz * (d / 2 - .5));
  table.rotation.y = fx !== 0 ? Math.PI / 2 : 0; g.add(table);
  if (label) boothCrew(it, fx, fz, (fx !== 0 ? w : d) / 2, tl, .8);   // open merchant slots stay empty
  it.top = eave + valH; return g;
}
