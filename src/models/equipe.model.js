const pool = require('./db');

async function getAllEquipes() {
  const [rows] = await pool.query(`
    SELECT 
      e.num_equipe,
      e.nom,
      e.categorie,
      e.couleur_maillot,
      e.date_creation,
      e.nb_joueurs_max,
      c.nom as nom_club,
      c.ville,
      u.prenom as coach_prenom,
      u.nom as coach_nom,
      COUNT(DISTINCT el.num_user) as nb_joueurs
    FROM equipe e
    LEFT JOIN club c ON e.num_club = c.num_club
    LEFT JOIN utilisateur u ON e.num_coach = u.num_user
    LEFT JOIN equipe_licencie el ON e.num_equipe = el.num_equipe
    GROUP BY e.num_equipe
    ORDER BY e.categorie DESC, e.nom ASC
  `);

  return rows;
}

async function getEquipeById(numEquipe) {
  const [rows] = await pool.query(`
    SELECT 
      e.num_equipe,
      e.nom,
      e.categorie,
      e.couleur_maillot,
      e.date_creation,
      e.nb_joueurs_max,
      c.nom as nom_club,
      c.ville,
      c.email as club_email,
      c.telephone as club_telephone,
      u.prenom as coach_prenom,
      u.nom as coach_nom,
      u.email as coach_email,
      COUNT(DISTINCT el.num_user) as nb_joueurs
    FROM equipe e
    LEFT JOIN club c ON e.num_club = c.num_club
    LEFT JOIN utilisateur u ON e.num_coach = u.num_user
    LEFT JOIN equipe_licencie el ON e.num_equipe = el.num_equipe
    WHERE e.num_equipe = ?
    GROUP BY e.num_equipe
  `, [numEquipe]);

  return rows[0] || null;
}

async function getJoueursParEquipe(numEquipe) {
  const [rows] = await pool.query(`
    SELECT 
      u.num_user,
      u.prenom,
      u.nom,
      el.numero_maillot,
      el.capitaine,
      el.date_integration,
      l.position,
      l.poids_kg,
      l.taille_cm,
      l.statut
    FROM equipe_licencie el
    JOIN utilisateur u ON el.num_user = u.num_user
    JOIN licencie l ON u.num_user = l.num_user
    WHERE el.num_equipe = ?
    ORDER BY el.numero_maillot ASC
  `, [numEquipe]);

  return rows;
}

module.exports = {
  getAllEquipes,
  getEquipeById,
  getJoueursParEquipe
};
