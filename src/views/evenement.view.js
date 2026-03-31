const { renderHotbar } = require('./hotbar.view');
const { escapeHtml, selectedAttr, checkedAttr } = require('./view.utils');

function renderTeamChoices(teams, selectedTeamIds) {
  if (!teams.length) {
    return '<p class="event-form-help">Aucune equipe disponible pour votre role.</p>';
  }

  return `
    <div class="event-team-list" role="group" aria-label="Equipes concernees">
      ${teams
        .map(
          (team) => `
            <label class="event-team-item">
              <input type="checkbox" name="team_ids" value="${team.num_equipe}" ${checkedAttr(selectedTeamIds.includes(Number(team.num_equipe)))}>
              <span>${escapeHtml(team.nom)}</span>
            </label>
          `
        )
        .join('')}
    </div>
  `;
}

function renderEvenementPage({ user, teams, values, error, success }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Creation d'evenement - AngeMa Volley</title>
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
      <p class="tag">Evenements</p>
      <h2>Creer un evenement</h2>
      <p>Remplissez les informations pour planifier un nouvel evenement du club.</p>
    </section>

    <section class="event-form-card">
      ${error ? `<p class="auth-error" role="alert">${escapeHtml(error)}</p>` : ''}
      ${success ? `<p class="event-success" role="status">${escapeHtml(success)}</p>` : ''}

      <form class="event-form" method="POST" action="/evenements">
        <div class="event-form-grid">
          <label>
            Type d'evenement
            <select name="type" required>
              <option value="entrainement" ${selectedAttr(values.type === 'entrainement')}>Entrainement</option>
              <option value="tournoi" ${selectedAttr(values.type === 'tournoi')}>Tournoi</option>
              <option value="match" ${selectedAttr(values.type === 'match')}>Match</option>
              <option value="autre" ${selectedAttr(values.type === 'autre')}>Autre</option>
            </select>
          </label>

          <label>
            Date de debut
            <input type="datetime-local" name="date_debut" value="${escapeHtml(values.dateDebut)}" required>
          </label>

          <label>
            Date de fin
            <input type="datetime-local" name="date_fin" value="${escapeHtml(values.dateFin)}" required>
          </label>

          <label>
            Lieu
            <input type="text" name="lieu" value="${escapeHtml(values.lieu)}" maxlength="200" required>
          </label>

          <label>
            Adresse du lieu
            <input type="text" name="adresse_lieu" value="${escapeHtml(values.adresseLieu)}" maxlength="255">
          </label>

          <label>
            Nombre de places max
            <input type="number" name="nb_places_max" value="${escapeHtml(values.nbPlacesMax)}" min="1" step="1">
          </label>

          <label>
            Statut
            <select name="statut" required>
              <option value="planifie" ${selectedAttr(values.statut === 'planifie')}>Planifie</option>
              <option value="en_cours" ${selectedAttr(values.statut === 'en_cours')}>En cours</option>
              <option value="termine" ${selectedAttr(values.statut === 'termine')}>Termine</option>
              <option value="annule" ${selectedAttr(values.statut === 'annule')}>Annule</option>
            </select>
          </label>
        </div>

        <label>
          Description
          <textarea name="description" rows="4" required>${escapeHtml(values.description)}</textarea>
        </label>

        <fieldset class="event-team-fieldset">
          <legend>Equipes concernees (optionnel)</legend>
          ${renderTeamChoices(teams, values.teamIds)}
        </fieldset>

        <div class="hero-actions">
          <button class="cta" type="submit">Creer l'evenement</button>
          <a href="/calendrier" class="cta cta-outline">Voir le calendrier</a>
        </div>
      </form>
    </section>
  </main>
</body>
</html>`;
}

module.exports = {
  renderEvenementPage
};
