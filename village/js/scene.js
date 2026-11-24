// FunRide Bike Village 3D: Renderer, camera, text textures, ground, roads, fences and rider-flow lanes.
// Loaded in order by main.js once fonts and logos are ready; top-level names are shared across files.
"use strict";

/* ---------- renderer ---------- */
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.background = col('#cfe6f7');
scene.fog = new THREE.Fog(scene.background, 170, 340);
const camera = new THREE.PerspectiveCamera(42, 1, .1, 800);
camera.position.set(0, 90, 110);
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = .08;
controls.maxPolarAngle = 1.47; controls.minDistance = 4; controls.maxDistance = 220;
controls.target.set(0, 0, 0);

scene.add(new THREE.HemisphereLight(col('#eaf4ff'), col('#6d8f55'), .75));
const sun = new THREE.DirectionalLight(col('#fff4e0'), .95);
sun.position.set(-45, 90, 55); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, {left:-80, right:80, top:80, bottom:-80, near:10, far:260});
sun.shadow.bias = -.0005;
scene.add(sun);

/* ---------- textures with text ---------- */
const FONT = 'Oswald, "Arial Narrow", Impact, sans-serif';
function textCanvas(text, wU, hU, o){
  o = o || {};
  const ppu = o.ppu || 40;
  let cw = Math.max(32, Math.round(wU * ppu)), ch = Math.max(32, Math.round(hU * ppu));
  const k = Math.min(1, 1024 / Math.max(cw, ch)); cw = Math.round(cw * k); ch = Math.round(ch * k);
  const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
  const g = cv.getContext('2d');
  if (o.pill){
    const r = Math.min(cw, ch) * .5;
    g.fillStyle = o.bg; g.beginPath();
    if (g.roundRect) g.roundRect(1, 1, cw - 2, ch - 2, r); else g.rect(0, 0, cw, ch);
    g.fill();
  } else if (o.bg){ g.fillStyle = o.bg; g.fillRect(0, 0, cw, ch); }
  if (o.border){ g.strokeStyle = o.border; g.lineWidth = Math.max(2, Math.min(cw, ch) * .04); g.strokeRect(0, 0, cw, ch); }
  if (text){
    g.save();
    let W = cw, H = ch;
    if (o.vert){ g.translate(cw / 2, ch / 2); g.rotate(-Math.PI / 2); W = ch; H = cw; g.translate(-W / 2, -H / 2); }
    const lines = text.split('\n');
    let fs = H * (o.fill || .62) / lines.length;
    g.font = `700 ${fs}px ${FONT}`;
    const mw = Math.max(...lines.map(l => g.measureText(l).width));
    const maxW = W * (o.pill ? .8 : .86);
    if (mw > maxW) fs *= maxW / mw;
    g.font = `700 ${fs}px ${FONT}`;
    g.fillStyle = o.fg; g.textAlign = 'center'; g.textBaseline = 'middle';
    lines.forEach((l, i) => g.fillText(l, W / 2, H / 2 + (i - (lines.length - 1) / 2) * fs * 1.08));
    g.restore();
  }
  const t = new THREE.CanvasTexture(cv);
  t.encoding = THREE.sRGBEncoding; t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
}
function faceMat(text, wU, hU, bg, fg, vert){
  if (!text || wU * hU < .35) return new THREE.MeshStandardMaterial({color:col(bg), roughness:.75});
  return new THREE.MeshStandardMaterial({map:textCanvas(text, wU, hU, {bg, fg, vert}), roughness:.75});
}
function flatLabel(text, px, py, wpx, hpx, o){
  o = o || {};
  const w = wpx / S, h = hpx / S;
  const tex = textCanvas(text, w, h, Object.assign({bg:'#ffffff', fg:'#16187a', pill:true, ppu:60}, o));
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({map:tex, transparent:true, depthWrite:false}));
  m.rotation.x = -Math.PI / 2;
  if (o.rot) m.rotation.z = o.rot * Math.PI / 180;
  m.position.set(X(px), o.y || .08, Z(py));
  m.renderOrder = 2;
  scene.add(m);
  return m;
}

