const pool = require('./db');

// ── PROFIL & ÉQUIPE ─────────────────────────────────────────────
async function getJoueurProfil(numUser) {
  const [rows] = await pool.query(`
    SELECT
      u.num_user,
      u.prenom,
      u.nom,
      u.email,
      u.telephone,
      u.date_naissance,
      li.statut,
      li.poids_kg,
      li.taille_cm,
      c.nom  AS nom_club,
      c.ville,
      c.email AS email_club,
      c.telephone AS tel_club
    FROM utilisateur u
    JOIN licencie li ON li.num_user = u.num_user
    LEFT JOIN club c ON li.num_club = c.num_club
    WHERE u.num_user = ?
  `, [numUser]);
  return rows[0] || null;
}

async function getJoueurEquipe(numUser) {
  const [rows] = await pool.query(`
    SELECT
      eq.num_equipe,
      eq.nom,
      eq.categorie,
      eq.couleur_maillot,
      eq.date_creation,
      eq.nb_joueurs_max,
      el.date_integration,
      c.nom  AS nom_club,
      c.ville,
      u.prenom AS coach_prenom,
      u.nom    AS coach_nom,
      u.email  AS coach_email,
      COUNT(DISTINCT el2.num_user) AS nb_joueurs
    FROM equipe_licencie el
    JOIN equipe eq ON eq.num_equipe = el.num_equipe
    LEFT JOIN club c ON eq.num_club = c.num_club
    LEFT JOIN utilisateur u ON eq.num_coach = u.num_user
    LEFT JOIN equipe_licencie el2 ON el2.num_equipe = eq.num_equipe
    WHERE el.num_user = ?
    GROUP BY eq.num_equipe, el.date_integration
  `, [numUser]);
  return rows[0] || null;
}

async function getCoequipiers(numEquipe, numUser) {
  const [rows] = await pool.query(`
    SELECT
      u.prenom,
      u.nom,
      li.statut
    FROM equipe_licencie el
    JOIN utilisateur u ON el.num_user = u.num_user
    JOIN licencie li ON li.num_user = u.num_user
    WHERE el.num_equipe = ? AND el.num_user != ?
    ORDER BY u.nom ASC, u.prenom ASC
  `, [numEquipe, numUser]);
  return rows;
}

// ── LICENCES ────────────────────────────────────────────────────
async function getJoueurLicences(numUser) {
  const [rows] = await pool.query(`
    SELECT
      l.num_licence,
      'licencie' AS type,
      l.date_debut,
      l.date_fin,
      l.validee,
      l.date_validation,
      NULL AS montant_cotisation,
      v.prenom AS validateur_prenom,
      v.nom    AS validateur_nom
    FROM licence_joueur l
    LEFT JOIN utilisateur v ON l.num_validateur = v.num_user
    WHERE l.num_user = ?
    ORDER BY l.date_debut DESC
  `, [numUser]);
  return rows;
}

// ── ÉVÉNEMENTS ──────────────────────────────────────────────────
async function getJoueurEvents(numUser) {
  const [rows] = await pool.query(`
    SELECT
      e.num_evenement,
      e.type,
      e.date_debut,
      e.date_fin,
      e.lieu,
      e.adresse_lieu,
      e.description,
      e.statut,
      p.score,
      p.resultat,
      eq.nom AS nom_equipe
    FROM evenement e
    JOIN participation p ON p.num_evenement = e.num_evenement
    JOIN equipe eq ON eq.num_equipe = p.num_equipe
    JOIN equipe_licencie el ON el.num_equipe = eq.num_equipe
    WHERE el.num_user = ?
    ORDER BY e.date_debut DESC
  `, [numUser]);
  return rows;
}

module.exports = {
  getJoueurProfil,
  getJoueurEquipe,
  getCoequipiers,
  getJoueurLicences,
  getJoueurEvents
};
