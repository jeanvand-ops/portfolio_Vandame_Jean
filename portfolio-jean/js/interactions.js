/* =====================================================================
   Les petites interactions des pages projet.
   Chaque projet choisit la sienne avec  interaction.type  dans projets-data.js
   (spotlight, hue, synth, zap, loupe, affiche, stamp, billboard, erase, guides, tilt, dots)
   ===================================================================== */
const CALME = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MODULES = {};
const ETOILE = 'M50 0C54 30 70 46 100 50C70 54 54 70 50 100C46 70 30 54 0 50C30 46 46 30 50 0Z';
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const borne = (v, a, b) => Math.min(b, Math.max(a, v));

/* boucle d'animation qui s'arrête quand la page disparaît */
function boucle(fn, racine) {
  let actif = true;
  const tour = t => { if (!actif || !racine.isConnected) return; fn(t); requestAnimationFrame(tour); };
  requestAnimationFrame(tour);
  return () => { actif = false; };
}

/* ---------- MÉDUSE : lampe torche ---------- */
MODULES.spotlight = (c, p, {u}) => {
  c.innerHTML = `
    <div class="spot" tabindex="0" role="img" aria-label="${esc(p.nom)}, éclairé à la lampe : flèches du clavier pour déplacer la lumière">
      <img src="${u(p.visuel)}" alt=""><div class="voile"></div>
    </div>
    <div class="outils">
      <button class="btn-t" aria-pressed="false">Tout allumer</button>
      <label class="curseur">Rayon <input type="range" min="80" max="420" value="190"></label>
    </div>`;
  const spot = c.querySelector('.spot'), btn = c.querySelector('button'), rg = c.querySelector('input');
  let x = .5, y = .45, tx = x, ty = y, r = +rg.value, touche = false;
  spot.addEventListener('pointermove', e => {
    const b = spot.getBoundingClientRect();
    tx = (e.clientX - b.left) / b.width; ty = (e.clientY - b.top) / b.height; touche = true;
  });
  spot.addEventListener('keydown', e => {
    const k = {ArrowLeft: [-.06, 0], ArrowRight: [.06, 0], ArrowUp: [0, -.06], ArrowDown: [0, .06]}[e.key];
    if (!k) return;
    e.preventDefault(); touche = true; tx = borne(tx + k[0], 0, 1); ty = borne(ty + k[1], 0, 1);
  });
  rg.addEventListener('input', () => { r = +rg.value; });
  btn.addEventListener('click', () => {
    const on = spot.classList.toggle('tout');
    btn.setAttribute('aria-pressed', on); btn.textContent = on ? 'Éteindre' : 'Tout allumer';
  });
  boucle(t => {
    if (!touche && !CALME) { tx = .5 + .28 * Math.sin(t / 1700); ty = .45 + .2 * Math.cos(t / 2300); }
    x += (tx - x) * .12; y += (ty - y) * .12;
    spot.style.setProperty('--mx', x * 100 + '%');
    spot.style.setProperty('--my', y * 100 + '%');
    spot.style.setProperty('--r', Math.max(60, r * spot.clientWidth / 1100) + 'px');
  }, spot);
};

/* ---------- MONSIEUR : changer de teinte ---------- */
const TEINTES = [['rouge', 0, '#ff0a14'], ['orange', 28, '#ff7a00'], ['vert', 115, '#18c964'],
                 ['bleu', 215, '#1f5bff'], ['violet', 275, '#8a2be2'], ['rose', 325, '#ff4fa0']];
MODULES.hue = (c, p, {u}) => {
  const phrase = p.interaction.phrase || p.nom;
  c.innerHTML = `
    <div class="teinte"><img src="${u(p.visuel)}" alt="${esc(p.nom)}"></div>
    <div class="pastilles" role="group" aria-label="Teinte">
      ${TEINTES.map((t, i) => `<button class="pastille" style="--c:${t[2]}" aria-label="${t[0]}" aria-pressed="${i === 0}" data-i="${i}"></button>`).join('')}
    </div>
    <p class="legende" aria-live="polite"></p>`;
  const box = c.querySelector('.teinte'), leg = c.querySelector('.legende'), bts = [...c.querySelectorAll('.pastille')];
  const set = i => {
    box.style.filter = `hue-rotate(${TEINTES[i][1]}deg)`;
    leg.textContent = `${phrase} ${TEINTES[i][0]}.`;
    bts.forEach((b, j) => b.setAttribute('aria-pressed', j === i));
  };
  bts.forEach(b => b.addEventListener('click', () => set(+b.dataset.i)));
  set(0);
};

