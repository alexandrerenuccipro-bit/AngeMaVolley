function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

const { renderHotbar } = require('./hotbar.view');

function renderHomePage({
  title,
  message,
  user
}) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="/css/style.css">
  <script src="/js/theme-toggle.js" defer></script>
</head>
<body>
  <header class="topbar">
    <a class="logo" href="/">${escapeHtml(title)}</a>
    ${renderHotbar(user)}
  </header>

  <main class="page">
    <section class="hero-card">
      <p class="tag">Gestion d’équipe de volley</p>
      <h2>Bienvenue sur <span>${escapeHtml(title)}</span></h2>
      <p>${escapeHtml(message)}</p>
      <div class="hero-actions">
        ${user ? `<a href="/dashboard" class="cta">Accéder au Dashboard</a>` : `<a href="/connexion" class="cta">Connexion</a>`}
        <a href="#" class="cta cta-outline">Voir le calendrier</a>
      </div>
    </section>

  </main>
</body>
</html>`;
}

module.exports = {
  renderHomePage
};
