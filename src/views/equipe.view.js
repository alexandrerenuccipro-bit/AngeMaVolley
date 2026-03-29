const { renderHotbar } = require('./hotbar.view');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getCategoryLabel(category) {
  const labels = {
    senior: 'Senior'
  };
  return labels[category] || category;
}

function getCategoryColor(category) {
  const colors = {
    senior: '#3b82f6'
  };
  return colors[category] || '#3b82f6';
}

function renderSearchBar(filters, resultCount) {
  return `
    <section class="equipe-search-panel" aria-label="Recherche d'equipe">
      <form class="equipe-search-form" method="GET" action="/equipe">
        <label for="equipe-search-input">Rechercher une equipe</label>
        <input
          id="equipe-search-input"
          type="search"
          name="search"
          value="${escapeHtml(filters.search || '')}"
          placeholder="Nom d'equipe, club ou ville"
        >
        <button type="submit" class="cta">Rechercher</button>
        <a href="/equipe" class="cta cta-outline">Reinitialiser</a>
      </form>
      <p class="equipe-search-result">${resultCount} equipe(s) trouvee(s)</p>
    </section>
  `;
}

function renderListeEquipes(equipes) {
  if (!equipes.length) {
    return `
      <section class="category-section">
        <h3 class="category-title" style="color: ${getCategoryColor('senior')};">
          Equipes
        </h3>
        <p class="empty-state">Aucune equipe ne correspond a votre recherche.</p>
      </section>
    `;
  }

  let html = `
    <section class="category-section">
      <h3 class="category-title" style="color: ${getCategoryColor('senior')};">
        Equipes
      </h3>
      <div class="equipes-grid">
  `;

  equipes.forEach(equipe => {
    html += `
      <article class="equipe-card" onclick="location.href='/equipe/${equipe.num_equipe}';" style="cursor: pointer;">
        <div class="equipe-header">
          <h4>${escapeHtml(equipe.nom)}</h4>
          <div class="equipe-badge" style="background-color: ${getCategoryColor(equipe.categorie)}; color: white;">
            ${getCategoryLabel(equipe.categorie)}
          </div>
        </div>

        <div class="equipe-info">
          <div class="info-row">
            <span class="label">Club:</span>
            <span>${escapeHtml(equipe.nom_club)}</span>
          </div>
          <div class="info-row">
            <span class="label">Ville:</span>
            <span>${escapeHtml(equipe.ville || '-')}</span>
          </div>
          <div class="info-row">
            <span class="label">Couleur:</span>
            <div class="color-swatch" style="background-color: ${escapeHtml(equipe.couleur_maillot)};"></div>
          </div>
        </div>

        <div class="equipe-stats">
          <div class="stat-item">
            <span class="stat-value">${equipe.nb_joueurs}</span>
            <span class="stat-label">Joueurs</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${equipe.nb_joueurs_max}</span>
            <span class="stat-label">Max</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${equipe.coach_prenom ? '✓' : '—'}</span>
            <span class="stat-label">Coach</span>
          </div>
        </div>

        ${equipe.coach_prenom ? `
          <div class="equipe-coach">
            <strong>Coach:</strong> ${escapeHtml(equipe.coach_prenom)} ${escapeHtml(equipe.coach_nom)}
          </div>
        ` : ''}

        <div class="equipe-footer">
          <small>Créée le ${new Date(equipe.date_creation).toLocaleDateString('fr-FR')}</small>
        </div>
      </article>
    `;
  });

  html += `
      </div>
    </section>
  `;

  return html;
}