/* ---------- PLAY 4 LIFE : petit synthé ---------- */
MODULES.synth = (c, p) => {
  const NOTES = [['Q', 261.63, 'do'], ['S', 293.66, 'ré'], ['D', 329.63, 'mi'], ['F', 392, 'sol'], ['G', 440, 'la'], ['H', 523.25, 'do aigu']];
  const AIR = [0, 2, 4, 5, 4, 2, 1, 3, 4, 2, 0, 2, 4, 5, 3, 5];
  c.innerHTML = `
    <svg class="synth-star" viewBox="0 0 100 100" aria-hidden="true"><path d="${ETOILE}"/></svg>
    <div class="pads">${NOTES.map((n, i) => `<button class="pad" data-i="${i}" aria-label="Note ${n[2]}, touche ${n[0]}">${n[0]}<small>${n[2]}</small></button>`).join('')}</div>
    <div class="outils"><button class="btn-t" aria-pressed="false">Jouer un air</button></div>`;
  const pads = [...c.querySelectorAll('.pad')], star = c.querySelector('.synth-star'), auto = c.querySelector('.btn-t');
  let ctx = null, timer = null, pas = 0;
  function jouer(i) {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = 'square'; o.frequency.value = NOTES[i][1];
    f.type = 'lowpass'; f.frequency.value = 1700;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(.11, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + .45);
    o.connect(f); f.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + .5);
    pads[i].classList.add('on'); setTimeout(() => pads[i].classList.remove('on'), 140);
    star.style.setProperty('--rot', (i * 60) + 'deg');
    star.classList.remove('hit'); void star.getBoundingClientRect(); star.classList.add('hit');
  }
  pads.forEach(b => {
    b.addEventListener('pointerdown', e => { e.preventDefault(); jouer(+b.dataset.i); });
    b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jouer(+b.dataset.i); } });
  });
  addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const i = NOTES.findIndex(n => n[0].toLowerCase() === e.key.toLowerCase());
    if (i >= 0 && !e.repeat) jouer(i);
  });
  auto.addEventListener('click', () => {
    const on = auto.getAttribute('aria-pressed') !== 'true';
    auto.setAttribute('aria-pressed', on); auto.textContent = on ? "Arrêter l'air" : 'Jouer un air';
    clearInterval(timer);
    if (on) { pas = 0; timer = setInterval(() => { if (!c.isConnected) return clearInterval(timer); jouer(AIR[pas++ % AIR.length]); }, 230); }
  });
};

/* ---------- CARTON TV : zapping ---------- */
MODULES.zap = (c, p, {u, byId}) => {
  const canaux = (p.interaction.canaux || [p.id]).map(byId).filter(x => x && x.visuel);
  c.innerHTML = `
    <div class="tv">
      <div class="ecran-tv" tabindex="0" aria-label="Télé : flèches gauche et droite pour zapper">
        ${canaux.map((x, i) => `<img src="${u(x.visuel)}" alt="${esc(x.nom)}" class="${i ? '' : 'on'}">`).join('')}
        <canvas class="neige" width="160" height="120"></canvas>
        <span class="osd on">CH 01</span>
      </div>
      <div class="cote-tv">
        <button class="molette" data-d="1" aria-label="Chaîne suivante">CH +</button>
        <button class="molette" data-d="-1" aria-label="Chaîne précédente">CH −</button>
      </div>
    </div>`;
  const ecran = c.querySelector('.ecran-tv'), imgs = [...c.querySelectorAll('.ecran-tv img')], osd = c.querySelector('.osd');
  const cx = c.querySelector('canvas').getContext('2d');
  let cur = 0, occupe = false, tOsd;
  const neige = () => {
    const d = cx.createImageData(160, 120);
    for (let i = 0; i < d.data.length; i += 4) { d.data[i] = d.data[i + 1] = d.data[i + 2] = Math.random() * 255; d.data[i + 3] = 255; }
    cx.putImageData(d, 0, 0);
  };
  function aller(dir) {
    if (occupe) return; occupe = true;
    ecran.classList.add('zap'); osd.classList.remove('on');
    const fin = performance.now() + (CALME ? 120 : 420);
    (function f() {
      neige();
      if (performance.now() < fin) return requestAnimationFrame(f);
      imgs[cur].classList.remove('on'); cur = (cur + dir + imgs.length) % imgs.length; imgs[cur].classList.add('on');
      osd.textContent = 'CH ' + String(cur + 1).padStart(2, '0'); osd.classList.add('on');
      ecran.classList.remove('zap'); occupe = false;
      clearTimeout(tOsd); tOsd = setTimeout(() => osd.classList.remove('on'), 1800);
    })();
  }
  c.querySelectorAll('.molette').forEach(b => b.addEventListener('click', () => aller(+b.dataset.d)));
  ecran.addEventListener('click', () => aller(1));
  ecran.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); aller(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); aller(-1); }
  });
  tOsd = setTimeout(() => osd.classList.remove('on'), 1800);
};

