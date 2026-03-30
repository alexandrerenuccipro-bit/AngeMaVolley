const pool = require('./db');

const SORT_OPTIONS = {
  recent: 'e.date_debut DESC',
  ancien: 'e.date_debut ASC',
  type: 'e.type ASC, e.date_debut ASC',
  statut: 'e.statut ASC, e.date_debut ASC'
};

function getSortClause(sort) {
  return SORT_OPTIONS[sort] || SORT_OPTIONS.recent;
}

function buildSharedFilters(filters, params) {
  const clauses = [];

  if (filters.month) {
    const [yearRaw, monthRaw] = String(filters.month).split('-');
    const year = Number(yearRaw);
    const month = Number(monthRaw);

    if (Number.isInteger(year) && Number.isInteger(month) && month >= 1 && month <= 12) {
      const monthStart = new Date(year, month - 1, 1);
      const nextMonthStart = new Date(year, month, 1);

      const monthStartSql = monthStart.toISOString().slice(0, 19).replace('T', ' ');
      const nextMonthStartSql = nextMonthStart.toISOString().slice(0, 19).replace('T', ' ');

      clauses.push('(e.date_debut >= ? AND e.date_debut < ?)');
      params.push(monthStartSql, nextMonthStartSql);
    }
  }

  if (filters.type && filters.type !== 'all') {
    clauses.push('e.type = ?');
    params.push(filters.type);
  }

  if (filters.statut && filters.statut !== 'all') {
    clauses.push('e.statut = ?');
    params.push(filters.statut);
  }

  if (filters.search) {
    clauses.push('(e.description LIKE ? OR e.lieu LIKE ? OR e.adresse_lieu LIKE ?)');
    const likeValue = `%${filters.search}%`;
    params.push(likeValue, likeValue, likeValue);
  }

  return clauses;
}

function buildTeamFilter(filters, params) {
  if (filters.team && filters.team !== 'all') {
    params.push(Number(filters.team));
    return 'AND p.num_equipe = ?';
  }

  return '';
}

async function getCalendarEventsForAdmin(filters) {
  const params = [];
  const whereClauses = buildSharedFilters(filters, params);
  const teamFilter = buildTeamFilter(filters, params);

  const query = `
    SELECT
      e.num_evenement,
      e.type,
      e.date_debut,
      e.date_fin,
      e.lieu,
      e.adresse_lieu,
      e.description,
      e.nb_places_max,
      e.statut,
      GROUP_CONCAT(DISTINCT eq.nom ORDER BY eq.nom SEPARATOR ', ') AS equipes
    FROM evenement e
    LEFT JOIN participation p ON p.num_evenement = e.num_evenement
    LEFT JOIN equipe eq ON eq.num_equipe = p.num_equipe
    WHERE 1 = 1
      ${whereClauses.length ? `AND ${whereClauses.join(' AND ')}` : ''}
      ${teamFilter}
    GROUP BY e.num_evenement
    ORDER BY ${getSortClause(filters.sort)}
  `;

  const [rows] = await pool.query(query, params);

  return rows;
}

async function getCalendarEventsForCoachOrPlayer(user, filters) {
  const filterParams = [];
  const whereClauses = buildSharedFilters(filters, filterParams);
  const teamFilter = buildTeamFilter(filters, filterParams);

  const roleClause = user.role === 'coach'
    ? 'eq.num_coach = ?'
    : `EXISTS (
      SELECT 1
      FROM equipe_licencie el
      WHERE el.num_equipe = eq.num_equipe
        AND el.num_user = ?
    )`;

  const queryParams = [user.id, ...filterParams];

  const query = `
    SELECT
      e.num_evenement,
      e.type,
      e.date_debut,
      e.date_fin,
      e.lieu,
      e.adresse_lieu,
      e.description,
      e.nb_places_max,
      e.statut,
      GROUP_CONCAT(DISTINCT eq.nom ORDER BY eq.nom SEPARATOR ', ') AS equipes
    FROM evenement e
    JOIN participation p ON p.num_evenement = e.num_evenement
    JOIN equipe eq ON eq.num_equipe = p.num_equipe
    WHERE e.type IN ('entrainement', 'tournoi')
      AND ${roleClause}
      ${whereClauses.length ? `AND ${whereClauses.join(' AND ')}` : ''}
      ${teamFilter}
    GROUP BY e.num_evenement
    ORDER BY ${getSortClause(filters.sort)}
  `;

  const [rows] = await pool.query(query, queryParams);

  return rows;
}

async function getVisibleTeamsForUser(user) {
  if (user.estAdmin) {
    const [rows] = await pool.query(`
      SELECT DISTINCT eq.num_equipe, eq.nom
      FROM equipe eq
      JOIN participation p ON p.num_equipe = eq.num_equipe
      ORDER BY eq.nom ASC
    `);

    return rows;
  }

  if (user.role === 'coach') {
    const [rows] = await pool.query(
      `
      SELECT DISTINCT eq.num_equipe, eq.nom
      FROM equipe eq
      JOIN participation p ON p.num_equipe = eq.num_equipe
      WHERE eq.num_coach = ?
      ORDER BY eq.nom ASC
      `,
      [user.id]
    );

    return rows;
  }

  if (user.role === 'licencie') {
    const [rows] = await pool.query(
      `
      SELECT DISTINCT eq.num_equipe, eq.nom
      FROM equipe eq
      JOIN participation p ON p.num_equipe = eq.num_equipe
      JOIN equipe_licencie el ON el.num_equipe = eq.num_equipe
      WHERE el.num_user = ?
      ORDER BY eq.nom ASC
      `,
      [user.id]
    );

    return rows;
  }

  return [];
}

async function getCalendarData(user, filters) {
  const events = user.estAdmin
    ? await getCalendarEventsForAdmin(filters)
    : await getCalendarEventsForCoachOrPlayer(user, filters);

  const teams = await getVisibleTeamsForUser(user);

  return { events, teams };
}

module.exports = {
  getCalendarData
};
