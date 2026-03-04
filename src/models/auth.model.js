const pool = require('./db');

async function findActiveUserByEmail(email) {
  const [rows] = await pool.query(
    `
      SELECT num_user, nom, prenom, email, mot_de_passe, role, actif
      FROM utilisateur
      WHERE email = ? AND actif = 1
      LIMIT 1
    `,
    [email]
  );

  return rows[0] || null;
}

module.exports = {
  findActiveUserByEmail
};