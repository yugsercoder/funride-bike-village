// FunRide Bike Village 3D: Selection, camera flights, panels, modes, walkthroughs, animation loop and start().
// Loaded in order by main.js once fonts and logos are ready; top-level names are shared across files.
"use strict";

/* ---------- selection ring ---------- */
const ring = new THREE.Mesh(new THREE.RingGeometry(1, 1.18, 48), new THREE.MeshBasicMaterial({color:col('#ffc928'), transparent:true, opacity:.95, depthWrite:false}));
ring.rotation.x = -Math.PI / 2; ring.position.y = .07; ring.visible = false; ring.renderOrder = 3; scene.add(ring);
let selected = null;
function itemCenter(it){ return new V3(X(it.x), 0, Z(it.y)); }
function itemTop(it){ const h = it.kind === 'arch' ? it.h / S / 2 + 1.2 : it.kind === 'wall' ? 2.6 : it.kind === 'stage' ? it.ht + 4 : it.kind === 'gate' ? 3.1 : it.kind === 'restricted' ? .4 : it.id === 'grandstand' ? 1.9 : (it.top || it.ht || 2.2); return itemCenter(it).setY(h + .5); }
function select(it){
  selected = it;
  if (!it){ ring.visible = false; infoEl.hidden = true; renderDirOn(); return; }
  ring.visible = true; ring.position.x = X(it.x); ring.position.z = Z(it.y);
  const rr = Math.min(10, Math.max(it.w, it.h) / S * .62 + .6); ring.scale.setScalar(rr);
  infoEl.hidden = false;
  document.getElementById('iSw').style.background = CATS[it.cat].bg;
  document.getElementById('iCat').textContent = CATS[it.cat].name;
  document.getElementById('iName').textContent = it.name;
  document.getElementById('iDesc').textContent = it.desc;
  const sizeEl = document.getElementById('iSize');
  sizeEl.hidden = !it.sz;
  if (it.sz){ document.getElementById('iSzV').textContent = it.sz; document.getElementById('iType').textContent = it.tent ? TENT[it.tent] : ''; }
  renderDirOn();
}

/* ---------- camera flights ---------- */
let fly = null;
function viewFor(target, az, el, dist){
  return {tgt:target.clone(), pos:new V3(target.x + dist * Math.cos(el) * Math.sin(az), target.y + dist * Math.sin(el), target.z + dist * Math.cos(el) * Math.cos(az))};
}
function flyTo(v, dur){
  fly = {fp:camera.position.clone(), ft:controls.target.clone(), tp:v.pos, tt:v.tgt, t:0, dur:reduced ? .01 : (dur || 2.2)};
}
function centroid(ids){
  const c = new V3(); ids.forEach(id => c.add(itemCenter(BY[id]))); return c.multiplyScalar(1 / ids.length);
}
function stopView(s){
  const tgt = s.target ? new V3(X(s.target[0]), 0, Z(s.target[1])) : centroid(s.ids);
  let dist = s.dist;
  if (innerWidth < 820) dist *= 1.35;
  return viewFor(tgt, s.az, s.el, dist);
}
function flyToItem(it){
  const off = camera.position.clone().sub(controls.target);
  const az = Math.atan2(off.x, off.z);
  const size = Math.max(it.w, it.h) / S;
  flyTo(viewFor(itemCenter(it), az, .6, Math.max(14, size * 2.4) * (innerWidth < 820 ? 1.3 : 1)), 1.6);
}

/* ---------- UI ---------- */
const $ = id => document.getElementById(id);
const infoEl = $('info');
const bar = {kick:$('bKick'), count:$('bCount'), title:$('bTitle'), text:$('bText'), prog:$('bProg').firstElementChild, ctrls:$('bCtrls'), progWrap:$('bProg')};
let mode = 'tour', stop = 0, playing = !reduced, dwell = 0;
const DWELL = 9;
const dotsEl = $('dots');
TOUR.forEach((s, i) => { const b = document.createElement('button'); b.setAttribute('aria-label', `Stop ${i + 1}: ${s.t}`); b.onclick = () => { goStop(i); }; dotsEl.appendChild(b); });
let focusIds = [];
function goStop(i){
  setMode('tour', true);
  stop = (i + TOUR.length) % TOUR.length; dwell = 0;
  const s = TOUR[stop];
  bar.kick.textContent = s.k; bar.count.textContent = `Stop ${stop + 1} of ${TOUR.length}`;
  bar.title.textContent = s.t; bar.text.textContent = s.d;
  [...dotsEl.children].forEach((b, j) => b.classList.toggle('on', j === stop));
  focusIds = s.ids.slice();
  select(null);
  flyTo(stopView(s));
}
function setPlaying(p){ playing = p; $('play').textContent = p ? 'Pause' : 'Play'; }
const stepMode = () => !!wtMode();
$('prev').onclick = () => stepMode() ? goStep(mStep - 1) : goStop(stop - 1);
$('next').onclick = () => stepMode() ? goStep(mStep + 1) : goStop(stop + 1);
$('gunBtn').onclick = () => { gunCue = true; gunNow = true; if (!anyRider('ride', 'grid')){ if (!anyRider('wait')) fillStandby(); releaseWave(); } };
$('play').onclick = () => { setPlaying(!playing); if (playing) dwell = 0; };

