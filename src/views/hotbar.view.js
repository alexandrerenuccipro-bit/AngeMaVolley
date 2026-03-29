function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderHotbar(user) {
  if (user) {
    const canSeeEvents = user.estAdmin || user.role === 'coach';
    const eventsLink = canSeeEvents ? '<a href="/evenements">Evenements</a>' : '';

    return `<nav class="menu" aria-label="Navigation principale">
      <a href="/equipe">Équipe</a>
      <a href="/calendrier">Calendrier</a>
      ${eventsLink}
      <label class="switch" for="theme-switch" aria-label="Activer le mode sombre">
        <input id="theme-switch" type="checkbox" role="switch" aria-label="Activer le mode sombre">
        <span class="slider" aria-hidden="true"></span>
      </label>
      <a href="/dashboard" class="user-link">${escapeHtml(user.prenom)}</a>
    </nav>`;
  }
  return `<nav class="menu" aria-label="Navigation principale">
      <a href="/equipe">Équipe</a>
      <a href="/calendrier">Calendrier</a>
      <label class="switch" for="theme-switch" aria-label="Activer le mode sombre">
        <input id="theme-switch" type="checkbox" role="switch" aria-label="Activer le mode sombre">
        <span class="slider" aria-hidden="true"></span>
      </label>
      <a href="/connexion" class="cta-btn">Connexion</a>
    </nav>`;
}

module.exports = {
  renderHotbar
};
