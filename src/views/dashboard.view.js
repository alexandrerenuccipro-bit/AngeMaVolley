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
  if (user.estAdmin) return 'Admin';
  const labels = {
    coach: 'Coach',
    licencie: 'Joueur / Licencié',
    responsable_club: 'Responsable de club'
  };
  return labels[user.role] || user.role;
}

function getRoleCards(user) {
  if (user.estAdmin) {
    return [
      { title: 'Dashboard admin', text: 'Supervise la plateforme et les comptes.', href: '/admin' },
      { title: 'Validation licences', text: 'Contrôle les activations et inscriptions.', href: '/admin/licences' }
    ];
  }

  const cardsByRole = {
    coach: [
      { title: 'Séance du jour', text: 'Planifie les exercices et la charge de travail.', href: '/calendrier' },
      { title: 'Suivi effectif', text: 'Consulte la disponibilité des joueurs.', href: '/equipe' }
    ],
    licencie: [
      { title: 'Mon équipe', text: 'Consulte ton équipe et tes coéquipiers.', href: '/joueur/equipe' },
      { title: 'Mes licences', text: 'Vérifie le statut de tes licences.', href: '/joueur/licences' },
      { title: 'Mes événements', text: 'Matchs, tournois et entraînements à venir.', href: '/joueur/events' }
    ],
    responsable_club: [
      { title: 'Gestion club', text: 'Mets à jour les informations du club.', href: '/equipe' },
      { title: 'Gestion équipes', text: 'Affecte les joueurs et encadrants.', href: '/equipe' }
    ]
  };

  return cardsByRole[user.role] || [{ title: 'Tableau de bord', text: 'Bienvenue sur ton espace.', href: '/' }];
}

function renderDashboardPage({ user }) {
  const cardsMarkup = getRoleCards(user)
    .map(card => `
      <article class="info-card">
        <h3>${escapeHtml(card.title)}</h3>
        <p>${escapeHtml(card.text)}</p>
        <a href="${escapeHtml(card.href)}" class="cta" style="margin-top: 0.5rem; display: inline-block; padding: 0.6rem 1.2rem; font-size: 0.9rem;">
          Accéder →
        </a>
      </article>
    `)
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
      <p>Rôle : <strong>${escapeHtml(getRoleLabel(user))}</strong></p>
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

module.exports = { renderDashboardPage };