/* ---------- CARTON FOOT : loupe ---------- */
MODULES.loupe = (c, p, {u}) => {
  c.innerHTML = `
    <div class="zone-loupe"><img src="${u(p.visuel)}" alt="${esc(p.nom)}"><div class="lentille"></div></div>
    <div class="outils"><label class="curseur">Zoom <input type="range" min="2" max="5" step=".5" value="3"></label></div>`;
  const zone = c.querySelector('.zone-loupe'), img = zone.querySelector('img'), len = zone.querySelector('.lentille'), rg = c.querySelector('input');
  let zoom = 3;
  const bouge = e => {
    const b = img.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
    if (x < 0 || y < 0 || x > b.width || y > b.height) return zone.classList.remove('actif');
    zone.classList.add('actif');
    const R = len.offsetWidth / 2;
    len.style.left = x + 'px'; len.style.top = y + 'px';
    len.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
    len.style.backgroundSize = `${b.width * zoom}px ${b.height * zoom}px`;
    len.style.backgroundPosition = `${R - x * zoom}px ${R - y * zoom}px`;
  };
  zone.addEventListener('pointermove', bouge);
  zone.addEventListener('pointerdown', bouge);
  zone.addEventListener('pointerleave', () => zone.classList.remove('actif'));
  rg.addEventListener('input', () => { zoom = +rg.value; });
};

/* ---------- TOID : fabrique ton affiche ---------- */
MODULES.affiche = (c, p) => {
  const PAL = [['Rouge et noir', '#ff2d2d', '#000'], ['Noir et rouge', '#000', '#ff0a14'], ['Rose sur rouge', '#c10010', '#ff9a9a'],
               ['Jaune et noir', '#ffe79a', '#000'], ['Blanc et noir', '#f2efea', '#000']];
  c.innerHTML = `
    <div class="atelier">
      <div class="affiche" role="img" aria-label="Affiche avec ton mot"><div class="mot"></div></div>
      <div class="commandes">
        <label class="champ">Ton mot <input type="text" maxlength="10" value="${esc(p.interaction.mot || p.nom)}" autocomplete="off" spellcheck="false"></label>
        <div class="chips" role="group" aria-label="Couleurs">
          ${PAL.map((x, i) => `<button class="chip" style="--b:${x[1]};--t:${x[2]}" aria-pressed="${i === 0}" data-i="${i}">${x[0]}</button>`).join('')}
        </div>
        <label class="curseur">Étirement <input type="range" min="1" max="2.6" step=".05" value="1.9"></label>
      </div>
    </div>`;
  const aff = c.querySelector('.affiche'), mot = c.querySelector('.mot'), inp = c.querySelector('input[type=text]'), rg = c.querySelector('input[type=range]');
  const chips = [...c.querySelectorAll('.chip')];
  function coul(i) {
    aff.style.setProperty('--b', PAL[i][1]); aff.style.setProperty('--t', PAL[i][2]);
    chips.forEach((b, j) => b.setAttribute('aria-pressed', j === i));
  }
  function fit() {
    const w = aff.clientWidth, h = aff.clientHeight;
    const m = (inp.value.trim() || '?').toUpperCase();
    const lignes = m.length > 5 ? [m.slice(0, Math.ceil(m.length / 2)), m.slice(Math.ceil(m.length / 2))] : [m];
    mot.innerHTML = lignes.map(l => `<span>${esc(l)}</span>`).join('');
    mot.style.fontSize = '100px'; mot.style.transform = 'none';
    const lmax = Math.max(...[...mot.children].map(s => s.getBoundingClientRect().width)) || 1;
    const taille = 100 * (w * .94) / lmax;
    mot.style.fontSize = taille + 'px';
    const sMax = (h * .94) / (lignes.length * .8 * taille);
    mot.style.transform = `scaleY(${Math.min(+rg.value, sMax).toFixed(3)})`;
  }
  chips.forEach(b => b.addEventListener('click', () => coul(+b.dataset.i)));
  inp.addEventListener('input', fit); rg.addEventListener('input', fit); addEventListener('resize', fit);
  coul(0); fit(); document.fonts && document.fonts.ready.then(fit);
};

