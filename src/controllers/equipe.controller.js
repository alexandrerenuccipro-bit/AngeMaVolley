const { getAllEquipes, getEquipeById, getJoueursParEquipe } = require('../models/equipe.model');
const { renderEquipePage, renderDetailEquipe } = require('../views/equipe.view');

exports.listEquipes = async (req, res) => {
  try {
    const search = String(req.query.search || '').trim().slice(0, 80);
    const equipes = await getAllEquipes(search);
    const html = renderEquipePage(equipes, req.session.user || null, { search });
    res.status(200).send(html);
  } catch (error) {
    console.error('Erreur chargement équipes:', error.message);
    res.status(500).send('<h1>Erreur serveur</h1><p>Impossible de charger les équipes.</p>');
  }
};

exports.detailEquipe = async (req, res) => {
  try {
    const { numEquipe } = req.params;
    const equipe = await getEquipeById(numEquipe);

    if (!equipe) {
      return res.status(404).send('<h1>Équipe non trouvée</h1>');
    }

    const joueurs = await getJoueursParEquipe(numEquipe);
    const html = renderDetailEquipe(equipe, joueurs, req.session.user || null);
    res.status(200).send(html);
  } catch (error) {
    console.error('Erreur chargement détail équipe:', error.message);
    res.status(500).send('<h1>Erreur serveur</h1><p>Impossible de charger les détails de l\'équipe.</p>');
  }
};