let silentFly = false;
function setMode(m, silent){
  mode = m;
  ['mTour','mWalkthrough','mFree','mTop'].forEach(id => $(id).setAttribute('aria-pressed', 'false'));
  $({tour:'mTour', morning:'mWalkthrough', walk:'mWalkthrough', free:'mFree', top:'mTop'}[m]).setAttribute('aria-pressed', 'true');
  const wm = wtMode();
  $('phaseSw').hidden = !(wm || m === 'top');
  $('phLive').hidden = m !== 'top';
  $('phLive').setAttribute('aria-pressed', m === 'top' && !wm);
  $('phMorning').setAttribute('aria-pressed', wm === 'morning'); $('phAfter').setAttribute('aria-pressed', wm === 'walk');
  if (m === 'morning' || m === 'walk') lastPhase = m;
  controls.enabled = !firstPerson();
  canvas.classList.toggle('fp', firstPerson());
  const prevPhase = simPhase;
  simPhase = wm === 'morning' ? 'morning' : wm === 'walk' ? 'after' : 'auto';
  if (!wm){ guide.visible = guideRing.visible = myBike.visible = false; }
  if (simPhase === 'auto' && prevPhase !== 'auto'){ gunCue = false; if (!anyRider('wait', 'ride', 'grid', 'race')) fillStandby(); }
  // walkthroughs keep the crowd light so the view stays clear; after the race nobody heads to Standby
  morningWalkers.forEach((w, i) => w.visible = wm === 'morning' ? i < 5 : wm !== 'walk');
  walkers.forEach((w, i) => w.visible = wm === 'morning' ? i % 4 === 0 : wm === 'walk' ? (w.userData.r === ROUTES[2] && i % 2 === 0) : true);
  if (wm !== 'morning') $('gunBtn').hidden = true;
  closedBooths.visible = wm === 'morning';
  boothPeople.forEach(m => m.visible = wm !== 'morning' || MORNING_STAFFED.has(m.userData.base));
  flowLanes.forEach(l => l.visible = wm !== 'morning');      // morning: no queue lanes inside the booth area,
  morningLane.forEach(l => l.visible = wm === 'morning');   // just the one lane toward KM 0
  camSnap = true;
  const tourUI = m === 'tour' || !!wm;
  bar.ctrls.hidden = !tourUI; bar.progWrap.hidden = !tourUI; dotsEl.hidden = m !== 'tour';
  if (silent) return;
  focusIds = [];
  if (m === 'tour'){ setPlaying(!reduced); goStop(stop); }
  if (m === 'free'){
    bar.kick.textContent = 'Explore freely'; bar.count.textContent = '';
    bar.title.textContent = 'Look around the village';
    bar.text.textContent = 'Drag to orbit, right-drag or two fingers to pan, scroll or pinch to zoom. Tap any booth to see what it is, or pick one from the booth list.';
  }
  if (m === 'top'){
    if (!silentFly) flyTo({pos:new V3(0, innerWidth < 820 ? 200 : 132, .1), tgt:new V3(0, 0, 0)}, 2);
    if (wm){ select(null); setPlaying(!reduced); goStep(0); }
    else {
      bar.kick.textContent = 'Top view'; bar.count.textContent = 'Live';
      bar.title.textContent = 'The site map in 3D';
      bar.text.textContent = 'Same layout as the printed site map: Roxas Boulevard at the top, Independence Road at the bottom. Pick Morning or After the race to watch that walkthrough from above. Drag to tilt back into 3D.';
    }
  }
  if (m === 'walk' || m === 'morning'){
    fly = null; select(null); setPlaying(!reduced);
    goStep(0);
  }
}
// one Walkthrough button; the bar switches between the Morning (pre-race) and After the race phases
let lastPhase = 'morning';
$('mWalkthrough').onclick = () => setMode(lastPhase);
// in Top view the switch picks Live / Morning / After the race without moving the camera
function setTopPhase(ph){ topPhase = ph; silentFly = true; setMode('top'); silentFly = false; }
$('phLive').onclick = () => setTopPhase(null);
$('phMorning').onclick = () => { if (mode === 'top') setTopPhase('morning'); else if (mode !== 'morning') setMode('morning'); };
$('phAfter').onclick = () => { if (mode === 'top') setTopPhase('after'); else if (mode !== 'walk') setMode('walk'); };
// ⋯ menu: simulation on/off and hide panels
const moreMenu = $('moreMenu');
function setMenu(open){
  moreMenu.hidden = !open; $('mMore').setAttribute('aria-expanded', open);
  if (open){ const r = $('mMore').getBoundingClientRect(); moreMenu.style.top = (r.bottom + 6) + 'px'; moreMenu.style.left = Math.max(8, Math.min(innerWidth - 186, r.right - 170)) + 'px'; }
}
$('mMore').onclick = e => { e.stopPropagation(); setMenu(moreMenu.hidden); };
moreMenu.onclick = () => setMenu(false);
document.addEventListener('pointerdown', e => { if (!moreMenu.hidden && !moreMenu.contains(e.target) && e.target !== $('mMore')) setMenu(false); });
addEventListener('resize', () => setMenu(false));
$('mTour').onclick = () => setMode('tour');
$('mFree').onclick = () => setMode('free');
$('mTop').onclick = () => setMode('top');
let simOn = true;
$('mSim').onclick = () => { simOn = !simOn; $('mSim').setAttribute('aria-pressed', simOn); $('mSim').textContent = simOn ? 'Simulation on' : 'Simulation off'; };
function setDir(o){ $('dir').classList.toggle('open', o); document.body.classList.toggle('dir-open', o); $('dirToggle').setAttribute('aria-pressed', o); }
$('dirToggle').onclick = () => setDir(!$('dir').classList.contains('open'));
function layoutUI(){ const r = document.querySelector('.modes').getBoundingClientRect(); document.documentElement.style.setProperty('--below-modes', Math.round(r.bottom + 10) + 'px'); }
new ResizeObserver(layoutUI).observe(document.querySelector('.modes'));
addEventListener('resize', layoutUI); layoutUI();
$('infoX').onclick = () => select(null);
// minimise buttons on every info box, and a full-view toggle that hides them all
document.querySelectorAll('.minbtn').forEach(b => {
  const panel = b.closest('.panel');
  b.onclick = () => { const m = panel.classList.toggle('min'); b.textContent = m ? '+' : '−'; b.setAttribute('aria-label', m ? 'Expand' : 'Minimise'); b.setAttribute('aria-expanded', !m); };
});
// close the top-left box and the narration bar; Esc does the same; the Info pill brings them back
function syncReopen(){
  const brandClosed = $('brandBox').classList.contains('closed');
  $('reopen').hidden = !(brandClosed || $('bar').classList.contains('closed'));
  document.body.classList.toggle('brand-closed', brandClosed);
  requestAnimationFrame(layoutUI);
}
function closePanels(){ $('brandBox').classList.add('closed'); $('bar').classList.add('closed'); syncReopen(); }
document.querySelectorAll('.closeb').forEach(b => b.onclick = () => { b.closest('.panel').classList.add('closed'); syncReopen(); });
$('reopen').onclick = () => { $('brandBox').classList.remove('closed'); $('bar').classList.remove('closed'); syncReopen(); };
$('mClean').onclick = () => { const c = document.body.classList.toggle('clean'); $('mClean').setAttribute('aria-pressed', c); $('mClean').textContent = c ? 'Show panels' : 'Hide panels'; };

