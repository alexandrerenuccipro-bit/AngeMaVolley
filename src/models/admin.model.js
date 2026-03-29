const pool = require('./db');

// ── STATS GLOBALES ──────────────────────────────────────────────
async function getAdminStats() {
  const [rows] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM utilisateur WHERE actif = 1)                    AS total_utilisateurs,
      (SELECT COUNT(*) FROM licencie WHERE statut = 'actif')                AS joueurs_actifs,
      (SELECT COUNT(*) FROM licence WHERE validee = 0)                      AS licences_en_attente,
      (SELECT COUNT(*) FROM licence WHERE validee = 1)                      AS licences_validees,
      (SELECT COUNT(*) FROM equipe)                                         AS total_equipes,
      (SELECT COUNT(*) FROM evenement WHERE statut = 'planifie')            AS events_a_venir,
      (SELECT COUNT(*) FROM coach)                                          AS total_coachs,
      (SELECT COUNT(*) FROM club)                                           AS total_clubs
  `);
  return rows[0];
}

// ── LICENCES ────────────────────────────────────────────────────
async function getAllLicences() {
  const [rows] = await pool.query(`
    SELECT
      l.num_licence,
      l.type,
      l.date_debut,
      l.date_fin,
      l.validee,
      l.date_validation,
      l.montant_cotisation,
      u.num_user,
      u.prenom,
      u.nom,
      u.email,
      c.nom AS nom_club,
      c.ville,
      v.prenom AS validateur_prenom,
      v.nom    AS validateur_nom
    FROM licence l
    JOIN utilisateur u ON l.num_user = u.num_user
    LEFT JOIN licencie li ON li.num_user = u.num_user
    LEFT JOIN club c ON li.num_club = c.num_club
    LEFT JOIN utilisateur v ON l.num_validateur = v.num_user
    ORDER BY l.validee ASC, l.date_debut DESC
  `);
  return rows;
}

async function validerLicence(numLicence, numValidateur) {
  const [result] = await pool.query(`
    UPDATE licence
    SET validee = 1,
        num_validateur = ?,
        date_validation = NOW()
    WHERE num_licence = ? AND validee = 0
  `, [numValidateur, numLicence]);
  return result.affectedRows > 0;
}

async function invaliderLicence(numLicence) {
  const [result] = await pool.query(`
    UPDATE licence
    SET validee = 0,
        num_validateur = NULL,
        date_validation = NULL
    WHERE num_licence = ?
  `, [numLicence]);
  return result.affectedRows > 0;
}

// ── JOUEURS ─────────────────────────────────────────────────────
async function getAllJoueurs() {
  const [rows] = await pool.query(`
    SELECT
      u.num_user,
      u.prenom,
      u.nom,
      u.email,
      u.telephone,
      u.date_naissance,
      u.date_inscription,
      u.actif,
      li.statut,
      li.position,
      li.poids_kg,
      li.taille_cm,
      c.nom  AS nom_club,
      c.ville,
      (
        SELECT COUNT(*)
        FROM licence lc
        WHERE lc.num_user = u.num_user AND lc.validee = 1
      ) AS nb_licences_validees
    FROM utilisateur u
    JOIN licencie li ON li.num_user = u.num_user
    LEFT JOIN club c ON li.num_club = c.num_club
    ORDER BY li.statut ASC, u.nom ASC
  `);
  return rows;
}

// ── COACHS ──────────────────────────────────────────────────────
async function getAllCoachs() {
  const [rows] = await pool.query(`
    SELECT
      u.num_user,
      u.prenom,
      u.nom,
      u.email,
      u.telephone,
      u.actif,
      co.specialite,
      co.diplome,
      co.annees_experience,
      GROUP_CONCAT(DISTINCT eq.nom ORDER BY eq.nom SEPARATOR ', ') AS equipes
    FROM utilisateur u
    JOIN coach co ON co.num_user = u.num_user
    LEFT JOIN equipe eq ON eq.num_coach = u.num_user
    GROUP BY u.num_user
    ORDER BY u.nom ASC
  `);
  return rows;
}

// ── ÉVÉNEMENTS ──────────────────────────────────────────────────
async function getAllEvents() {
  const [rows] = await pool.query(`
    SELECT
      e.num_evenement,
      e.type,
      e.date_debut,
      e.date_fin,
      e.lieu,
      e.description,
      e.nb_places_max,
      e.statut,
      u.prenom AS createur_prenom,
      u.nom    AS createur_nom,
      GROUP_CONCAT(DISTINCT eq.nom ORDER BY eq.nom SEPARATOR ', ') AS equipes
    FROM evenement e
    LEFT JOIN utilisateur u ON e.createur = u.num_user
    LEFT JOIN participation p ON p.num_evenement = e.num_evenement
    LEFT JOIN equipe eq ON eq.num_equipe = p.num_equipe
    GROUP BY e.num_evenement
    ORDER BY e.date_debut DESC
  `);
  return rows;
}

module.exports = {
  getAdminStats,
  getAllLicences,
  validerLicence,
  invaliderLicence,
  getAllJoueurs,
  getAllCoachs,
  getAllEvents
};
