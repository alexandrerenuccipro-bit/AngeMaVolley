const pool = require('./db');

// ── PROFIL & ÉQUIPE ─────────────────────────────────────────────
async function getCoachProfil(numUser) {
  const [rows] = await pool.query(`
    SELECT
      u.num_user,
      u.prenom,
      u.nom,
      u.email,
      u.telephone,
      u.date_naissance,
      co.diplome,
      co.specialite,
      co.annees_experience,
      c.nom  AS nom_club,
      c.ville,
      c.email AS email_club,
      c.telephone AS tel_club
    FROM utilisateur u
    JOIN coach co ON co.num_user = u.num_user
    LEFT JOIN club c ON co.num_club = c.num_club
    WHERE u.num_user = ?
  `, [numUser]);
  return rows[0] || null;
}

async function getCoachEquipe(numUser) {
  const [rows] = await pool.query(`
    SELECT
      eq.num_equipe,
      eq.nom,
      eq.categorie,
      eq.couleur_maillot,
      eq.date_creation,
      eq.nb_joueurs_max,
      c.nom  AS nom_club,
      c.ville,
      COUNT(DISTINCT el.num_user) AS nb_joueurs
    FROM equipe eq
    LEFT JOIN club c ON eq.num_club = c.num_club
    LEFT JOIN equipe_licencie el ON el.num_equipe = eq.num_equipe
    WHERE eq.num_coach = ?
    GROUP BY eq.num_equipe
  `, [numUser]);
  return rows[0] || null;
}

async function getJoueursParCoach(numEquipe) {
  const [rows] = await pool.query(`
    SELECT
      u.num_user,
      u.prenom,
      u.nom,
      u.email,
      u.telephone,
      li.statut,
      li.poids_kg,
      li.taille_cm,
      c.nom AS nom_club
    FROM equipe_licencie el
    JOIN utilisateur u ON el.num_user = u.num_user
    JOIN licencie li ON li.num_user = u.num_user
    LEFT JOIN club c ON li.num_club = c.num_club
    WHERE el.num_equipe = ?
    ORDER BY u.nom ASC, u.prenom ASC
  `, [numEquipe]);
  return rows;
}

// ── ÉVÉNEMENTS ──────────────────────────────────────────────────
async function getCoachEvents(numEquipe) {
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
      p.resultat
    FROM evenement e
    JOIN participation p ON p.num_evenement = e.num_evenement
    WHERE p.num_equipe = ?
    ORDER BY e.date_debut DESC
  `, [numEquipe]);
  return rows;
}

// ── LICENCES ────────────────────────────────────────────────────
async function getCoachLicences(numUser) {
  const [rows] = await pool.query(`
    SELECT
      l.num_licence,
      'coach' AS type,
      l.date_debut,
      l.date_fin,
      l.validee,
      l.date_validation,
      NULL AS montant_cotisation,
      v.prenom AS validateur_prenom,
      v.nom    AS validateur_nom
    FROM licence_coach l
    LEFT JOIN utilisateur v ON l.num_validateur = v.num_user
    WHERE l.num_user = ?
    ORDER BY l.date_debut DESC
  `, [numUser]);
  return rows;
}

module.exports = {
  getCoachProfil,
  getCoachEquipe,
  getJoueursParCoach,
  getCoachEvents,
  getCoachLicences
};
