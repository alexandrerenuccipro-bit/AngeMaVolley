const pool = require('./db');

// ── STATS GLOBALES ──────────────────────────────────────────────
async function getAdminStats() {
  const [rows] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM utilisateur WHERE actif = 1)                    AS total_utilisateurs,
      (SELECT COUNT(*) FROM licencie WHERE statut = 'actif')                AS joueurs_actifs,
      (
        (SELECT COUNT(*) FROM demande_licence_joueur WHERE statut = 'en_attente') +
        (SELECT COUNT(*) FROM demande_licence_coach WHERE statut = 'en_attente')
      )                                                                      AS licences_en_attente,
      (
        (SELECT COUNT(*) FROM demande_licence_joueur WHERE statut = 'validee') +
        (SELECT COUNT(*) FROM demande_licence_coach WHERE statut = 'validee')
      )                                                                      AS licences_validees,
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
      d.num_demande,
      d.type_demande,
      d.statut,
      d.date_demande,
      d.date_traitement,
      u.num_user,
      u.prenom,
      u.nom,
      u.email,
      c.nom AS nom_club,
      c.ville
    FROM (
      SELECT num_demande, num_user, 'licencie' AS type_demande, statut, date_demande, date_traitement
      FROM demande_licence_joueur

      UNION ALL

      SELECT num_demande, num_user, 'coach' AS type_demande, statut, date_demande, date_traitement
      FROM demande_licence_coach
    ) d
    INNER JOIN utilisateur u ON u.num_user = d.num_user
    LEFT JOIN licencie li ON li.num_user = u.num_user
    LEFT JOIN club c ON c.num_club = li.num_club
    ORDER BY CASE WHEN d.statut = 'en_attente' THEN 0 ELSE 1 END, d.date_demande DESC
  `);
  return rows;
}

async function validerLicence(typeDemande, numDemande) {
  const tableName = typeDemande === 'coach'
    ? 'demande_licence_coach'
    : 'demande_licence_joueur';

  const [result] = await pool.query(
    `
      UPDATE ${tableName}
      SET statut = 'validee',
          date_traitement = NOW()
      WHERE num_demande = ? AND statut = 'en_attente'
    `,
    [numDemande]
  );

  return result.affectedRows > 0;
}

async function invaliderLicence(typeDemande, numDemande) {
  const tableName = typeDemande === 'coach'
    ? 'demande_licence_coach'
    : 'demande_licence_joueur';

  const [result] = await pool.query(
    `
      UPDATE ${tableName}
      SET statut = 'refusee',
          date_traitement = NOW()
      WHERE num_demande = ?
    `,
    [numDemande]
  );

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
      li.poids_kg,
      li.taille_cm,
      c.nom  AS nom_club,
      c.ville,
      (
        SELECT COUNT(*)
        FROM licence_joueur lc
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
async function getAllEvenements() {
  const [rows] = await pool.query(`
    SELECT
      e.num_evenement,
      e.type,
      e.date_debut,
      e.date_fin,
      e.lieu,
      e.description,
      e.statut,
      COUNT(DISTINCT p.num_equipe) AS nb_equipes,
      GROUP_CONCAT(DISTINCT eq.nom ORDER BY eq.nom SEPARATOR ', ') AS equipes
    FROM evenement e
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
  getAllEvenements
};
