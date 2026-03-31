const { renderHotbar } = require('./hotbar.view');
const { escapeHtml } = require('./view.utils');

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
      </div>
    </section>
    <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
      <article class="info-card">
        <p class="tag">Découvrir</p>
        <h3>Nos équipes</h3>
        <p>Explorez toutes les équipes de volley et trouvez celle qui vous intéresse.</p>
        <a href="/equipe" style="display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 1rem; color: var(--primary); text-decoration: none; font-weight: 600;">
          Consulter les équipes <span>→</span>
        </a>
      </article>

      <article class="info-card">
        <p class="tag">Rejoindre</p>
        <h3>Devenir licencié</h3>
        <p>Rejoignez notre communauté en tant que joueur licencié ou coach.</p>
        <a href="${user ? '/dashboard' : '/connexion'}" style="display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 1rem; color: var(--primary); text-decoration: none; font-weight: 600;">
          <span>${user ? 'Accéder à mon profil' : 'Se connecter'}</span>
          <span>→</span>
        </a>
      </article>

      <article class="info-card">
        <p class="tag">À propos</p>
        <h3>AngeMa Volley</h3>
        <p>Une plateforme complète de gestion d'équipes et d'événements de volley pour tous.</p>
        <div style="display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 1rem; color: var(--primary); font-weight: 600;">
          Plateforme pour tous
        </div>
      </article>
    </section>
  </main>
</body>
</html>`;
}

module.exports = {
  renderHomePage
};
