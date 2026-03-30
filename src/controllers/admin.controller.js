const {
  getAdminStats,
  getAllLicences,
  validerLicence,
  invaliderLicence,
  getAllJoueurs,
  getAllCoachs,
  getAllEvents
} = require('../models/admin.model');

const {
  renderAdminDashboard,
  renderAdminLicences,
  renderAdminJoueurs,
  renderAdminCoachs,
  renderAdminEvents
} = require('../views/admin.view');

// ── DASHBOARD ───────────────────────────────────────────────────
exports.dashboard = async (req, res) => {
  try {
    const stats = await getAdminStats();
    const html = renderAdminDashboard({ user: req.session.user, stats });
    return res.status(200).send(html);
  } catch (error) {
    console.error('Erreur admin dashboard:', error.message);
    return res.status(500).send('<h1>Erreur serveur</h1>');
  }
};

// ── LICENCES ────────────────────────────────────────────────────
exports.licences = async (req, res) => {
  try {
    const licences = await getAllLicences();
    const success = req.query.success || null;
    const html = renderAdminLicences({ user: req.session.user, licences, success });
    return res.status(200).send(html);
  } catch (error) {
    console.error('Erreur admin licences:', error.message);
    return res.status(500).send('<h1>Erreur serveur</h1>');
  }
};

exports.validerLicence = async (req, res) => {
  const numLicence = parseInt(req.params.numLicence, 10);
  if (!numLicence) return res.redirect('/admin/licences');

  try {
    await validerLicence(numLicence, req.session.user.id);
    return res.redirect('/admin/licences?success=valide');
  } catch (error) {
    console.error('Erreur validation licence:', error.message);
    return res.redirect('/admin/licences');
  }
};

exports.invaliderLicence = async (req, res) => {
  const numLicence = parseInt(req.params.numLicence, 10);
  if (!numLicence) return res.redirect('/admin/licences');

  try {
    await invaliderLicence(numLicence);
    return res.redirect('/admin/licences?success=invalide');
  } catch (error) {
    console.error('Erreur invalidation licence:', error.message);
    return res.redirect('/admin/licences');
  }
};

// ── JOUEURS ─────────────────────────────────────────────────────
exports.joueurs = async (req, res) => {
  try {
    const joueurs = await getAllJoueurs();
    const html = renderAdminJoueurs({ user: req.session.user, joueurs });
    return res.status(200).send(html);
  } catch (error) {
    console.error('Erreur admin joueurs:', error.message);
    return res.status(500).send('<h1>Erreur serveur</h1>');
  }
};

// ── COACHS ──────────────────────────────────────────────────────
exports.coachs = async (req, res) => {
  try {
    const coachs = await getAllCoachs();
    const html = renderAdminCoachs({ user: req.session.user, coachs });
    return res.status(200).send(html);
  } catch (error) {
    console.error('Erreur admin coachs:', error.message);
    return res.status(500).send('<h1>Erreur serveur</h1>');
  }
};

// ── ÉVÉNEMENTS ──────────────────────────────────────────────────
exports.events = async (req, res) => {
  try {
    const events = await getAllEvents();
    const html = renderAdminEvents({ user: req.session.user, events });
    return res.status(200).send(html);
  } catch (error) {
    console.error('Erreur admin events:', error.message);
    return res.status(500).send('<h1>Erreur serveur</h1>');
  }
};
