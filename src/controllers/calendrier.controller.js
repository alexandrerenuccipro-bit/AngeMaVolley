const { getCalendarData } = require('../models/calendrier.model');
const { renderCalendrierPage } = require('../views/calendrier.view');

const ALLOWED_TYPES = new Set(['all', 'match', 'tournoi', 'entrainement', 'autre']);
const ALLOWED_STATUS = new Set(['all', 'planifie', 'en_cours', 'termine', 'annule']);
const ALLOWED_SORT = new Set(['recent', 'ancien', 'type', 'statut']);
const ALLOWED_VIEW = new Set(['calendar', 'list']);

function sanitizeFilters(query, isAdmin) {
  const requestedType = String(query.type || 'all').trim();
  const type = ALLOWED_TYPES.has(requestedType) ? requestedType : 'all';

  const requestedStatus = String(query.statut || 'all').trim();
  const statut = ALLOWED_STATUS.has(requestedStatus) ? requestedStatus : 'all';

  const requestedSort = String(query.sort || 'recent').trim();
  const sort = ALLOWED_SORT.has(requestedSort) ? requestedSort : 'recent';

  const requestedView = String(query.view || 'calendar').trim();
  const view = ALLOWED_VIEW.has(requestedView) ? requestedView : 'calendar';

  const requestedTeam = String(query.team || 'all').trim();
  const team = requestedTeam === 'all' || /^\d+$/.test(requestedTeam) ? requestedTeam : 'all';

  const search = String(query.search || '').trim().slice(0, 100);

  const requestedMonth = String(query.month || '').trim();
  const month = /^\d{4}-\d{2}$/.test(requestedMonth) ? requestedMonth : null;

  const requestedEvent = String(query.event || '').trim();
  const event = /^\d+$/.test(requestedEvent) ? requestedEvent : null;

  let sanitizedType = type;

  if (!isAdmin && (type === 'match' || type === 'autre')) {
    sanitizedType = 'all';
  }

  return {
    type: sanitizedType,
    statut,
    sort,
    view,
    team,
    search,
    month,
    event
  };
}

exports.showCalendrier = async (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.redirect('/connexion');
  }

  const isAllowedRole = user.estAdmin || user.role === 'coach' || user.role === 'licencie';

  if (!isAllowedRole) {
    return res.status(403).send('<h1>Accès refusé</h1><p>Votre rôle ne permet pas d\'accéder au calendrier.</p>');
  }

  const filters = sanitizeFilters(req.query, user.estAdmin);

  try {
    const { events, teams } = await getCalendarData(user, filters);

    const html = renderCalendrierPage({
      user,
      events,
      teams,
      filters
    });

    return res.status(200).send(html);
  } catch (error) {
    console.error('Erreur chargement calendrier:', error.message);
    return res.status(500).send('<h1>Erreur serveur</h1><p>Impossible de charger le calendrier.</p>');
  }
};
