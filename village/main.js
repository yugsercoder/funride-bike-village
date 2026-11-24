// FunRide Bike Village 3D: entry point. Waits for the Oswald font and the sponsor logos (canvas textures need them),
// then loads the scene scripts in order. Classic scripts (not modules) so the page still works opened from disk.
"use strict";
const FR_PARTS = ['data.js', 'scene.js', 'booths.js', 'brands.js', 'byd.js', 'world.js', 'people.js', 'riders.js', 'ui.js'];
function boot(){
  FR_PARTS.forEach(name => { const s = document.createElement('script'); s.src = 'village/js/' + name; s.async = false; document.body.appendChild(s); });
}
(function(){
  let done = false; const go = () => { if (!done){ done = true; boot(); } };
  // sponsor logos (village/logos.js) are data URIs, so the page works opened straight from disk
  const imgs = window.FR_LOGO_IMG = {};
  const logos = Object.entries(window.FR_LOGOS || {}).map(([k, src]) => new Promise(res => { const im = new Image(); im.onload = im.onerror = res; im.src = src; imgs[k] = im; }));
  try { Promise.all([document.fonts.load('700 40px Oswald'), document.fonts.load('500 14px Oswald')].concat(logos)).then(go, go); } catch(e){ Promise.all(logos).then(go, go); }
  setTimeout(go, 4000);
})();
