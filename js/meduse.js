/* =====================================================================
   Page MÉDUSE
   Images du film à mettre dans img/meduse/ (plan-01.jpg … plan-08.jpg, teaser.mp4).
   Tant qu'une image manque, le plan s'affiche en version typographique.
   ===================================================================== */
(function () {
  const BASE = '../', DOSSIER = BASE + 'img/meduse/';
  const CALME = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => document.querySelector(s);
  const nn = i => String(i + 1).padStart(2, '0');
  const borne = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- les 8 plans du récit ---------- */
  const N = '#0a0a0a', R = '#ff0a14', B = '#3b8fe3', O = '#eba552', C = '#f1ebe0';
  const PLANS = [
    {titre: 'Persée triomphant', etat: 'La légende officielle', fond: N, encre: R, txt: C, img: 'plan-01.jpg', secours: BASE + 'img/visuels/img-meduse.jpg',
     texte: "D'un coup de glaive triomphant, l'illustre Persée tranche la tête de l'horrible Méduse, délivrant le monde de l'abomination."},
    {titre: 'Une vérité effacée', etat: "L'autre version", fond: R, encre: N, txt: '#000', img: 'plan-02.jpg', grec: 'ἀλήθεια', yeux: true,
     texte: 'Mais derrière cette victoire se cache une vérité que les dieux ont voulu effacer…'},
    {titre: 'Avant les serpents', etat: "L'autre version", fond: O, encre: N, txt: '#000', img: 'plan-03.jpg', grec: 'Μέδουσα',
     texte: 'Bien avant les serpents, Méduse était une mortelle dont la grâce émerveillait la Grèce.'},
    {titre: 'La convoitise', etat: "L'autre version", fond: B, encre: N, txt: '#000', img: 'plan-04.jpg', grec: 'Ποσειδῶν',
     texte: "Jusqu'au jour où sa beauté attira la convoitise du dieu des mers…"},
    {titre: "Le temple d'Athéna", etat: "L'autre version", fond: N, encre: B, txt: C, img: 'plan-05.jpg', grec: 'ναός',
     texte: "Dans le temple d'Athéna, Poséidon lui imposa son désir, étouffant son refus sur le marbre."},
    {titre: "La colère d'Athéna", etat: "L'autre version", fond: B, encre: N, txt: '#000', img: 'plan-06.jpg', grec: 'Ἀθηνᾶ',
     texte: "Consumée par la colère de voir son temple profané, Athéna fit de Méduse la cible de son courroux, changeant sa beauté en abomination."},
    {titre: 'Le monstre', etat: "L'autre version", fond: N, encre: R, txt: C, img: 'plan-07.jpg', grec: 'Γοργώ',
     texte: 'Celle qui fut blessée devint celle que le monde craignait.'},
    {titre: 'Ses sœurs de silence', etat: 'Sa version', fond: C, encre: N, txt: '#000', img: 'plan-08.jpg', grec: 'Μέδουσα',
     texte: "L'Histoire retiendra la gloire du vainqueur, mais ses sœurs de silence n'ont jamais oublié celle qui fut brisée."}
  ];

  /* =================================================================
     LE VASE QUI TOURNE : les 8 plans peints autour d'une amphore
     ================================================================= */
  const cv = $('#vase'), ctx = cv.getContext('2d'), sVase = $('.vase-s');
  const PW = 440, PH = 248, MH = 34, NB = PLANS.length, SW = PW * NB, SH = PH + MH * 2;
  const K = SW / (2 * Math.PI);                       // pixels de bande par radian
  const bande = document.createElement('canvas'); bande.width = SW; bande.height = SH;
  const bx = bande.getContext('2d');
  const images = [];
  const YEUX = [[.12, .2, -.2], [.3, .12, .15], [.72, .16, -.1], [.88, .34, .25], [.1, .66, .1], [.26, .84, -.25], [.66, .86, .2], [.86, .74, -.15], [.48, .2, 0]];

  function meandre(c, y, h, couleur) {
    const s = h / 14, w = 28 * s;
    c.save(); c.strokeStyle = couleur; c.lineWidth = 2 * s; c.lineJoin = 'miter'; c.beginPath();
    for (let x = 0; x < SW + w; x += w) {
      const P = (a, b) => [x + a * s, y + b * s];
      c.moveTo(...P(0, 13)); c.lineTo(...P(4, 13)); c.lineTo(...P(4, 1)); c.lineTo(...P(16, 1)); c.lineTo(...P(16, 9));
      c.lineTo(...P(8, 9)); c.lineTo(...P(8, 5)); c.lineTo(...P(12, 5));
      c.moveTo(...P(14, 13)); c.lineTo(...P(28, 13));
    }
    c.stroke(); c.restore();
  }
  function construireBande() {
    bx.fillStyle = '#111'; bx.fillRect(0, 0, SW, SH);
    meandre(bx, 2, MH - 6, O); meandre(bx, SH - MH + 4, MH - 6, O);
    PLANS.forEach((p, i) => {
      const x0 = i * PW, y0 = MH, im = images[i];
      bx.save(); bx.beginPath(); bx.rect(x0, y0, PW, PH); bx.clip();
      bx.fillStyle = p.fond; bx.fillRect(x0, y0, PW, PH);
      if (im) {
        const k = Math.max(PW / im.naturalWidth, PH / im.naturalHeight), w = im.naturalWidth * k, h = im.naturalHeight * k;
        bx.drawImage(im, x0 + (PW - w) / 2, y0 + (PH - h) / 2, w, h);
      } else {
        if (p.yeux) {
          bx.fillStyle = p.encre;
          YEUX.forEach(([a, b, r]) => { bx.beginPath(); bx.ellipse(x0 + a * PW, y0 + b * PH, PW * .05, PH * .035, r, 0, 7); bx.fill(); });
        }
        bx.fillStyle = p.encre; bx.textAlign = 'center'; bx.textBaseline = 'middle';
        bx.font = `italic ${PH * .3}px Georgia, 'Times New Roman', serif`;
        bx.fillText(p.grec, x0 + PW / 2, y0 + PH / 2);
      }
      bx.fillStyle = im ? C : p.encre; bx.textAlign = 'left'; bx.textBaseline = 'top';
      bx.font = `${PH * .1}px Anton, Impact, sans-serif`;
      bx.fillText(nn(i), x0 + 22, y0 + 18);
      bx.restore();
      bx.fillStyle = '#111'; bx.fillRect(x0 - 4, MH, 8, PH);
    });
    sale = true;
  }

  // profil de l'amphore (côté droit, en unités du rayon) : [type, ...points]
  const PROFIL = [['L', .56, 0], ['L', .56, .1], ['L', .4, .16], ['L', .36, .24], ['L', .38, .5], ['C', .62, .54, 1, .64, 1, .9],
                  ['L', 1, 1.66], ['C', 1, 2.0, .5, 2.14, .34, 2.22], ['L', .32, 2.3], ['L', .46, 2.36], ['L', .46, 2.42]];
  let W = 1, H = 1, RR = 1, cx = 0, t0 = 0, sale = true;
  const X = x => cx + x * RR, Y = y => t0 + y * RR;
  function cheminVase() {
    ctx.beginPath(); ctx.moveTo(X(-PROFIL[0][1]), Y(PROFIL[0][2])); ctx.lineTo(X(PROFIL[0][1]), Y(PROFIL[0][2]));
    for (let k = 1; k < PROFIL.length; k++) {
      const s = PROFIL[k];
      if (s[0] === 'L') ctx.lineTo(X(s[1]), Y(s[2]));
      else ctx.bezierCurveTo(X(s[1]), Y(s[2]), X(s[3]), Y(s[4]), X(s[5]), Y(s[6]));
    }
    for (let k = PROFIL.length - 1; k >= 1; k--) {
      const s = PROFIL[k], p = PROFIL[k - 1], px = p[p.length - 2], py = p[p.length - 1];
      if (s[0] === 'L') ctx.lineTo(X(-px), Y(py));
      else ctx.bezierCurveTo(X(-s[3]), Y(s[4]), X(-s[1]), Y(s[2]), X(-px), Y(py));
    }
    ctx.closePath();
  }
  function taille() {
    const b = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    W = b.width; H = b.height; cv.width = Math.round(W * d); cv.height = Math.round(H * d); ctx.setTransform(d, 0, 0, d, 0, 0);
    RR = Math.min(W / 2.8, (H - 30) / 2.72); cx = W / 2; t0 = (H - 30 - 2.64 * RR) / 2;
    sale = true;
  }
  function dessiner(rot) {
    ctx.clearRect(0, 0, W, H);
    // halo derrière le vase
    const g = ctx.createRadialGradient(cx, Y(1.3), 0, cx, Y(1.3), RR * 1.7);
    g.addColorStop(0, 'rgba(255,255,255,.12)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // anses dorées
    const or = ctx.createLinearGradient(0, Y(0), 0, Y(.85));
    or.addColorStop(0, '#f6dc8a'); or.addColorStop(.5, '#d6a43c'); or.addColorStop(1, '#9c6a1c');
    ctx.strokeStyle = or; ctx.lineWidth = RR * .085; ctx.lineCap = 'round';
    for (const s of [1, -1]) {
      ctx.beginPath(); ctx.moveTo(X(.37 * s), Y(.26));
      ctx.bezierCurveTo(X(1.02 * s), Y(.02), X(1.3 * s), Y(.46), X(.86 * s), Y(.74)); ctx.stroke();
    }
    // socle carré
    ctx.fillStyle = '#111'; ctx.fillRect(X(-.62), Y(2.42), 1.24 * RR, .22 * RR);
    ctx.fillStyle = or; ctx.fillRect(X(-.62), Y(2.42), 1.24 * RR, .03 * RR); ctx.fillRect(X(-.62), Y(2.61), 1.24 * RR, .03 * RR);
    // corps
    ctx.save(); cheminVase(); ctx.fillStyle = '#111'; ctx.fill(); ctx.clip();
    // la frise des 8 plans, enroulée autour du cylindre
    const bt = Y(.96), bh = SH / K * RR;
    for (let px = -RR; px < RR; px += 1) {
      const xc = px + .5, q = Math.sqrt(Math.max(RR * RR - xc * xc, .01));
      let u = ((rot + Math.asin(borne(xc / RR, -1, 1))) * K) % SW; if (u < 0) u += SW;
      let sw = Math.max(1, K / q); if (u + sw > SW) sw = SW - u;
      ctx.drawImage(bande, u, 0, Math.max(sw, .5), SH, cx + px, bt, 1.5, bh);
    }
    // rayons ocre sur le bas du vase (tournent avec lui)
    ctx.fillStyle = O;
    for (let k = 0; k < 28; k++) {
      const f = k * 2 * Math.PI / 28 - rot, c = Math.cos(f);
      if (c <= .04) continue;
      const xb = Math.sin(f) * .97, xa = Math.sin(f) * .62, h = .04 * c;
      ctx.beginPath(); ctx.moveTo(X(xb - h), Y(1.72)); ctx.lineTo(X(xb + h), Y(1.72)); ctx.lineTo(X(xa), Y(2.06)); ctx.fill();
    }
    ctx.fillRect(X(-.4), Y(.31), .8 * RR, .035 * RR);
    ctx.fillRect(X(-.5), Y(2.26), RR, .025 * RR);
    // volume : ombres sur les côtés, reflet à gauche
    const l = ctx.createLinearGradient(X(-1), 0, X(1), 0);
    l.addColorStop(0, 'rgba(0,0,0,.7)'); l.addColorStop(.22, 'rgba(0,0,0,.1)'); l.addColorStop(.33, 'rgba(255,255,255,.2)');
    l.addColorStop(.4, 'rgba(255,255,255,0)'); l.addColorStop(.72, 'rgba(0,0,0,.05)'); l.addColorStop(1, 'rgba(0,0,0,.75)');
    ctx.fillStyle = l; ctx.fillRect(0, 0, W, H);
    ctx.restore();
    cheminVase(); ctx.strokeStyle = 'rgba(241,235,224,.22)'; ctx.lineWidth = 1.5; ctx.stroke();
  }

  // rotation : rot = angle ; le plan i est de face quand rot = (i + .5) * PW / K
  const PAS = PW / K, centre = i => (i + .5) * PAS;
  let rot = centre(0), vit = 0, cible = null, glisse = false, dernierX = 0, touche = false, visible = false, cur = -1;
  const accroche = r => (Math.round(r / PAS - .5) + .5) * PAS;
  const indice = r => { const u = ((r * K) % SW + SW) % SW; return Math.floor(u / PW) % NB; };

  const points = $('#v-points');
  points.innerHTML = PLANS.map(() => '<i></i>').join('');
  function plan(i) {
    if (i === cur) return; cur = i;
    const p = PLANS[i];
    sVase.style.setProperty('--v-fond', p.fond); sVase.style.setProperty('--v-txt', p.txt);
    $('#v-num').textContent = nn(i);
    $('#v-etat').textContent = p.etat;
    $('#v-titre').textContent = 'Plan ' + nn(i) + ' · ' + p.titre;
    $('#v-texte').textContent = '« ' + p.texte + ' »';
    [...points.children].forEach((el, j) => el.classList.toggle('on', j === i));
  }
  function premiereFois() { if (!touche) { touche = true; sVase.classList.add('touche'); } }
  function aller(d) { premiereFois(); vit = 0; cible = (cible !== null ? cible : accroche(rot)) + d * PAS; }

  cv.addEventListener('pointerdown', e => { glisse = true; premiereFois(); vit = 0; cible = null; dernierX = e.clientX; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => {
    if (!glisse) return;
    const dx = e.clientX - dernierX; dernierX = e.clientX;
    rot -= dx / RR; vit = -dx / RR; sale = true;
  });
  const lacher = () => { if (!glisse) return; glisse = false; if (Math.abs(vit) < .01) { vit = 0; cible = accroche(rot); } };
  cv.addEventListener('pointerup', lacher); cv.addEventListener('pointercancel', lacher);
  cv.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); aller(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); aller(-1); }
  });
  $('#v-suiv').addEventListener('click', () => aller(1));
  $('#v-prec').addEventListener('click', () => aller(-1));
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(cv);
  new ResizeObserver(taille).observe(cv); taille();

  (function boucle(t) {
    if (!glisse) {
      if (Math.abs(vit) > .0008) {
        rot += vit; vit *= .93; sale = true;
        if (Math.abs(vit) < .004) { vit = 0; cible = accroche(rot); }
      } else if (cible !== null) {
        rot += (cible - rot) * (CALME ? 1 : .13); sale = true;
        if (Math.abs(cible - rot) < 1e-4) { rot = cible; cible = null; }
      }
    }
    const balance = (!touche && visible && !CALME) ? Math.sin(t / 650) * .09 : 0;
    if (visible && (sale || balance)) { dessiner(rot + balance); sale = false; }
    plan(indice(rot));
    requestAnimationFrame(boucle);
  })(0);

  // images du film (sinon version typo)
  PLANS.forEach((p, i) => {
    const essai = (src, suite) => { const im = new Image(); im.onload = () => { images[i] = im; construireBande(); }; im.onerror = suite; im.src = src; };
    essai(DOSSIER + p.img, () => p.secours && essai(p.secours, () => {}));
  });
  construireBande();
  document.fonts && document.fonts.ready.then(construireBande);

  /* =================================================================
     LE REGARD QUI PÉTRIFIE
     ================================================================= */
  const zone = $('#regard'), media = $('#r-media'), curseur = $('#r-curseur'), statues = $('#r-statues');
  const yeux = [...zone.querySelectorAll('.oeil')], rayons = [...zone.querySelectorAll('.r-rayons line')];
  const msg = $('#r-message'), flash = $('#r-flash');
  const OEIL = [[.509, .523], [.597, .52]];            // position des yeux dans l'image (0 → 1)
  let mw = 1, mh = 1, ml = 0, mt = 0, zw = 1, zh = 1;
  let mx = -99, my = -99, vx = 0, dedans = false, regard = 0, mode = 'libre', fige = null, compte = 0, demoFaite = false, demoT = null;

  function cadrer() {                                  // l'image couvre la zone, visage centré, sous-titres coupés
    zw = zone.clientWidth; zh = zone.clientHeight;
    const k = Math.max(zw / 1600, zh / 720); mw = 1600 * k; mh = 900 * k;
    ml = borne(zw / 2 - .55 * mw, zw - mw, 0); mt = borne(zh / 2 - .5 * mh, zh - .8 * mh, 0);
    Object.assign(media.style, {width: mw + 'px', height: mh + 'px', left: ml + 'px', top: mt + 'px'});
  }
  new ResizeObserver(cadrer).observe(zone); cadrer();
  const oeilXY = i => [ml + OEIL[i][0] * mw, mt + OEIL[i][1] * mh];

  function message(t, alerte) { if (msg.textContent !== t) msg.textContent = t; msg.classList.toggle('alerte', !!alerte); }
  function placer(x, y) { curseur.style.transform = `translate(${x}px,${y}px)`; }
  function pos(e) { const b = zone.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; }

  function petrifier() {
    mode = 'pierre'; fige = [mx, my]; compte++;
    curseur.classList.add('pierre'); zone.classList.add('pierre');
    if (!CALME) { flash.classList.remove('on'); void flash.offsetWidth; flash.classList.add('on'); zone.classList.remove('tremble'); void zone.offsetWidth; zone.classList.add('tremble'); }
    $('#r-compte').textContent = compte; $('#r-pl').textContent = compte > 1 ? 's' : '';
    message('Pétrifiée ! Détourne le regard pour t\'en sortir.', true);
  }
  function enStatue() {
    if (!fige) return;
    const s = document.createElement('div'); s.className = 'statue';
    s.style.left = (fige[0] / zw * 100) + '%'; s.style.top = (fige[1] / zh * 100) + '%';
    s.style.setProperty('--rot', (Math.random() * 30 - 15).toFixed(1) + 'deg');
    s.innerHTML = curseur.querySelector('svg').outerHTML;
    statues.appendChild(s);
    while (statues.children.length > 14) statues.firstChild.remove();
    curseur.classList.remove('pierre'); zone.classList.remove('pierre', 'fixe');
    mode = 'libre'; fige = null; regard = 0;
    message(compte === 1 ? 'Une statue de plus dans sa collection.' : 'Encore une. Elle ne se lasse pas.');
  }

  zone.addEventListener('pointerenter', e => { if (mode === 'demo') arreterDemo(); dedans = true; zone.classList.add('dedans'); [mx, my] = pos(e); });
  zone.addEventListener('pointerdown', e => { if (mode === 'demo') arreterDemo(); dedans = true; zone.classList.add('dedans'); [mx, my] = pos(e); zone.setPointerCapture && zone.releasePointerCapture && zone.releasePointerCapture(e.pointerId); });
  zone.addEventListener('pointermove', e => {
    if (mode === 'demo') arreterDemo();
    const [x, y] = pos(e); vx += Math.hypot(x - mx, y - my); mx = x; my = y; dedans = true; zone.classList.add('dedans');
    if (mode === 'pierre' && Math.hypot(mx - fige[0], my - fige[1]) > Math.max(160, zw * .2)) enStatue();
  });
  const sortir = () => { dedans = false; zone.classList.remove('dedans'); if (mode === 'pierre') enStatue(); };
  zone.addEventListener('pointerleave', sortir);
  zone.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') sortir(); });

  let avant = performance.now();
  (function boucleRegard(t) {
    const dt = Math.min(.05, (t - avant) / 1000); avant = t;
    const vitesse = vx / Math.max(dt, .001); vx = 0;
    if (mode === 'libre') {
      if (dedans) {
        // immobile : elle s'éveille lentement (~8 s). Agité : beaucoup plus vite.
        const agite = Math.min(vitesse, 2000) / 2000;
        regard += dt * (.12 + agite * 1.25);
      } else regard -= dt * .6;
      regard = borne(regard, 0, 1);
      if (dedans) message(regard > .7 ? 'Trop tard, elle te voit !' : regard > .3 ? 'Elle s\'éveille… doucement.' : 'Ne t\'agite pas trop…', regard > .7);
      if (regard >= 1) petrifier();
    }
    if (mode !== 'pierre') placer(mx, my); else placer(fige[0], fige[1]);
    // yeux, pupilles et rayons
    const o = mode === 'pierre' ? 1 : borne((regard - .15) / .5, 0, 1);
    const cible = mode === 'pierre' ? fige : [mx, my];
    yeux.forEach((el, i) => {
      el.style.setProperty('--o', o.toFixed(3));
      const [ex] = oeilXY(i);
      el.style.setProperty('--px', (borne((cible[0] - ex) / (zw * .3), -1, 1) * mw * .043 * .3).toFixed(1) + 'px');
    });
    const ray = mode === 'pierre' ? 1 : borne((regard - .55) / .45, 0, 1);
    zone.classList.toggle('fixe', ray > 0);
    zone.style.setProperty('--ray', ray.toFixed(2));
    rayons.forEach((l, i) => {
      const [ex, ey] = oeilXY(i);
      l.setAttribute('x1', ex); l.setAttribute('y1', ey); l.setAttribute('x2', cible[0] + 2); l.setAttribute('y2', cible[1] + 2);
    });
    requestAnimationFrame(boucleRegard);
  })(avant);

  /* démo : une souris fantôme s'approche, se fait pétrifier, devient statue */
  function demo() {
    if (mode === 'pierre') enStatue();
    mode = 'demo'; regard = 0; zone.classList.add('demo'); demoFaite = true;
    const depart = [zw * .9, zh * .9], arrivee = [ml + mw * .553, mt + mh * .56];
    const t0 = performance.now();
    (function pas(t) {
      if (mode !== 'demo') return;
      const e = (t - t0) / 1000;
      if (e < 1.2) {
        const k = 1 - Math.pow(1 - e / 1.2, 3);
        mx = depart[0] + (arrivee[0] - depart[0]) * k; my = depart[1] + (arrivee[1] - depart[1]) * k;
        message('Regarde ce qui arrive à cette souris…');
      } else if (e < 3.2) {
        const a = (e - 1.2) * 14;                         // elle s'agite sur le visage
        mx = arrivee[0] + Math.sin(a) * zw * .07 + Math.sin(a * 2.3) * zw * .02; my = arrivee[1] + Math.cos(a * 1.4) * zh * .07;
        regard = (e - 1.2) / 2;
        message(regard > .6 ? 'Elle s\'agite… les yeux s\'ouvrent !' : 'Elle s\'agite sur son visage…', regard > .6);
      } else {
        regard = 1; mode = 'libre'; petrifier(); zone.classList.remove('demo');
        message('Pétrifiée.', true);
        demoT = setTimeout(() => { if (mode === 'pierre') { enStatue(); message('À toi. Ne la fixe pas trop longtemps.'); } }, 1500);
        return;
      }
      requestAnimationFrame(pas);
    })(t0);
  }
  function arreterDemo() { mode = 'libre'; regard = 0; zone.classList.remove('demo'); message('Ne t\'agite pas trop…'); }
  new IntersectionObserver(es => {
    if (es[0].isIntersecting && !demoFaite && !CALME) setTimeout(() => { if (!dedans && mode === 'libre') demo(); }, 500);
  }, {threshold: .6}).observe(zone);
  $('#r-demo').addEventListener('click', () => { clearTimeout(demoT); demo(); });
  $('#r-liberer').addEventListener('click', () => {
    statues.innerHTML = ''; compte = 0; $('#r-compte').textContent = '0'; $('#r-pl').textContent = 's'; message('Statues libérées. Pour l\'instant.');
  });

  /* ---------- le film (YouTube chargé seulement au clic) ---------- */
  $('#film-lancer').addEventListener('click', function () {
    const f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/F0CWzE7a0yY?autoplay=1&rel=0&modestbranding=1';
    f.title = 'Méduse, le film';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    this.replaceWith(f);
  });

  /* ---------- styleframes : seulement celles qui existent ---------- */
  const grille = $('#frames-grille');
  [[0, 'plan-01.jpg'], [4, 'plan-05.jpg'], [1, 'plan-02.jpg'], [2, 'plan-03.jpg']].forEach(([i, f]) => {
    const fig = document.createElement('figure'), im = new Image();
    im.alt = PLANS[i].titre; im.loading = 'lazy';
    im.onload = () => { $('#frames').hidden = false; };
    im.onerror = () => fig.remove();
    im.src = DOSSIER + f;
    fig.appendChild(im);
    fig.insertAdjacentHTML('beforeend', `<figcaption>${PLANS[i].titre}<span>Plan ${i + 1}</span></figcaption>`);
    grille.appendChild(fig);
  });

  /* ---------- teaser vertical ---------- */
  const tv = $('#teaser-video');
  tv.addEventListener('loadedmetadata', () => { $('#teaser').hidden = false; });
  tv.src = DOSSIER + 'teaser.mp4';

  /* ---------- couleurs + projets voisins ---------- */
  afficherCouleurs($('#couleurs'), [
    {nom: 'Rouge légende', hex: R, role: 'La version officielle'},
    {nom: 'Noir', hex: N, role: 'Les fonds, les silhouettes'},
    {nom: 'Bleu céramique', hex: B, role: "Le temple d'Athéna"},
    {nom: 'Ocre céramique', hex: O, role: 'Avant les serpents'},
    {nom: 'Crème', hex: C, role: 'Le texte, la fin'}
  ]);
  if (typeof PROJETS !== 'undefined') {
    const k = PROJETS.findIndex(p => p.id === 'meduse');
    const prev = PROJETS[(k - 1 + PROJETS.length) % PROJETS.length], next = PROJETS[(k + 1) % PROJETS.length];
    const v = (q, cls, label) => `<a class="voisin ${cls}" href="${q.id}.html" style="--v-fond:${q.theme.fond};--v-titre:${q.theme.titre};--v-texte:${q.theme.texte}">
      ${q.visuel ? `<img src="${BASE + q.visuel}" alt="" loading="lazy">` : ''}<small>${label}</small><strong>${q.nom}</strong></a>`;
    $('#nav-projets').innerHTML = v(prev, 'precedent', '← Précédent') + v(next, 'suivant', 'Suivant →');
  }
})();