function renderEquipePage(equipes, user, filters = { search: '' }) {
  const equipesHtml = renderListeEquipes(equipes);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Équipes - AngeMa Volley</title>
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
      <p class="tag">Gestion d'équipe</p>
      <h2>Les Équipes</h2>
      <p>Découvrez toutes nos équipes. Cliquez sur une équipe pour voir ses détails et ses joueurs.</p>
    </section>

    ${renderSearchBar(filters, equipes.length)}

    ${equipesHtml}
  </main>
</body>
</html>`;
}

function renderDetailEquipe(equipe, joueurs, user) {
  const coachEmailItem = equipe.coach_email
    ? `<li><strong>Email:</strong> ${escapeHtml(equipe.coach_email)}</li>`
    : '';
  const clubEmailItem = equipe.club_email
    ? `<li><strong>Email:</strong> ${escapeHtml(equipe.club_email)}</li>`
    : '';
  const clubTelephoneItem = equipe.club_telephone
    ? `<li><strong>Tél:</strong> ${escapeHtml(equipe.club_telephone)}</li>`
    : '';

  const joueursHtml = joueurs.map(joueur => `
    <tr>
      <td>${escapeHtml(joueur.numero_maillot || '—')}</td>
      <td>
        <strong>${escapeHtml(joueur.prenom)} ${escapeHtml(joueur.nom)}</strong>
        ${joueur.capitaine ? '<span class="captain-badge">C</span>' : ''}
      </td>
      <td>${escapeHtml(joueur.position || '—')}</td>
      <td>${joueur.taille_cm || '—'} cm</td>
      <td>${joueur.poids_kg || '—'} kg</td>
      <td>
        <span class="status-badge status-${joueur.statut}">
          ${escapeHtml(joueur.statut)}
        </span>
      </td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(equipe.nom)} - AngeMa Volley</title>
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
      <div style="display: flex; justify-content: space-between; align-items: start; gap: 2rem; flex-wrap: wrap;">
        <div>
          <p class="tag">${getCategoryLabel(equipe.categorie)}</p>
          <h2>${escapeHtml(equipe.nom)}</h2>
          <p>${escapeHtml(equipe.nom_club)} - ${escapeHtml(equipe.ville)}</p>
        </div>
        <div class="color-preview" style="
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, ${escapeHtml(equipe.couleur_maillot)}, ${escapeHtml(equipe.couleur_maillot)}dd);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
          Maillot
        </div>
      </div>
    </section>

    <section class="grid-cards">
      <article class="info-card">
        <h3>Informations</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Catégorie:</strong> ${getCategoryLabel(equipe.categorie)}</li>
          <li><strong>Club:</strong> ${escapeHtml(equipe.nom_club)}</li>
          <li><strong>Ville:</strong> ${escapeHtml(equipe.ville)}</li>
          <li><strong>Créée le:</strong> ${new Date(equipe.date_creation).toLocaleDateString('fr-FR')}</li>
          <li><strong>Joueurs:</strong> ${equipe.nb_joueurs}/${equipe.nb_joueurs_max}</li>
        </ul>
      </article>

      ${equipe.coach_nom ? `
      <article class="info-card">
        <h3>Entraîneur</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Nom:</strong> ${escapeHtml(equipe.coach_prenom)} ${escapeHtml(equipe.coach_nom)}</li>
          ${coachEmailItem}
        </ul>
      </article>
      ` : `
      <article class="info-card">
        <h3>Entraîneur</h3>
        <p>Aucun entraîneur assigné pour le moment.</p>
      </article>
      `}

      <article class="info-card">
        <h3>Contact Club</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Club:</strong> ${escapeHtml(equipe.nom_club)}</li>
          ${clubEmailItem}
          ${clubTelephoneItem}
        </ul>
      </article>
    </section>

    <section class="equipe-section">
      <h3 style="font-size: 1.5rem; margin-bottom: 1.5rem;">Effectif (${joueurs.length} joueurs)</h3>
      
      ${joueurs.length > 0 ? `
        <div class="table-wrapper">
          <table class="team-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Joueur</th>
                <th>Poste</th>
                <th>Taille</th>
                <th>Poids</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              ${joueursHtml}
            </tbody>
          </table>
        </div>
      ` : `
        <p style="text-align: center; color: var(--secondary-text); padding: 2rem;">Aucun joueur dans cette équipe pour le moment.</p>
      `}
    </section>

    <div style="margin-top: 2rem;">
      <a href="/equipe" class="cta cta-outline">← Retour aux équipes</a>
    </div>
  </main>
</body>
</html>`;
}

module.exports = {
  renderEquipePage,
  renderDetailEquipe
};
