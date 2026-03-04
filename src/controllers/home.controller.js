const { renderHomePage } = require('../views/home.view');
const { getHomePageData } = require('../models/home.model');

exports.index = async (req, res) => {
  try {
    const homeData = await getHomePageData();
    const html = renderHomePage(homeData);

    res.status(200).send(html);
  } catch (error) {
    console.error('Erreur chargement home:', error.message);

    const html = renderHomePage({
      title: 'AngeMa Volley',
      message: 'Impossible de charger les données de la base pour le moment.',
      nextEvent: {
        title: 'Indisponible',
        dateLabel: '—',
        location: '—',
        description: 'Réessaie dans quelques instants.'
      },
      stats: {
        clubs: 0,
        teams: 0,
        activeLicensed: 0,
        plannedEvents: 0
      },
      latestTeam: 'Indisponible',
      keyPositions: ['Indisponible']
    });

    res.status(500).send(html);
  }
};
