// FunRide Bike Village 3D: Riders: standby waves, ramp, start grid, gun start, finishers, morning / after-race flows.
// Loaded in order by main.js once fonts and logos are ready; top-level names are shared across files.
"use strict";

/* ---------- riders: waves leave standby, take the ramp, line up on Roxas, gun start, U-turn to Katigbak ---------- */
function makeCyclist(){
  const g = new THREE.Group();
  const tire = new THREE.MeshStandardMaterial({color:col('#111218'), roughness:.6});
  const wheels = [];
  [-.45, .45].forEach(x => { const w = new THREE.Mesh(new THREE.TorusGeometry(.32, .05, 6, 16), tire); w.position.set(x, .37, 0); g.add(w); wheels.push(w); });
  const frame = new THREE.Mesh(new THREE.BoxGeometry(.9, .07, .07), new THREE.MeshStandardMaterial({color:col(['#c8202f','#16187a','#ffc928','#e8eaf2'][Math.random() * 4 | 0])}));
  frame.position.y = .6; g.add(frame);
  const jersey = new THREE.Mesh(new THREE.BoxGeometry(.5, .55, .32), new THREE.MeshStandardMaterial({color:col(shirt[Math.random() * shirt.length | 0])}));
  jersey.position.set(-.05, 1.0, 0); jersey.rotation.z = -.6; g.add(jersey);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.16, 10, 8), new THREE.MeshStandardMaterial({color:col(['#ffffff','#16187a','#c8202f','#111'][Math.random() * 4 | 0])}));
  head.position.set(.22, 1.3, 0); g.add(head);
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  g.userData.wheels = wheels;
  g.userData.body = [jersey, head];
  // the same rider on foot, walking beside the bike (person front is +z, bike front is +x)
  const pusher = makePerson(); pusher.rotation.y = Math.PI / 2; pusher.position.set(-.05, 0, .55); pusher.visible = false; g.add(pusher);
  g.userData.pusher = pusher;
  return g;
}
// rider on the bike, or bike parked alone; on = 'walk' puts the rider on foot beside the bike
const mounted = (c, on) => { c.userData.body.forEach(m => m.visible = on === true); c.userData.pusher.visible = on === 'walk'; };
// standby slots (4 x 3) inside Standby per Wave
const SLOTS = [];
for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) SLOTS.push([510 + c * 36, 225 + r * 30]);
// finishers park at the Bike Rack along the east fence (west side, south half), so no bikes stay on Independence Road
const PARK = [];
for (let i = RACK_FREE; i < 29; i++) PARK.push([1019 - 37.5, 625 + (-15.25 + i * 30.5 / 29) * 10]);
const MY_SLOT = [1019 - 37.5, 625 + (-15.25 + 29 * 30.5 / 29) * 10];   // After the race: where *you* rack your bike
const parked = []; // queue of parked bikes, oldest first
// Roxas Boulevard: only the south (eastbound) lane is closed for the riders, y 65-98.
// Start grid sits west of the START arch, 2 abreast x 6 rows, everyone facing east toward South Drive.
const GRID = [];
for (let r = 0; r < 6; r++) for (let c = 0; c < 2; c++) GRID.push([862 - r * 20, 86 + c * 9]);
const RAMP_BOX = [665, 687, 120, 258];      // Exit to Start lane + Ramp slab (map px), riders ride on top of it
const SLAB_Y = .26;
// standby -> Exit to Start lane -> straight up the green Ramp -> off the north end onto the KM 0 plaza -> into the closed lane
function rideRoute(slot, g){
  return mkPath([slot, [665, slot[1]], [676, 266], [676, 258], [676, 120], [676, 106], [684, 93], [g[0] - 24, g[1]], g]);
}
// gun start: roll east through START, U-turn at the cones, back west in the same lane, then onto Katigbak Parkway
const UTURN_X = 978;
function raceRoute(g){
  return mkPath([g, [UTURN_X - 26, g[1]], [UTURN_X - 6, 88], [UTURN_X, 80], [UTURN_X - 6, 73], [UTURN_X - 26, 72], [190, 72], [160, 78], [128, 98], [118, 118]]);
}
const KATIGBAK_CUT = 118; // riders leave the sim once they are on Katigbak Parkway
// cones: closed-lane line on the centre of Roxas, U-turn cones, lane closed east of the U-turn
{
  const pts = [];
  for (let x = 175; x <= UTURN_X + 4; x += 40) pts.push([x, 67]);
  pts.push([UTURN_X + 12, 72], [UTURN_X + 12, 80], [UTURN_X + 12, 88], [UTURN_X + 12, 96], [UTURN_X - 12, 80], [UTURN_X - 30, 80]);
  const coneM = new THREE.MeshStandardMaterial({color:col('#f26a1b'), roughness:.6});
  const im = new THREE.InstancedMesh(new THREE.ConeGeometry(.16, .5, 10), coneM, pts.length), o = new THREE.Object3D();
  pts.forEach(([x, y], i) => { o.position.set(X(x), .27, Z(y)); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
  im.castShadow = true; scene.add(im);
}
// starter with the gun at KM 0, on the plaza edge beside the START arch
const starter = makePerson();
{
  starter.position.set(X(905), 0, Z(106));
  starter.rotation.y = Math.atan2(X(840) - X(905), Z(88) - Z(106));
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .55, 6), new THREE.MeshStandardMaterial({color:col('#e0b08a')}));
  arm.position.set(.2, 1.35, 0); starter.add(arm);
  const gun = new THREE.Mesh(new THREE.BoxGeometry(.06, .12, .16), new THREE.MeshStandardMaterial({color:col('#15161c')}));
  gun.position.set(.2, 1.68, .04); starter.add(gun);
  scene.add(starter);
}
const GUN_AT = new V3(X(905), 1.85, Z(106));
const fx = [];
function gunFx(){
  const flash = new THREE.Mesh(new THREE.SphereGeometry(.25, 10, 8), new THREE.MeshBasicMaterial({color:col('#ffe27a'), transparent:true}));
  flash.position.copy(GUN_AT); scene.add(flash); fx.push({m:flash, t:0, life:.35, flash:true});
  for (let i = 0; i < 7; i++){
    const s = new THREE.Mesh(new THREE.SphereGeometry(.18, 8, 6), new THREE.MeshBasicMaterial({color:col('#d9dbe2'), transparent:true, opacity:.8, depthWrite:false}));
    s.position.copy(GUN_AT); scene.add(s);
    fx.push({m:s, t:0, life:2.2 + Math.random(), v:new V3((Math.random() - .5) * .6, .7 + Math.random() * .5, (Math.random() - .5) * .6)});
  }
}
function updateFx(dt){
  for (let i = fx.length - 1; i >= 0; i--){
    const f = fx[i]; f.t += dt; const k = f.t / f.life;
    if (k >= 1){ scene.remove(f.m); f.m.geometry.dispose(); f.m.material.dispose(); fx.splice(i, 1); continue; }
    if (f.flash){ f.m.scale.setScalar(1 + k * 4); f.m.material.opacity = 1 - k; }
    else { f.m.position.addScaledVector(f.v, dt); f.m.scale.setScalar(1 + k * 5); f.m.material.opacity = .8 * (1 - k); }
  }
}
function parkAt(c, slot){
  const u = c.userData;
  Object.assign(u, {state:'parked', park:slot});
  c.position.set(X(slot[0]), 0, Z(slot[1]));
  c.rotation.y = 0;                       // facing east, toward the BYD Test Drive
  mounted(c, false);                      // rider has stepped off and walked into the village
  c.visible = true; parked.push(c);
}
function freePark(){
  const used = new Set(riders.filter(c => ['parked', 'finish'].includes(c.userData.state)).map(c => c.userData.park));
  let s = PARK.find(p => !used.has(p));
  if (!s){
    const old = parked.shift(); if (!old) return null;
    s = old.userData.park; old.userData.state = 'idle'; old.visible = false;
  }
  return s;
}
const riders = [];
for (let i = 0; i < 72; i++){ const c = makeCyclist(); c.visible = false; c.userData.state = 'idle'; scene.add(c); riders.push(c); }
for (let i = 0; i < 8; i++) parkAt(riders[i], PARK[i]);
let waveNo = 0, waveTimer = 0, gunT = -1, finished = 0;
// simPhase: 'auto' (free-running), 'morning' (pre-race walkthrough drives the waves), 'after' (no bikes on the start side)
let simPhase = 'auto', gunCue = false, gunAge = -1, gunNow = false;
function fillStandby(){
  if (simPhase === 'after') return;
  let n = riders.filter(c => c.userData.state === 'wait').length;
  for (const c of riders){
    if (n >= SLOTS.length) break;
    if (c.userData.state !== 'idle') continue;
    const s = SLOTS[n++];
    Object.assign(c.userData, {state:'wait', slot:s, route:null, d:0, delay:0, park:null, walking:false});
    c.position.set(X(s[0]) + (Math.random() - .5) * .6, 0, Z(s[1]) + (Math.random() - .5) * .6);
    c.rotation.y = 0; mounted(c, true); c.visible = true;
  }
}
function releaseWave(){
  waveNo++;
  let k = 0;
  riders.forEach(c => { if (c.userData.state === 'wait'){ const u = c.userData; u.gi = k; u.grid = GRID[k % GRID.length]; u.state = 'ride'; u.route = rideRoute(u.slot, u.grid); u.d = 0; u.delay = k++ * .55; u.v = 6 + Math.random() * 1.2; } });
  toast(`Wave ${waveNo} heading to the start`);
  setTimeout(fillStandby, 4000);
}
function gunStart(){
  riders.forEach(c => { const u = c.userData; if (u.state !== 'grid') return;
    Object.assign(u, {state:'race', route:raceRoute(u.grid), d:0, delay:(u.gi >> 1) * .7, v:7 + Math.random() * 1.5}); });
  gunFx(); gunAge = 0;
  toast(`Gun start at KM 0 · Wave ${waveNo}`);
}
// finishers: appear on Independence Road (west end), ride east, cross FINISH, park, then walk into the village
const FIN_EVERY = 3.4;
let finT = 1.5;
// cross FINISH, leave the road at once through the Entrance, then ride up beside the Bike Rack to a free slot
function finRoute(slot, x0){
  return mkPath([[x0 || 110, 963], [800, 963], [830, 958], [950, 940], [990, 914], [1008, 880], [1000, 850], [1000, 795], [945, 795], [945, slot[1]], slot]);
}
function sendFinisher(x0, delay){
  const c = riders.find(r => r.userData.state === 'idle');
  const slot = c && freePark();
  if (!c || !slot) return null;
  const route = finRoute(slot, x0);
  Object.assign(c.userData, {state:'finish', inWave:false, park:slot, route, d:0, delay:delay || 0, v:6 + Math.random() * 1.5, walking:false, walkAt:route.L[2] + 2.5});
  c.position.set(X(x0 || 110), 0, Z(963)); c.rotation.y = 0;
  mounted(c, true); c.visible = !(delay > 0);
  return c;
}
// people on foot: finishers leave their bike at the rack and walk the village (route A east blocks, route B west blocks), out by the Exit
const TAIL_A = [[796,443],[796,742],[858,742],[858,830],[645,830],[645,870],[622,884],[608,905],[600,965]];
const TAIL_B = [[688,443],[688,587],[572,587],[572,812],[590,830],[645,830],[645,870],[622,884],[608,905],[600,965]];
const finWalkers = [];
for (let i = 0; i < 14; i++){ const p = makePerson(); p.visible = false; p.userData.busy = false; scene.add(p); finWalkers.push(p); }
function walkIn(slot){
  const p = finWalkers.find(w => !w.userData.busy); if (!p) return;
  const head = [[slot[0] - 6, slot[1]], [945, slot[1]]];
  const pts = head.concat([[945, 443]], Math.random() < .5 ? TAIL_A : TAIL_B);
  Object.assign(p.userData, {busy:true, r:mkPath(pts), d:0, v:1.1 + Math.random() * .4, off:(Math.random() - .5) * .8, ph:Math.random() * 6});
  p.visible = true;
}
// Phase 1, morning (pre-race): Entrance -> Registration -> Kit Claiming -> Baggage -> east lane north -> Bike Check -> Standby per Wave,
// then Exit to Start -> Ramp -> KM 0 plaza -> behind the grid at the START arch -> gun start
const anyRider = (...st) => riders.some(c => st.includes(c.userData.state));
const MORNING = [
  {t:'Arrive at the Entrance', d:'Morning call time. Riders walk in from Independence Road through the main Entrance at the southeast corner and follow the red lane north along the operations column. Sponsor and merchant booths are still closed.',
   pts:[[1075,915],[1022,890],[1008,880],[1000,850],[1000,795],[945,795]], look:null},
  {t:'Step 1 · Registration', d:'First stop: Registration. Present your QR code or ID at either of the two Registration desks (10 × 10 ft each) and get your race bib.',
   pts:[[945,795],[945,589]], look:[890,589]},
  {t:'Step 2 · Kit Claiming', d:'Next, step back down to Kit Claiming (10 × 30 ft) and claim your race kit: jersey, bib number and freebies.',
   pts:[[945,589],[945,686]], look:[890,686]},
  {t:'Step 3 · Baggage', d:'Drop your bag at the Baggage Area (10 × 30 ft) at the top of the operations column. Keep your claim stub.',
   pts:[[945,686],[945,496]], look:[890,496]},
  {t:'Step 4 · Bike check', d:'Follow the eastern red lane straight north to the top lane, then west along it and up to the Bike Check Station, keeping clear of the sponsor blocks, photowalls and stage. Marshals check brakes, tyres and helmet.',
   pts:[[945,496],[945,443],[688,443],[688,318]], look:[642,315]},
  {t:'Step 5 · Standby per Wave', d:'Riders wait here by wave, on their bikes and ready to go. When the wave is called it rides out through the Exit to Start lane.',
   pts:[[688,318],[688,285],[648,285]], look:[560,252],
   enter(){ if (!anyRider('wait', 'ride', 'grid')) fillStandby(); }},
  {t:'Step 6 · Exit to Start and the Ramp', d:'The wave is called. Follow it out of Standby, north along the Exit to Start lane and straight up the green Ramp onto the KM 0 plaza.',
   pts:[[648,285],[665,280],[676,266],[676,118]], startDelay:7, gun:1,
   enter(){ if (anyRider('wait') && !anyRider('ride', 'grid')) releaseWave(); }},
  {t:'Step 7 · KM 0 plaza', d:'Across the KM 0 plaza, past the Satellite Stage. The wave is lining up two abreast in the closed south lane of Roxas Boulevard, behind the START arch.',
   pts:[[676,118],[705,140],[800,150]], look:[862,121], gun:1},
  {t:'Step 8 · Gun start', d:'Stand behind the grid on Roxas Boulevard. When everyone is lined up the starter fires the gun and the wave rolls through the START arch, U-turns at the cones and heads west to Katigbak Parkway. Press Gun start to fire it now.',
   pts:[[800,150],[765,128],[724,110]], look:[900,84], gun:1, pause:3,
   arrive(){ if (!anyRider('ride', 'grid')){ if (!anyRider('wait')) fillStandby(); releaseWave(); } gunCue = true; },
   hold(){ return !(gunAge > 8); }}
];
MORNING.forEach(s => s.path = mkPath(s.pts));
const MORNING_FLOW = MORNING.slice(0, 6);   // the on-foot part, Entrance to Standby per Wave
const MORNING_ALL = mkPath(MORNING_FLOW.reduce((a, s, i) => a.concat(i ? s.pts.slice(1) : s.pts), []));
const MORNING_STOPS = [];   // where people on foot pause, and what they face
{ let L = 0; MORNING_FLOW.forEach((s, i) => { L += s.path.len; if (s.look && i < MORNING_FLOW.length - 1) MORNING_STOPS.push({d:L, look:s.look}); }); }
function resetMorning(){
  // pre-race: nothing on the roads, no finishers yet, a full wave staged in Standby
  gunT = -1; gunCue = false; gunAge = -1; waveTimer = 0;
  riders.forEach(c => { if (c.userData.state !== 'idle' && c.userData.state !== 'wait'){ c.userData.state = 'idle'; c.visible = false; } });
  parked.length = 0;
  finWalkers.forEach(w => { w.userData.busy = false; w.visible = false; });
  fillStandby();
}
MORNING.reset = resetMorning;

