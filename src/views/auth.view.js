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
  <script src="/js/theme-toggle.js" defer></script>
</head>
<body>
  <header class="topbar">
    <a class="logo" href="/">AngeMa Volley</a>
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
      <p>Pas encore de compte ? <a href="/inscription">Inscription</a></p>
    </section>
  </main>
</body>
</html>`;
}

function renderRegisterPage({ error, form }) {
  const errorMarkup = error
    ? `<p class="auth-error" role="alert">${escapeHtml(error)}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inscription - AngeMa Volley</title>
  <link rel="stylesheet" href="/css/style.css">
  <script src="/js/theme-toggle.js" defer></script>
</head>
<body>
  <header class="topbar">
    <a class="logo" href="/">AngeMa Volley</a>
    <nav class="menu" aria-label="Navigation principale">
      <a href="/">Accueil</a>
      <a href="/connexion">Connexion</a>
    </nav>
  </header>

  <main class="page auth-page">
    <section class="auth-card" aria-label="Formulaire d'inscription">
      <h2>Inscription</h2>
      <p>Cree ton compte pour acceder au dashboard et demander une licence.</p>
      ${errorMarkup}
      <form method="POST" action="/inscription" class="auth-form">
        <label for="nom">Nom</label>
        <input id="nom" name="nom" type="text" required value="${escapeHtml(form.nom || '')}">

        <label for="prenom">Prenom</label>
        <input id="prenom" name="prenom" type="text" required value="${escapeHtml(form.prenom || '')}">

        <label for="email">Email</label>
        <input id="email" name="email" type="email" required value="${escapeHtml(form.email || '')}">

        <label for="telephone">Telephone</label>
        <input id="telephone" name="telephone" type="text" value="${escapeHtml(form.telephone || '')}">

        <label for="date_naissance">Date de naissance</label>
        <input id="date_naissance" name="date_naissance" type="date" value="${escapeHtml(form.dateNaissance || '')}">

        <label for="password">Mot de passe</label>
        <input id="password" name="password" type="password" required>

        <button type="submit" class="cta">Creer mon compte</button>
      </form>
    </section>
  </main>
</body>
</html>`;
}

module.exports = {
  renderLoginPage,
  renderRegisterPage
};