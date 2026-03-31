const pool = require('./db');

async function getHomePageData() {
  const [statsRows] = await pool.query(
    `
      SELECT
        (SELECT COUNT(*) FROM equipe) AS teams,
        (SELECT COUNT(*) FROM licencie WHERE statut = 'actif') AS active_licensed
    `
  );

  const stats = statsRows[0] || { teams: 0, active_licensed: 0 };

  return {
    title: 'AngeMa Volley',
    message: `${stats.active_licensed} licenciés actifs dans ${stats.teams} équipes.`
  };
}

// ── ÉVÉNEMENTS À VENIR ──────────────────────────────────────────
async function getUpcomingEventsForAdmin(limit = 5) {
  const [rows] = await pool.query(`
    SELECT
      e.num_evenement,
      e.type,
      e.date_debut,
      e.description,
      e.lieu,
      e.statut,
      COUNT(DISTINCT p.num_equipe) AS nb_equipes
    FROM evenement e
    LEFT JOIN participation p ON p.num_evenement = e.num_evenement
    WHERE e.date_debut >= NOW() AND e.statut IN ('planifie', 'en_cours')
    GROUP BY e.num_evenement
    ORDER BY e.date_debut ASC
    LIMIT ?
  `, [limit]);
  return rows;
}

async function getUpcomingEventsForUser(numUser, limit = 5) {
  const [rows] = await pool.query(`
    SELECT
      e.num_evenement,
      e.type,
      e.date_debut,
      e.description,
      e.lieu,
      e.statut,
      GROUP_CONCAT(DISTINCT eq.nom ORDER BY eq.nom SEPARATOR ', ') AS equipes
    FROM evenement e
    JOIN participation p ON p.num_evenement = e.num_evenement
    JOIN equipe eq ON eq.num_equipe = p.num_equipe
    WHERE e.date_debut >= NOW() AND e.statut IN ('planifie', 'en_cours')
    AND (
      eq.num_coach = ? OR
      eq.num_equipe IN (
        SELECT DISTINCT el.num_equipe
        FROM equipe_licencie el
        WHERE el.num_user = ?
      )
    )
    GROUP BY e.num_evenement
    ORDER BY e.date_debut ASC
    LIMIT ?
  `, [numUser, numUser, limit]);
  return rows;
}

module.exports = {
  getHomePageData,
  getUpcomingEventsForAdmin,
  getUpcomingEventsForUser
};