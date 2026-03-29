const {
  getJoueurProfil,
  getJoueurEquipe,
  getCoequipiers,
  getJoueurLicences,
  getJoueurEvents
} = require('../models/joueur.model');

const {
  renderJoueurEquipe,
  renderJoueurLicences,
  renderJoueurEvents
} = require('../views/joueur.view');

function requireLicencie(req, res, next) {
  if (!req.session.user) return res.redirect('/connexion');
  if (req.session.user.role !== 'licencie') {
    return res.status(403).send('<h1>Accès réservé aux joueurs licenciés.</h1>');
  }
  return next();
}

// ── ÉQUIPE ──────────────────────────────────────────────────────
exports.equipe = async (req, res) => {
  try {
    const { id } = req.session.user;
    const [profil, equipe] = await Promise.all([
      getJoueurProfil(id),
      getJoueurEquipe(id)
    ]);

    const coequipiers = equipe ? await getCoequipiers(equipe.num_equipe, id) : [];

    const html = renderJoueurEquipe({ user: req.session.user, profil, equipe, coequipiers });
    return res.status(200).send(html);
  } catch (error) {
    console.error('Erreur joueur équipe:', error.message);
    return res.status(500).send('<h1>Erreur serveur</h1>');
  }
};

// ── LICENCES ────────────────────────────────────────────────────
exports.licences = async (req, res) => {
  try {
    const licences = await getJoueurLicences(req.session.user.id);
    const html = renderJoueurLicences({ user: req.session.user, licences });
    return res.status(200).send(html);
  } catch (error) {
    console.error('Erreur joueur licences:', error.message);
    return res.status(500).send('<h1>Erreur serveur</h1>');
  }
};

// ── ÉVÉNEMENTS ──────────────────────────────────────────────────
exports.events = async (req, res) => {
  try {
    const events = await getJoueurEvents(req.session.user.id);
    const html = renderJoueurEvents({ user: req.session.user, events });
    return res.status(200).send(html);
  } catch (error) {
    console.error('Erreur joueur events:', error.message);
    return res.status(500).send('<h1>Erreur serveur</h1>');
  }
};

exports.requireLicencie = requireLicencie;
