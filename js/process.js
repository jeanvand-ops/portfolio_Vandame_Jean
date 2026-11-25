/* Bloc réutilisable « Coulisses du process ».
   afficherProcess(element, [{titre, texte, image?}, ...]) */
function afficherProcess(el, etapes) {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  el.innerHTML = etapes.map((e, i) => `
    <article class="etape">
      <div class="etape-n">${String(i + 1).padStart(2, '0')}</div>
      <div class="etape-vis">${e.image ? `<img src="${esc(e.image)}" alt="" loading="lazy" onerror="this.parentNode.classList.add('vide');this.remove()">` : ''}</div>
      <h3>${esc(e.titre)}</h3>
      <p>${esc(e.texte)}</p>
    </article>`).join('');
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('vu'); io.unobserve(x.target); } }), {threshold: .2});
  el.querySelectorAll('.etape').forEach(a => io.observe(a));
}
