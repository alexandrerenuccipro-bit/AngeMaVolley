function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

const { renderHotbar } = require('./hotbar.view');

function getRoleLabel(role) {
  const labels = {
    coach: 'Coach',
    licencie: 'Joueur / Licencié',
    administrateur: 'Administrateur',
    responsable_club: 'Responsable de club'
  };

  return labels[role] || role;
}

function getRoleCards(role) {
  const cardsByRole = {
    coach: [
      { title: 'Séance du jour', text: 'Planifie les exercices et la charge de travail.' },
      { title: 'Suivi effectif', text: 'Consulte la disponibilité des joueurs.' }
    ],
    licencie: [
      { title: 'Mes entraînements', text: 'Retrouve ton planning personnel.' },
      { title: 'Mes performances', text: 'Consulte tes statistiques récentes.' }
    ],
    administrateur: [
      { title: 'Supervision plateforme', text: 'Surveille les comptes et permissions.' },
      { title: 'Modération', text: 'Valide les inscriptions et licences.' }
    ],
    responsable_club: [
      { title: 'Gestion club', text: 'Mets à jour les informations du club.' },
      { title: 'Gestion équipes', text: 'Affecte les joueurs et encadrants.' }
    ]
  };

  return cardsByRole[role] || [{ title: 'Tableau de bord', text: 'Bienvenue sur ton espace.' }];
}

function renderDashboardPage({ user }) {
  const cardsMarkup = getRoleCards(user.role)
    .map(
      (card) => `
      <article class="info-card">
        <h3>${escapeHtml(card.title)}</h3>
        <p>${escapeHtml(card.text)}</p>
      </article>
    `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - AngeMa Volley</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header class="topbar">
    <h1 class="logo">AngeMa Volley</h1>
    ${renderHotbar(user)}
  </header>

  <main class="page">
    <section class="hero-card">
      <p class="tag">Espace connecté</p>
      <h2>Bienvenue ${escapeHtml(user.prenom)} ${escapeHtml(user.nom)}</h2>
      <p>Rôle connecté: <strong>${escapeHtml(getRoleLabel(user.role))}</strong></p>
      <form method="POST" action="/deconnexion">
        <button type="submit" class="cta cta-outline">Se déconnecter</button>
      </form>
    </section>

    <section class="grid-cards" aria-label="Actions par rôle">
      ${cardsMarkup}
    </section>
  </main>
</body>
</html>`;
}

module.exports = {
  renderDashboardPage
};