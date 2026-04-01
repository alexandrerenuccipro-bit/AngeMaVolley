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

async function assignLicencieToClubTeam(numUser) {
  const [existingAssignment] = await pool.query(
    `
      SELECT 1
      FROM equipe_licencie
      WHERE num_user = ?
      LIMIT 1
    `,
    [numUser]
  );

  if (existingAssignment.length) {
    return false;
  }

  const [licencieRows] = await pool.query(
    `
      SELECT num_club
      FROM licencie
      WHERE num_user = ?
      LIMIT 1
    `,
    [numUser]
  );

  const numClub = licencieRows[0]?.num_club;
  if (!numClub) {
    return false;
  }

  const [teamRows] = await pool.query(
    `
      SELECT
        eq.num_equipe,
        COUNT(el.num_user) AS nb_joueurs
      FROM equipe eq
      LEFT JOIN equipe_licencie el ON el.num_equipe = eq.num_equipe
      WHERE eq.num_club = ?
      GROUP BY eq.num_equipe, eq.nb_joueurs_max
      HAVING COUNT(el.num_user) < COALESCE(eq.nb_joueurs_max, 999999)
      ORDER BY nb_joueurs ASC, eq.date_creation ASC, eq.num_equipe ASC
      LIMIT 1
    `,
    [numClub]
  );

  const numEquipe = teamRows[0]?.num_equipe;
  if (!numEquipe) {
    return false;
  }

  await pool.query(
    `
      INSERT INTO equipe_licencie (num_equipe, num_user, date_integration)
      VALUES (?, ?, CURDATE())
    `,
    [numEquipe, numUser]
  );

  return true;
}

async function validerLicence(typeDemande, numDemande, numValidateur = null) {
  const tableName = typeDemande === 'coach'
    ? 'demande_licence_coach'
    : 'demande_licence_joueur';

  const [requestRows] = await pool.query(
    `
      SELECT num_user, statut
      FROM ${tableName}
      WHERE num_demande = ?
      LIMIT 1
    `,
    [numDemande]
  );

  const request = requestRows[0] || null;
  if (request?.statut !== 'en_attente') {
    return false;
  }

  const [result] = await pool.query(
    `
      UPDATE ${tableName}
      SET statut = 'validee',
          date_traitement = NOW()
      WHERE num_demande = ? AND statut = 'en_attente'
    `,
    [numDemande]
  );

  if (!result.affectedRows) {
    return false;
  }

  if (typeDemande === 'coach') {
    await pool.query(
      `
        INSERT INTO licence_coach (
          num_user,
          date_debut,
          date_fin,
          validee,
          num_validateur,
          date_validation
        )
        VALUES (?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 1, ?, NOW())
      `,
      [request.num_user, numValidateur]
    );
  } else {
    await pool.query(
      `
        INSERT INTO licence_joueur (
          num_user,
          date_debut,
          date_fin,
          validee,
          num_validateur,
          date_validation
        )
        VALUES (?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 1, ?, NOW())
      `,
      [request.num_user, numValidateur]
    );

    await pool.query(
      `
        UPDATE licencie
        SET statut = 'actif'
        WHERE num_user = ?
      `,
      [request.num_user]
    );

    await assignLicencieToClubTeam(request.num_user);
  }

  return true;
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
