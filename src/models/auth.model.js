const pool = require('./db');

async function findActiveUserByEmail(email) {
  const [rows] = await pool.query(
    `
      SELECT num_user, nom, prenom, email, mot_de_passe, role, est_admin, actif
      FROM utilisateur
      WHERE email = ? AND actif = 1
      LIMIT 1
    `,
    [email]
  );

  return rows[0] || null;
}

async function findUserTeamNamesForDashboard(user) {
  if (!user || user.estAdmin) {
    return [];
  }

  if (user.role === 'coach') {
    const [rows] = await pool.query(
      `
      SELECT DISTINCT e.nom
      FROM equipe e
      WHERE e.num_coach = ?
      ORDER BY e.nom ASC
      `,
      [user.id]
    );

    return rows.map((row) => row.nom);
  }

  if (user.role === 'licencie') {
    const [rows] = await pool.query(
      `
      SELECT DISTINCT e.nom
      FROM equipe_licencie el
      JOIN equipe e ON e.num_equipe = el.num_equipe
      WHERE el.num_user = ?
      ORDER BY e.nom ASC
      `,
      [user.id]
    );

    return rows.map((row) => row.nom);
  }

  return [];
}

module.exports = {
  findActiveUserByEmail,
  findUserTeamNamesForDashboard
};