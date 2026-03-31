const {
  getCoachProfil,
  getCoachEquipe,
  getJoueursParCoach,
  getCoachEvents,
  getCoachLicences
} = require('../models/coach.model');

const {
  renderCoachEquipe,
  renderCoachJoueurs,
  renderCoachEvents,
  renderCoachLicences
} = require('../views/coach.view');

function requireCoach(req, res, next) {
  if (!req.session.user) return res.redirect('/connexion');
  if (req.session.user.role !== 'coach') {
    return res.status(403).send('<h1>Accès réservé aux coachs.</h1>');
  }
  return next();
}

// ── ÉQUIPE ──────────────────────────────────────────────────────
exports.equipe = async (req, res) => {
  try {
    const { id } = req.session.user;
    const [profil, equipe] = await Promise.all([
      getCoachProfil(id),
      getCoachEquipe(id)
    ]);

    const html = renderCoachEquipe({ user: req.session.user, profil, equipe });
    return res.status(200).send(html);
  } catch (error) {
    console.error('Erreur coach équipe:', error.message);
    return res.status(500).send('<h1>Erreur serveur</h1>');
  }
};

// ── JOUEURS ─────────────────────────────────────────────────────
exports.joueurs = async (req, res) => {
  try {
    const { id } = req.session.user;
    const equipe = await getCoachEquipe(id);

    if (!equipe) {
      return res.status(404).send('<h1>Aucune équipe assignée.</h1>');
    }

    const joueurs = await getJoueursParCoach(equipe.num_equipe);
    const html = renderCoachJoueurs({ user: req.session.user, equipe, joueurs });
    return res.status(200).send(html);
  } catch (error) {
    console.error('Erreur coach joueurs:', error.message);
    return res.status(500).send('<h1>Erreur serveur</h1>');
  }
};

// ── LICENCES ────────────────────────────────────────────────────
exports.licences = async (req, res) => {
  try {
    const licences = await getCoachLicences(req.session.user.id);
    const html = renderCoachLicences({ user: req.session.user, licences });
    return res.status(200).send(html);
  } catch (error) {
    console.error('Erreur coach licences:', error.message);
    return res.status(500).send('<h1>Erreur serveur</h1>');
  }
};

// ── ÉVÉNEMENTS ──────────────────────────────────────────────────
exports.events = async (req, res) => {
  try {
    const { id } = req.session.user;
    const equipe = await getCoachEquipe(id);

    if (!equipe) {
      return res.status(404).send('<h1>Aucune équipe assignée.</h1>');
    }

    const events = await getCoachEvents(equipe.num_equipe);
    const html = renderCoachEvents({ user: req.session.user, equipe, events });
    return res.status(200).send(html);
  } catch (error) {
    console.error('Erreur coach events:', error.message);
    return res.status(500).send('<h1>Erreur serveur</h1>');
  }
};

exports.requireCoach = requireCoach;
