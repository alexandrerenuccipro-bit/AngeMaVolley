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

module.exports = {
  getHomePageData
};