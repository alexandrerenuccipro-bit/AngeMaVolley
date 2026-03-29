function requireAdmin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/connexion');
  }

  if (!req.session.user.estAdmin) {
    return res.status(403).send(`
      <!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
      <title>Accès refusé</title>
      <link rel="stylesheet" href="/css/style.css"></head>
      <body>
        <header class="topbar"><a class="logo" href="/">AngeMa Volley</a></header>
        <main class="page">
          <section class="hero-card">
            <p class="tag">Erreur 403</p>
            <h2>Accès refusé</h2>
            <p>Vous n'avez pas les droits administrateur pour accéder à cette page.</p>
            <a href="/dashboard" class="cta cta-outline">Retour au dashboard</a>
          </section>
        </main>
      </body></html>
    `);
  }

  return next();
}

module.exports = { requireAdmin };
