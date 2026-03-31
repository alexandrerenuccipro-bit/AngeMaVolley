const pool = require('./db');

async function getCreatableTeamsForUser(user) {
  if (user.estAdmin) {
    const [rows] = await pool.query(`
      SELECT num_equipe, nom
      FROM equipe
      ORDER BY nom ASC
    `);

    return rows;
  }

  if (user.role === 'coach') {
    const [rows] = await pool.query(
      `
      SELECT num_equipe, nom
      FROM equipe
      WHERE num_coach = ?
      ORDER BY nom ASC
      `,
      [user.id]
    );

    return rows;
  }

  return [];
}

async function createEventForUser(user, eventData) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [insertResult] = await connection.query(
      `
      INSERT INTO evenement (
        type,
        date_debut,
        date_fin,
        lieu,
        adresse_lieu,
        description,
        nb_places_max,
        statut,
        createur
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        eventData.type,
        eventData.dateDebut,
        eventData.dateFin,
        eventData.lieu,
        eventData.adresseLieu,
        eventData.description,
        eventData.nbPlacesMax,
        eventData.statut,
        user.id
      ]
    );

    const eventId = insertResult.insertId;

    if (eventData.teamIds.length > 0) {
      const values = eventData.teamIds.map((teamId) => [Number(teamId), eventId]);

      await connection.query(
        `
        INSERT INTO participation (num_equipe, num_evenement)
        VALUES ?
        `,
        [values]
      );
    }

    await connection.commit();

    return eventId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  getCreatableTeamsForUser,
  createEventForUser
};
