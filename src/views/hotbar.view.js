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
    return `<nav class="menu" aria-label="Navigation principale">
      <a href="/equipe">Équipe</a>
      <a href="#">Matchs</a>
      <a href="#">Entraînements</a>
      <label class="switch" for="theme-switch" aria-label="Activer le mode sombre">
        <input id="theme-switch" type="checkbox" role="switch" aria-label="Activer le mode sombre">
        <span class="slider" aria-hidden="true"></span>
      </label>
      <a href="/dashboard" class="user-link">${escapeHtml(user.prenom)}</a>
    </nav>`;
  }
  return `<nav class="menu" aria-label="Navigation principale">
      <a href="/equipe">Équipe</a>
      <a href="#">Matchs</a>
      <a href="#">Entraînements</a>
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