// Phase 2, after the race: a wave crosses FINISH and clears off the road to the Bike Rack, then the Bike Village tour
function resetAfter(){
  // after the race: no bikes on Roxas, Exit to Start or Standby per Wave
  gunT = -1; gunCue = false; gunAge = -1;
  riders.forEach(c => { if (['wait', 'ride', 'grid', 'race'].includes(c.userData.state)){ c.userData.state = 'idle'; c.visible = false; } });
}
const ATOUR = [
  {t:'You cross the FINISH', d:'You ride the last metres along Independence Road behind your wave and cross under the FINISH arch.',
   pts:[[330,963],[800,963],[830,958],[855,954]], speed:6.5, eye:1.6, pause:.6, you:'ride',
   enter(){
     // the rest of your wave rides ahead of you at the same pace, so nobody runs into you
     [780, 660, 540].forEach(x0 => { const c = sendFinisher(x0, 0); if (c) c.userData.v = 6.5; });
   }},
  {t:'Walk your bike to the Bike Rack', d:'Just past the arch you get off and walk your bike, like everyone ahead of you: in through the Entrance, up the east red lane to the Bike Rack, and rack it. Independence Road stays clear except for the BYD Test Drive Lane.',
   pts:[[855,954],[950,940],[990,914],[1008,880],[1000,850],[1000,795],[945,795],[945,MY_SLOT[1]]], speed:1.5, look:MY_SLOT, pause:3.5, you:'walkbike'},
  {t:'Bikes and Coffee', d:'North along the rack to Bikes and Coffee in the northeast corner. Grab a coffee after the ride.',
   pts:[[945,MY_SLOT[1]],[945,443],[975,443]], look:[1002,421]},
  {t:'Photowalls: 21 KM, 10 KM, 5 KM', d:'Along the top lane are the three photowalls, one for each distance. Find yours and take the finisher photo.',
   pts:[[975,443],[945,443],[760,443]], look:[790,405]},
  {t:'Neutra K and Wert PH', d:'Into the north sponsor blocks. Facing the fronts of Wert PH, with Neutra K behind it in the northeast block.',
   pts:[[760,443],[796,443],[796,587],[832,587]], look:[832,524]},
  {t:'Oxecure and Dr. O', d:'Oxecure and Dr. O share one 15 × 10 ft tent, with the Dr. O photo wall beside it.',
   pts:[[832,587],[730,587]], look:[728,523]},
  {t:'DOT Booth', d:'The Department of Tourism booth (10 × 20 ft) with its photo wall, in the northwest block.',
   pts:[[730,587],[618,587]], look:[618,528]},
  {t:'BDO and Specialign', d:'Round to the front of the south sponsor block: the BDO and Specialign branded tents, each with a photo wall.',
   pts:[[618,587],[688,587],[688,682],[735,682]], look:[735,640]},
  {t:'Fitbar, Cargo Boss and Espace Wellness', d:'Down the east lane of the south blocks: Fitbar, Cargo Boss and the Espace Wellness stall.',
   pts:[[735,682],[796,682],[796,742],[838,742]], look:[838,700]},
  {t:'Popcycle, Gatorade and Pepsi', d:'Popcycle, and Gatorade and Pepsi sharing one tent. Cold drinks after the ride.',
   pts:[[838,742],[796,742],[796,765],[745,765]], look:[745,718]},
  {t:'BYD Showroom', d:'The BYD Showroom: a 10 × 15 m truss tent with the Shark 6 on a turf deck.',
   pts:[[745,765],[700,765]], look:[630,720]},
  {t:'Merchants', d:'Through the two rows of merchant booths: food, drinks and bike gear.',
   pts:[[700,765],[796,765],[796,742],[858,742],[858,830],[650,830]], look:[640,795]},
  {t:'Main Stage', d:'End at the Main Stage on the west side of the village for the awards and the show. Enjoy the Bike Village!',
   pts:[[650,830],[590,830],[572,812],[572,600]], look:[497,580], pause:8}
];
ATOUR.forEach(s => s.path = mkPath(s.pts));
ATOUR.reset = resetAfter;
const morningWalkers = [];
for (let i = 0; i < 12; i++){
  const p = makePerson();
  p.userData = {d:Math.random() * MORNING_ALL.len, v:1.0 + Math.random() * .4, off:-(.7 + Math.random() * .5),   // keep right, clear of the walkthrough camera
     ph:Math.random() * 6, wait:0, next:0};
  p.userData.next = MORNING_STOPS.findIndex(s => s.d > p.userData.d);
  scene.add(p); morningWalkers.push(p);
}
// morning: sponsor, DOT and merchant booths are still closed (shutters down), shown only in the morning walkthrough
const closedBooths = new THREE.Group(); closedBooths.visible = false; scene.add(closedBooths);
{
  const shut = new THREE.MeshStandardMaterial({color:col('#dfe3ec'), roughness:.8});
  ITEMS.forEach(it => {
    if (!['sponsor', 'merch', 'dot'].includes(it.cat) || !it.tent) return;
    const w = it.w / S + .04, d = it.h / S + .04, h = it.tent === 'stall' ? 2.25 : 2.3;
    const [bx, bz] = BACKDIR[it.back || 'n'];
    const mats = [shut, shut, shut, shut, shut, shut];
    mats[bx < 0 ? 0 : bx > 0 ? 1 : bz < 0 ? 4 : 5] = faceMat('CLOSED', bx !== 0 ? d : w, h, '#dfe3ec', '#c8202f');
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats);
    m.position.set(X(it.x), h / 2, Z(it.y)); if (it.rot) m.rotation.y = it.rot * Math.PI / 180;
    m.castShadow = m.receiveShadow = true; closedBooths.add(m);
  });
}
// smooth turning: frame-rate independent easing and shortest-way angle blend
const ease = (k, dt) => 1 - Math.exp(-k * dt);
let camYaw = 0, camPitch = 0, camSnap = true;   // first-person camera heading state
function lerpAngle(a, b, t){ const d = ((b - a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; return a + d * t; }
fillStandby();
