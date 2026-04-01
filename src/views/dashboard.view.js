const { renderHotbar } = require('./hotbar.view');
const { escapeHtml, formatDateTime, getTypeLabel } = require('./view.utils');

function getLicenceTypeLabel(typeDemande) {
  return typeDemande === 'coach' ? 'Coach' : 'Licencié';
}

function getLicenceRequestStatusLabel(status) {
  return {
    en_attente: 'En attente',
    validee: 'Validée',
    refusee: 'Refusée'
  }[status] || status;
}

function getLicenceRequestStatusClass(status) {
  return {
    en_attente: 'status-suspendu',
    validee: 'status-actif',
    refusee: 'status-inactif'
  }[status] || 'status-inactif';
}

function renderMiniStat(label, value) {
  return `
    <div style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.82rem; padding:0.25rem 0.55rem; border:1px solid var(--border); border-radius:999px; color:var(--muted-text); margin-right:0.4rem; margin-top:0.45rem;">
      <strong style="color:var(--text-color, #fff);">${escapeHtml(String(value))}</strong>
      <span>${escapeHtml(label)}</span>
    </div>
  `;
}

function countRequestsByStatus(licenceRequests = []) {
  return licenceRequests.reduce(
    (acc, req) => {
      if (req.statut === 'en_attente') acc.pending += 1;
      if (req.statut === 'validee') acc.validated += 1;
      if (req.statut === 'refusee') acc.refused += 1;
      return acc;
    },
    { pending: 0, validated: 0, refused: 0 }
  );
}

function renderAdminLicenceRequests(requests, limit = 4) {
  const pendingRequests = requests.filter((request) => request.statut === 'en_attente');

  if (!pendingRequests.length) {
    return '<p>Aucune demande de licence pour le moment.</p>';
  }

  const visibleRequests = pendingRequests.slice(0, limit);
  const hiddenCount = Math.max(0, pendingRequests.length - visibleRequests.length);

  return `
    <p><strong>${pendingRequests.length}</strong> demande(s) en attente</p>
    <ul style="list-style:none; margin:0.75rem 0 0; padding:0; display:grid; gap:0.6rem;">
    ${visibleRequests
    .map(
      (request) => `
        <li style="display:flex; align-items:center; justify-content:space-between; gap:0.75rem; padding:0.55rem 0.7rem; border:1px solid var(--border, #ddd); border-radius:10px;">
          <div>
            <strong>${escapeHtml(request.prenom)} ${escapeHtml(request.nom)}</strong>
            <div style="font-size:0.9rem; opacity:0.85; margin-top:0.15rem;">${escapeHtml(getLicenceTypeLabel(request.type_demande))}</div>
          </div>
          <span style="background:var(--danger); color:#fff; font-size:0.78rem; font-weight:700; letter-spacing:0.02em; text-transform:uppercase; padding:0.22rem 0.55rem; border-radius:999px;">En attente</span>
        </li>
      `
    )
    .join('')}
    </ul>
    ${hiddenCount > 0 ? `<p style="margin-top:0.7rem; font-size:0.9rem; color:var(--muted-text);">+ ${hiddenCount} autre(s) demande(s)</p>` : ''}
  `;
}

