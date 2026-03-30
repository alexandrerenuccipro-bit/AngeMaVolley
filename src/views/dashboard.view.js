function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

const { renderHotbar } = require('./hotbar.view');

function renderAdminLicenceRequests(requests) {
  if (!requests.length) {
    return '<p>Aucune demande de licence pour le moment.</p>';
  }

  return requests
    .map(
      (request) => `
        <p>
          <strong>${escapeHtml(request.prenom)} ${escapeHtml(request.nom)}</strong>
          - ${escapeHtml(request.type_demande)}
          - ${escapeHtml(request.statut)}
        </p>
      `
    )
    .join('');
}

function getRoleLabel(user) {
  if (user.estAdmin) {
    return 'Admin';
  }

  const labels = {
    admin: 'Admin',
    coach: 'Coach',
    licencie: 'Joueur/Licencié',
    responsable_club: 'Responsable de club'
  };

  return labels[user.role] || user.role;
}

function getRoleCards(user, licenceRequests = []) {
  if (user.estAdmin) {
    return [
      { title: 'Supervision plateforme', text: 'Surveille les comptes et permissions.' },
      {
        title: 'Validation licences',
        html: renderAdminLicenceRequests(licenceRequests)
      }
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

function renderDashboardPage({ user, teams = [], licenceRequests = [], clubs = [] }) {
  const canRequestLicence = !user.estAdmin && user.role === 'utilisateur';
  const hasPendingRequest = licenceRequests.some((request) => request.statut === 'en_attente');

  const licenceRequestHistoryMarkup = !user.estAdmin && licenceRequests.length
    ? `<article class="info-card">
        <h3>Mes demandes de licence</h3>
        ${licenceRequests
          .map(
            (request) => `
          <p>
            <strong>${escapeHtml(request.type_demande)}</strong>
            - ${escapeHtml(request.statut)}
          </p>
        `
          )
          .join('')}
      </article>`
    : '';

  const licenceRequestFormMarkup = !canRequestLicence || hasPendingRequest
    ? ''
    : `<article class="info-card">
        <h3>Demander une licence</h3>
        <p>Choisis le type de licence puis complete le formulaire correspondant.</p>
        <form method="POST" action="/dashboard/demande-licence" class="auth-form">
          <label for="type_demande">Type de licence</label>
          <select id="type_demande" name="type_demande" required>
            <option value="">Selectionner...</option>
            <option value="licencie">Joueur</option>
            <option value="coach">Coach</option>
          </select>

          <div id="licencie_fields" style="display:none;">
            <label for="num_club">Nom du club</label>
            <select id="num_club" name="num_club">
              <option value="">Selectionner un club...</option>
              ${clubs
                .map(
                  (club) =>
                    `<option value="${escapeHtml(club.num_club)}">${escapeHtml(club.nom)}</option>`
                )
                .join('')}
            </select>

            <label for="poids_kg">Poids (kg)</label>
            <input id="poids_kg" name="poids_kg" type="number" min="1" step="0.1" placeholder="Ex: 72.5">

            <label for="taille_cm">Taille (cm)</label>
            <input id="taille_cm" name="taille_cm" type="number" min="1" step="1" placeholder="Ex: 178">
          </div>

          <div id="coach_fields" style="display:none;">
            <label for="diplome">Diplome</label>
            <input id="diplome" name="diplome" type="text" placeholder="Ex: UEFA B">
          </div>

          <button type="submit" class="cta">Envoyer la demande</button>
        </form>
      </article>`;

  const cardsMarkup = getRoleCards(user, licenceRequests)
    .map(
      (card) => `
      <article class="info-card">
        <h3>${escapeHtml(card.title)}</h3>
        ${card.html || `<p>${escapeHtml(card.text)}</p>`}
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
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      const typeSelect = document.getElementById('type_demande');
      const licencieFields = document.getElementById('licencie_fields');
      const coachFields = document.getElementById('coach_fields');
      const numClub = document.getElementById('num_club');
      const diplome = document.getElementById('diplome');

      function updateFormByType() {
        const type = typeSelect ? typeSelect.value : '';

        if (licencieFields) {
          licencieFields.style.display = type === 'licencie' ? 'block' : 'none';
        }

        if (coachFields) {
          coachFields.style.display = type === 'coach' ? 'block' : 'none';
        }

        if (numClub) {
          numClub.required = type === 'licencie';
        }

        if (diplome) {
          diplome.required = type === 'coach';
        }
      }

      if (typeSelect) {
        typeSelect.addEventListener('change', updateFormByType);
        updateFormByType();
      }
    });
  </script>
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
      ${licenceRequestHistoryMarkup}
      ${licenceRequestFormMarkup}
    </section>
  </main>
</body>
</html>`;
}

module.exports = {
  renderDashboardPage
};