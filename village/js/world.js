// FunRide Bike Village 3D: Placing every item, plus the Quirino Grandstand, trees and parked cars.
// Loaded in order by main.js once fonts and logos are ready; top-level names are shared across files.
"use strict";

function place(it, g){
  g.position.set(X(it.x), 0, Z(it.y));
  if (it.rot) g.rotation.y = it.rot * Math.PI / 180;
  scene.add(g); register(it, g);
}

function build(it){
  const g = new THREE.Group();
  const c = CATS[it.cat];
  switch (it.kind){
    case 'none': ROOT[it.id] = null; return;
    case 'stage': {
      g.add(boxBooth(it));
      // back wall with an LED screen facing the crowd, showing the FunRide PH logo
      const L = it.h / S, wallH = 4.4, bx = -it.w / S / 2 + .2, navy = new THREE.MeshStandardMaterial({color:col('#14162e'), roughness:.6});
      const back = new THREE.Mesh(new THREE.BoxGeometry(.35, wallH, L), navy);
      back.position.set(bx, it.ht + wallH / 2, 0); g.add(back);
      const sw = L - .7, sh = Math.min(3.3, sw * .5);
      const led = artTex(sw, sh, (gg, W, H) => {
        gg.fillStyle = lin(gg, 0, 0, W, H, [[0, '#0b1240'], [.55, '#1b1f7a'], [1, '#0b1240']]); gg.fillRect(0, 0, W, H);
        const glow = gg.createRadialGradient(W / 2, H * .45, 0, W / 2, H * .45, W * .45); glow.addColorStop(0, 'rgba(90,120,255,.45)'); glow.addColorStop(1, 'rgba(90,120,255,0)');
        gg.fillStyle = glow; gg.fillRect(0, 0, W, H);
        logo(gg, 'frphW', W / 2, H * .44, W * .5, H * .68);
        gg.fillStyle = '#ffffff'; gg.font = `700 ${H * .075}px ${FONT}`; gg.textAlign = 'center'; gg.textBaseline = 'middle';
        if (gg.letterSpacing !== undefined) gg.letterSpacing = `${H * .012}px`;
        gg.fillText('MOVING PEOPLE. INSPIRING CHANGE.', W / 2, H * .87);
        gg.fillStyle = 'rgba(0,0,0,.22)'; const p = Math.max(3, Math.round(H / 90));   // LED pixel grid
        for (let x = 0; x < W; x += p) gg.fillRect(x, 0, 1, H); for (let y = 0; y < H; y += p) gg.fillRect(0, y, W, 1);
      }, 260);
      const frameM = new THREE.MeshStandardMaterial({color:col('#0c0d12'), roughness:.4, metalness:.3});
      const screen = new THREE.Mesh(new THREE.BoxGeometry(.12, sh + .2, sw + .2), [new THREE.MeshBasicMaterial({map:led}), frameM, frameM, frameM, frameM, frameM]);
      screen.position.set(bx + .24, it.ht + .55 + sh / 2, 0); g.add(screen);
      // truss header with lights above the screen
      const hdr = truss(L, .3); hdr.rotation.y = Math.PI / 2; hdr.position.set(bx + .3, it.ht + wallH + .2, 0); g.add(hdr);
      for (let i = 0; i < 6; i++){ const sp = new THREE.Mesh(new THREE.CylinderGeometry(.09, .12, .22, 10), frameM); sp.position.set(bx + .55, it.ht + wallH - .05, -L / 2 + .6 + i * (L - 1.2) / 5); sp.rotation.z = -.6; g.add(sp); }
      // speaker stacks
      [-1, 1].forEach(s => { const sp = new THREE.Mesh(new THREE.BoxGeometry(.8, 1.6, .8), new THREE.MeshStandardMaterial({color:col('#1a1a22')})); sp.position.set(it.w / S / 2 - .5, it.ht + .8, s * (it.h / S / 2 - .6)); g.add(sp); });
      break;
    }
    case 'wall': {
      const w = it.w / S, h = 2.6, d = .35;
      const front = new THREE.MeshStandardMaterial({map:textCanvas(it.label + '\nPHOTOWALL', w, h, {bg:c.bg, fg:'#ffffff', fill:.55})});
      const plain = new THREE.MeshStandardMaterial({color:col(c.bg)});
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [plain, plain, plain, plain, front, front]);
      m.position.y = h / 2; g.add(m);
      const base = new THREE.Mesh(new THREE.BoxGeometry(w + .2, .12, it.h / S), new THREE.MeshStandardMaterial({map:textCanvas(it.label, w + .2, it.h / S, {bg:c.bg, fg:'#fff'})}));
      base.position.y = .06; g.add(base);
      break;
    }
    case 'rack': {
      g.add(boxBooth(it));
      const n = 30, wheels = new THREE.InstancedMesh(new THREE.TorusGeometry(.3, .045, 6, 14), new THREE.MeshStandardMaterial({color:col('#15161c')}), n * 4);
      const frames = new THREE.InstancedMesh(new THREE.BoxGeometry(.85, .06, .06), new THREE.MeshStandardMaterial({color:col('#e8eaf2')}), n * 2);
      const o = new THREE.Object3D(); let wi = 0, fi = 0;
      for (let i = 0; i < n; i++){
        const z = -it.h / S / 2 + 1 + i * ((it.h / S - 2) / (n - 1));
        [-1, 1].forEach(side => {
          if (side < 0 && i >= RACK_FREE) return;   // west side, south half: kept free for finishers parking in the sim
          const x = side * (it.w / S / 2 + .45);
          // bike pointing east-west, parked against the rack
          [-.42, .42].forEach(off => { o.position.set(x + off, .32, z); o.rotation.set(0, 0, 0); o.updateMatrix(); wheels.setMatrixAt(wi++, o.matrix); });
          o.position.set(x, .55, z); o.updateMatrix(); frames.setMatrixAt(fi++, o.matrix);
        });
      }
      wheels.count = wi; frames.count = fi;
      wheels.castShadow = frames.castShadow = true;
      g.add(wheels, frames);
      break;
    }
    case 'ramp': {
      const w = it.w / S, d = it.h / S;
      const bg = it.white ? '#ffffff' : c.bg, fg = it.white ? '#16183f' : '#ffffff';
      const side = new THREE.MeshStandardMaterial({color:col(bg)});
      const slab = new THREE.Mesh(new THREE.BoxGeometry(w, .25, d), [side, side,
        new THREE.MeshStandardMaterial({map:textCanvas(it.label, w, d, {bg, fg, vert:true})}), side, side, side]);
      slab.position.y = .13; g.add(slab);
      [-1, 1].forEach(sd => { const r = new THREE.Mesh(new THREE.BoxGeometry(.08, .8, d), fenceMat); r.position.set(sd * w / 2, .4, 0); g.add(r); });
      break;
    }
    case 'arch': {
      const span = it.h / S, r = span / 2;
      const tube = new THREE.Mesh(new THREE.TorusGeometry(r, .45, 12, 40, Math.PI), new THREE.MeshStandardMaterial({color:col(c.bg), roughness:.5}));
      tube.rotation.y = Math.PI / 2; g.add(tube);
      // sign panel printed on both faces of the arch crown (sits just in front of the tube, centred)
      const bw = 1.1, bl = r * 1.05;
      const lab = textCanvas(it.label, bl, bw, {bg:c.bg, fg:'#ffffff', fill:.7});
      const plain = new THREE.MeshStandardMaterial({color:col(c.bg)});
      [1, -1].forEach(sd => {
        const p = new THREE.Mesh(new THREE.BoxGeometry(.08, bw, bl), [new THREE.MeshStandardMaterial({map:lab}), new THREE.MeshStandardMaterial({map:lab}), plain, plain, plain, plain]);
        p.position.set(sd * .52, r - .15, 0); g.add(p);
      });
      // checkered start / finish line right under the arch
      const chk = textCanvas('', .6, span, {bg:'#ffffff', ppu:40});
      {
        const cv = chk.image, gg = cv.getContext('2d'), n = Math.round(span / .3), sq = cv.height / n;
        gg.fillStyle = '#16171b';
        for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) if ((i + j) % 2) gg.fillRect(j * cv.width / 2, i * sq, cv.width / 2, sq);
        chk.needsUpdate = true;
      }
      const line = new THREE.Mesh(new THREE.BoxGeometry(.6, .03, span - 1), [plain, plain, new THREE.MeshStandardMaterial({map:chk}), plain, plain, plain]);
      line.position.set(0, .03, 0); g.add(line);
      // painted word on the approach side: both arches are ridden eastbound (start grid waits west of START facing South Drive)
      const appr = -1, pw = 1.6, pd = span * .55;
      const word = new THREE.Mesh(new THREE.PlaneGeometry(pw, pd), new THREE.MeshBasicMaterial({map:textCanvas(it.label, pw, pd, {fg:'#ffffff', vert:true, fill:.8}), transparent:true, depthWrite:false}));
      word.rotation.x = -Math.PI / 2; word.rotation.z = appr > 0 ? 0 : Math.PI;   // letters face the riders coming in
      word.position.set(appr * 2.2, .05, 0); word.renderOrder = 2; g.add(word);
      it.top = r + .5;
      break;
    }
    case 'barricade': g.add(barricade(it)); break;
    case 'td-lane': g.add(tdLane(it)); break;
    case 'byd-showroom': g.add(bydShowroom(it)); break;
    case 'byd-garage': g.add(bydLineup(it, 'garage')); break;
    case 'byd-td': g.add(bydLineup(it, 'td')); break;
    case 'restricted': {
      const r = it.w / S / 2;
      const disk = new THREE.Mesh(new THREE.CylinderGeometry(r, r, .2, 48), new THREE.MeshStandardMaterial({color:col('#141414'), roughness:.9}));
      disk.position.y = .1; g.add(disk);
      const xm = new THREE.MeshStandardMaterial({color:col('#7bd23a'), emissive:col('#2b5a10')});
      [45, -45].forEach(a => { const b = new THREE.Mesh(new THREE.BoxGeometry(r * 1.1, .12, .9), xm); b.position.y = .26; b.rotation.y = a * Math.PI / 180; g.add(b); });
      const n = 24, posts = new THREE.InstancedMesh(new THREE.CylinderGeometry(.08, .08, 1, 6), new THREE.MeshStandardMaterial({color:col('#e9c21b')}), n), o = new THREE.Object3D();
      for (let i = 0; i < n; i++){ const a = i / n * Math.PI * 2; o.position.set(Math.cos(a) * (r + .3), .5, Math.sin(a) * (r + .3)); o.updateMatrix(); posts.setMatrixAt(i, o.matrix); }
      g.add(posts);
      break;
    }
    case 'gate': {
      // span exactly between the two hedge ends that frame the opening
      const [a, b] = it.ends;
      const A = new V3(X(a[0]), 0, Z(a[1])), B = new V3(X(b[0]), 0, Z(b[1]));
      const w = A.distanceTo(B);
      const mid = A.clone().lerp(B, .5);
      it.x = mid.x * S + 690; it.y = mid.z * S + 540;
      it.rot = Math.atan2(-(B.z - A.z), B.x - A.x) * 180 / Math.PI;
      const postH = 3.2, signH = .9, white = new THREE.MeshStandardMaterial({color:col('#ffffff')});
      const face = new THREE.MeshStandardMaterial({map:textCanvas(it.label, w - .4, signH, {bg:'#ffffff', fg:'#16183f'})});
      const sign = new THREE.Mesh(new THREE.BoxGeometry(w - .4, signH, .18), [white, white, white, white, face, face]);
      sign.position.y = postH - signH / 2 - .1; g.add(sign);
      [-1, 1].forEach(sd => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(.22, postH, .22), fenceMat);
        post.position.set(sd * (w / 2 - .11), postH / 2, 0); g.add(post);
        const foot = new THREE.Mesh(new THREE.BoxGeometry(.5, .12, .5), fenceMat);
        foot.position.set(sd * (w / 2 - .11), .06, 0); g.add(foot);
      });
      const top = new THREE.Mesh(new THREE.BoxGeometry(w, .14, .26), fenceMat);
      top.position.y = postH + .07; g.add(top);
      break;
    }
    default: {
      if (it.brand && it.shared){ ROOT[it.id] = null; return; }   // built together with its tent mate
      if (it.brand) g.add(brandBooth(it));
      else if (it.tent && it.tent !== 'big' && it.tent !== 'stage') g.add(tentBooth(it));
      else g.add(boxBooth(it, it.tent === 'big' ? {ht:it.ht || 2.6} : null));
      if (it.cat === 'merch' && !it.label){
        // open slot: see-through canopy with a small "OPEN SLOT" sign
        g.traverse(o => { if (o.isMesh) [].concat(o.material).forEach(m => { m.transparent = true; m.opacity = Math.min(m.opacity, .55); }); });
        const s = new THREE.Mesh(new THREE.PlaneGeometry(2.4, .7), new THREE.MeshBasicMaterial({map:textCanvas('OPEN SLOT', 2.4, .7, {bg:'#ffffff', fg:'#1f3a12', pill:true}), transparent:true}));
        s.position.set(0, (it.top || it.ht || 2.2) + .02, 0); s.rotation.x = -Math.PI / 2; g.add(s);
      }
    }
  }
  place(it, g);
}
ITEMS.forEach(build);