/* ---------- QUALBO : tampons ---------- */
MODULES.stamp = (c, p, {u}) => {
  const COUL = ['#ff4a00', '#2bbfa0', '#ffb000', '#ff3dd6', '#2d3bff', '#ff1f1f', '#f6ff00', '#00e5ff'];
  c.innerHTML = `
    <div class="zone-tampon"><img src="${u(p.visuel)}" alt="${esc(p.nom)}"><canvas></canvas></div>
    <div class="outils"><button class="btn-t">Effacer les tampons</button></div>`;
  const zone = c.querySelector('.zone-tampon'), cv = c.querySelector('canvas'), ctx = cv.getContext('2d');
  const etoile = new Path2D(ETOILE);
  let tampons = [], W = 1, H = 1, bas = false, dernier = null;
  function dessine(s) {
    ctx.save(); ctx.translate(s.x * W, s.y * H); ctx.rotate(s.r);
    const k = s.k * W; ctx.fillStyle = ctx.strokeStyle = s.c; ctx.lineWidth = k * .14; ctx.lineCap = 'round';
    if (s.f === 0) { ctx.scale(k / 100, k / 100); ctx.translate(-50, -50); ctx.fill(etoile); }
    else if (s.f === 1) { ctx.beginPath(); ctx.arc(0, 0, k * .4, 0, 7); ctx.stroke(); }
    else if (s.f === 2) {
      ctx.beginPath(); ctx.moveTo(-k * .5, 0);
      ctx.bezierCurveTo(-k * .3, -k * .55, -k * .1, k * .55, k * .1, 0);
      ctx.bezierCurveTo(k * .25, -k * .4, k * .4, k * .35, k * .5, 0); ctx.stroke();
    } else { ctx.beginPath(); ctx.arc(0, 0, k * .2, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  function tout() { ctx.clearRect(0, 0, W, H); tampons.forEach(dessine); }
  function taille() {
    const d = devicePixelRatio || 1; W = zone.clientWidth; H = zone.clientHeight;
    cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); tout();
  }
  function pose(e) {
    const b = cv.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
    if (dernier && Math.hypot((x - dernier.x) * W, (y - dernier.y) * H) < W * .05) return;
    const s = {x, y, k: .06 + Math.random() * .09, r: Math.random() * 6.28, f: Math.floor(Math.random() * 4), c: COUL[Math.floor(Math.random() * COUL.length)]};
    tampons.push(s); dessine(s); dernier = {x, y};
  }
  cv.addEventListener('pointerdown', e => { bas = true; dernier = null; cv.setPointerCapture(e.pointerId); pose(e); });
  cv.addEventListener('pointermove', e => { if (bas) pose(e); });
  cv.addEventListener('pointerup', () => { bas = false; });
  cv.addEventListener('pointercancel', () => { bas = false; });
  c.querySelector('.btn-t').addEventListener('click', () => { tampons = []; tout(); });
  new ResizeObserver(taille).observe(zone); taille();
};

/* ---------- UMÀ : panneau DOOH ---------- */
MODULES.billboard = (c, p, {u, byId}) => {
  const prog = (p.interaction.programme || [p.id]).map(byId).filter(x => x && x.visuel);
  c.innerHTML = `
    <div class="rue">
      <div class="skyline" aria-hidden="true"></div>
      <div class="panneau-pub">
        <div class="cadre-pub">${prog.map((x, i) => `<img src="${u(x.visuel)}" alt="${esc(x.nom)}" class="${i ? '' : 'on'}">`).join('')}</div>
        <div class="poteau"></div>
      </div>
      <div class="sol"></div>
    </div>
    <div class="outils">
      <button class="btn-t" data-j aria-pressed="false">Passer à la nuit</button>
      <button class="btn-t" data-r aria-pressed="${!CALME}">Rotation des campagnes</button>
    </div>`;
  const rue = c.querySelector('.rue'), sky = c.querySelector('.skyline'), imgs = [...c.querySelectorAll('.cadre-pub img')];
  for (let i = 0; i < 16; i++) {
    const d = document.createElement('div'); d.className = 'imm';
    d.style.cssText = `left:${i * 6.3 - 1}%;width:${6 + (i * 7) % 4}%;height:${28 + (i * 37) % 55}%`;
    sky.appendChild(d);
  }
  const bj = c.querySelector('[data-j]'), br = c.querySelector('[data-r]');
  bj.addEventListener('click', () => {
    const nuit = rue.classList.toggle('nuit'); bj.setAttribute('aria-pressed', nuit);
    bj.textContent = nuit ? 'Revenir au jour' : 'Passer à la nuit';
  });
  let cur = 0, timer = null;
  const avance = () => { if (!c.isConnected) return clearInterval(timer); imgs[cur].classList.remove('on'); cur = (cur + 1) % imgs.length; imgs[cur].classList.add('on'); };
  const rot = on => { clearInterval(timer); if (on && imgs.length > 1) timer = setInterval(avance, 3500); br.setAttribute('aria-pressed', on); };
  br.addEventListener('click', () => rot(br.getAttribute('aria-pressed') !== 'true'));
  rot(!CALME);
};

/* ---------- AQUARIUM : « tout ici est temporaire » ---------- */
MODULES.erase = (c, p, {u}) => {
  c.innerHTML = `
    <div class="gomme" style="--o:0"><div class="fond-txt">Tout ici est temporaire.</div><canvas aria-label="Ticket à effacer" role="img"></canvas></div>
    <div class="outils"><button class="btn-t">Restaurer</button><output class="sortie" aria-live="polite">0 % effacé</output></div>`;
  const box = c.querySelector('.gomme'), cv = c.querySelector('canvas'), ctx = cv.getContext('2d'), out = c.querySelector('output');
  const W = 1200; let H = 628, img = new Image(), bas = false, last = null;
  const GX = 48, GY = 25, cells = new Uint8Array(GX * GY);
  function dessine() { ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, H); ctx.drawImage(img, 0, 0, W, H); }
  img.onload = () => { H = Math.round(W * img.naturalHeight / img.naturalWidth); cv.width = W; cv.height = H; box.style.aspectRatio = W + '/' + H; dessine(); };
  img.src = u(p.visuel);
  function marque(x, y) {
    for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++)
      if (Math.hypot((i + .5) * W / GX - x, (j + .5) * H / GY - y) < 58) cells[j * GX + i] = 1;
    const pct = Math.round(cells.reduce((a, b) => a + b, 0) / cells.length * 100);
    out.textContent = pct + ' % effacé'; box.style.setProperty('--o', Math.min(1, pct / 55));
  }
  function gomme(e) {
    const b = cv.getBoundingClientRect(), x = (e.clientX - b.left) * W / b.width, y = (e.clientY - b.top) * H / b.height;
    ctx.globalCompositeOperation = 'destination-out'; ctx.lineWidth = 100; ctx.lineCap = 'round'; ctx.strokeStyle = '#000';
    ctx.beginPath(); ctx.moveTo(last ? last[0] : x, last ? last[1] : y); ctx.lineTo(x + .01, y); ctx.stroke();
    marque(x, y); last = [x, y];
  }
  cv.addEventListener('pointerdown', e => { bas = true; last = null; cv.setPointerCapture(e.pointerId); gomme(e); });
  cv.addEventListener('pointermove', e => { if (bas) gomme(e); });
  cv.addEventListener('pointerup', () => { bas = false; last = null; });
  cv.addEventListener('pointercancel', () => { bas = false; last = null; });
  c.querySelector('.btn-t').addEventListener('click', () => { cells.fill(0); dessine(); out.textContent = '0 % effacé'; box.style.setProperty('--o', 0); });
};