function renderUpcomingEvents(events = [], limit = 4, options = {}) {
  const { compact = false } = options;

  if (!events.length) {
    return '<p>Aucun événement à venir.</p>';
  }

  const visibleEvents = events.slice(0, limit);
  const hiddenCount = Math.max(0, events.length - visibleEvents.length);

  return `
    <ul style="list-style:none; margin:0.75rem 0 0; padding:0; display:grid; gap:${compact ? '0.45rem' : '0.6rem'};">
      ${visibleEvents
        .map(
          (event) => `
            <li style="padding:${compact ? '0.45rem 0.6rem' : '0.55rem 0.7rem'}; border:1px solid var(--border, #ddd); border-radius:10px;">
              <strong>${escapeHtml(getTypeLabel(event.type))}</strong>
              <div style="font-size:${compact ? '0.85rem' : '0.9rem'}; opacity:0.9; margin-top:0.2rem;">${escapeHtml(event.description || 'Événement')}</div>
              <div style="font-size:${compact ? '0.78rem' : '0.82rem'}; color:var(--muted-text); margin-top:0.2rem;">${escapeHtml(formatDateTime(event.date_debut))}</div>
            </li>
          `
        )
        .join('')}
    </ul>
    ${hiddenCount > 0 ? `<p style="margin-top:0.7rem; font-size:0.9rem; color:var(--muted-text);">+ ${hiddenCount} autre(s) événement(s)</p>` : ''}
  `;
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

function getRoleCards(user, { licenceRequests = [], teams = [], upcomingEvents = [] } = {}) {
  if (user.estAdmin) {
    return [
      { 
        title: 'Validation licences',
        html: renderAdminLicenceRequests(licenceRequests, 4)
      },
      {
        title: 'Prochains événements',
        html: renderUpcomingEvents(upcomingEvents, 4),
        link: '/calendrier'
      }
    ];
  }

  const teamSummary = teams.length
    ? `Équipe(s): ${teams.slice(0, 2).map((team) => escapeHtml(team)).join(', ')}${teams.length > 2 ? ` (+${teams.length - 2})` : ''}`
 : 'Aucune équipe attribuée pour le moment.';
  const requestStats = countRequestsByStatus(licenceRequests);

  const cardsByRole = {
    coach: [
      {
        title: 'Mon équipe',
        html: `
          <p style="margin:0.2rem 0 0.5rem;">${teamSummary}</p>
          ${renderMiniStat('équipe(s)', teams.length || 0)}
          ${renderMiniStat('événement(s)', upcomingEvents.length || 0)}
        `,
        link: '/coach/equipe'
      },
      {
        title: 'Mes joueurs',
        html: `
          <p style="margin:0.2rem 0;">Accéder à la liste complète de ton groupe.</p>
          <p style="margin:0.25rem 0 0; color:var(--muted-text); font-size:0.88rem;">Suivi des statut.</p>
        `,
        link: '/coach/joueurs'
      },
      {
        title: 'Mes licences',
        html: `
          <p style="margin:0.2rem 0;">Historique de validation de tes licences coach.</p>
          ${renderMiniStat('en attente', requestStats.pending)}
          ${renderMiniStat('validées', requestStats.validated)}
        `,
        link: '/coach/licences'
      },
      {
        title: 'Planning rapide',
        html: renderUpcomingEvents(upcomingEvents, 2, { compact: true }),
        link: '/coach/events'
      }
    ],
    licencie: [
      {
        title: 'Mon équipe',
        html: `
          <p style="margin:0.2rem 0 0.45rem;">${teamSummary}</p>
          ${renderMiniStat('équipe(s)', teams.length || 0)}
          ${renderMiniStat('événement(s)', upcomingEvents.length || 0)}
        `,
        link: '/joueur/equipe'
      },
      {
        title: 'Mes licences',
        html: `
          <p style="margin:0.2rem 0 0.45rem;">Retrouver les périodes de validité et les validations.</p>
          ${renderMiniStat('demande(s)', licenceRequests.length || 0)}
          ${renderMiniStat('en attente', requestStats.pending)}
          ${renderMiniStat('validées', requestStats.validated)}
        `,
        link: '/joueur/licences'
      },
      {
        title: 'Mes événements',
        html: renderUpcomingEvents(upcomingEvents, 2, { compact: true }),
        link: '/joueur/events'
      }
    ],
    utilisateur: [
      {
        title: 'Clubs disponibles',
        text: 'Consulte les équipes et choisis un club avant de faire ta demande.',
        link: '/equipe'
      }
    ],
    responsable_club: [
      { title: 'Gestion club', text: 'Mets a jour les informations du club.' },
      { title: 'Gestion equipes', text: 'Affecte les joueurs et encadrants.' }
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

function renderDashboardPage({ user, teams = [], licenceRequests = [], clubs = [], upcomingEvents = [] }) {
  const canRequestLicence = !user.estAdmin && user.role === 'utilisateur';
  const hasPendingRequest = licenceRequests.some((request) => request.statut === 'en_attente');
  const visibleHistory = licenceRequests.slice(0, 5);
  const hiddenHistoryCount = Math.max(0, licenceRequests.length - visibleHistory.length);
  const licenceRequestMoreMarkup = hiddenHistoryCount > 0
    ? `<p class="licence-request-more">+ ${hiddenHistoryCount} autre(s) demande(s)</p>`
    : '';

  const licenceRequestHistoryMarkup = !user.estAdmin && licenceRequests.length
    ? `<article class="info-card">
        <h3>Mes demandes de licence</h3>
        <ul class="licence-request-list">
          ${visibleHistory
            .map(
              (request) => `
            <li class="licence-request-item">
              <div class="licence-request-main">
                <strong class="licence-request-type">${escapeHtml(getLicenceTypeLabel(request.type_demande))}</strong>
                <span class="licence-request-date">${escapeHtml(formatDateTime(request.date_demande, 'Date inconnue'))}</span>
              </div>
              <span class="status-badge ${getLicenceRequestStatusClass(request.statut)}">${escapeHtml(getLicenceRequestStatusLabel(request.statut))}</span>
            </li>
          `
            )
            .join('')}
        </ul>
        ${licenceRequestMoreMarkup}
      </article>`
    : '';

  const licenceRequestFormMarkup = !canRequestLicence || hasPendingRequest
    ? ''
    : `<article id="licence-form" class="info-card">
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

  const cardsMarkup = getRoleCards(user, { licenceRequests, teams, upcomingEvents })
    .map(
      (card) => `
      <article class="info-card" ${card.link ? `style="cursor:pointer; transition:all 0.3s ease; border:1px solid var(--border); position:relative; overflow:hidden;"` : ''} ${card.link ? `onclick="window.location.href='${card.link}'" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 6px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"` : ''}>
        <h3>${escapeHtml(card.title)}</h3>
        ${card.html || `<p>${escapeHtml(card.text || '')}</p>`}
        ${card.link ? `<div style="font-size:0.85rem; color:var(--muted-text); margin-top:0.8rem; display:flex; align-items:center; justify-content:center; gap:0.4rem;">
          <span>Accéder</span>
          <span style="font-size:1rem;">→</span>
        </div>` : ''}
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
        <button type="submit" class="cta cta-outline">Se deconnecter</button>
      </form>
    </section>

    <section class="grid-cards" aria-label="Actions par role" style="align-items:start;">
      ${cardsMarkup}
      ${licenceRequestHistoryMarkup}
      ${licenceRequestFormMarkup}
    </section>
  </main>
</body>
</html>`;
}

module.exports = { renderDashboardPage };
