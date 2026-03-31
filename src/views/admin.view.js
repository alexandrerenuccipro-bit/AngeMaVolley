const { renderHotbar } = require('./hotbar.view');
const { escapeHtml, formatDate, formatDateTime } = require('./view.utils');

// ── LAYOUT PARTAGÉ ──────────────────────────────────────────────
function renderAdminLayout({ title, user, content }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - Admin AngeMa Volley</title>
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

// ── DASHBOARD ───────────────────────────────────────────────────
function renderAdminDashboard({ user, stats }) {
  const content = `
    <section class="hero-card" style="margin-bottom: 1.5rem;">
      <p class="tag">Administration</p>
      <h2>Dashboard Admin</h2>
      <p>Bienvenue ${escapeHtml(user.prenom)}. Voici l'état global de la plateforme.</p>
    </section>

    <div class="stat-grid">
      <div class="stat-card">
        <span class="stat-value">${stats.total_utilisateurs}</span>
        <span class="stat-label">Utilisateurs actifs</span>
      </div>
      <div class="stat-card success">
        <span class="stat-value">${stats.joueurs_actifs}</span>
        <span class="stat-label">Joueurs actifs</span>
      </div>
      <div class="stat-card ${stats.licences_en_attente > 0 ? 'warning' : 'success'}">
        <span class="stat-value">${stats.licences_en_attente}</span>
        <span class="stat-label">Licences en attente</span>
      </div>
      <div class="stat-card success">
        <span class="stat-value">${stats.licences_validees}</span>
        <span class="stat-label">Licences validées</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">${stats.total_equipes}</span>
        <span class="stat-label">Équipes</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">${stats.events_a_venir}</span>
        <span class="stat-label">Événements planifiés</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">${stats.total_coachs}</span>
        <span class="stat-label">Coachs</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">${stats.total_clubs}</span>
        <span class="stat-label">Clubs</span>
      </div>
    </div>

    ${stats.licences_en_attente > 0 ? `
      <section class="info-card" style="border-left: 4px solid var(--warning);">
        <h3 style="color: var(--warning);">⚠ Action requise</h3>
        <p>${stats.licences_en_attente} licence(s) en attente de validation.</p>
        <a href="/admin/licences" class="cta" style="margin-top: 0.5rem; display: inline-block;">
          Gérer les licences
        </a>
      </section>
    ` : `
      <section class="info-card" style="border-left: 4px solid var(--success);">
        <h3 style="color: var(--success);">✓ Tout est à jour</h3>
        <p>Aucune licence en attente de validation.</p>
      </section>
    `}
  `;

  return renderAdminLayout({ title: 'Dashboard', user, content });
}

// ── LICENCES ────────────────────────────────────────────────────
function renderAdminLicences({ user, licences, success }) {
  const successMsg = success === 'valide'
    ? '<div class="alert-success">✓ Demande de licence validée avec succès.</div>'
    : success === 'invalide'
    ? '<div class="alert-success">✓ Demande de licence refusée.</div>'
    : '';

  const enAttente = licences.filter((l) => l.statut === 'en_attente');

  function renderLicenceRows(list, showActions) {
    if (!list.length) {
      return '<tr><td colspan="7" style="text-align:center; color: var(--muted-text); padding: 1.5rem;">Aucune licence.</td></tr>';
    }
    return list.map(l => `
      <tr>
        <td><strong>${escapeHtml(l.prenom)} ${escapeHtml(l.nom)}</strong><br>
          <small style="color:var(--muted-text)">${escapeHtml(l.email)}</small></td>
        <td>${escapeHtml(l.nom_club || '—')}<br>
          <small style="color:var(--muted-text)">${escapeHtml(l.ville || '')}</small></td>
        <td><span class="event-chip type-${escapeHtml(l.type_demande)}">${escapeHtml(l.type_demande)}</span></td>
        <td>${formatDateTime(l.date_demande)}</td>
        <td>${formatDateTime(l.date_traitement)}</td>
        <td>
          ${l.statut === 'validee'
            ? `<span class="status-badge status-actif">Validée</span><br>
               <small style="color:var(--muted-text)">${formatDateTime(l.date_traitement)}</small>`
            : l.statut === 'refusee'
            ? '<span class="status-badge status-inactif">Refusée</span>'
            : '<span class="status-badge status-suspendu">En attente</span>'
          }
        </td>
        <td>
          ${showActions && l.statut === 'en_attente' ? `
            <form method="POST" action="/admin/licences/${encodeURIComponent(l.type_demande)}/${l.num_demande}/valider" style="display:inline">
              <button class="action-btn btn-success" type="submit">✓ Valider</button>
            </form>
          ` : ''}
          ${showActions && l.statut === 'en_attente' ? `
            <form method="POST" action="/admin/licences/${encodeURIComponent(l.type_demande)}/${l.num_demande}/invalider" style="display:inline">
              <button class="action-btn btn-danger" type="submit"
                onclick="return confirm('Refuser cette demande ?')">✗ Refuser</button>
            </form>
          ` : ''}
        </td>
      </tr>
    `).join('');
  }

  const content = `
    <section class="hero-card" style="margin-bottom: 1.5rem;">
      <p class="tag">Administration</p>
      <h2>Gestion des licences</h2>
    </section>

    ${successMsg}

    <section class="equipe-section" style="margin-bottom: 2rem;">
      <h3 style="font-size: 1.3rem; margin-bottom: 1rem; color: var(--warning);">
        En attente (${enAttente.length})
      </h3>
      <div class="table-wrapper">
        <table class="team-table">
          <thead><tr>
            <th>Joueur</th><th>Club</th><th>Type</th>
            <th>Date demande</th><th>Date traitement</th><th>Statut</th><th>Action</th>
          </tr></thead>
          <tbody>${renderLicenceRows(enAttente, true)}</tbody>
        </table>
      </div>
    </section>
  `;

  return renderAdminLayout({ title: 'Licences', user, content });
}

// ── JOUEURS ─────────────────────────────────────────────────────
function renderAdminJoueurs({ user, joueurs }) {
  const rows = joueurs.map(j => `
    <tr>
      <td>
        <strong>${escapeHtml(j.prenom)} ${escapeHtml(j.nom)}</strong><br>
        <small style="color:var(--muted-text)">${escapeHtml(j.email)}</small>
      </td>
      <td>${escapeHtml(j.nom_club || '—')}<br>
        <small style="color:var(--muted-text)">${escapeHtml(j.ville || '')}</small></td>
      <td>${j.taille_cm ? j.taille_cm + ' cm' : '—'}</td>
      <td>${j.poids_kg ? j.poids_kg + ' kg' : '—'}</td>
      <td>
        <span class="status-badge status-${escapeHtml(j.statut)}">${escapeHtml(j.statut)}</span>
      </td>
      <td>${j.nb_licences_validees > 0
        ? `<span class="status-badge status-actif">${j.nb_licences_validees} validée(s)</span>`
        : '<span class="status-badge status-suspendu">Aucune</span>'
      }</td>
    </tr>
  `).join('');

  const content = `
    <section class="hero-card" style="margin-bottom: 1.5rem;">
      <p class="tag">Administration</p>
      <h2>Liste des joueurs <span style="font-size:1.5rem; color:var(--muted-text)">(${joueurs.length})</span></h2>
    </section>

    <div class="filter-bar">
      <input type="text" id="search-joueurs" placeholder="Rechercher un joueur ou un club..." oninput="filterTable('joueurs-tbody', this.value)">
    </div>

    <section class="equipe-section">
      <div class="table-wrapper">
        <table class="team-table">
          <thead><tr>
            <th>Joueur</th><th>Club</th>
            <th>Taille</th><th>Poids</th><th>Statut</th><th>Licences</th>
          </tr></thead>
          <tbody id="joueurs-tbody">${rows}</tbody>
        </table>
      </div>
    </section>

    <script>
      function filterTable(tbodyId, query) {
        const tbody = document.getElementById(tbodyId);
        const q = query.toLowerCase();
        Array.from(tbody.rows).forEach(row => {
          row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      }
    </script>
  `;

  return renderAdminLayout({ title: 'Joueurs', user, content });
}

// ── COACHS ──────────────────────────────────────────────────────
function renderAdminCoachs({ user, coachs }) {
  const rows = coachs.map(c => `
    <tr>
      <td>
        <strong>${escapeHtml(c.prenom)} ${escapeHtml(c.nom)}</strong><br>
        <small style="color:var(--muted-text)">${escapeHtml(c.email)}</small>
      </td>
      <td>${escapeHtml(c.specialite || '—')}</td>
      <td>${escapeHtml(c.diplome || '—')}</td>
      <td>${c.annees_experience ? c.annees_experience + ' ans' : '—'}</td>
      <td>${escapeHtml(c.equipes || 'Aucune équipe')}</td>
      <td>
        <span class="status-badge ${c.actif ? 'status-actif' : 'status-inactif'}">
          ${c.actif ? 'Actif' : 'Inactif'}
        </span>
      </td>
    </tr>
  `).join('');

  const content = `
    <section class="hero-card" style="margin-bottom: 1.5rem;">
      <p class="tag">Administration</p>
      <h2>Liste des coachs <span style="font-size:1.5rem; color:var(--muted-text)">(${coachs.length})</span></h2>
    </section>

    <div class="filter-bar">
      <input type="text" placeholder="Rechercher un coach, spécialité..." oninput="filterTable('coachs-tbody', this.value)">
    </div>

    <section class="equipe-section">
      <div class="table-wrapper">
        <table class="team-table">
          <thead><tr>
            <th>Coach</th><th>Spécialité</th><th>Diplôme</th>
            <th>Expérience</th><th>Équipes</th><th>Statut</th>
          </tr></thead>
          <tbody id="coachs-tbody">${rows}</tbody>
        </table>
      </div>
    </section>

    <script>
      function filterTable(tbodyId, query) {
        const tbody = document.getElementById(tbodyId);
        const q = query.toLowerCase();
        Array.from(tbody.rows).forEach(row => {
          row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      }
    </script>
  `;

  return renderAdminLayout({ title: 'Coachs', user, content });
}

// ── ÉVÉNEMENTS ──────────────────────────────────────────────────
function renderAdminEvenements({ user, evenements }) {
  function getTypeLabel(type) {
    return { match: 'Match', tournoi: 'Tournoi', entrainement: 'Entraînement', autre: 'Autre' }[type] || type;
  }

  function getStatusLabel(statut) {
    return { planifie: 'Planifié', en_cours: 'En cours', termine: 'Terminé', annule: 'Annulé' }[statut] || statut;
  }

  function formatDateTime(value) {
    if (!value) return '—';
    return new Date(value).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  const rows = evenements.map(e => `
    <tr>
      <td><span class="event-chip type-${escapeHtml(e.type)}">${getTypeLabel(e.type)}</span></td>
      <td>
        <strong>${escapeHtml(e.description || 'Événement')}</strong><br>
        <small style="color:var(--muted-text)">${escapeHtml(e.lieu || '—')}</small>
      </td>
      <td>${formatDateTime(e.date_debut)}</td>
      <td>${e.nb_equipes}</td>
      <td>${escapeHtml(e.equipes || 'Aucune')}</td>
      <td>
        <span class="status-badge status-${escapeHtml(e.statut)}">
          ${getStatusLabel(e.statut)}
        </span>
      </td>
    </tr>
  `).join('');

  const content = `
    <section class="hero-card" style="margin-bottom: 1.5rem;">
      <p class="tag">Administration</p>
      <h2>Liste des événements <span style="font-size:1.5rem; color:var(--muted-text)">(${evenements.length})</span></h2>
    </section>

    <div class="filter-bar">
      <input type="text" placeholder="Rechercher un événement, lieu..." oninput="filterTable('evenements-tbody', this.value)">
    </div>

    <section class="equipe-section">
      <div class="table-wrapper">
        <table class="team-table">
          <thead><tr>
            <th>Type</th><th>Événement</th><th>Date</th>
            <th>Équipes</th><th>Équipes impliquées</th><th>Statut</th>
          </tr></thead>
          <tbody id="evenements-tbody">${rows}</tbody>
        </table>
      </div>
    </section>

    <script>
      function filterTable(tbodyId, query) {
        const tbody = document.getElementById(tbodyId);
        const q = query.toLowerCase();
        Array.from(tbody.rows).forEach(row => {
          row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      }
    </script>
  `;

  return renderAdminLayout({ title: 'Événements', user, content });
}

module.exports = {
  renderAdminDashboard,
  renderAdminLicences,
  renderAdminJoueurs,
  renderAdminCoachs,
  renderAdminEvenements
};
