function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

const { renderHotbar } = require('./hotbar.view');

function getRoleLabel(user) {
  if (user.estAdmin) {
    return 'Admin';
  }

  const labels = {
    coach: 'Coach',
    licencie: 'Joueur/Licencié',
    responsable_club: 'Responsable de club'
  };

  return labels[user.role] || user.role;
}

function getRoleCards(user) {
  if (user.estAdmin) {
    return [
      { title: 'Supervision plateforme', text: 'Surveille les comptes et permissions.' },
      { title: 'Validation licences', text: 'Contrôle les activations et les inscriptions.' }
    ];
  }

  const cardsByRole = {
    coach: [
      { title: 'Séance du jour', text: 'Planifie les exercices et la charge de travail.' },
      { title: 'Suivi effectif', text: 'Consulte la disponibilité des joueurs.' }
    ],
    licencie: [
      { title: 'Mes entraînements', text: 'Retrouve ton planning personnel.' },
      { title: 'Mes performances', text: 'Consulte tes statistiques récentes.' }
    ],
    responsable_club: [
      { title: 'Gestion club', text: 'Mets à jour les informations du club.' },
      { title: 'Gestion équipes', text: 'Affecte les joueurs et encadrants.' }
    ]
  };

  return cardsByRole[user.role] || [{ title: 'Tableau de bord', text: 'Bienvenue sur ton espace.' }];
}

function renderTeamLine(user, teams) {
  const shouldShowTeams = user.role === 'coach' || user.role === 'licencie';

  if (!shouldShowTeams) {
    return '';
  }

  if (!teams.length) {
    return '<p>Équipe: <strong>Non attribuée</strong></p>';
  }

  const label = teams.length > 1 ? 'Équipes' : 'Équipe';
  const teamNames = teams.map((teamName) => escapeHtml(teamName)).join(', ');

  return `<p>${label}: <strong>${teamNames}</strong></p>`;
}

function renderDashboardPage({ user, teams = [] }) {
  const cardsMarkup = getRoleCards(user)
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
  <script src="/js/theme-toggle.js" defer></script>
</head>
<body>
  <header class="topbar">
    <a class="logo" href="/">AngeMa Volley</a>
    ${renderHotbar(user)}
  </header>

  <main class="page">
    <section class="hero-card">
      <p class="tag">Espace personnel</p>
      <h2>Bienvenue ${escapeHtml(user.prenom)} ${escapeHtml(user.nom)}</h2>
      <p>Rôle: <strong>${escapeHtml(getRoleLabel(user))}</strong></p>
      ${renderTeamLine(user, teams)}
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