const { renderHotbar } = require('./hotbar.view');
const {
  escapeHtml,
  formatDate,
  formatDateTime,
  getTypeLabel,
  getStatusLabel
} = require('./view.utils');

function getResultatLabel(resultat) {
  return { victoire: '✓ Victoire', defaite: '✗ Défaite', nul: '= Nul', forfait: '⚠ Forfait' }[resultat] || '—';
}

function getResultatClass(resultat) {
  return { victoire: 'status-actif', defaite: 'status-suspendu', nul: 'status-inactif', forfait: 'status-inactif' }[resultat] || '';
}

// ── LAYOUT PARTAGÉ ──────────────────────────────────────────────
function renderJoueurLayout({ title, user, content }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - AngeMa Volley</title>
  <link rel="stylesheet" href="/css/style.css">
  <script src="/js/theme-toggle.js" defer></script>
</head>
<body>
  <header class="topbar">
    <a class="logo" href="/">AngeMa Volley</a>
    ${renderHotbar(user)}
  </header>
  <main class="page">
    ${content}
  </main>
</body>
</html>`;
}

// ── PAGE ÉQUIPE ─────────────────────────────────────────────────
function renderJoueurEquipe({ user, profil, equipe, coequipiers }) {
  const profilSection = profil ? `
    <div class="grid-cards" style="margin-bottom: 2rem;">
      <article class="info-card">
        <h3>Mon profil</h3>
        <ul style="list-style:none; padding:0;">
          <li><strong>Taille :</strong> ${profil.taille_cm ? profil.taille_cm + ' cm' : '—'}</li>
          <li><strong>Poids :</strong> ${profil.poids_kg ? profil.poids_kg + ' kg' : '—'}</li>
          <li><strong>Club :</strong> ${escapeHtml(profil.nom_club || '—')}</li>
          <li><strong>Statut :</strong>
            <span class="status-badge status-${escapeHtml(profil.statut)}">${escapeHtml(profil.statut)}</span>
          </li>
        </ul>
      </article>

      ${equipe ? `
      <article class="info-card">
        <h3>Mon équipe</h3>
        <ul style="list-style:none; padding:0;">
          <li><strong>Équipe :</strong> ${escapeHtml(equipe.nom)}</li>
          <li><strong>Intégré le :</strong> ${formatDate(equipe.date_integration)}</li>
          <li><strong>Joueurs :</strong> ${equipe.nb_joueurs}/${equipe.nb_joueurs_max}</li>
        </ul>
      </article>

      <article class="info-card">
        <h3>Mon coach</h3>
        ${equipe.coach_prenom ? `
          <ul style="list-style:none; padding:0;">
            <li><strong>Nom :</strong> ${escapeHtml(equipe.coach_prenom)} ${escapeHtml(equipe.coach_nom)}</li>
            <li><strong>Email :</strong> ${escapeHtml(equipe.coach_email || '—')}</li>
          </ul>
        ` : '<p>Aucun coach assigné.</p>'}
      </article>
      ` : `
      <article class="info-card">
        <h3>Mon équipe</h3>
        <p>Tu n'es assigné à aucune équipe pour le moment.</p>
      </article>
      `}
    </div>
  ` : '';

  const couleurPreview = equipe ? `
    <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem;">
      <div style="width:48px; height:48px; border-radius:8px; background:${escapeHtml(equipe.couleur_maillot)}; border:2px solid var(--border);"></div>
      <span style="color:var(--muted-text); font-size:0.9rem;">Couleur du maillot</span>
    </div>
  ` : '';

  const coequipiersSection = equipe && coequipiers.length > 0 ? `
    <section class="equipe-section">
      <h3 style="font-size:1.3rem; margin-bottom:1.2rem;">
        Mes coéquipiers (${coequipiers.length})
      </h3>
      ${couleurPreview}
      <div class="table-wrapper">
        <table class="team-table">
          <thead><tr>
            <th>Joueur</th><th>Statut</th>
          </tr></thead>
          <tbody>
            ${coequipiers.map(j => `
              <tr>
                <td>
                  ${escapeHtml(j.prenom)} ${escapeHtml(j.nom)}
                </td>
                <td><span class="status-badge status-${escapeHtml(j.statut)}">${escapeHtml(j.statut)}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  ` : equipe ? `
    <section class="equipe-section">
      <p class="empty-state">Aucun autre joueur dans ton équipe pour le moment.</p>
    </section>
  ` : '';

  const content = `
    <section class="hero-card" style="margin-bottom:1.5rem;">
      <p class="tag">Espace joueur</p>
      <h2>Mon équipe</h2>
      <p>Retrouve ici toutes les informations sur ton équipe et tes coéquipiers.</p>
    </section>
    ${profilSection}
    ${coequipiersSection}
  `;

  return renderJoueurLayout({ title: 'Mon équipe', user, content });
}

// ── PAGE LICENCES ───────────────────────────────────────────────
function renderJoueurLicences({ user, licences }) {
  const licenceActive = licences.find(l => l.validee && new Date(l.date_fin) >= new Date());

  const statutGlobal = licenceActive
    ? `<div class="alert-success">✓ Tu as une licence valide jusqu'au ${formatDate(licenceActive.date_fin)}.</div>`
    : `<div class="alert-warning">
        ⚠ Aucune licence active. Rapproche-toi de ton responsable de club.
      </div>`;

  const rows = licences.length ? licences.map(l => `
    <tr>
      <td><span class="event-chip type-${escapeHtml(l.type)}">${escapeHtml(l.type)}</span></td>
      <td>${formatDate(l.date_debut)}</td>
      <td>${formatDate(l.date_fin)}</td>
      <td>${l.montant_cotisation ? escapeHtml(String(l.montant_cotisation)) + ' €' : '—'}</td>
      <td>
        ${l.validee
          ? `<span class="status-badge status-actif">Validée</span>`
          : `<span class="status-badge status-suspendu">En attente</span>`
        }
      </td>
      <td>
        ${l.validee
          ? `${escapeHtml(l.validateur_prenom || '')} ${escapeHtml(l.validateur_nom || '')}<br>
             <small style="color:var(--muted-text)">${formatDateTime(l.date_validation)}</small>`
          : '—'
        }
      </td>
    </tr>
  `).join('') : `<tr><td colspan="6" style="text-align:center; color:var(--muted-text); padding:1.5rem;">Aucune licence trouvée.</td></tr>`;

  const content = `
    <section class="hero-card" style="margin-bottom:1.5rem;">
      <p class="tag">Espace joueur</p>
      <h2>Mes licences</h2>
      <p>Historique de toutes tes licences et leur statut de validation.</p>
    </section>

    ${statutGlobal}

    <section class="equipe-section">
      <div class="table-wrapper">
        <table class="team-table">
          <thead><tr>
            <th>Type</th><th>Début</th><th>Fin</th>
            <th>Cotisation</th><th>Statut</th><th>Validée par</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;

  return renderJoueurLayout({ title: 'Mes licences', user, content });
}

// ── PAGE ÉVÉNEMENTS ─────────────────────────────────────────────
function renderJoueurEvents({ user, events }) {
  const aVenir  = events.filter(e => e.statut === 'planifie' || e.statut === 'en_cours');
  const passes  = events.filter(e => e.statut === 'termine' || e.statut === 'annule');

  function renderEventRows(list) {
    if (!list.length) {
      return '<tr><td colspan="6" style="text-align:center; color:var(--muted-text); padding:1.5rem;">Aucun événement.</td></tr>';
    }
    return list.map(e => `
      <tr>
        <td><span class="event-chip type-${escapeHtml(e.type)}">${getTypeLabel(e.type)}</span></td>
        <td>
          ${escapeHtml(e.description || 'Événement')}<br>
          <small style="color:var(--muted-text)">${escapeHtml(e.lieu || '—')}</small>
        </td>
        <td>${formatDateTime(e.date_debut)}</td>
        <td>${escapeHtml(e.nom_equipe)}</td>
        <td><span class="event-chip status-${escapeHtml(e.statut)}">${getStatusLabel(e.statut)}</span></td>
        <td>
          ${e.resultat
            ? `<span class="status-badge ${getResultatClass(e.resultat)}">${getResultatLabel(e.resultat)}</span>
               ${e.score ? `<br><small style="color:var(--muted-text)">${escapeHtml(e.score)}</small>` : ''}`
            : '—'
          }
        </td>
      </tr>
    `).join('');
  }

  const content = `
    <section class="hero-card" style="margin-bottom:1.5rem;">
      <p class="tag">Espace joueur</p>
      <h2>Mes événements</h2>
      <p>Tous les matchs, tournois et entraînements de ton équipe.</p>
    </section>

    <section class="equipe-section" style="margin-bottom:2rem;">
      <h3 style="font-size:1.3rem; margin-bottom:1rem;">
        À venir & en cours (${aVenir.length})
      </h3>
      <div class="table-wrapper">
        <table class="team-table">
          <thead><tr>
            <th>Type</th><th>Description</th><th>Date</th>
            <th>Équipe</th><th>Statut</th><th>Résultat</th>
          </tr></thead>
          <tbody>${renderEventRows(aVenir)}</tbody>
        </table>
      </div>
    </section>

    <section class="equipe-section">
      <h3 style="font-size:1.3rem; margin-bottom:1rem; color:var(--muted-text);">
        Passés (${passes.length})
      </h3>
      <div class="table-wrapper">
        <table class="team-table">
          <thead><tr>
            <th>Type</th><th>Description</th><th>Date</th>
            <th>Équipe</th><th>Statut</th><th>Résultat</th>
          </tr></thead>
          <tbody>${renderEventRows(passes)}</tbody>
        </table>
      </div>
    </section>
  `;

  return renderJoueurLayout({ title: 'Mes événements', user, content });
}

module.exports = {
  renderJoueurEquipe,
  renderJoueurLicences,
  renderJoueurEvents
};