/* ---------- QONTO : zones de sécurité du titrage ---------- */
MODULES.guides = (c, p, {u}) => {
  const G = [['titre', 'Zone de titre 80 %', 'g-titre', true], ['action', "Zone d'action 90 %", 'g-action', false],
             ['tiers', 'Règle des tiers', 'g-tiers', false], ['axes', 'Axes centraux', 'g-axes', false]];
  c.innerHTML = `
    <div class="cadre-g"><img src="${u(p.visuel)}" alt="${esc(p.nom)}">
      ${G.map(g => `<div class="g ${g[2]}${g[3] ? ' on' : ''}" data-k="${g[0]}" data-l="${g[1]}"></div>`).join('')}
    </div>
    <div class="outils">${G.map(g => `<button class="btn-t" data-k="${g[0]}" aria-pressed="${g[3]}">${g[1]}</button>`).join('')}</div>`;
  c.querySelectorAll('.btn-t').forEach(b => b.addEventListener('click', () => {
    const on = c.querySelector(`.g[data-k="${b.dataset.k}"]`).classList.toggle('on'); b.setAttribute('aria-pressed', on);
  }));
};

/* ---------- BOSE : inclinaison 3D ---------- */
MODULES.tilt = (c, p, {u}) => {
  c.innerHTML = `
    <div class="scene-3d"><div class="carte-3d"><img src="${u(p.visuel)}" alt="${esc(p.nom)}"><div class="reflet"></div></div></div>
    <div class="outils"><button class="btn-t" aria-pressed="false">Rotation automatique</button></div>`;
  const scene = c.querySelector('.scene-3d'), carte = c.querySelector('.carte-3d'), ref = c.querySelector('.reflet'), btn = c.querySelector('.btn-t');
  let auto = false;
  const applique = (nx, ny) => {
    carte.style.transform = `rotateY(${(nx - .5) * 28}deg) rotateX(${-(ny - .5) * 20}deg)`;
    ref.style.setProperty('--gx', nx * 100 + '%'); ref.style.setProperty('--gy', ny * 100 + '%');
  };
  scene.addEventListener('pointermove', e => {
    if (auto) return;
    const b = scene.getBoundingClientRect(); applique(borne((e.clientX - b.left) / b.width, 0, 1), borne((e.clientY - b.top) / b.height, 0, 1));
  });
  scene.addEventListener('pointerleave', () => { if (!auto) applique(.5, .5); });
  btn.addEventListener('click', () => { auto = !auto; btn.setAttribute('aria-pressed', auto); if (!auto) applique(.5, .5); });
  boucle(t => { if (auto) applique(.5 + .45 * Math.cos(t / 900), .5 + .4 * Math.sin(t / 1300)); }, scene);
};