// directory
const listEl = $('list');
const ORDER = ['stage','sponsor','tent','byd','dot','ops','merch','standby','start','cardinal','restricted','landmark'];
function renderDir(q){
  q = (q || '').trim().toLowerCase();
  listEl.innerHTML = '';
  ORDER.forEach(cat => {
    const items = ITEMS.filter(it => it.cat === cat && (!q || it.name.toLowerCase().includes(q) || CATS[cat].name.toLowerCase().includes(q)));
    if (!items.length) return;
    const g = document.createElement('div'); g.className = 'grp';
    g.innerHTML = `<h3><span class="sw" style="background:${CATS[cat].bg}"></span>${CATS[cat].name}<small style="margin-left:auto;font:500 11px var(--body);color:var(--muted)">${items.length}</small></h3>`;
    items.forEach(it => {
      const b = document.createElement('button'); b.textContent = it.name; b.dataset.id = it.id;
      if (it.ft || it.sz === 'To follow'){ const sm = document.createElement('small'); sm.textContent = it.szLabel ? `${it.szLabel.replace(/ /g, '')} ft` : it.ft ? `${fmtFt(it.ft[0])}×${fmtFt(it.ft[1])} ft` : 'size TBA'; b.appendChild(sm); }
      b.onclick = () => { if (mode !== 'free' && mode !== 'top') setMode('free'); select(it); flyToItem(it); setDir(false); };
      g.appendChild(b);
    });
    listEl.appendChild(g);
  });
  renderDirOn();
}
function renderDirOn(){ listEl.querySelectorAll('button').forEach(b => b.classList.toggle('on', !!selected && b.dataset.id === selected.id)); }
$('q').addEventListener('input', e => renderDir(e.target.value));
renderDir('');