/* ---------- Quirino Grandstand ---------- */
{
  const pts = [[472,998],[1118,998],[1118,1040],[1000,1075],[600,1075],[472,1040]];
  const sh = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(X(x), -Z(y))));
  const baseH = .3;
  const base = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, {depth:baseH, bevelEnabled:false}), new THREE.MeshStandardMaterial({color:col('#efe2d2'), roughness:.9}));
  base.rotation.x = -Math.PI / 2; base.castShadow = base.receiveShadow = true; scene.add(base);
  base.userData.item = BY.grandstand; pickables.push(base);
  // red outline traced exactly on the top edge of the base
  const edge = pts.concat([pts[0]]).map(([x, y]) => new V3(X(x), baseH + .01, Z(y)));
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(edge), new THREE.LineBasicMaterial({color:col('#c8202f')})));
  // seating steps: same length, rising toward the back, all aligned on one edge
  const tierCols = ['#f6ebdd','#ecdcc8'];
  for (let i = 0; i < 4; i++){
    const y1 = 1000 + i * 10, h = baseH + .35 * (i + 1);
    const m = new THREE.Mesh(new THREE.BoxGeometry((1110 - 480) / S, h, 10 / S), new THREE.MeshStandardMaterial({color:col(tierCols[i % 2]), roughness:.85}));
    m.position.set(X(795), h / 2, Z(y1 + 5));
    m.castShadow = m.receiveShadow = true; scene.add(m);
    m.userData.item = BY.grandstand; pickables.push(m);
  }
  flatLabel('QUIRINO GRANDSTAND', 800, 1058, 232, 26, {y:baseH + .02});
}

