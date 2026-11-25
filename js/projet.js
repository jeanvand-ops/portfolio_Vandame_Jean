/* =====================================================================
   Construit la page d'un projet à partir de js/projets-data.js
   (le <body> porte data-projet="id" et data-base="../")
   ===================================================================== */
(function () {
  const body = document.body;
  const id = body.dataset.projet, base = body.dataset.base || '';
  const i = PROJETS.findIndex(p => p.id === id);
  if (i < 0) return;
  const p = PROJETS[i];
  const u = chemin => chemin ? base + chemin : '';
  const byId = x => PROJETS.find(q => q.id === x);
  const nn = n => String(n + 1).padStart(2, '0');
  const prev = PROJETS[(i - 1 + PROJETS.length) % PROJETS.length];
  const next = PROJETS[(i + 1) % PROJETS.length];
  const T = p.theme;
  const root = document.documentElement.style;
  // ambiance : si le projet (ou son film) est sombre, la page l'est aussi. On peut forcer avec  ambiance: 'sombre' | 'clair'  dans projets-data.js
  const lumFond = (n => ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000)(parseInt(T.fond.slice(1), 16));
  const sombre = p.ambiance ? p.ambiance === 'sombre' : lumFond < 100;
  document.body.classList.toggle('sombre', sombre);
  const bs = document.body.style;
  bs.setProperty('--p-fond', sombre ? '#0a0a0a' : '#fff'); bs.setProperty('--p-texte', sombre ? '#fff' : '#0a0a0a'); bs.setProperty('--p-titre', sombre ? '#fff' : '#0a0a0a');
  bs.setProperty('--p-accent', '#ff0a14'); bs.setProperty('--p-accent-t', '#000'); root.setProperty('--p-perso', p.couleur);

  const ETOILE = '<svg class="etoile-svg" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 0C54 30 70 46 100 50C70 54 54 70 50 100C46 70 30 54 0 50C30 46 46 30 50 0Z" fill="currentColor"/></svg>';
  const tags = p.role.split(' · ').map(t => `<span>${esc(t)}</span>`).join('');
  const jauges = Object.entries(p.stats || {}).map(([k, v]) =>
    `<div><span>${esc(k)}</span><i>${Array.from({length: 10}, (_, n) => `<b class="${n < v ? 'on' : ''}"></b>`).join('')}</i></div>`).join('');
  const voisin = (q, cls, label) => `
    <a class="voisin ${cls}" href="${q.id}.html" style="--v-fond:#0a0a0a;--v-titre:#fff;--v-texte:#ff0a14">
      ${q.visuel ? `<img src="${u(q.visuel)}" alt="" loading="lazy">` : ''}
      <small>${label}</small><strong>${esc(q.nom)}</strong>
    </a>`;
  const fiche = [['Rôle', p.role], ['Format', p.format], ['Projet', nn(i) + ' / ' + PROJETS.length]]
    .map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('');
  const lum = hex => { const n = parseInt(hex.slice(1), 16); return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000; };
  const nuances = (p.palette || []).map(c =>
    `<button class="nuance" style="background:${c};color:${lum(c) > 140 ? '#000' : '#fff'}" data-c="${c}" aria-label="Copier ${c}">${c}</button>`).join('');
  const inter = p.interaction || {};

  document.getElementById('app').innerHTML = `
    <section class="hero">
      <div>
        <a class="retour" href="${base}projets.html#${p.id}">← Tous les projets</a>
        <div class="num">${nn(i)} / ${PROJETS.length}</div>
        <h1>${esc(p.nom)}</h1>
        <div class="tags">${tags}</div>
        <p class="desc">${esc(p.desc)}</p>
        <p class="format">${esc(p.format)}</p>
        <div class="jauges">${jauges}</div>
      </div>
      <div class="hero-perso">${p.perso ? `<img id="hero-img" src="${u(p.perso)}.jpg" alt="">` : ''}${ETOILE}</div>
    </section>
    <section class="stage" aria-labelledby="st">
      <div class="stage-tete"><h2 id="st">${esc(inter.titre || 'À toi de jouer')}</h2><p class="aide">${esc(inter.aide || '')}</p></div>
      <div class="corps" id="corps"></div>
    </section>
    ${p.video ? `<section class="video" id="video" ${p.video === 'embed' ? '' : 'hidden'}><h2>La vidéo</h2><div id="video-zone"></div></section>` : ''}
    <section class="infos-bas">
      <div><h2>Palette (clic = copie le code)</h2><div class="palette">${nuances}</div></div>
      <div class="fiche-bas"><h2>Fiche</h2><dl>${fiche}</dl></div>
    </section>
    <nav class="nav-projets" aria-label="Autres projets">
      ${voisin(prev, 'precedent', '← Précédent')}${voisin(next, 'suivant', 'Suivant →')}
    </nav>
    <footer class="pied"><span>Jean Vandame, Paris</span><a href="mailto:jeanvand@gmail.com">jeanvand@gmail.com</a></footer>`;

  /* personnage animé si un GIF existe */
  if (p.perso) {
    const g = new Image();
    g.onload = () => { const h = document.getElementById('hero-img'); if (h) h.src = g.src; };
    g.src = u(p.perso) + '.gif';
  }
  /* vidéo */
  if (p.video && p.video !== 'embed') {
    const v = document.createElement('video');
    v.controls = true; v.playsInline = true; v.preload = 'metadata';
    if (p.visuel) v.poster = u(p.visuel);
    v.addEventListener('loadedmetadata', () => { document.getElementById('video').hidden = false; });
    v.src = u(p.video);
    document.getElementById('video-zone').appendChild(v);
  } else if (p.video === 'embed' && p.embed) {
    document.getElementById('video-zone').innerHTML = `<iframe src="${esc(p.embed)}" allowfullscreen title="${esc(p.nom)}"></iframe>`;
  }
  /* palette : copie */
  document.querySelectorAll('.nuance').forEach(b => b.addEventListener('click', () => {
    const c = b.dataset.c;
    (navigator.clipboard ? navigator.clipboard.writeText(c) : Promise.reject()).catch(() => {});
    b.textContent = 'Copié !'; setTimeout(() => { b.textContent = c; }, 900);
  }));
  /* l'interaction du projet */
  const corps = document.getElementById('corps');
  const m = MODULES[inter.type];
  if (m) { try { m(corps, p, {u, byId}); } catch (e) { corps.textContent = ''; console.error(e); } }
})();
