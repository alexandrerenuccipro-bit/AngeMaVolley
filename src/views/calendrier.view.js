const { renderHotbar } = require('./hotbar.view');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatDate(value) {
  if (!value) {
    return 'Date inconnue';
  }

  return new Date(value).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatMonthValue(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function shiftMonth(monthValue, delta) {
  const [yearRaw, monthRaw] = String(monthValue).split('-');
  const year = Number(yearRaw);
  const monthIndex = Number(monthRaw) - 1;

  if (!Number.isInteger(year) || !Number.isInteger(monthIndex)) {
    return formatMonthValue(new Date());
  }

  const next = new Date(year, monthIndex + delta, 1);
  return formatMonthValue(next);
}

function normalizeDateKey(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return null;
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getTypeLabel(type) {
  const labels = {
    match: 'Match',
    tournoi: 'Tournoi',
    entrainement: 'Entrainement',
    autre: 'Autre'
  };

  return labels[type] || type;
}

function getStatusLabel(status) {
  const labels = {
    planifie: 'Planifie',
    en_cours: 'En cours',
    termine: 'Termine',
    annule: 'Annule'
  };

  return labels[status] || status;
}

function buildQuery(filters, overrides = {}) {
  const next = {
    type: filters.type,
    statut: filters.statut,
    sort: filters.sort,
    team: filters.team,
    search: filters.search,
    view: filters.view,
    month: filters.month || '',
    event: filters.event || '',
    ...overrides
  };

  const params = new URLSearchParams();

  Object.entries(next).forEach(([key, value]) => {
    if (value !== null && value !== undefined && String(value).trim() !== '') {
      params.append(key, String(value));
    }
  });

  return params.toString();
}

function getRoleScopeText(user) {
  if (user.estAdmin) {
    return 'Vous voyez tous les entrainements et evenements, avec filtres et tri complets.';
  }

  return 'Vous voyez uniquement les entrainements et tournois de vos equipes inscrites.';
}

function getMonthTitle(monthValue) {
  const [yearRaw, monthRaw] = String(monthValue).split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return { monthNumber: '-', monthLabel: 'Mois invalide' };
  }

  const labels = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

  return {
    monthNumber: String(month),
    monthLabel: `${labels[month - 1]} ${year}`
  };
}

function getEventsMapForMonth(events, monthValue) {
  const map = new Map();

  events.forEach((event) => {
    const dateKey = normalizeDateKey(event.date_debut);

    if (!dateKey || (monthValue && !dateKey.startsWith(monthValue))) {
      return;
    }

    if (!map.has(dateKey)) {
      map.set(dateKey, []);
    }

    map.get(dateKey).push(event);
  });

  return map;
}

function getMonthStats(events, monthValue) {
  const stats = {
    total: 0,
    entrainement: 0,
    tournoi: 0,
    match: 0,
    autre: 0
  };

  events.forEach((event) => {
    const dateKey = normalizeDateKey(event.date_debut);

    if (!dateKey || (monthValue && !dateKey.startsWith(monthValue))) {
      return;
    }

    stats.total += 1;

    if (Object.hasOwn(stats, event.type)) {
      stats[event.type] += 1;
    }
  });

  return stats;
}

function renderCalendarLegend() {
  return `
    <div class="calendar-legend" aria-label="Legende des types d'evenements">
      <span><i class="month-event-marker type-entrainement" aria-hidden="true"></i> Entrainement</span>
      <span><i class="month-event-marker type-tournoi" aria-hidden="true"></i> Tournoi</span>
      <span><i class="month-event-marker type-match" aria-hidden="true"></i> Match</span>
      <span><i class="month-event-marker type-autre" aria-hidden="true"></i> Autre</span>
    </div>
  `;
}

function renderMonthSummary(events, monthValue) {
  const stats = getMonthStats(events, monthValue);

  return `
    <section class="calendar-summary" aria-label="Resume du mois">
      <p><strong>${stats.total}</strong> evenement(s) ce mois</p>
      <p>${stats.entrainement} entrainement(s)</p>
      <p>${stats.tournoi} tournoi(s)</p>
      <p>${stats.match} match(s)</p>
      <p>${stats.autre} autre(s)</p>
    </section>
  `;
}

function renderMonthGrid(events, monthValue, filters) {
  const [yearRaw, monthRaw] = String(monthValue).split('-');
  const year = Number(yearRaw);
  const monthIndex = Number(monthRaw) - 1;

  if (!Number.isInteger(year) || !Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return '<p class="empty-state">Mois invalide.</p>';
  }

  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = firstDay.getDay();
  const eventsByDay = getEventsMapForMonth(events, monthValue);
  const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const todayKey = normalizeDateKey(new Date());
  const prevMonthLink = `/calendrier?${buildQuery(filters, { view: 'calendar', month: shiftMonth(monthValue, -1), event: null })}`;
  const nextMonthLink = `/calendrier?${buildQuery(filters, { view: 'calendar', month: shiftMonth(monthValue, 1), event: null })}`;

  const headers = dayHeaders
    .map((dayName, index) => {
      const weekendClass = index === 0 || index === 6 ? 'is-weekend' : '';
      return `<div class="month-weekday ${weekendClass}">${dayName}</div>`;
    })
    .join('');

  const cells = [];

  for (let i = 0; i < 42; i += 1) {
    const dayNumber = i - firstWeekday + 1;
    const weekDay = i % 7;

    if (dayNumber < 1 || dayNumber > daysInMonth) {
      cells.push('<div class="month-day-cell is-outside"></div>');
      continue;
    }

    const dateKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    const dayEvents = eventsByDay.get(dateKey) || [];
    const weekendClass = weekDay === 0 || weekDay === 6 ? 'is-weekend' : '';
    const todayClass = dateKey === todayKey ? 'is-today' : '';

    const markers = dayEvents
      .slice(0, 3)
      .map((event) => {
        const tooltip = `${getTypeLabel(event.type)} | ${event.description || 'Evenement'} | ${formatDate(event.date_debut)} | ${event.lieu || 'Lieu non precise'}`;
        const eventLink = `/calendrier?${buildQuery(filters, { view: 'calendar', event: event.num_evenement })}`;
        return `<a class="month-event-link" href="${eventLink}" title="${escapeHtml(tooltip)}"><span class="month-event-marker type-${escapeHtml(event.type)}"></span></a>`;
      })
      .join('');

    const labels = dayEvents
      .slice(0, 2)
      .map((event) => {
        const label = `${getTypeLabel(event.type)}: ${event.description || 'Evenement'}`;
        const tooltip = `${label} | ${formatDate(event.date_debut)} | Equipes: ${event.equipes || 'Aucune'}`;
        const eventLink = `/calendrier?${buildQuery(filters, { view: 'calendar', event: event.num_evenement })}`;
        return `<p class="month-event-label"><a class="month-event-label-link" href="${eventLink}" title="${escapeHtml(tooltip)}">${escapeHtml(label)}</a></p>`;
      })
      .join('');

    const extraCount = dayEvents.length > 3
      ? `<span class="month-event-count">+${dayEvents.length - 3}</span>`
      : '';

    const extraLabelCount = dayEvents.length > 2
      ? `<p class="month-event-label more">+${dayEvents.length - 2} autre(s)</p>`
      : '';

    cells.push(`
      <div class="month-day-cell ${todayClass}">
        <span class="month-day-number ${weekendClass}">${dayNumber}</span>
        <div class="month-day-markers">${markers}${extraCount}</div>
        <div class="month-day-labels">${labels}${extraLabelCount}</div>
      </div>
    `);
  }

  return `
    <section class="month-calendar">
      <div class="month-calendar-head">
        <p class="month-big-number">${escapeHtml(getMonthTitle(monthValue).monthNumber)}</p>
        <div class="month-head-right">
          <p class="month-small-label">${escapeHtml(getMonthTitle(monthValue).monthLabel)}</p>
          <div class="month-nav-actions">
            <a class="calendar-action-btn" href="${prevMonthLink}" aria-label="Mois precedent">← Mois precedent</a>
            <a class="calendar-action-btn" href="${nextMonthLink}" aria-label="Mois suivant">Mois suivant →</a>
          </div>
        </div>
      </div>
      ${renderCalendarLegend()}
      <div class="month-weekdays-row">${headers}</div>
      <div class="month-grid">${cells.join('')}</div>
    </section>
  `;
}

function renderSelectedEventPanel(events, selectedEventId, filters) {
  const closeLink = `/calendrier?${buildQuery(filters, { view: 'calendar', event: null })}`;

  if (!selectedEventId) {
    return `
      <section class="calendar-event-detail">
        <p class="empty-state">Cliquez sur un evenement du calendrier pour voir ses details complets.</p>
      </section>
    `;
  }

  const selectedEvent = events.find((event) => String(event.num_evenement) === String(selectedEventId));

  if (!selectedEvent) {
    return `
      <section class="calendar-event-detail">
        <div class="detail-header-actions">
          <a href="${closeLink}" class="calendar-action-btn is-outline">Fermer</a>
        </div>
        <p class="empty-state">Evenement introuvable avec les filtres actuels.</p>
      </section>
    `;
  }

  return `
    <section class="calendar-event-detail">
      <div class="detail-header-actions">
        <a href="${closeLink}" class="calendar-action-btn is-outline">Fermer</a>
      </div>
      <p class="tag">Detail evenement</p>
      <h3>${escapeHtml(selectedEvent.description || 'Evenement')}</h3>
      <div class="detail-grid">
        <p><strong>Type:</strong> ${escapeHtml(getTypeLabel(selectedEvent.type))}</p>
        <p><strong>Statut:</strong> ${escapeHtml(getStatusLabel(selectedEvent.statut))}</p>
        <p><strong>Debut:</strong> ${escapeHtml(formatDate(selectedEvent.date_debut))}</p>
        <p><strong>Fin:</strong> ${escapeHtml(formatDate(selectedEvent.date_fin || selectedEvent.date_debut))}</p>
        <p><strong>Lieu:</strong> ${escapeHtml(selectedEvent.lieu || 'Non precise')}</p>
        <p><strong>Adresse:</strong> ${escapeHtml(selectedEvent.adresse_lieu || 'Non precisee')}</p>
        <p><strong>Equipes:</strong> ${escapeHtml(selectedEvent.equipes || 'Aucune')}</p>
        <p><strong>Places max:</strong> ${escapeHtml(selectedEvent.nb_places_max || 'Non defini')}</p>
      </div>
    </section>
  `;
}

function renderListTable(events) {
  if (!events.length) {
    return '<p class="empty-state">Aucun evenement correspondant aux filtres.</p>';
  }

  const rows = events
    .map(
      (event) => `
        <tr>
          <td>${escapeHtml(getTypeLabel(event.type))}</td>
          <td>${escapeHtml(formatDate(event.date_debut))}</td>
          <td>${escapeHtml(event.lieu || 'Non precise')}</td>
          <td>${escapeHtml(event.equipes || 'Aucune')}</td>
          <td><span class="event-chip status-${escapeHtml(event.statut)}">${escapeHtml(getStatusLabel(event.statut))}</span></td>
        </tr>
      `
    )
    .join('');

  return `
    <div class="table-wrapper">
      <table class="team-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>Lieu</th>
            <th>Equipes</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

function renderTeamOptions(teams, selectedTeam) {
  const options = ['<option value="all">Toutes les equipes</option>'];

  teams.forEach((team) => {
    const selected = String(team.num_equipe) === String(selectedTeam) ? 'selected' : '';
    options.push(`<option value="${team.num_equipe}" ${selected}>${escapeHtml(team.nom)}</option>`);
  });

  return options.join('');
}

function getCurrentMonthValue(filters, events) {
  if (filters.month) {
    return filters.month;
  }

  if (events.length) {
    const firstKey = normalizeDateKey(events[0].date_debut);
    if (firstKey) {
      return firstKey.slice(0, 7);
    }
  }

  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}-${currentMonth}`;
}

function selectedAttr(condition) {
  return condition ? 'selected' : '';
}

function renderTypeOptions(filters, isAdmin) {
  const options = [
    `<option value="all" ${selectedAttr(filters.type === 'all')}>Tous</option>`,
    `<option value="entrainement" ${selectedAttr(filters.type === 'entrainement')}>Entrainements</option>`,
    `<option value="tournoi" ${selectedAttr(filters.type === 'tournoi')}>Tournois</option>`
  ];

  if (isAdmin) {
    options.push(
      `<option value="match" ${selectedAttr(filters.type === 'match')}>Matchs</option>`,
      `<option value="autre" ${selectedAttr(filters.type === 'autre')}>Autres</option>`
    );
  }

  return options.join('');
}

function renderViewSwitch(filters) {
  const calendarClass = filters.view === 'calendar' ? '' : 'cta-outline';
  const listClass = filters.view === 'list' ? '' : 'cta-outline';

  return `
    <div class="hero-actions">
      <a class="cta ${calendarClass}" href="/calendrier?${buildQuery(filters, { view: 'calendar' })}">Vue calendrier</a>
      <a class="cta ${listClass}" href="/calendrier?${buildQuery(filters, { view: 'list' })}">Vue liste</a>
    </div>
  `;
}

function renderFilters({ user, filters, monthValue, teams }) {
  const resetLink = `/calendrier?${buildQuery(filters, {
    type: 'all',
    statut: 'all',
    sort: 'recent',
    team: 'all',
    search: '',
    view: filters.view,
    month: '',
    event: null
  })}`;

  const todayLink = `/calendrier?${buildQuery(filters, { month: formatMonthValue(new Date()), event: null })}`;

  return `
    <section class="calendar-panel">
      <div class="calendar-quick-actions">
        <a class="calendar-action-btn" href="${todayLink}">Aller a aujourd'hui</a>
        <a class="calendar-action-btn is-outline" href="${resetLink}">Reinitialiser les filtres</a>
      </div>

      <form class="calendar-filters" method="GET" action="/calendrier">
        <input type="hidden" name="view" value="${escapeHtml(filters.view)}">

        <label>
          Mois
          <input type="month" name="month" value="${escapeHtml(monthValue)}">
        </label>

        <label>
          Type
          <select name="type">
            ${renderTypeOptions(filters, user.estAdmin)}
          </select>
        </label>

        <label>
          Statut
          <select name="statut">
            <option value="all" ${selectedAttr(filters.statut === 'all')}>Tous</option>
            <option value="planifie" ${selectedAttr(filters.statut === 'planifie')}>Planifie</option>
            <option value="en_cours" ${selectedAttr(filters.statut === 'en_cours')}>En cours</option>
            <option value="termine" ${selectedAttr(filters.statut === 'termine')}>Termine</option>
            <option value="annule" ${selectedAttr(filters.statut === 'annule')}>Annule</option>
          </select>
        </label>

        <label>
          Equipe
          <select name="team">
            ${renderTeamOptions(teams, filters.team)}
          </select>
        </label>

        <label>
          Tri
          <select name="sort">
            <option value="recent" ${selectedAttr(filters.sort === 'recent')}>Date recente</option>
            <option value="ancien" ${selectedAttr(filters.sort === 'ancien')}>Date ancienne</option>
            <option value="type" ${selectedAttr(filters.sort === 'type')}>Type</option>
            <option value="statut" ${selectedAttr(filters.sort === 'statut')}>Statut</option>
          </select>
        </label>

        <label>
          Recherche
          <input type="text" name="search" value="${escapeHtml(filters.search)}" placeholder="Lieu, description...">
        </label>

        <button type="submit" class="cta">Appliquer</button>
      </form>
    </section>
  `;
}

function renderContentViews({ filters, events, monthValue }) {
  const calendarClass = filters.view === 'calendar' ? '' : 'hidden';
  const listClass = filters.view === 'list' ? '' : 'hidden';

  return `
    <section class="calendar-view ${calendarClass}">
      ${renderMonthGrid(events, monthValue, filters)}
      ${renderMonthSummary(events, monthValue)}
      ${renderSelectedEventPanel(events, filters.event, filters)}
    </section>

    <section class="list-view ${listClass}">
      ${renderListTable(events)}
    </section>
  `;
}

function renderCalendrierPage({ user, events, teams, filters }) {
  const monthValue = getCurrentMonthValue(filters, events);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calendrier - AngeMa Volley</title>
  <link rel="stylesheet" href="/css/style.css">
  <script src="/js/theme-toggle.js" defer></script>
</head>
<body>
  <header class="topbar">
    <a class="logo" href="/">AngeMa Volley</a>
    ${renderHotbar(user)}
  </header>

  <main class="page">
    <div class="calendar-top-layout">
      <section class="hero-card">
        <p class="tag">Planning</p>
        <h2>Calendrier des activites</h2>
        <p>${escapeHtml(getRoleScopeText(user))}</p>

        ${renderViewSwitch(filters)}
      </section>

      ${renderFilters({ user, filters, monthValue, teams })}
    </div>

    ${renderContentViews({ filters, events, monthValue })}
  </main>
</body>
</html>`;
}

module.exports = {
  renderCalendrierPage
};
