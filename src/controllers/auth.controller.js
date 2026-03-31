const crypto = require('node:crypto');
const {
  findActiveUserByEmail,
  findUserTeamNamesForDashboard,
  findUserByEmail,
  createUser,
  findLicenceRequestByUserId,
  findLicenceRequestsByUserId,
  findAllLicenceRequests,
  getClubsList,
  createLicenceRequestWithProfile,
  syncUserRoleWithAcceptedLicence,
  renewLicence,
  resignLicence
} = require('../models/auth.model');
const {
  getUpcomingEventsForAdmin,
  getUpcomingEventsForUser
} = require('../models/home.model');
const { renderLoginPage, renderRegisterPage } = require('../views/auth.view');
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

exports.showRegister = (req, res) => {
  const html = renderRegisterPage({
    error: null,
    form: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      dateNaissance: ''
    }
  });

  res.status(200).send(html);
};

exports.register = async (req, res) => {
  const nom = String(req.body.nom || '').trim();
  const prenom = String(req.body.prenom || '').trim();
  const email = String(req.body.email || '').trim();
  const password = String(req.body.password || '');
  const telephone = String(req.body.telephone || '').trim();
  const dateNaissance = String(req.body.date_naissance || '').trim();

  if (!nom || !prenom || !email || !password) {
    const html = renderRegisterPage({
      error: 'Nom, prenom, email et mot de passe sont obligatoires.',
      form: { nom, prenom, email, telephone, dateNaissance }
    });
    return res.status(400).send(html);
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      const html = renderRegisterPage({
        error: 'Un compte existe deja avec cet email.',
        form: { nom, prenom, email, telephone, dateNaissance }
      });
      return res.status(409).send(html);
    }

    const motDePasseHash = hashPassword(password);
    const userId = await createUser({
      nom,
      prenom,
      email,
      motDePasseHash,
      telephone,
      dateNaissance
    });

    req.session.user = {
      id: userId,
      nom,
      prenom,
      email,
      role: 'utilisateur',
      estAdmin: false
    };

    return res.redirect('/dashboard');
  } catch (error) {
    console.error('Erreur inscription:', error.message);
    const html = renderRegisterPage({
      error: 'Erreur interne lors de la creation du compte.',
      form: { nom, prenom, email, telephone, dateNaissance }
    });
    return res.status(500).send(html);
  }
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

    const syncedRole = await syncUserRoleWithAcceptedLicence(user.num_user);

    req.session.user = {
      id: user.num_user,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: syncedRole || user.role,
      estAdmin: Boolean(user.est_admin)
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

exports.dashboard = async (req, res) => {
  try {
    const isAdmin = Boolean(req.session.user.estAdmin);
    const teamsPromise = findUserTeamNamesForDashboard(req.session.user);

    const syncedRole = await syncUserRoleWithAcceptedLicence(req.session.user.id);
    if (syncedRole && !isAdmin) {
      req.session.user.role = syncedRole;
    }

    const shouldLoadUpcomingEvents = isAdmin || ['coach', 'licencie'].includes(req.session.user.role);

    const [teams, licenceRequests, clubs, upcomingEvents] = await Promise.all([
      teamsPromise,
      isAdmin
        ? findAllLicenceRequests(50)
        : findLicenceRequestsByUserId(req.session.user.id, 20),
      isAdmin ? Promise.resolve([]) : getClubsList(),
      shouldLoadUpcomingEvents
        ? (isAdmin
          ? getUpcomingEventsForAdmin(8)
          : getUpcomingEventsForUser(req.session.user.id, 8))
        : Promise.resolve([])
    ]);

    const html = renderDashboardPage({
      user: req.session.user,
      teams,
      licenceRequests,
      clubs,
      upcomingEvents
    });
    return res.status(200).send(html);
  } catch (error) {
    console.error('Erreur dashboard:', error.message);
    return res.status(500).send('Erreur interne.');
  }
};

exports.requestLicence = async (req, res) => {
  const typeDemande = String(req.body.type_demande || '').trim();
  const allowedTypes = ['coach', 'licencie'];

  if (!allowedTypes.includes(typeDemande)) {
    return res.status(400).send('Type de demande invalide.');
  }

  try {
    await syncUserRoleWithAcceptedLicence(req.session.user.id);

    const existingRequest = await findLicenceRequestByUserId(req.session.user.id);
    if (existingRequest?.statut === 'en_attente') {
      return res.redirect('/dashboard');
    }

    const payload = {
      userId: req.session.user.id,
      typeDemande,
      licencieData: null,
      coachData: null
    };

    if (typeDemande === 'licencie') {
      const numClub = Number(req.body.num_club);
      const poidsKgRaw = String(req.body.poids_kg || '').trim();
      const tailleCmRaw = String(req.body.taille_cm || '').trim();

      const poidsKg = Number(poidsKgRaw);
      const tailleCm = Number(tailleCmRaw);

      if (!Number.isInteger(numClub) || numClub <= 0) {
        return res.status(400).send('Club invalide.');
      }

      if (poidsKgRaw && (!Number.isFinite(poidsKg) || poidsKg <= 0)) {
        return res.status(400).send('Poids invalide.');
      }

      if (tailleCmRaw && (!Number.isInteger(tailleCm) || tailleCm <= 0)) {
        return res.status(400).send('Taille invalide.');
      }

      payload.licencieData = {
        numClub,
        poidsKg: poidsKgRaw ? poidsKg : null,
        tailleCm: tailleCmRaw ? tailleCm : null
      };
    }

    if (typeDemande === 'coach') {
      const diplome = String(req.body.diplome || '').trim();
      if (!diplome) {
        return res.status(400).send('Le diplome est obligatoire pour une demande coach.');
      }

      payload.coachData = { diplome };
    }

    await createLicenceRequestWithProfile(payload);

    return res.redirect('/dashboard');
  } catch (error) {
    console.error('Erreur demande licence:', error.message);
    return res.status(500).send('Erreur interne.');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/connexion');
  });
};

exports.renewLicence = async (req, res) => {
  try {
    const numLicence = parseInt(req.params.numLicence, 10);
    if (!numLicence) {
      return res.redirect('/dashboard');
    }

    await renewLicence(req.session.user.id, numLicence, req.session.user.role);
    return res.redirect('/dashboard?renewed=true');
  } catch (error) {
    console.error('Erreur renouvellement licence:', error.message);
    return res.redirect('/dashboard');
  }
};

exports.resignLicence = async (req, res) => {
  try {
    const numLicence = parseInt(req.params.numLicence, 10);
    if (!numLicence) {
      return res.redirect('/dashboard');
    }

    await resignLicence(req.session.user.id, numLicence, req.session.user.role);
    return res.redirect('/dashboard?resigned=true');
  } catch (error) {
    console.error('Erreur résiliation licence:', error.message);
    return res.redirect('/dashboard');
  }
};