// toast
let toastT;
function toast(msg){ const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }

// clock (Manila time)
function tick(){ try { $('clock').textContent = new Intl.DateTimeFormat('en-PH', {hour:'2-digit', minute:'2-digit', timeZone:'Asia/Manila'}).format(new Date()) + ' PHT'; } catch(e){} }
tick(); setInterval(tick, 15000);

/* ---------- picking ---------- */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
let hoverIt = null, downAt = null;
function pick(e){
  const r = canvas.getBoundingClientRect();
  ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects(pickables, false)[0];
  return hit ? hit.object.userData.item : null;
}
canvas.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse' || mode === 'walk' || mode === 'morning') return;
  hoverIt = pick(e); canvas.classList.toggle('hovering', !!hoverIt);
});
canvas.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY]; if (mode === 'tour') setPlaying(false); if (mode !== 'morning') fly = null; });
canvas.addEventListener('pointerup', e => {
  if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6 || mode === 'walk' || mode === 'morning') return;
  const it = pick(e);
  if (it){ select(it); flyToItem(it); } else select(null);
});
canvas.addEventListener('wheel', () => { fly = null; if (mode === 'tour') setPlaying(false); }, {passive:true});
addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === 'ArrowRight') $('next').click();
  if (e.key === 'ArrowLeft') $('prev').click();
  if (e.key === 'h' || e.key === 'H') $('mClean').click();
  if (e.key === 'Escape'){ if (!moreMenu.hidden) setMenu(false); else if (selected) select(null); else closePanels(); }
});

/* ---------- floating name tags ---------- */
const tagsEl = $('tags'), tagPool = {};
function tagFor(it){ let t = tagPool[it.id]; if (!t){ t = document.createElement('div'); t.className = 'tag'; t.textContent = it.name; tagsEl.appendChild(t); tagPool[it.id] = t; } return t; }
const tmp = new V3();
function updateTags(){
  const show = new Set(focusIds);
  if (selected) show.add(selected.id);
  if (hoverIt) show.add(hoverIt.id);
  const r = canvas.getBoundingClientRect();
  for (const id in tagPool) if (!show.has(id)) tagPool[id].style.display = 'none';
  show.forEach(id => {
    const it = BY[id]; const t = tagFor(it);
    tmp.copy(itemTop(it)).project(camera);
    if (tmp.z > 1 || Math.abs(tmp.x) > 1.1 || Math.abs(tmp.y) > 1.1){ t.style.display = 'none'; return; }
    t.style.display = 'block';
    t.classList.toggle('hover', hoverIt === it || selected === it);
    t.style.transform = `translate(${(tmp.x + 1) / 2 * r.width}px, ${(1 - tmp.y) / 2 * r.height}px) translate(-50%, -100%)`;
  });
}

/* ---------- walkthroughs (eye level, step by step) ---------- */
// mode 'morning' runs MORNING (phase 1), mode 'walk' runs ATOUR (phase 2, after the race)
let mStep = 0, mD = 0, mPause = 0, mWait = 0, mArrived = false;
const M_PAUSE = 5;
let topPhase = null;   // Top view: null = live sim, 'morning' or 'after' = watch that walkthrough from above
const wtMode = () => mode === 'morning' || (mode === 'top' && topPhase === 'morning') ? 'morning'
  : mode === 'walk' || (mode === 'top' && topPhase === 'after') ? 'walk' : null;