/* ---------- ground ---------- */
function rect(x1, y1, x2, y2, color, y, recv){
  const m = new THREE.Mesh(new THREE.PlaneGeometry((x2 - x1) / S, (y2 - y1) / S), new THREE.MeshStandardMaterial({color:col(color), roughness:1}));
  m.rotation.x = -Math.PI / 2; m.position.set(X((x1 + x2) / 2), y, Z((y1 + y2) / 2));
  m.receiveShadow = recv !== false; scene.add(m); return m;
}
function polyFloor(pts, color, y){
  const sh = new THREE.Shape(pts.map(([x, yy]) => new THREE.Vector2(X(x), -Z(yy))));
  const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshStandardMaterial({color:col(color), roughness:.95}));
  m.rotation.x = -Math.PI / 2; m.position.y = y; m.receiveShadow = true; scene.add(m); return m;
}
rect(-400, -400, 1800, 1500, '#e6e9e3', -.05);               // surrounding paving
rect(93, 0, 1293, 32, '#8fc46f', 0);                          // Rizal Park strip
rect(162, 98, 1232, 922, '#9fd07f', 0);                       // lawn
const ASPH = '#70757f';
rect(93, 32, 1293, 98, ASPH, .01);                            // Roxas Boulevard
rect(93, 98, 162, 990, ASPH, .01);                            // Katigbak Parkway
rect(1232, 98, 1262, 990, ASPH, .011);                        // South Drive
rect(93, 922, 1262, 990, ASPH, .012);                         // Independence Road
rect(105, 1000, 282, 1077, '#d4d8dd', .01);                   // parking west
rect(1152, 1000, 1287, 1077, '#d4d8dd', .01);                 // parking east
rect(566, 100, 1015, 185, '#efe4cf', .02);                    // KM 0 plaza
const VENUE = [[362,378],[655,352],[815,380],[1065,380],[1065,790],[1010,905],[640,905],[550,812],[362,748]];
polyFloor(VENUE, '#f2f4f9', .03);

// lane markings
const dashMat = new THREE.MeshBasicMaterial({color:col('#f3f3f0'), transparent:true, opacity:.75});
function dashes(x1, y1, x2, y2, dash, gap, width, y, mat){
  const a = new V3(X(x1), 0, Z(y1)), b = new V3(X(x2), 0, Z(y2));
  const L = a.distanceTo(b), dir = b.clone().sub(a).normalize(), ang = Math.atan2(-dir.z, dir.x);
  const geo = new THREE.BoxGeometry(dash, .02, width);
  const n = Math.floor(L / (dash + gap));
  const im = new THREE.InstancedMesh(geo, mat || dashMat, n);
  const o = new THREE.Object3D();
  for (let i = 0; i < n; i++){
    const d = i * (dash + gap) + dash / 2;
    o.position.copy(a).addScaledVector(dir, d); o.position.y = y || .03; o.rotation.set(0, ang, 0); o.updateMatrix();
    im.setMatrixAt(i, o.matrix);
  }
  scene.add(im); return im;
}
dashes(100, 65, 1290, 65, 1.6, 1.4, .1);
dashes(133, 110, 133, 915, 1.6, 1.4, .1);
dashes(1247, 110, 1247, 915, 1.6, 1.4, .08);
dashes(100, 956, 1255, 956, 1.6, 1.4, .1);
// parking stalls
for (let i = 0; i < 9; i++){ dashes(115 + i * 19, 1005, 115 + i * 19, 1035, .3, 0, .08, .03); }
for (let i = 0; i < 7; i++){ dashes(1160 + i * 19, 1005, 1160 + i * 19, 1035, .3, 0, .08, .03); }

// road & place labels (as printed on the map)
flatLabel('RIZAL PARK', 769, 22, 112, 18);
flatLabel('ROXAS BOULEVARD', 769, 63, 170, 24);
flatLabel('KM 0', 612, 120, 46, 14);
flatLabel('KATIGBAK PARKWAY', 133, 440, 24, 180, {vert:true});
flatLabel('SOUTH DRIVE', 1249, 440, 22, 140, {vert:true});
flatLabel('INDEPENDENCE ROAD', 180, 958, 146, 22);
flatLabel('PHOTOWALL', 757, 426, 90, 14, {bg:null, pill:false, fg:'#16183f'});
flatLabel('MERCHANTS', 775, 818, 80, 11, {bg:null, pill:false, fg:'#16183f'});
flatLabel('PARKING', 192, 1040, 90, 16, {bg:null, pill:false, fg:'#5b5f75'});
flatLabel('PARKING', 1219, 1040, 90, 16, {bg:null, pill:false, fg:'#5b5f75'});

