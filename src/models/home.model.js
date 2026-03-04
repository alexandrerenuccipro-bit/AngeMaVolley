const pool = require('./db');

function formatEventDate(dateValue) {
  if (!dateValue) {
    return 'Date non définie';
  }

  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateValue));
}

async function getHomePageData() {
  const [statsRows] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM club) AS clubs,
      (SELECT COUNT(*) FROM equipe) AS teams,
      (SELECT COUNT(*) FROM licencie WHERE statut = 'actif') AS active_licensed,
      (SELECT COUNT(*) FROM evenement WHERE statut = 'planifie') AS planned_events
  `);

  const [nextEventRows] = await pool.query(`
    SELECT type, date_debut, lieu, description
    FROM evenement
    WHERE statut = 'planifie'
    ORDER BY date_debut ASC
    LIMIT 1
  `);

  let nextEvent = nextEventRows[0] || null;

  if (!nextEvent) {
    const [fallbackEventRows] = await pool.query(`
      SELECT type, date_debut, lieu, description
      FROM evenement
      ORDER BY date_debut DESC
      LIMIT 1
    `);

    nextEvent = fallbackEventRows[0] || null;
  }

  const [positionsRows] = await pool.query(`
    SELECT position, COUNT(*) AS total
    FROM licencie
    WHERE position IS NOT NULL AND position <> ''
    GROUP BY position
    ORDER BY total DESC, position ASC
    LIMIT 4
  `);

  const [latestTeamRows] = await pool.query(`
    SELECT nom, categorie, couleur_maillot
    FROM equipe
    ORDER BY date_creation DESC, num_equipe DESC
    LIMIT 1
  `);

  const stats = statsRows[0] || {
    clubs: 0,
    teams: 0,
    active_licensed: 0,
    planned_events: 0
  };

  const latestTeam = latestTeamRows[0] || null;

  return {
    title: 'AngeMa Volley',
    message: `${stats.active_licensed} licenciés actifs dans ${stats.teams} équipes.`,
    nextEvent: nextEvent
      ? {
          title: `Prochain ${nextEvent.type}`,
          dateLabel: formatEventDate(nextEvent.date_debut),
          location: nextEvent.lieu || 'Lieu à confirmer',
          description: nextEvent.description || 'Aucune description disponible'
        }
      : {
          title: 'Aucun événement',
          dateLabel: 'Pas de planification en cours',
          location: '—',
          description: 'Aucun événement enregistré pour le moment.'
        },
    stats: {
      clubs: Number(stats.clubs || 0),
      teams: Number(stats.teams || 0),
      activeLicensed: Number(stats.active_licensed || 0),
      plannedEvents: Number(stats.planned_events || 0)
    },
    latestTeam: latestTeam
      ? `${latestTeam.nom} (${latestTeam.categorie}) · ${latestTeam.couleur_maillot || 'Couleur non renseignée'}`
      : 'Aucune équipe enregistrée',
    keyPositions:
      positionsRows.length > 0
        ? positionsRows.map((row) => `${row.position} (${row.total})`)
        : ['Aucun poste enregistré']
  };
}

module.exports = {
  getHomePageData
};