/* ---------- trees (9, as drawn) ---------- */
const trees = [];
{
  const trunkM = new THREE.MeshStandardMaterial({color:col('#6b4a2b')});
  const leafM = new THREE.MeshStandardMaterial({color:col('#4c9a35'), roughness:.9, flatShading:true});
  [[749,226,2.6],[797,212,2.4],[844,238,2.1],[737,281,2.8],[790,266,3.1],[838,292,2.4],[761,330,2.5],[811,333,2.4],[856,346,1.9]].forEach(([x, y, r]) => {
    const t = new THREE.Group();
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(.25, .35, 2.4, 7), trunkM); tr.position.y = 1.2; t.add(tr);
    const lf = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), leafM); lf.position.y = 2.4 + r * .8; t.add(lf);
    t.position.set(X(x), 0, Z(y)); t.traverse(o => { if (o.isMesh){ o.castShadow = o.receiveShadow = true; } });
    t.userData.seed = Math.random() * 6; scene.add(t); trees.push(t);
  });
}

/* ---------- parked cars ---------- */
{
  const carCols = ['#d9dde3','#2b2f3a','#b8262f','#3b5fb0','#f2f2f2','#7a7f88'];
  const spots = [];
  for (let i = 0; i < 8; i++) if (i % 3 !== 1) spots.push([124.5 + i * 19, 1020]);
  for (let i = 0; i < 6; i++) if (i % 2 === 0) spots.push([1169.5 + i * 19, 1020]);
  spots.forEach(([x, y], i) => {
    const g = new THREE.Group(), m = new THREE.MeshStandardMaterial({color:col(carCols[i % carCols.length]), roughness:.4});
    const b = new THREE.Mesh(new THREE.BoxGeometry(1.4, .6, 2.6), m); b.position.y = .45; g.add(b);
    const cab = new THREE.Mesh(new THREE.BoxGeometry(1.2, .5, 1.3), new THREE.MeshStandardMaterial({color:col('#9fc3dd'), roughness:.2})); cab.position.set(0, .95, -.1); g.add(cab);
    g.traverse(o => { if (o.isMesh) o.castShadow = true; });
    g.position.set(X(x), 0, Z(y)); scene.add(g);
  });
}
