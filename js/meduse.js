/* =====================================================================
   Page MÉDUSE
   Les images du film se mettent dans img/meduse/ :
     plan-01.jpg  Persée triomphant      plan-05.jpg  Le temple d'Athéna
     plan-02.jpg  Une vérité effacée     (tu peux ajouter plan-04, 06, 07, 08)
     plan-03.jpg  Avant les serpents     teaser.mp4   le teaser vertical
   Tant qu'une image manque, le plan s'affiche en version typographique.
   ===================================================================== */
(function () {
  const BASE = '../';
  const CALME = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => document.querySelector(s);
  const DOSSIER = BASE + 'img/meduse/';

  /* ---------- les 8 plans du récit ---------- */
  const N = '#0a0a0a', R = '#ff0a14', B = '#3b8fe3', O = '#eba552', C = '#f1ebe0';
  const PLANS = [
    {titre: 'Persée triomphant', etat: 'La légende officielle', fond: N, encre: R, img: 'plan-01.jpg', secours: BASE + 'img/visuels/img-meduse.jpg',
     texte: "D'un coup de glaive triomphant, l'illustre Persée tranche la tête de l'horrible Méduse, délivrant le monde de l'abomination."},
    {titre: 'Une vérité effacée', etat: "La version qu'on ne raconte pas", fond: R, encre: N, img: 'plan-02.jpg', grec: 'ἀλήθεια', yeux: true,
     texte: 'Mais derrière cette victoire se cache une vérité que les dieux ont voulu effacer…'},
    {titre: 'Avant les serpents', etat: "La version qu'on ne raconte pas", fond: O, encre: N, img: 'plan-03.jpg', grec: 'Μέδουσα', meandre: true,
     texte: 'Bien avant les serpents, Méduse était une mortelle dont la grâce émerveillait la Grèce.'},
    {titre: 'La convoitise', etat: "La version qu'on ne raconte pas", fond: B, encre: N, img: 'plan-04.jpg', grec: 'Ποσειδῶν', meandre: true,
     texte: "Jusqu'au jour où sa beauté attira la convoitise du dieu des mers…"},
    {titre: "Le temple d'Athéna", etat: "La version qu'on ne raconte pas", fond: N, encre: B, img: 'plan-05.jpg', grec: 'ναός', meandre: true, clair: true,
     texte: "Dans le temple d'Athéna, Poséidon lui imposa son désir, étouffant son refus sur le marbre."},
    {titre: "La colère d'Athéna", etat: "La version qu'on ne raconte pas", fond: B, encre: N, img: 'plan-06.jpg', grec: 'Ἀθηνᾶ', meandre: true,
     texte: "Consumée par la colère de voir son temple profané, Athéna fit de Méduse la cible de son courroux, changeant sa beauté en abomination."},
    {titre: 'Le monstre', etat: "La version qu'on ne raconte pas", fond: N, encre: R, img: 'plan-07.jpg', grec: 'Γοργώ',
     texte: 'Celle qui fut blessée devint celle que le monde craignait.'},
    {titre: 'Ses sœurs de silence', etat: 'Sa version', fond: C, encre: N, img: 'plan-08.jpg', grec: 'Μέδουσα', meandre: true,
     texte: "L'Histoire retiendra la gloire du vainqueur, mais ses sœurs de silence n'ont jamais oublié celle qui fut brisée."}
  ];
  const nn = i => String(i + 1).padStart(2, '0');
  const cadre = $('#rb-cadre'), frise = $('#rb-frise'), colle = $('.rb-colle'), section = $('#rebours');
  const YEUX = [[12, 18, -8], [30, 10, 6], [70, 14, -4], [86, 30, 10], [8, 62, 4], [24, 80, -10], [62, 84, 8], [84, 72, -6], [46, 22, 0]];

  PLANS.forEach((p, i) => {
    const d = document.createElement('div');
    d.className = 'plan' + (p.clair ? ' clair' : '');
    d.style.setProperty('--fond', p.fond); d.style.setProperty('--encre', p.encre);
    d.innerHTML = (p.yeux ? `<div class="yeux">${YEUX.map(([x, y, r]) => `<i style="left:${x}%;top:${y}%;transform:rotate(${r}deg)"></i>`).join('')}</div>` : '')
      + (p.grec ? `<span class="grec" lang="el">${p.grec}</span>` : '')
      + (p.meandre ? '<div class="meandre"></div>' : '');
    cadre.appendChild(d);
    // image du film si elle existe (sinon image de secours, sinon version typo)
    const essai = (src, suite) => { const im = new Image(); im.alt = p.titre; im.onload = () => d.appendChild(im); im.onerror = suite; im.src = src; };
    essai(DOSSIER + p.img, () => p.secours && essai(p.secours, () => {}));
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = nn(i); b.setAttribute('role', 'tab'); b.setAttribute('aria-label', `Plan ${i + 1} : ${p.titre}`);
    b.addEventListener('click', () => allerA(i));
    frise.appendChild(b);
  });
  const plans = [...cadre.children], boutons = [...frise.children];

  let cur = -1, tRemb;
  function montre(i) {
    if (i === cur) return;
    const avant = cur; cur = i;
    const p = PLANS[i];
    plans.forEach((el, j) => el.classList.toggle('on', j === i));
    boutons.forEach((el, j) => { el.classList.toggle('on', j === i); el.setAttribute('aria-selected', j === i); });
    colle.style.setProperty('--rb-fond', p.fond); colle.style.setProperty('--rb-encre', p.encre);
    $('#rb-num').textContent = nn(i);
    $('#rb-etat').textContent = p.etat;
    $('#rb-titre').textContent = 'Plan ' + nn(i) + ' · ' + p.titre;
    $('#rb-texte').textContent = '« ' + p.texte + ' »';
    // on passe de la légende à « l'autre version » : effet de rembobinage
    if (avant === 0 && i > 0 && !CALME) {
      colle.classList.add('rembobine'); clearTimeout(tRemb);
      tRemb = setTimeout(() => colle.classList.remove('rembobine'), 900);
    }
  }
  function progression() {
    const r = section.getBoundingClientRect();
    const course = r.height - colle.offsetHeight;
    const p = Math.min(Math.max(-r.top / course, 0), .9999);
    montre(Math.floor(p * PLANS.length));
  }
  function allerA(i) {
    const course = section.offsetHeight - colle.offsetHeight;
    const haut = section.getBoundingClientRect().top + scrollY;
    scrollTo({top: haut + course * (i + .5) / PLANS.length, behavior: CALME ? 'auto' : 'smooth'});
  }
  frise.addEventListener('keydown', e => {
    const d = {ArrowRight: 1, ArrowLeft: -1}[e.key];
    if (!d) return;
    e.preventDefault(); const n = Math.min(Math.max(cur + d, 0), PLANS.length - 1); allerA(n); boutons[n].focus();
  });
  addEventListener('scroll', () => requestAnimationFrame(progression), {passive: true});
  addEventListener('resize', progression);
  montre(0); progression();

  /* ---------- le reflet du bouclier ---------- */
  const zone = $('#bouclier');
  let x = .62, y = .42, tx = x, ty = y, touche = false;
  const rayon = () => zone.style.setProperty('--r', Math.round(Math.max(70, zone.clientWidth * (innerWidth < 860 ? .22 : .15))) + 'px');
  new ResizeObserver(rayon).observe(zone); rayon();
  zone.addEventListener('pointermove', e => {
    const b = zone.getBoundingClientRect(); touche = true;
    tx = (e.clientX - b.left) / b.width; ty = (e.clientY - b.top) / b.height;
  });
  zone.addEventListener('pointerdown', e => zone.setPointerCapture && zone.setPointerCapture(e.pointerId));
  zone.addEventListener('keydown', e => {
    const k = {ArrowLeft: [-.05, 0], ArrowRight: [.05, 0], ArrowUp: [0, -.07], ArrowDown: [0, .07]}[e.key];
    if (!k) return; e.preventDefault(); touche = true;
    tx = Math.min(Math.max(tx + k[0], 0), 1); ty = Math.min(Math.max(ty + k[1], 0), 1);
  });
  (function boucle(t) {
    if (!touche && !CALME) { tx = .58 + .14 * Math.sin(t / 1600); ty = .42 + .14 * Math.cos(t / 2100); }
    x += (tx - x) * .14; y += (ty - y) * .14;
    zone.style.setProperty('--x', (x * 100).toFixed(2) + '%');
    zone.style.setProperty('--y', (y * 100).toFixed(2) + '%');
    requestAnimationFrame(boucle);
  })(0);

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
  const FRAMES = [[0, 'plan-01.jpg'], [4, 'plan-05.jpg'], [1, 'plan-02.jpg'], [2, 'plan-03.jpg']];
  const grille = $('#frames-grille');
  FRAMES.forEach(([i, f]) => {
    const fig = document.createElement('figure');
    const im = new Image(); im.alt = PLANS[i].titre; im.loading = 'lazy';
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

  /* ---------- palette + projets voisins ---------- */
  const PAL = [['Rouge légende', R], ['Noir', N], ['Bleu céramique', B], ['Ocre céramique', O]];
  $('#palette').innerHTML = PAL.map(([n, c]) =>
    `<button class="nuance" style="background:${c};color:${c === O ? '#000' : '#fff'}" data-c="${c}" aria-label="Copier ${n} ${c}">${c}</button>`).join('');
  document.querySelectorAll('.nuance').forEach(b => b.addEventListener('click', () => {
    const c = b.dataset.c; navigator.clipboard && navigator.clipboard.writeText(c).catch(() => {});
    b.textContent = 'Copié !'; setTimeout(() => { b.textContent = c; }, 900);
  }));
  if (typeof PROJETS !== 'undefined') {
    const k = PROJETS.findIndex(p => p.id === 'meduse');
    const prev = PROJETS[(k - 1 + PROJETS.length) % PROJETS.length], next = PROJETS[(k + 1) % PROJETS.length];
    const v = (q, cls, label) => `<a class="voisin ${cls}" href="${q.id}.html" style="--v-fond:${q.theme.fond};--v-titre:${q.theme.titre};--v-texte:${q.theme.texte}">
      ${q.visuel ? `<img src="${BASE + q.visuel}" alt="" loading="lazy">` : ''}<small>${label}</small><strong>${q.nom}</strong></a>`;
    $('#nav-projets').innerHTML = v(prev, 'precedent', '← Précédent') + v(next, 'suivant', 'Suivant →');
  }
})();
