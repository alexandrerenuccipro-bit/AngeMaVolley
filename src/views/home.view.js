function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderHomePage({
  title,
  message
}) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header class="topbar">
    <h1 class="logo">${escapeHtml(title)}</h1>
    <nav class="menu" aria-label="Navigation principale">
      <a href="#">Équipe</a>
      <a href="#">Matchs</a>
      <a href="#">Entraînements</a>
    </nav>
  </header>

  <main class="page">
    <section class="hero-card">
      <p class="tag">Gestion d’équipe de volley</p>
      <h2>Bienvenue sur <span>${escapeHtml(title)}</span></h2>
      <p>${escapeHtml(message)}</p>
      <div class="hero-actions">
        <a href="/connexion" class="cta">Connexion</a>
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
