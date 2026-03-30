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

async function findUserByEmail(email) {
  const [rows] = await pool.query(
    `
      SELECT num_user, email
      FROM utilisateur
      WHERE email = ?
      LIMIT 1
    `,
    [email]
  );

  return rows[0] || null;
}

async function createUser({ nom, prenom, email, motDePasseHash, telephone, dateNaissance }) {
  const [result] = await pool.query(
    `
      INSERT INTO utilisateur (
        nom,
        prenom,
        email,
        mot_de_passe,
        telephone,
        date_naissance,
        role,
        est_admin,
        actif
      ) VALUES (?, ?, ?, ?, ?, ?, 'utilisateur', 0, 1)
    `,
    [nom, prenom, email, motDePasseHash, telephone || null, dateNaissance || null]
  );

  return result.insertId;
}

async function findLicenceRequestByUserId(userId) {
  const requests = await findLicenceRequestsByUserId(userId, 1);
  return requests[0] || null;
}

async function findLicenceRequestsByUserId(userId, limit = 10) {
  const [rows] = await pool.query(
    `
      SELECT *
      FROM (
        SELECT
          num_demande,
          'coach' AS type_demande,
          statut,
          date_demande,
          date_traitement
        FROM demande_licence_coach
        WHERE num_user = ?

        UNION ALL

        SELECT
          num_demande,
          'licencie' AS type_demande,
          statut,
          date_demande,
          date_traitement
        FROM demande_licence_joueur
        WHERE num_user = ?
      ) demandes
      ORDER BY date_demande DESC
      LIMIT ?
    `,
    [userId, userId, Number(limit)]
  );

  return rows;
}

async function findAllLicenceRequests(limit = 50) {
  const [rows] = await pool.query(
    `
      SELECT *
      FROM (
        SELECT
          dlc.num_demande,
          'coach' AS type_demande,
          dlc.statut,
          dlc.date_demande,
          dlc.date_traitement,
          u.num_user,
          u.nom,
          u.prenom,
          u.email
        FROM demande_licence_coach dlc
        INNER JOIN utilisateur u ON u.num_user = dlc.num_user

        UNION ALL

        SELECT
          dlj.num_demande,
          'licencie' AS type_demande,
          dlj.statut,
          dlj.date_demande,
          dlj.date_traitement,
          u.num_user,
          u.nom,
          u.prenom,
          u.email
        FROM demande_licence_joueur dlj
        INNER JOIN utilisateur u ON u.num_user = dlj.num_user
      ) demandes
      ORDER BY
        CASE WHEN statut = 'en_attente' THEN 0 ELSE 1 END,
        date_demande DESC
      LIMIT ?
    `,
    [Number(limit)]
  );

  return rows;
}

async function getClubsList() {
  const [rows] = await pool.query(
    `
      SELECT num_club, nom
      FROM club
      ORDER BY nom ASC
    `
  );

  return rows;
}

async function syncUserRoleWithAcceptedLicence(userId) {
  const [rows] = await pool.query(
    `
      SELECT type_demande
      FROM (
        SELECT
          'coach' AS type_demande,
          statut,
          date_demande,
          date_traitement
        FROM demande_licence_coach
        WHERE num_user = ?

        UNION ALL

        SELECT
          'licencie' AS type_demande,
          statut,
          date_demande,
          date_traitement
        FROM demande_licence_joueur
        WHERE num_user = ?
      ) demandes
      WHERE statut = 'validee'
      ORDER BY date_traitement DESC, date_demande DESC
      LIMIT 1
    `,
    [userId, userId]
  );

  const acceptedRequest = rows[0] || null;
  if (!acceptedRequest) {
    return null;
  }

  const newRole = acceptedRequest.type_demande;
  if (!['licencie', 'coach'].includes(newRole)) {
    return null;
  }

  await pool.query(
    `
      UPDATE utilisateur
      SET role = ?
      WHERE num_user = ?
    `,
    [newRole, userId]
  );

  return newRole;
}

async function createLicenceRequest({ userId, typeDemande }) {
  if (typeDemande === 'coach') {
    throw new Error('Le diplome est obligatoire pour une demande coach.');
  }

  const [result] = await pool.query(
    `
      INSERT INTO demande_licence_joueur (num_user, statut)
      VALUES (?, 'en_attente')
    `,
    [userId]
  );

  return result.insertId;
}

async function createLicenceRequestWithProfile({ userId, typeDemande, licencieData, coachData }) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [requestResult] = await connection.query(
      typeDemande === 'coach'
        ? `
            INSERT INTO demande_licence_coach (num_user, statut, diplome)
            VALUES (?, 'en_attente', ?)
          `
        : `
            INSERT INTO demande_licence_joueur (num_user, statut, poids, taille)
            VALUES (?, 'en_attente', ?, ?)
          `,
      typeDemande === 'coach'
        ? [userId, coachData.diplome]
        : [
            userId,
            licencieData?.poidsKg ?? null,
            licencieData?.tailleCm ?? null
          ]
    );

    if (typeDemande === 'licencie') {
      const { numClub, poidsKg, tailleCm } = licencieData;
      await connection.query(
        `
          INSERT INTO licencie (num_user, statut, num_club, poids_kg, taille_cm)
          VALUES (?, 'inactif', ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            num_club = VALUES(num_club),
            poids_kg = VALUES(poids_kg),
            taille_cm = VALUES(taille_cm)
        `,
        [userId, numClub, poidsKg, tailleCm]
      );
    }

    if (typeDemande === 'coach') {
      const { diplome } = coachData;
      await connection.query(
        `
          INSERT INTO coach (num_user, diplome)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE
            diplome = VALUES(diplome)
        `,
        [userId, diplome]
      );
    }

    await connection.commit();
    return requestResult.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  findActiveUserByEmail,
  findUserByEmail,
  createUser,
  findLicenceRequestByUserId,
  findLicenceRequestsByUserId,
  findAllLicenceRequests,
  createLicenceRequest,
  getClubsList,
  createLicenceRequestWithProfile,
  syncUserRoleWithAcceptedLicence
};