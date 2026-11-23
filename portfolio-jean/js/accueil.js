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
  a.href = 'projets/' + (lien || id) + '.html';
  a.style.animationDelay = (Math.random() * .6).toFixed(2) + 's';
  a.innerHTML = id
    ? `<img src="img/visuels/img-${id}.jpg" alt="" loading="${i < 14 ? 'eager' : 'lazy'}"><span>${nom}</span>`
    : `<svg aria-hidden="true"><use href="#etoile"/></svg><span>${nom}</span>`;
  a.setAttribute('aria-label', nom);
  if (i >= MUR.length) a.tabIndex = -1;
  mur.appendChild(a);
}

const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
