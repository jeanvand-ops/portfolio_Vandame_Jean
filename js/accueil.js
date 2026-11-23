/* Page d'accueil : mur de projets (parallaxe souris) et zoom au scroll */
/* ---- Liste des visuels du mur (ordre libre) ---- */
const MUR = [
  ['meduse','Méduse'],['qualbo','Qualbo'],['monsieur','Monsieur'],['carton-tv','Carton TV'],
  ['uma','UMÀ'],['toid','TOID'],['aquarium','Aquarium'],[null,'Play 4 Life','play4life'],
  ['bose','Bose'],['carton-foot','Carton Foot'],['qonto','Qonto'],['scrap','SCRAP']
];
const mur = document.getElementById('mur');
const total = 30; // nombre de tuiles, la liste se répète
for (let i = 0; i < total; i++) {
  const [id, nom, lien] = MUR[i % MUR.length];
  const a = document.createElement('a');
  a.className = 'tuile' + (id ? '' : ' vide');
  a.href = 'projets.html#' + (lien || id);
  a.addEventListener('click', e => choisirTuile(e, a));
  a.style.animationDelay = (Math.random() * .6).toFixed(2) + 's';
  a.innerHTML = id
    ? `<img src="img/visuels/img-${id}.jpg" alt="" loading="${i < 14 ? 'eager' : 'lazy'}"><span>${nom}</span>`
    : `<svg aria-hidden="true"><use href="#etoile"/></svg><span>${nom}</span>`;
  a.setAttribute('aria-label', nom);
  if (i >= MUR.length) a.tabIndex = -1;
  mur.appendChild(a);
}

const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Clic sur une tuile : elle sort du mur et file vers « Choisis ton projet » ---- */
function choisirTuile(e, a) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
  e.preventDefault();
  try { sessionStorage.setItem('depuis-mur', '1'); } catch (err) {}
  if (calme) { location.href = a.href; return; }
  // une copie de la tuile s'envole vers l'endroit où sera le grand perso
  const r = a.getBoundingClientRect();
  const vol = document.createElement('div');
  vol.className = 'tuile-vol' + (a.classList.contains('vide') ? ' vide' : '');
  vol.innerHTML = a.querySelector('img') ? `<img src="${a.querySelector('img').src}" alt="">` : a.querySelector('svg').outerHTML;
  Object.assign(vol.style, {left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px'});
  document.body.appendChild(vol);
  a.style.visibility = 'hidden';
  document.body.classList.add('choix');
  const cote = Math.min(innerHeight * .62, innerWidth * (innerWidth < 860 ? .8 : .42));
  const x = innerWidth < 860 ? (innerWidth - cote) / 2 : innerWidth * .5 - cote - 30, y = Math.max(140, (innerHeight - cote) / 2);
  vol.animate([
    {left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', transform: 'rotate(-6deg)'},
    {offset: .55, transform: 'rotate(4deg) scale(1.05)'},
    {left: x + 'px', top: y + 'px', width: cote + 'px', height: cote + 'px', transform: 'rotate(0deg)'}
  ], {duration: 650, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'forwards'});
  vol.style.viewTransitionName = 'perso';     // la copie se transforme en grand perso sur la page suivante
  setTimeout(() => { location.href = a.href; }, 680);
}

/* ---- Parallaxe du mur à la souris (et dérive lente sur mobile) ---- */
if (!calme) {
  let cx = 0, cy = 0, tx = 0, ty = 0, souris = false;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    souris = true;
    tx = (e.clientX / innerWidth - .5) * -2;
    ty = (e.clientY / innerHeight - .5) * -2;
  });
  (function boucle(t) {
    if (!souris) { tx = Math.sin(t / 3200) * .8; ty = Math.cos(t / 4100) * .6; }
    cx += (tx - cx) * .06; cy += (ty - cy) * .06;
    const dy = Math.min(scrollY, innerHeight) * .25;
    mur.style.transform = `translate(calc(-50% + ${cx * 7}vw), calc(-50% + ${cy * 7}vh - ${dy}px)) rotate(-6deg)`;
    requestAnimationFrame(boucle);
  })(0);
}

/* ---- Zoom au scroll ---- */
const zooms = [...document.querySelectorAll('.zoom')];
function zoom() {
  for (const z of zooms) {
    const r = z.getBoundingClientRect();
    const course = r.height - innerHeight;
    let p = Math.min(Math.max(-r.top / course, 0), 1);
    const ouverture = Math.min(p / .6, 1);          // 0 → 60 % : l'image s'ouvre
    const e = 1 - Math.pow(1 - ouverture, 3);
    const m = z.querySelector('.zoom-media');
    m.style.setProperty('--y', (32 * (1 - e)) + '%');
    m.style.setProperty('--x', (34 * (1 - e)) + '%');
    m.style.setProperty('--s', (1.25 - .25 * e).toFixed(3));
    const t = Math.min(Math.max((p - .55) / .25, 0), 1); // le titre arrive ensuite
    z.querySelector('.zoom-scene').style.setProperty('--t', t.toFixed(3));
  }
}
if (!calme) { addEventListener('scroll', () => requestAnimationFrame(zoom), {passive:true}); addEventListener('resize', zoom); zoom(); }
