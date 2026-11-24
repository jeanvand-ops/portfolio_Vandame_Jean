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

  // le vase dessiné par Jean (img/meduse/vase.svg), 1194 x 1842
  const VW = 1194, VH = 1842, VC = 599, VR = 571;      // largeur, hauteur, axe, rayon du corps
  const CORPS = ['M829.26,1836.6q-226.15,2.69-452.31,5.37,9.34-21.29,18.68-42.58,204.29,2.2,408.59,4.41Q816.74,1820.2,829.26,1836.6Z', 'M23.94,852.05c15.15,193.92,54.79,347.43,89.21,453,50.29,154.2,99.83,237.92,114.07,261.39,57.7,95.08,120.49,164.54,167.98,210.68q207.54-1.75,415.08-3.5c37.15-35.59,87.31-89.1,136.22-161.62,47.37-70.24,72.84-130.76,121.84-248.94,3.72-8.98,7.94-19.78,13.53-34.6,67.42-178.7,81.31-314.46,84.55-350.7,2.92-32.61,5.67-79.15,4.08-135.67Q597.22,847.07,23.94,852.05Z', 'M835.36,604.68c-64.92,7.43-133.19,13.47-204.57,17.57-97.28,5.6-189.46,6.99-275.81,5.4-60.63,19.41-137.1,51.09-216.86,104.25-42.82,28.54-78.87,58.13-108.72,85.87q242.33-3.05,484.63-3.59,322.09-.72,644.22,3.01c-43.96-39.19-82.61-67.08-109.9-85.37-22.9-15.35-38.05-25.04-126.64-76.27C883.8,633.62,853.56,615.61,835.36,604.68Z', 'M372,399.4q-27.07-17.24-54.14-34.47,278.95-1.07,557.9-2.13-22.27,19.37-44.55,38.75,1.25,87.24,2.49,174.49c-71.25,8.12-146.42,14.74-225.23,19.24-85.13,4.86-166.38,6.76-243.27,6.46Q368.6,500.57,372,399.4Z', 'M318.48,270.74q275.63-.77,551.26-1.54,35.38,27.84,70.76,55.68-338.43,7.26-676.85,14.51Q291.06,305.06,318.48,270.74Z'].map(d => new Path2D(d));     // socle, panse, épaule, col, lèvre
  const ANSES = ['M55.21,281.27c.36-114.75,36.1-200.6,90.83-214.87,3.6-.93,20.22-4.93,38.14,1.48,55,19.69,80.74,122.61,68.39,253.77q22.81-30.44,45.61-60.89c2.32-128.47-38.68-225.79-105.45-248.3-45.14-15.23-89.54,7.99-92.57,9.63C-11.16,82.32-5.74,308.7,5.88,648.51c2.24,65.53,5.51,119.37,7.95,155q25.65-25.8,51.31-51.6-2.88-40.68-5.1-82.13C52.87,535.27,51.69,405.61,55.21,281.27Z', 'M1146.63,85.37c-20.99-42.12-45.03-68.41-77.12-79.44-9.69-3.33-37.33-11.17-67.84-.57-6.11,2.12-29.35,10.9-53.66,43.16-51.54,68.36-61.36,180.41-63.36,207.84q29.22,24.12,58.44,48.25c-.99-16.26-6.11-110.06,19.46-173.89,7.8-19.46,19.39-38.5,37.79-52.53,17.05-13,30.42-14.44,34.81-14.73,0,0,12.34-.82,25.06,4.23,18.01,7.15,70.44,54.94,84,205.97,5.01,55.89,2.89,105.69-8.13,193.39-8.37,66.64-22.3,158.5-46.59,268.13q30.78,25.87,61.56,51.73c20.79-160.48,34.03-308.17,42.29-441.24C1194.28,330.66,1201.43,195.34,1146.63,85.37Z'].map(d => new Path2D(d));
  const BANDE_Y = 905;                                  // haut de la frise des 8 plans (unités du dessin)
  let W = 1, H = 1, RR = 1, S = 1, ox = 0, oy = 0, D = 1, sale = true;
  const masque = document.createElement('canvas'), couche = document.createElement('canvas');
  const mk = masque.getContext('2d'), cc = couche.getContext('2d');
  const Xs = x => ox + x * S, Ys = y => oy + y * S;
  function taille() {
    const b = cv.getBoundingClientRect(); D = Math.min(devicePixelRatio || 1, 2);
    W = b.width; H = b.height;
    for (const c of [cv, masque, couche]) { c.width = Math.round(W * D); c.height = Math.round(H * D); }
    ctx.setTransform(D, 0, 0, D, 0, 0);
    S = Math.min((H - 28) / VH, (W * .96) / VW); RR = VR * S;
    ox = (W - VW * S) / 2; oy = (H - 28 - VH * S) / 2;
    mk.setTransform(D, 0, 0, D, 0, 0); mk.clearRect(0, 0, W, H); mk.fillStyle = '#000';   // silhouette du vase (sans les anses)
    mk.save(); mk.translate(ox, oy); mk.scale(S, S); CORPS.forEach(p => mk.fill(p)); mk.restore();
    sale = true;
  }
  function dessiner(rot) {
    ctx.clearRect(0, 0, W, H);
    // anses dorées
    const or = ctx.createLinearGradient(0, Ys(0), 0, Ys(830));
    or.addColorStop(0, '#f6dc8a'); or.addColorStop(.5, '#d6a43c'); or.addColorStop(1, '#9c6a1c');
    ctx.save(); ctx.translate(ox, oy); ctx.scale(S, S);
    ctx.fillStyle = or; ANSES.forEach(p => ctx.fill(p)); ctx.restore();
    // le corps, dans une couche à part pour le découper à la forme du vase
    cc.setTransform(D, 0, 0, D, 0, 0); cc.globalCompositeOperation = 'source-over'; cc.clearRect(0, 0, W, H);
    cc.fillStyle = '#111'; cc.fillRect(0, 0, W, H);
    const RB = RR * 1.45, bt = Ys(BANDE_Y), bh = SH / K * RB, xc0 = Xs(VC);   // RB : la frise est vue un peu plus à plat, pour que les plans restent grands
    for (let px = -RR; px < RR; px += 1) {                // la frise des 8 plans, enroulée autour du cylindre
      const xc = px + .5, q = Math.sqrt(Math.max(RB * RB - xc * xc, .01));
      let u = ((rot + Math.asin(borne(xc / RB, -1, 1))) * K) % SW; if (u < 0) u += SW;
      let sw = Math.max(1, K / q); if (u + sw > SW) sw = SW - u;
      cc.drawImage(bande, u, 0, Math.max(sw, .5), SH, xc0 + px, bt, 1.5, bh);
    }
    cc.fillStyle = O;                                     // rayons ocre en bas de la panse (tournent avec le vase)
    for (let k = 0; k < 28; k++) {
      const f = k * 2 * Math.PI / 28 - rot, c = Math.cos(f);
      if (c <= .04) continue;
      const xb = Math.sin(f) * .96 * RR, xa = Math.sin(f) * .42 * RR, h = .05 * c * RR;
      cc.beginPath(); cc.moveTo(xc0 + xb - h, Ys(1800)); cc.lineTo(xc0 + xb + h, Ys(1800)); cc.lineTo(xc0 + xa, Ys(1530)); cc.fill();
    }
    for (const [y, h] of [[1590, 8]]) cc.fillRect(0, Ys(y), W, h * S);   // filet ocre au-dessus des rayons
    const l = cc.createLinearGradient(Xs(VC - VR), 0, Xs(VC + VR), 0);   // volume : ombres sur les côtés, reflet à gauche
    l.addColorStop(0, 'rgba(0,0,0,.7)'); l.addColorStop(.22, 'rgba(0,0,0,.1)'); l.addColorStop(.33, 'rgba(255,255,255,.2)');
    l.addColorStop(.4, 'rgba(255,255,255,0)'); l.addColorStop(.72, 'rgba(0,0,0,.05)'); l.addColorStop(1, 'rgba(0,0,0,.75)');
    cc.fillStyle = l; cc.fillRect(Xs(VC - VR) - 60, 0, 2 * RR + 120, H);
    cc.setTransform(1, 0, 0, 1, 0, 0); cc.globalCompositeOperation = 'destination-in'; cc.drawImage(masque, 0, 0);
    ctx.drawImage(couche, 0, 0, W, H);
    ctx.save(); ctx.translate(ox, oy); ctx.scale(S, S);   // fin liseré clair autour des formes
    ctx.strokeStyle = 'rgba(241,235,224,.25)'; ctx.lineWidth = 1.5 / S; CORPS.forEach(p => ctx.stroke(p)); ctx.restore();
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
  let zoom = 1;                                          // on se rapproche d'elle en scrollant
  const OX = (OEIL[0][0] + OEIL[1][0]) / 2, OY = (OEIL[0][1] + OEIL[1][1]) / 2;
  const oeilXY = i => {
    const ox = ml + OX * mw, oy = mt + OY * mh;
    return [ox + (ml + OEIL[i][0] * mw - ox) * zoom, oy + (mt + OEIL[i][1] * mh - oy) * zoom];
  };
  media.style.transformOrigin = (OX * 100) + '% ' + (OY * 100) + '%';
  const section = zone.parentElement, fuiteI = $('#rf-pct');
  let prog = 0, enJeu = false, echappe = false, parDemo = false;
  function suivreScroll() {
    const r = section.getBoundingClientRect(), course = r.height - zone.offsetHeight, haut = zone.offsetTop - section.offsetTop;
    const barre = zone.getBoundingClientRect().top;
    prog = borne((barre - r.top) / Math.max(course, 1), 0, 1);
    enJeu = r.top <= barre + 1 && r.bottom >= barre + zone.offsetHeight - 1 && prog < .985;
    zoom = 1 + prog * 1.7;
    media.style.transform = `scale(${zoom.toFixed(3)})`;
    zone.style.setProperty('--p', prog.toFixed(3));
    fuiteI.textContent = Math.round(prog * 100) + ' %';
    if (prog >= .985 && !echappe && mode === 'libre') { echappe = true; regard = 0; message('Tu lui as échappé ! Pour cette fois.'); }
    if (prog < .9) echappe = false;
  }
  // pétrifié : impossible de scroller pendant quelques secondes
  const bloque = e => { if (mode === 'pierre' && !parDemo) e.preventDefault(); };
  addEventListener('wheel', bloque, {passive: false});
  addEventListener('touchmove', bloque, {passive: false});
  addEventListener('keydown', e => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key)) bloque(e); });

  function message(t, alerte) { if (msg.textContent !== t) msg.textContent = t; msg.classList.toggle('alerte', !!alerte); }
  function placer(x, y) { curseur.style.transform = `translate(${x}px,${y}px)`; }
  function pos(e) { const b = zone.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; }

  function petrifier() {
    mode = 'pierre'; fige = [mx, my]; compte++;
    curseur.classList.add('pierre'); zone.classList.add('pierre');
    if (!parDemo) zone.classList.add('verrou');
    if (!CALME) { flash.classList.remove('on'); void flash.offsetWidth; flash.classList.add('on'); zone.classList.remove('tremble'); void zone.offsetWidth; zone.classList.add('tremble'); }
    $('#r-compte').textContent = compte; $('#r-pl').textContent = compte > 1 ? 's' : '';
    let n = 3; message('Pétrifiée ! Bloquée ' + n + ' s…', true);
    clearInterval(reprise);
    reprise = setInterval(() => {
      n--;
      if (mode !== 'pierre') return clearInterval(reprise);
      if (n > 0) return message('Pétrifiée ! Bloquée ' + n + ' s…', true);
      clearInterval(reprise); if (mode === 'pierre') enStatue();
    }, 1000);
  }
  let reprise;
  function enStatue() {
    if (!fige) return;
    const s = document.createElement('div'); s.className = 'statue';
    s.style.left = (fige[0] / zw * 100) + '%'; s.style.top = (fige[1] / zh * 100) + '%';
    s.style.setProperty('--rot', (Math.random() * 30 - 15).toFixed(1) + 'deg');
    s.innerHTML = curseur.querySelector('svg').outerHTML;
    statues.appendChild(s);
    while (statues.children.length > 14) statues.firstChild.remove();
    curseur.classList.remove('pierre'); zone.classList.remove('pierre', 'fixe', 'verrou');
    mode = 'libre'; fige = null; regard = 0; parDemo = false;
    message(compte === 1 ? 'Une statue de plus. Scrolle pour fuir !' : 'Encore une. Scrolle pour fuir !', true);
  }

  zone.addEventListener('pointerenter', e => { if (mode === 'demo') arreterDemo(); dedans = true; zone.classList.add('dedans'); [mx, my] = pos(e); });
  zone.addEventListener('pointerdown', e => { if (mode === 'demo') arreterDemo(); dedans = true; zone.classList.add('dedans'); [mx, my] = pos(e); zone.setPointerCapture && zone.releasePointerCapture && zone.releasePointerCapture(e.pointerId); });
  zone.addEventListener('pointermove', e => {
    if (mode === 'demo') arreterDemo();
    const [x, y] = pos(e); vx += Math.hypot(x - mx, y - my); mx = x; my = y; dedans = true; zone.classList.add('dedans');
  });
  const sortir = () => { dedans = false; zone.classList.remove('dedans'); };
  zone.addEventListener('pointerleave', sortir);
  zone.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') sortir(); });

  let avant = performance.now();
  (function boucleRegard(t) {
    const dt = Math.min(.05, (t - avant) / 1000); avant = t;
    const vitesse = vx / Math.max(dt, .001); vx = 0;
    suivreScroll();
    if (mode === 'libre') {
      if (dedans && enJeu) {
        // immobile : elle s'éveille lentement. Agité : beaucoup plus vite. Plus on avance, plus c'est dur.
        const agite = Math.min(vitesse, 2000) / 2000;
        regard += dt * (.12 + prog * .25 + agite * 1.25) * (1 + prog * 1.2);
      } else regard -= dt * .6;
      regard = borne(regard, 0, 1);
      if (dedans && enJeu) message(regard > .7 ? 'Trop tard, elle te voit !' : regard > .3 ? 'Elle s\'éveille… doucement.' : 'Ne t\'agite pas trop…', regard > .7);
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
        regard = 1; mode = 'libre'; parDemo = true; petrifier(); zone.classList.remove('demo');
        message('Pétrifiée.', true);
        demoT = setTimeout(() => { if (mode === 'pierre') { enStatue(); message('À toi. Ne la fixe pas trop longtemps.'); } }, 1500);
        return;
      }
      requestAnimationFrame(pas);
    })(t0);
  }
  function arreterDemo() { mode = 'libre'; regard = 0; zone.classList.remove('demo'); message('Ne t\'agite pas trop…'); }
  new IntersectionObserver(es => {
    if (es[0].isIntersecting && !demoFaite && !CALME) setTimeout(() => { if (!dedans && mode === 'libre' && prog < .1) demo(); }, 400);
  }, {threshold: .7}).observe(zone);
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
