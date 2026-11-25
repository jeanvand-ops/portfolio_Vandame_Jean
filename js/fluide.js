/* Fluidité & détails : scroll avec inertie, bandeau, étoiles au clic,
   barre de progression, sommaire latéral, flèches du clavier. */
(() => {
  const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tactile = matchMedia('(pointer: coarse)').matches;
  const est = s => document.querySelector(s);
  const projet = document.body.classList.contains('page-projet');

  /* ---------- 1. Scroll avec inertie (souris uniquement) ---------- */
  if (!reduit && !tactile) {
    let cible = scrollY, pos = scrollY, actif = false, auto = false;
    const max = () => document.documentElement.scrollHeight - innerHeight;
    const boucle = () => {
      pos += (cible - pos) * 0.11;
      if (Math.abs(cible - pos) < 0.4) { pos = cible; actif = false; }
      auto = true;
      scrollTo({top: pos, behavior: 'instant'});
      auto = false;
      if (actif) requestAnimationFrame(boucle);
    };
    addEventListener('scroll', () => { if (!auto && !actif) { cible = pos = scrollY; } }, {passive: true});
    addEventListener('wheel', e => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey) return;
      /* zones qui défilent seules (listes, vidéos) : on laisse faire */
      for (let n = e.target; n && n !== document.body; n = n.parentElement) {
        const st = getComputedStyle(n);
        if (/(auto|scroll)/.test(st.overflowY) && n.scrollHeight > n.clientHeight) return;
      }
      e.preventDefault();
      const k = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? innerHeight : 1;
      cible = Math.max(0, Math.min(max(), cible + e.deltaY * k));
      if (!actif) { pos = scrollY; actif = true; requestAnimationFrame(boucle); }
    }, {passive: false});
  }

  /* ---------- 2. Bandeau rouge défilant (accueil) ---------- */
  const zoomIntro = est('.intro-zoom');
  if (zoomIntro && !projet) {
    const mots = ['Motion design', 'Direction artistique', 'Paris', 'Titrage', 'Storytelling', 'Ouvert aux projets'];
    const etoile = '<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#etoile"/></svg>';
    const ligne = mots.map(m => `<span>${m}</span>${etoile}`).join('');
    const b = document.createElement('div');
    b.className = 'bandeau-cadre';
    b.setAttribute('aria-hidden', 'true');
    b.innerHTML = `<div class="bandeau"><div class="bandeau-piste">${ligne}${ligne}${ligne}${ligne}</div></div>`;
    zoomIntro.parentNode.insertBefore(b, zoomIntro);
  }

  /* ---------- 3. Étoiles au clic ---------- */
  if (!reduit) {
    addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      for (let i = 0; i < 7; i++) {
        const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        s.setAttribute('viewBox', '0 0 100 100');
        s.innerHTML = '<use href="#etoile"/>';
        s.setAttribute('class', 'burst');
        const t = 9 + Math.random() * 13;
        s.style.cssText = `left:${e.clientX - t / 2}px;top:${e.clientY - t / 2}px;width:${t}px;height:${t}px`;
        document.body.appendChild(s);
        const a = (i / 7) * Math.PI * 2 + Math.random() * .6, d = 34 + Math.random() * 46;
        s.animate([
          {transform: 'translate(0,0) rotate(0) scale(.2)', opacity: 1},
          {transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) rotate(${Math.random() * 240 - 120}deg) scale(1)`, opacity: 0}
        ], {duration: 650 + Math.random() * 250, easing: 'cubic-bezier(.2,.7,.2,1)'}).onfinish = () => s.remove();
      }
    }, {passive: true});
  }

  if (!projet) return;

  /* ---------- 4. Barre de progression ---------- */
  const barre = document.createElement('div');
  barre.className = 'progres';
  barre.innerHTML = '<i></i>';
  document.body.appendChild(barre);
  const bi = barre.firstChild;
  let att = false;
  const maj = () => {
    att = false;
    const m = document.documentElement.scrollHeight - innerHeight;
    bi.style.transform = `scaleX(${m > 0 ? Math.min(1, scrollY / m) : 0})`;
  };
  addEventListener('scroll', () => { if (!att) { att = true; requestAnimationFrame(maj); } }, {passive: true});
  addEventListener('resize', maj);
  maj();

  /* ---------- 5. Sommaire latéral (sections [data-nav]) ---------- */
  const monter = () => {
    const secs = [...document.querySelectorAll('[data-nav]')].filter(s => !s.hidden);
    if (secs.length < 2) return;
    const nav = document.createElement('nav');
    nav.className = 'sommaire';
    nav.setAttribute('aria-label', 'Sommaire de la page');
    nav.innerHTML = secs.map((s, i) => `<a href="#" data-i="${i}"><span>${s.dataset.nav}</span><i></i></a>`).join('');
    document.body.appendChild(nav);
    const liens = [...nav.querySelectorAll('a')];
    liens.forEach((a, i) => a.addEventListener('click', e => {
      e.preventDefault();
      const y = secs[i].getBoundingClientRect().top + scrollY - (i === 0 ? 0 : 64);
      scrollTo({top: y, behavior: reduit ? 'auto' : 'smooth'});
    }));
    let cadre = 0;
    const suivi = () => {
      cadre = 0;
      let cur = 0;
      secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .45) cur = i; });
      liens.forEach((a, i) => a.classList.toggle('on', i === cur));
    };
    addEventListener('scroll', () => { if (!cadre) cadre = requestAnimationFrame(suivi); }, {passive: true});
    suivi();
  };
  /* les pages génériques se construisent après ce script : on attend un instant */
  if (document.querySelector('[data-nav]')) monter(); else addEventListener('load', monter);

  /* ---------- 6. Flèches ←/→ : projet précédent / suivant ---------- */
  if (typeof PROJETS !== 'undefined') {
    const id = location.pathname.split('/').pop().replace('.html', '');
    const i = PROJETS.findIndex(p => p.id === id);
    if (i > -1) addEventListener('keydown', e => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (/^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable) return;
      const q = e.key === 'ArrowLeft' ? PROJETS[(i + PROJETS.length - 1) % PROJETS.length]
              : e.key === 'ArrowRight' ? PROJETS[(i + 1) % PROJETS.length] : null;
      if (q) location.href = q.id + '.html';
    });
  }
})();
