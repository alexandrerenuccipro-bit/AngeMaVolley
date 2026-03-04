function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderLoginPage({ error, email }) {
  const errorMarkup = error
    ? `<p class="auth-error" role="alert">${escapeHtml(error)}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connexion - AngeMa Volley</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header class="topbar">
    <h1 class="logo">AngeMa Volley</h1>
    <nav class="menu" aria-label="Navigation principale">
      <a href="/">Accueil</a>
    </nav>
  </header>

  <main class="page auth-page">
    <section class="auth-card" aria-label="Formulaire de connexion">
      <h2>Connexion</h2>
      <p>Entre tes identifiants pour accéder à ton tableau de bord.</p>
      ${errorMarkup}
      <form method="POST" action="/connexion" class="auth-form">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" required value="${escapeHtml(email || '')}">

        <label for="password">Mot de passe</label>
        <input id="password" name="password" type="password" required>

        <button type="submit" class="cta">Se connecter</button>
      </form>
    </section>
  </main>
</body>
</html>`;
}

module.exports = {
  renderLoginPage
};