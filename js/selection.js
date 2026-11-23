/* Page « Choisis ton projet » : écran de sélection de personnage.
   Les projets viennent de projets-data.js. */
const $ = id => document.getElementById(id);
const gifs = {};        // GIF trouvés : perso-ID.gif
let actuel = 0;

// cherche les GIF d'animation (ex. img/persos/perso-meduse.gif)
PROJETS.forEach(p => {
  if (!p.perso) return;
  const g = new Image();
  g.onload = () => { gifs[p.id] = g.src; if (PROJETS[actuel].id === p.id) $('badge').textContent = 'Survole-moi'; };
  g.src = p.perso + '.gif';
});

// vignettes du bas
const rangee = $('rangee');
PROJETS.forEach((p, i) => {
  const b = document.createElement('button');
  b.className = 'vignette' + (p.perso ? '' : ' vide');
  b.setAttribute('role', 'tab');
  b.setAttribute('aria-label', p.nom);
  b.innerHTML = p.perso ? `<img src="${p.perso}.jpg" alt="">` : '<svg aria-hidden="true"><use href="#etoile"/></svg>';
  b.addEventListener('click', () => choisir(i));
  b.addEventListener('mouseenter', () => animer(b, p, true));
  b.addEventListener('mouseleave', () => animer(b, p, false));
  b.addEventListener('dblclick', ouvrir);
  b.style.setProperty('--i', i);
  rangee.appendChild(b);
});

function animer(el, p, on) {
  const img = el.querySelector('img');
  if (!img || !p.perso) return;
  if (gifs[p.id]) img.src = on ? gifs[p.id] : p.perso + '.jpg';
  else el.classList.toggle('anim', on);
}

function choisir(i) {
  actuel = (i + PROJETS.length) % PROJETS.length;
  const p = PROJETS[actuel];
  document.documentElement.style.setProperty('--accent', p.couleur);

  const perso = $('perso'), img = $('perso-img');
  perso.classList.toggle('vide', !p.perso);
  perso.querySelector('svg')?.remove();
  if (!p.perso) { img.hidden = true; perso.insertAdjacentHTML('afterbegin', '<svg aria-hidden="true"><use href="#etoile"/></svg>'); }
  else { img.hidden = false; img.src = p.perso + '.jpg'; }
  $('badge').textContent = gifs[p.id] ? 'Survole-moi' : 'Perso à venir';
  perso.classList.remove('change'); void perso.offsetWidth; perso.classList.add('change');

  $('num').textContent = String(actuel + 1).padStart(2, '0') + ' / ' + String(PROJETS.length).padStart(2, '0');
  $('nom').textContent = p.nom;
  $('role').textContent = p.role;
  $('desc').textContent = p.desc;
  $('stats').innerHTML = Object.entries(p.stats).map(([k, v]) =>
    `<div class="stat"><span>${k}</span><div class="jauge" role="img" aria-label="${k} ${v} sur 10">${
      Array.from({length: 10}, (_, j) => `<i class="${j < v ? 'on' : ''}" style="animation-delay:${j * 35}ms"></i>`).join('')
    }</div></div>`).join('');

  [...rangee.children].forEach((v, j) => v.setAttribute('aria-current', j === actuel));
  const v = rangee.children[actuel];
  rangee.scrollTo({left: v.offsetLeft - rangee.clientWidth / 2 + v.clientWidth / 2, behavior: 'smooth'});
  history.replaceState(null, '', '#' + p.id);
}

// survol du grand perso : le GIF se lance
$('perso').addEventListener('mouseenter', () => animer($('perso'), PROJETS[actuel], true));
$('perso').addEventListener('mouseleave', () => animer($('perso'), PROJETS[actuel], false));

// ouvre la page du projet
function ouvrir() { location.href = 'projets/' + PROJETS[actuel].id + '.html'; }
$('perso').addEventListener('click', ouvrir);
$('ouvrir').addEventListener('click', ouvrir);

// clavier : flèches pour changer, Entrée pour ouvrir
addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { e.preventDefault(); choisir(actuel + 1); }
  if (e.key === 'ArrowLeft')  { e.preventDefault(); choisir(actuel - 1); }
  if (e.key === 'Enter' && document.activeElement === document.body) ouvrir();
});

// projet demandé dans l'adresse (ex. projets.html#meduse)
const depart = PROJETS.findIndex(p => p.id === location.hash.slice(1));
// arrivée depuis le mur de l'accueil : petite entrée animée
let depuisMur = false;
try { depuisMur = sessionStorage.getItem('depuis-mur') === '1'; sessionStorage.removeItem('depuis-mur'); } catch (e) {}
if (depuisMur) {
  const ecran = document.querySelector('.ecran');
  ecran.classList.add('arrivee');
  if (!window.CSSViewTransitionRule) ecran.classList.add('sans-vt');
  setTimeout(() => ecran.classList.remove('arrivee', 'sans-vt'), 1600);
}
choisir(depart >= 0 ? depart : 0);
