// FunRide Bike Village 3D: Paths, walkers on the rider-flow lanes, test drive car and booth staff.
// Loaded in order by main.js once fonts and logos are ready; top-level names are shared across files.
"use strict";

/* ---------- path helper ---------- */
function mkPath(pts){
  const p = pts.map(q => new V3(X(q[0]), 0, Z(q[1])));
  const L = [0]; for (let i = 1; i < p.length; i++) L.push(L[i-1] + p[i].distanceTo(p[i-1]));
  return {p, L, len:L[L.length-1], at(d, out, dir){
    d = Math.max(0, Math.min(d, this.len)); let i = 1;
    while (i < L.length - 1 && L[i] < d) i++;
    const t = (d - L[i-1]) / ((L[i] - L[i-1]) || 1);
    out.lerpVectors(p[i-1], p[i], t);
    if (dir) dir.subVectors(p[i], p[i-1]).normalize();
    return out;
  }};
}

/* ---------- people walking the rider-flow lanes ---------- */
const shirt = ['#c8202f','#16187a','#ffc928','#1fae4a','#ff7a1d','#3db2f0','#ffffff','#7c3aed','#0f766e'];
const skin = ['#8d5a3b','#c68b5e','#e0b08a','#6b4429'];
const IN = [[1075,915],[1022,890],[1008,880],[1000,850],[1000,795],[945,795],[945,443]];   // Entrance, up the east lane
const ROUTE_PTS = [
  IN.concat([[688,443],[688,285],[640,285]]),
  IN.concat([[796,443],[796,682],[688,682],[688,765],[572,765],[572,587],[688,587],[688,443],[688,285],[620,285]]),
  IN.concat([[796,443],[796,742],[858,742],[858,830],[645,830],[645,870],[622,884],[608,905],[600,965]])
];
const ROUTES = ROUTE_PTS.map(mkPath);
const PERSON_MAT = {hair:new THREE.MeshStandardMaterial({color:col('#1d1712'), roughness:.9}), eye:new THREE.MeshBasicMaterial({color:col('#111111')}), shoe:new THREE.MeshStandardMaterial({color:col('#15161c')})};
function makePerson(){
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(.17, .2, .75, 8), new THREE.MeshStandardMaterial({color:col(shirt[Math.random() * shirt.length | 0])}));
  body.position.y = .78; g.add(body);
  const legs = new THREE.Mesh(new THREE.CylinderGeometry(.16, .14, .45, 8), new THREE.MeshStandardMaterial({color:col('#23263a')}));
  legs.position.y = .22; g.add(legs);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.15, 10, 8), new THREE.MeshStandardMaterial({color:col(skin[Math.random() * skin.length | 0])}));
  head.position.y = 1.3; g.add(head);
  // front is local +z: eyes on the face, hair cap on the back of the head, shoes pointing forward
  const hair = new THREE.Mesh(new THREE.SphereGeometry(.158, 10, 8, 0, Math.PI * 2, 0, Math.PI * .62), PERSON_MAT.hair);
  hair.position.set(0, 1.315, -.012); hair.rotation.x = -.55; g.add(hair);
  [-.055, .055].forEach(x => { const e = new THREE.Mesh(new THREE.SphereGeometry(.022, 6, 4), PERSON_MAT.eye); e.position.set(x, 1.33, .137); g.add(e); });
  [-.07, .07].forEach(x => { const sh = new THREE.Mesh(new THREE.BoxGeometry(.1, .06, .24), PERSON_MAT.shoe); sh.position.set(x, .03, .05); g.add(sh); });
  g.userData.person = true;
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}
const walkers = [];
for (let i = 0; i < 42; i++){
  const r = ROUTES[i % 3], w = makePerson();
  w.userData = {r, d:Math.random() * r.len, v:.9 + Math.random() * .6, off:(Math.random() - .5) * 1.0, ph:Math.random() * 6};
  scene.add(w); walkers.push(w);
}
// test drive car: leaves the BYD Garage, drives the lane east, turns up South Drive, comes back and parks
const tdCar = vehicle('sealion6', '#2f62b0'); scene.add(tdCar);
tdCar.traverse(o => { if (o.isMesh) o.castShadow = true; });
const TD_PATH = mkPath([[1016,972],[1212,972],[1232,962],[1240,940],[1240,820],[1240,600]]);
const td = {state:'park', t:4, d:0}, tdP = new V3(), tdD = new V3();
function tdUpdate(dt){
  if (td.state === 'park' || td.state === 'away'){
    td.t -= dt;
    if (td.t <= 0){ td.state = td.state === 'park' ? 'out' : 'back'; tdCar.visible = true; td.d = td.state === 'out' ? 0 : TD_PATH.len; }
  } else {
    td.d += (td.state === 'out' ? 1 : -1) * 6 * dt;
    if (td.state === 'out' && td.d >= TD_PATH.len){ td.state = 'away'; td.t = 7; tdCar.visible = false; return; }
    if (td.state === 'back' && td.d <= 0){ td.state = 'park'; td.t = 8; td.d = 0; }
  }
  TD_PATH.at(td.d, tdP, tdD);
  tdCar.position.set(tdP.x, 0, tdP.z);
  if (td.state === 'back') tdD.negate();
  if (td.state === 'out' || td.state === 'back') tdCar.rotation.y = Math.atan2(-tdD.z, tdD.x);
}
tdUpdate(0);
// booth staff behind the sponsor tables and a guest posing at each photo wall
const boothPeople = [];
// morning (pre-race): only the race operations booths are staffed; every other booth is empty
const MORNING_STAFFED = new Set(['reg-1', 'reg-2', 'kit', 'baggage', 'bike-check', 'info', 'command', 'ems', 'tech']);
{
  const down = new THREE.Raycaster(), from = new V3(), DOWN = new V3(0, -1, 0);
  BRAND_PEOPLE.forEach(p => {
    const it = BY[p.base], a = (it.rot || 0) * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
    const wx = X(it.x) + p.x * c + p.z * sn, wz = Z(it.y) - p.x * sn + p.z * c;
    // stand on whatever floor the booth has under this spot (raised floor, turf), never sunk into it
    let y = 0;
    if (ROOT[it.id]){ ROOT[it.id].updateMatrixWorld(true); from.set(wx, .6, wz); down.set(from, DOWN); down.far = .6;
      const hit = down.intersectObject(ROOT[it.id], true).find(h => h.point.y < .45); if (hit) y = hit.point.y; }
    const m = makePerson(); m.position.set(wx, y, wz); m.rotation.y = p.ry != null ? p.ry + a : Math.random() * 6; scene.add(m);
    m.userData.base = p.base; boothPeople.push(m);
  });
}
if (location.hash === '#debug') window.FR_DEBUG = {BRAND_PEOPLE, BY, ROOT, scene, X, Z, camera, controls, renderer};