/* ---------- SCRAP : grille de points ---------- */
MODULES.dots = (c, p) => {
  c.innerHTML = `<div class="zone-scrap" aria-label="Grille de points interactive" role="img"><canvas></canvas><div class="mot">SCRAP<i></i></div></div>`;
  const zone = c.querySelector('.zone-scrap'), cv = c.querySelector('canvas'), ctx = cv.getContext('2d');
  const GAP = 24; let W = 1, H = 1, mx = -999, my = -999, sx = -999, sy = -999;
  const ondes = [];
  const taille = () => { const d = devicePixelRatio || 1; W = zone.clientWidth; H = zone.clientHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
  new ResizeObserver(taille).observe(zone); taille();
  zone.addEventListener('pointermove', e => { const b = zone.getBoundingClientRect(); mx = e.clientX - b.left; my = e.clientY - b.top; });
  zone.addEventListener('pointerleave', () => { mx = my = -999; });
  zone.addEventListener('pointerdown', e => { const b = zone.getBoundingClientRect(); ondes.push({x: e.clientX - b.left, y: e.clientY - b.top, t: performance.now()}); });
  boucle(t => {
    sx += (mx - sx) * .18; sy += (my - sy) * .18;
    ctx.clearRect(0, 0, W, H);
    while (ondes.length && t - ondes[0].t > 1700) ondes.shift();
    const cols = Math.ceil(W / GAP), rows = Math.ceil(H / GAP);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      let px = i * GAP + GAP / 2, py = j * GAP + GAP / 2;
      const dx = px - sx, dy = py - sy, d = Math.hypot(dx, dy) || 1, f = Math.max(0, 1 - d / 150);
      let amp = f;
      for (const o of ondes) {
        const r = (t - o.t) * .4, dd = Math.abs(Math.hypot(px - o.x, py - o.y) - r);
        if (dd < 44) amp += (1 - dd / 44) * (1 - (t - o.t) / 1700) * 1.3;
      }
      px += dx / d * f * f * 16; py += dy / d * f * f * 16;
      ctx.fillStyle = amp > .55 ? '#ff0a14' : 'rgba(80,80,80,.75)';
      if (i % 4 === 2 && j % 4 === 2) {
        const a = 4 + amp * 5; ctx.fillRect(px - a, py - .5, a * 2, 1.2); ctx.fillRect(px - .5, py - a, 1.2, a * 2);
      } else { ctx.beginPath(); ctx.arc(px, py, 1.1 + amp * 2.6, 0, 7); ctx.fill(); }
    }
  }, zone);
};