/* ---------- fences, barriers, rider flow, artists path ---------- */
const fenceMat = new THREE.MeshStandardMaterial({color:col('#1b1e4a'), roughness:.6});
function wallSeg(x1, y1, x2, y2, h, t, mat){
  const a = new V3(X(x1), 0, Z(y1)), b = new V3(X(x2), 0, Z(y2));
  const L = a.distanceTo(b);
  const m = new THREE.Mesh(new THREE.BoxGeometry(L, h, t), mat);
  m.position.copy(a).lerp(b, .5); m.position.y = h / 2;
  m.rotation.y = Math.atan2(-(b.z - a.z), b.x - a.x);
  m.castShadow = true; m.receiveShadow = true; scene.add(m); return m;
}
function polyWall(pts, h, t, mat){ for (let i = 1; i < pts.length; i++) wallSeg(pts[i-1][0], pts[i-1][1], pts[i][0], pts[i][1], h, t, mat); }
polyWall([[655,352],[362,378],[362,668]], 1.0, .16, fenceMat);
polyWall([[362,700],[362,748],[550,812]], 1.0, .16, fenceMat);
polyWall([[815,381],[1065,381],[1065,790]], 1.0, .16, fenceMat);
polyWall([[375,1022],[628,1055]], .9, .14, fenceMat);           // barrier by the grandstand
// grass hedge closing the south edge: only the Exit and the Entrance stay open
{
  const hedgeM = new THREE.MeshStandardMaterial({color:col('#4f9a3a'), roughness:1});
  const bushM = new THREE.MeshStandardMaterial({color:col('#5fae45'), roughness:1, flatShading:true});
  const segs = [[[550,812],[599,863]], [[645,905],[985,905]], [[1065,790],[1032,859]]];
  const bushes = [];
  segs.forEach(([a, b]) => {
    const w = wallSeg(a[0], a[1], b[0], b[1], .7, .9, hedgeM);
    w.userData.hedge = true;
    const A = new V3(X(a[0]), 0, Z(a[1])), B = new V3(X(b[0]), 0, Z(b[1])), n = Math.max(2, Math.round(A.distanceTo(B) / .8));
    for (let i = 0; i <= n; i++) bushes.push(A.clone().lerp(B, i / n));
  });
  const im = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.55, 0), bushM, bushes.length), o = new THREE.Object3D();
  bushes.forEach((p, i) => { o.position.set(p.x, .75, p.z); o.rotation.set(Math.random() * 3, Math.random() * 3, 0); o.scale.setScalar(.85 + Math.random() * .3); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
  im.castShadow = im.receiveShadow = true; scene.add(im);
}
// barrier beside the ops column (posts), with an opening at y 587 where the red lane
// passes between the two Registration booths
const BARRIER_GAP = [575, 599];
{
  const ys = []; for (let y = 455; y <= 865; y += 10) if (y <= BARRIER_GAP[0] || y >= BARRIER_GAP[1]) ys.push(y);
  const geo = new THREE.CylinderGeometry(.07, .07, .8, 6);
  const im = new THREE.InstancedMesh(geo, fenceMat, ys.length), o = new THREE.Object3D();
  ys.forEach((y, i) => { o.position.set(X(868), .4, Z(y)); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
  im.castShadow = true; scene.add(im);
}
// rider flow (red dotted queue lanes)
const flowMat = new THREE.MeshBasicMaterial({color:col('#d3202f'), transparent:true, opacity:.7});
const FLOW = [
  [[662,285],[688,285],[688,443]],                          // up from the top lane into Standby per Wave
  // the y 587 lane passes through the barrier opening into the gap between the two Registration booths
  [[572,443],[945,443],[945,587],[572,587],[572,443]],      // top lane, middle lane and the west / east sides
  [[945,443],[985,443]],                                    // to Bikes and Coffee
  [[688,443],[688,765]],                                    // west-centre aisle
  [[796,443],[796,765]],                                    // east-centre aisle, straight through both sponsor blocks
  [[572,587],[572,812],[590,830]],                          // west lane down to the merchants
  [[572,765],[796,765]], [[695,682],[796,682]],             // cross aisles in the south block
  [[796,742],[858,742],[858,830],[590,830]],                // round to the merchants aisle
  [[645,830],[645,870],[622,884]],                          // merchants aisle out through the Exit
  [[945,587],[945,795],[1000,795],[1000,850],[1008,880]]    // east lane from the Entrance
];
const flowLanes = [];
FLOW.forEach(pl => { for (let i = 1; i < pl.length; i++) flowLanes.push(dashes(pl[i-1][0], pl[i-1][1], pl[i][0], pl[i][1], .35, .55, .11, .05, flowMat)); });
// morning walkthrough only: a single lane from the Entrance, up the east side and along the top lane to the Exit to Start (toward KM 0)
const MORNING_LANE = [[[1008,880],[1000,850],[1000,795],[945,795],[945,443],[688,443],[688,285],[676,268]], [[688,285],[662,285]]];
const morningLane = [];
MORNING_LANE.forEach(pl => { for (let i = 1; i < pl.length; i++){
  const l = dashes(pl[i-1][0], pl[i-1][1], pl[i][0], pl[i][1], .35, .55, .11, .05, flowMat);
  l.visible = false; morningLane.push(l);
} });
// artists path
const pathMat = new THREE.MeshStandardMaterial({color:col('#2a2c3a'), roughness:1});
[[[370,684],[272,684]],[[272,684],[252,740]],[[252,740],[252,882]]].forEach(([a, b]) => {
  const s = wallSeg(a[0], a[1], b[0], b[1], .04, .9, pathMat); s.castShadow = false;
  dashes(a[0], a[1], b[0], b[1], .5, .5, .08, .05);
});
