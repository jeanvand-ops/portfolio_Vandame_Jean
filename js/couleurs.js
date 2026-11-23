/* =====================================================================
   Bloc « Couleurs » : le même sur toutes les pages projet.
   afficherCouleurs(element, [{nom, hex, role}, ...])
   (accepte aussi une simple liste de codes : ['#ff0a14', '#000000'])
   ===================================================================== */
function afficherCouleurs(el, liste) {
  const lum = hex => {
    const n = parseInt(hex.replace('#', '').padEnd(6, '0'), 16);
    return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000;
  };
  el.innerHTML = liste.map(c => {
    const x = typeof c === 'string' ? {hex: c} : c;
    const hex = x.hex.toUpperCase();
    return `<button type="button" class="couleur" data-hex="${hex}" aria-label="Copier ${x.nom || ''} ${hex}">
      <span class="c-pastille" style="--c:${hex};--ct:${lum(hex) > 150 ? '#000' : '#fff'}"><span class="c-copier">Copier</span></span>
      ${x.nom ? `<span class="c-nom">${x.nom}</span>` : ''}
      <span class="c-hex">${hex}</span>
      ${x.role ? `<span class="c-role">${x.role}</span>` : ''}
    </button>`;
  }).join('');
  el.querySelectorAll('.couleur').forEach(b => b.addEventListener('click', () => {
    const hex = b.dataset.hex, t = b.querySelector('.c-copier');
    if (navigator.clipboard) navigator.clipboard.writeText(hex).catch(() => {});
    t.textContent = 'Copié !'; b.classList.add('copie');
    setTimeout(() => { t.textContent = 'Copier'; b.classList.remove('copie'); }, 1000);
  }));
}
