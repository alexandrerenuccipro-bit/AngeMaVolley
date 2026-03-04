const crypto = require('crypto');
const { findActiveUserByEmail } = require('../models/auth.model');
const { renderLoginPage } = require('../views/auth.view');
const { renderDashboardPage } = require('../views/dashboard.view');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function isValidPassword(inputPassword, storedHash) {
  return hashPassword(inputPassword) === storedHash || inputPassword === storedHash;
}

exports.showLogin = (req, res) => {
  const html = renderLoginPage({ error: null, email: '' });
  res.status(200).send(html);
};

exports.login = async (req, res) => {
  const email = String(req.body.email || '').trim();
  const password = String(req.body.password || '');

  if (!email || !password) {
    const html = renderLoginPage({
      error: 'Email et mot de passe sont obligatoires.',
      email
    });
    return res.status(400).send(html);
  }

  try {
    const user = await findActiveUserByEmail(email);

    if (!user || !isValidPassword(password, user.mot_de_passe)) {
      const html = renderLoginPage({
        error: 'Identifiants invalides.',
        email
      });
      return res.status(401).send(html);
    }

    req.session.user = {
      id: user.num_user,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role
    };

    return res.redirect('/dashboard');
  } catch (error) {
    console.error('Erreur connexion:', error.message);
    const html = renderLoginPage({
      error: 'Erreur interne de connexion.',
      email
    });
    return res.status(500).send(html);
  }
};

exports.dashboard = (req, res) => {
  const html = renderDashboardPage({ user: req.session.user });
  res.status(200).send(html);
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/connexion');
  });
};