const firstPerson = () => mode === 'morning' || mode === 'walk';
const WT = () => wtMode() === 'walk' ? ATOUR : MORNING;
// "you": a highlighted walker (Top view), and your own bike for the after-the-race phase
const guide = makePerson(); guide.scale.setScalar(1.25); guide.visible = false; scene.add(guide);
const guideRing = new THREE.Mesh(new THREE.RingGeometry(1.1, 1.5, 40), new THREE.MeshBasicMaterial({color:col('#ffc928'), transparent:true, opacity:.95, depthWrite:false}));
guideRing.rotation.x = -Math.PI / 2; guideRing.position.y = .08; guideRing.renderOrder = 3; guideRing.visible = false; scene.add(guideRing);
const myBike = makeCyclist(); myBike.visible = false; scene.add(myBike);
const youP = new V3(), youR = new V3();
function updateYou(dt, t, s, wm){
  const top = mode === 'top', after = wm === 'walk';
  const k = ease(9, dt);
  // where "you" are: the camera in first person, the step position from above
  if (top) youP.copy(wp); else youP.set(camera.position.x, 0, camera.position.z);
  youR.set(-dv.z, 0, dv.x);   // your right-hand side
  const heading = Math.atan2(-dv.z, dv.x);
  myBike.visible = after;
  if (after){
    if (s.you === 'ride'){
      myBike.position.copy(youP).addScaledVector(dv, top ? 0 : .25);
      myBike.rotation.y = lerpAngle(myBike.rotation.y, heading, k);
      mounted(myBike, top);   // first person: you are the rider, so only the bike shows
      myBike.userData.wheels.forEach(wh => wh.rotation.z -= (s.speed || 1.8) * dt / .32);
    } else if (s.you === 'walkbike' && !mArrived){
      myBike.position.copy(youP).addScaledVector(youR, -.55).addScaledVector(dv, top ? 0 : .3);   // bike on your left
      myBike.rotation.y = lerpAngle(myBike.rotation.y, heading, k);
      mounted(myBike, top ? 'walk' : false);
      if (mD < s.path.len) myBike.userData.wheels.forEach(wh => wh.rotation.z -= (s.speed || 1.8) * dt / .32);
    } else {
      // racked: slide it into your slot, then it stays there for the village tour
      mounted(myBike, false);
      myBike.position.lerp(tmp.set(X(MY_SLOT[0]), 0, Z(MY_SLOT[1])), s.you === 'walkbike' ? ease(2.5, dt) : 1);
      myBike.rotation.y = lerpAngle(myBike.rotation.y, 0, s.you === 'walkbike' ? ease(4, dt) : 1);
    }
  }
  // the highlighted walker, only in Top view and only when you are not on / beside the bike
  const onBike = after && (s.you === 'ride' || (s.you === 'walkbike' && !mArrived));
  guide.visible = top && !onBike;
  guideRing.visible = top;
  guideRing.position.x = youP.x; guideRing.position.z = youP.z;
  guideRing.material.opacity = .7 + Math.sin(t * 4) * .25;
  if (guide.visible){
    guide.position.set(youP.x, mD < s.path.len ? Math.abs(Math.sin(t * 7)) * .06 : 0, youP.z);
    const want = s.look && mD >= s.path.len ? Math.atan2(X(s.look[0]) - youP.x, Z(s.look[1]) - youP.z) : Math.atan2(dv.x, dv.z);
    guide.rotation.y = lerpAngle(guide.rotation.y, want, k);
  }
}
function goStep(i){
  const steps = WT(), n = (i + steps.length) % steps.length;
  const snap = camSnap || n === 0 || n !== mStep + 1;
  mStep = n; mD = 0; mPause = 0; mWait = 0; mArrived = false;
  if (n === 0) steps.reset();
  const s = steps[n];
  if (s.enter) s.enter();
  const wm = wtMode();
  bar.kick.textContent = (mode === 'top' ? 'Top view · ' : '') + (wm === 'walk' ? 'After the race' : 'Morning walkthrough'); bar.count.textContent = `Step ${n + 1} of ${steps.length}`;
  bar.title.textContent = s.t; bar.text.textContent = s.d;
  focusIds = [];   // the bar already names the booth
  $('gunBtn').hidden = !(wm === 'morning' && s.gun);
  if (snap && firstPerson()){ s.path.at(0, wp, dv); camera.position.copy(wp.setY(1.7)); camYaw = Math.atan2(dv.x, dv.z); camPitch = -.05; camSnap = false; lookYaw = lookPitch = 0; }
}
// first-person camera: heading and pitch ease toward a target, never pointing at the ground under the camera
function fpLook(tx, ty, tz, dt, rate){
  const dx = tx - camera.position.x, dz = tz - camera.position.z, dist = Math.hypot(dx, dz);
  if (dist > 1.5){   // too close to the target: hold the current heading instead of spinning or looking down
    const k = ease(rate, dt);
    camYaw = lerpAngle(camYaw, Math.atan2(dx, dz), k);
    camPitch += (Math.max(-.3, Math.min(.15, Math.atan2(ty - camera.position.y, Math.max(dist, 3)))) - camPitch) * k;
  }
  // your own look-around (drag) sits on top of the guided heading; it drifts back a few seconds after you let go
  if (!lookDrag){ lookIdle += dt; if (lookIdle > LOOK_HOLD){ const kb = ease(1.5, dt); lookYaw -= lookYaw * kb; lookPitch -= lookPitch * kb; } }
  const yaw = camYaw + lookYaw, pitch = Math.max(-1.2, Math.min(1.2, camPitch + lookPitch)), c = Math.cos(pitch);
  camera.lookAt(camera.position.x + Math.sin(yaw) * c, camera.position.y + Math.sin(pitch), camera.position.z + Math.cos(yaw) * c);
}
// drag to look around while the walkthrough keeps moving
const FOV_WALK = 75, FOV_ORBIT = 42, LOOK_HOLD = 3;
let lookYaw = 0, lookPitch = 0, lookDrag = null, lookIdle = 0;
canvas.addEventListener('pointerdown', e => {
  if (!firstPerson()) return;
  lookDrag = {x:e.clientX, y:e.clientY, id:e.pointerId}; lookIdle = 0;
  canvas.setPointerCapture(e.pointerId); canvas.classList.add('looking');
});
canvas.addEventListener('pointermove', e => {
  if (!lookDrag || e.pointerId !== lookDrag.id) return;
  const k = camera.fov * Math.PI / 180 / canvas.clientHeight;   // one pixel of drag = one pixel of view
  lookYaw += (e.clientX - lookDrag.x) * k; lookPitch += (e.clientY - lookDrag.y) * k;
  lookPitch = Math.max(-1.1, Math.min(1.1, lookPitch));
  lookDrag.x = e.clientX; lookDrag.y = e.clientY;
});
const endLook = e => { if (lookDrag && e.pointerId === lookDrag.id){ lookDrag = null; lookIdle = 0; canvas.classList.remove('looking'); } };
canvas.addEventListener('pointerup', endLook); canvas.addEventListener('pointercancel', endLook);
function nearestId(p){
  let best = null, bd = 1e9;
  ITEMS.forEach(it => { const d = Math.hypot(it.x - p[0], it.y - p[1]); if (d < bd){ bd = d; best = it.id; } });
  return best;
}
const wp = new V3(), wl = new V3();






/* ---------- resize ---------- */
function resize(){
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

/* ---------- loop ---------- */
const clock = new THREE.Clock();
const pv = new V3(), dv = new V3();
let statT = 0;
function frame(){
  const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;

  if (simOn){
    const turnK = ease(7, dt);
    const face = (o, yaw, snap) => { o.rotation.y = snap ? yaw : lerpAngle(o.rotation.y, yaw, turnK); };
    // walkers
    walkers.forEach(w => {
      const u = w.userData; u.d += u.v * dt;
      let snap = false;
      if (u.d > u.r.len){ u.d = 0; snap = true; }
      u.r.at(u.d, pv, dv);
      w.position.set(pv.x - dv.z * u.off, Math.abs(Math.sin(t * 7 + u.ph)) * .06, pv.z + dv.x * u.off);
      if (dv.lengthSq() > 1e-6) face(w, Math.atan2(dv.x, dv.z), snap);
    });
    // morning flow on foot (registration -> kit -> baggage -> bike check -> standby)
    morningWalkers.forEach(w => {
      const u = w.userData, st = MORNING_STOPS[u.next];
      if (u.wait > 0){ u.wait -= dt; face(w, u.lookYaw); return; }   // turn smoothly to the booth while waiting
      u.d += u.v * dt;
      if (st && u.d >= st.d){ u.d = st.d; u.wait = 2 + Math.random() * 3; u.next++;
        MORNING_ALL.at(u.d, pv, dv); w.position.set(pv.x - dv.z * u.off, 0, pv.z + dv.x * u.off);
        u.lookYaw = Math.atan2(X(st.look[0]) - w.position.x, Z(st.look[1]) - w.position.z); return; }
      let snap = false;
      if (u.d > MORNING_ALL.len){ u.d = 0; u.next = 0; snap = true; }
      MORNING_ALL.at(u.d, pv, dv);
      w.position.set(pv.x - dv.z * u.off, Math.abs(Math.sin(t * 7 + u.ph)) * .06, pv.z + dv.x * u.off);
      if (dv.lengthSq() > 1e-6) face(w, Math.atan2(dv.x, dv.z), snap);
    });
    // finishers walking from the Bike Rack into the village
    finWalkers.forEach(w => {
      const u = w.userData; if (!u.busy) return;
      u.d += u.v * dt;
      if (u.d > u.r.len){ u.busy = false; w.visible = false; return; }
      u.r.at(u.d, pv, dv);
      w.position.set(pv.x - dv.z * u.off, Math.abs(Math.sin(t * 7 + u.ph)) * .06, pv.z + dv.x * u.off);
      if (dv.lengthSq() > 1e-6) face(w, Math.atan2(dv.x, dv.z), u.d < .2);
    });
    // waves: standby -> grid on Roxas -> countdown -> gun start -> U-turn -> Katigbak
    let toGrid = 0, onGrid = 0;
    riders.forEach(c => { const s = c.userData.state; if (s === 'ride') toGrid++; else if (s === 'grid') onGrid++; });
    if (gunT >= 0){ gunT -= dt; if (gunT < 0) gunStart(); }
    else if (simPhase === 'auto'){
      if (onGrid && !toGrid) gunT = 4;
      else if (!onGrid && !toGrid){ waveTimer += dt; if (waveTimer > (waveNo === 0 ? 3 : 7)){ waveTimer = 0; releaseWave(); } }
    } else if (simPhase === 'morning' && gunCue && onGrid && !toGrid){ gunCue = false; gunT = gunNow ? .2 : 3; gunNow = false; if (gunT > 1) toast('Gun start in 3…'); }
    if (gunAge >= 0) gunAge += dt;
    if (simPhase === 'auto'){ finT -= dt; if (finT <= 0){ finT = FIN_EVERY * (.7 + Math.random() * .6); sendFinisher(); } }
    riders.forEach(c => {
      const u = c.userData;
      if (u.state !== 'ride' && u.state !== 'race' && u.state !== 'finish') return;
      if (u.delay > 0){ u.delay -= dt; if (u.delay <= 0) c.visible = true; return; }
      // finishers roll through FINISH, then get off and walk the bike to the rack
      if (u.state === 'finish' && !u.walking && u.d > u.walkAt){ u.walking = true; mounted(c, 'walk'); }
      const sp = u.walking ? 1.5 : u.v;
      u.d += sp * dt;
      if (u.walking) u.pusher.position.y = Math.abs(Math.sin(t * 7 + u.d)) * .05;
      if (u.d >= u.route.len){
        if (u.state === 'ride'){ u.state = 'grid'; c.position.set(X(u.grid[0]), 0, Z(u.grid[1])); c.rotation.y = 0; }
        else if (u.state === 'race'){ u.state = 'idle'; c.visible = false; }   // cut: wave has reached Katigbak Parkway
        else { finished++; u.inWave = false; const s = u.park; parkAt(c, s); walkIn(s); }
        return;
      }
      u.route.at(u.d, pv, dv);
      const onSlab = u.state === 'ride' && pv.x > X(RAMP_BOX[0]) && pv.x < X(RAMP_BOX[1]) && pv.z > Z(RAMP_BOX[2]) && pv.z < Z(RAMP_BOX[3]);
      c.position.set(pv.x, onSlab ? SLAB_Y : 0, pv.z);
      if (dv.lengthSq() > 1e-6) face(c, Math.atan2(-dv.z, dv.x), u.d < .3 && u.state === 'finish');
      u.wheels.forEach(wh => wh.rotation.z -= sp * dt / .32);
    });
    updateFx(dt);
    tdUpdate(dt);
    trees.forEach(tr => { tr.rotation.z = Math.sin(t * .8 + tr.userData.seed) * .015; });
  }

  statT += dt;
  if (statT > .5){
    statT = 0;
    const n = s => riders.filter(c => c.userData.state === s).length;
    const moving = n('ride'), onGrid = n('grid'), racing = n('race');
    $('stats').textContent = !waveNo ? 'Wave 1 lining up'
      : moving ? `Wave ${waveNo} taking the ramp to the start`
      : gunT >= 0 ? `Wave ${waveNo} on the grid · gun in ${Math.ceil(gunT)}`
      : racing ? `Wave ${waveNo} off · U-turn to Katigbak`
      : `Wave ${waveNo + 1} lining up · ${finished} finished`;
  }

  // camera: wide lens at eye level, normal lens for orbit / top views
  const fovT = firstPerson() ? FOV_WALK : FOV_ORBIT;
  if (Math.abs(camera.fov - fovT) > .05){ camera.fov += (fovT - camera.fov) * ease(5, dt); camera.updateProjectionMatrix(); }
  const wm = wtMode();
  if (wm){
    const steps = WT(), s = steps[mStep], P = s.pause || M_PAUSE;
    if (playing){
      if (mD === 0 && s.startDelay && mWait < s.startDelay) mWait += dt;   // let the wave pull away first
      else if (mD < s.path.len) mD = Math.min(s.path.len, mD + (s.speed || 1.8) * dt);
      else {
        if (!mArrived){ mArrived = true; if (s.arrive) s.arrive(); }
        if ((mPause += dt) > P && !(s.hold && s.hold())) goStep(mStep + 1);
      }
    }
    bar.prog.style.width = Math.min(100, ((mStep + Math.min(1, mD / s.path.len) * .7 + Math.min(1, mPause / P) * .3) / steps.length) * 100) + '%';
    s.path.at(mD, wp, dv);
    if (firstPerson()){
      camera.position.lerp(tmp.copy(wp).setY(s.eye || 1.7), ease(8, dt));
      // look a few metres ahead along the route; in the last stretch turn toward the booth of this step
      const ahead = (s.speed || 1.8) > 3 ? 9 : 4;
      if (s.look && mD > s.path.len - 2.5) wl.set(X(s.look[0]), 1.3, Z(s.look[1]));
      else { s.path.at(mD + ahead, wl); if (mD + ahead > s.path.len) wl.addScaledVector(dv, mD + ahead - s.path.len); wl.y = 1.5; }
      fpLook(wl.x, wl.y, wl.z, dt, 2.2);
    }
    wp.y = 0; updateYou(dt, t, s, wm);
  }
  if (!firstPerson()){
    if (fly){
      fly.t += dt / fly.dur;
      const k = fly.t >= 1 ? 1 : (fly.t < .5 ? 4 * fly.t ** 3 : 1 - (-2 * fly.t + 2) ** 3 / 2);
      camera.position.lerpVectors(fly.fp, fly.tp, k);
      controls.target.lerpVectors(fly.ft, fly.tt, k);
      if (fly.t >= 1) fly = null;
    } else if (mode === 'tour' && playing){
      dwell += dt;
      bar.prog.style.width = Math.min(100, dwell / DWELL * 100) + '%';
      if (!reduced){ // slow drift around the stop
        const off = camera.position.clone().sub(controls.target);
        off.applyAxisAngle(new V3(0, 1, 0), dt * .04);
        camera.position.copy(controls.target).add(off);
      }
      if (dwell > DWELL) goStop(stop + 1);
    }
    if (!(mode === 'tour' && playing) && !wm) bar.prog.style.width = mode === 'tour' ? Math.min(100, dwell / DWELL * 100) + '%' : '0';
    controls.update();
  }

  if (ring.visible){ ring.material.opacity = .7 + Math.sin(t * 4) * .25; ring.rotation.z = t * .3; }

  renderer.render(scene, camera);
  updateTags();
  requestAnimationFrame(frame);
}

/* ---------- start once fonts are ready (labels are drawn with Oswald) ---------- */
function start(){
  $('loading').classList.add('done');
  setMode('tour', true); goStop(0); setPlaying(!reduced);
  // deep link to one booth, e.g. "FunRide Bike Village.html#booth=bdo" (optional &az=0.4 &dist=12)
  const hp = new URLSearchParams(location.hash.slice(1)), dl = BY[hp.get('booth')];
  if (dl){
    setMode('free'); select(dl);
    const v = viewFor(itemCenter(dl), parseFloat(hp.get('az')) || .35, parseFloat(hp.get('el')) || .45, parseFloat(hp.get('dist')) || Math.max(14, Math.max(dl.w, dl.h) / S * 2.4));
    fly = null; camera.position.copy(v.pos); controls.target.copy(v.tgt); controls.update();
  }
  requestAnimationFrame(frame);
}
start();
