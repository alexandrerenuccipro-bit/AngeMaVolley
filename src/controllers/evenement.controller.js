const {
  getCreatableTeamsForUser,
  createEventForUser
} = require('../models/evenement.model');
const { renderEvenementPage } = require('../views/evenement.view');

const ALLOWED_TYPES = new Set(['match', 'tournoi', 'entrainement', 'autre']);
const ALLOWED_STATUS = new Set(['planifie', 'en_cours', 'termine', 'annule']);

function toDatetimeSql(input) {
  if (!input) {
    return null;
  }

  const normalized = String(input).trim();
  const match = normalized.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/);

  if (!match) {
    return null;
  }

  const [, datePart, timePart] = match;
  const date = new Date(`${datePart}T${timePart}:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return `${datePart} ${timePart}:00`;
}

function normalizeTeamIds(rawTeamIds) {
  const values = Array.isArray(rawTeamIds) ? rawTeamIds : rawTeamIds ? [rawTeamIds] : [];

  return values
    .map((value) => Number(value))
    .filter((value, index, list) => Number.isInteger(value) && value > 0 && list.indexOf(value) === index);
}

function buildInitialFormValues() {
  return {
    type: 'entrainement',
    dateDebut: '',
    dateFin: '',
    lieu: '',
    adresseLieu: '',
    description: '',
    nbPlacesMax: '',
    statut: 'planifie',
    teamIds: []
  };
}

function normalizeFormValues(body) {
  return {
    type: String(body.type || '').trim(),
    dateDebut: String(body.date_debut || '').trim(),
    dateFin: String(body.date_fin || '').trim(),
    lieu: String(body.lieu || '').trim(),
    adresseLieu: String(body.adresse_lieu || '').trim(),
    description: String(body.description || '').trim(),
    nbPlacesMax: String(body.nb_places_max || '').trim(),
    statut: String(body.statut || '').trim(),
    teamIds: normalizeTeamIds(body.team_ids)
  };
}

function validateEvent(values, allowedTeamIds) {
  const errors = [];

  if (!ALLOWED_TYPES.has(values.type)) {
    errors.push('Type d\'evenement invalide.');
  }

  const dateDebutSql = toDatetimeSql(values.dateDebut);
  const dateFinSql = toDatetimeSql(values.dateFin);

  if (!dateDebutSql) {
    errors.push('La date de debut est obligatoire et doit etre valide.');
  }

  if (!dateFinSql) {
    errors.push('La date de fin est obligatoire et doit etre valide.');
  }

  if (dateDebutSql && dateFinSql && new Date(dateDebutSql) > new Date(dateFinSql)) {
    errors.push('La date de fin doit etre posterieure a la date de debut.');
  }

  if (!values.lieu || values.lieu.length < 2 || values.lieu.length > 200) {
    errors.push('Le lieu est obligatoire (2 a 200 caracteres).');
  }

  if (values.adresseLieu.length > 255) {
    errors.push('L\'adresse du lieu ne doit pas depasser 255 caracteres.');
  }

  if (!values.description || values.description.length < 3) {
    errors.push('La description est obligatoire (minimum 3 caracteres).');
  }

  if (!ALLOWED_STATUS.has(values.statut)) {
    errors.push('Statut invalide.');
  }

  let nbPlacesMax = null;

  if (values.nbPlacesMax !== '') {
    const parsed = Number(values.nbPlacesMax);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      errors.push('Le nombre de places max doit etre un entier positif.');
    } else {
      nbPlacesMax = parsed;
    }
  }

  const unauthorizedTeam = values.teamIds.some((teamId) => !allowedTeamIds.has(teamId));

  if (unauthorizedTeam) {
    errors.push('Une ou plusieurs equipes selectionnees sont invalides pour votre role.');
  }

  return {
    errors,
    payload: {
      type: values.type,
      dateDebut: dateDebutSql,
      dateFin: dateFinSql,
      lieu: values.lieu,
      adresseLieu: values.adresseLieu || null,
      description: values.description,
      nbPlacesMax,
      statut: values.statut,
      teamIds: values.teamIds
    }
  };
}

function canAccessEvenementCreation(user) {
  return Boolean(user && (user.estAdmin || user.role === 'coach'));
}

exports.showForm = async (req, res) => {
  const user = req.session.user;

  if (!canAccessEvenementCreation(user)) {
    return res.status(403).send('<h1>Acces refuse</h1><p>Vous n\'avez pas les droits pour creer un evenement.</p>');
  }

  try {
    const teams = await getCreatableTeamsForUser(user);
    const html = renderEvenementPage({
      user,
      teams,
      values: buildInitialFormValues(),
      error: null,
      success: null
    });

    return res.status(200).send(html);
  } catch (error) {
    console.error('Erreur chargement formulaire evenement:', error.message);
    return res.status(500).send('<h1>Erreur serveur</h1><p>Impossible de charger le formulaire.</p>');
  }
};

exports.create = async (req, res) => {
  const user = req.session.user;

  if (!canAccessEvenementCreation(user)) {
    return res.status(403).send('<h1>Acces refuse</h1><p>Vous n\'avez pas les droits pour creer un evenement.</p>');
  }

  try {
    const teams = await getCreatableTeamsForUser(user);
    const allowedTeamIds = new Set(teams.map((team) => Number(team.num_equipe)));
    const values = normalizeFormValues(req.body);
    const { errors, payload } = validateEvent(values, allowedTeamIds);

    if (errors.length > 0) {
      const html = renderEvenementPage({
        user,
        teams,
        values,
        error: errors.join(' '),
        success: null
      });

      return res.status(400).send(html);
    }

    await createEventForUser(user, payload);

    const html = renderEvenementPage({
      user,
      teams,
      values: buildInitialFormValues(),
      error: null,
      success: 'Evenement cree avec succes.'
    });

    return res.status(201).send(html);
  } catch (error) {
    console.error('Erreur creation evenement:', error.message);

    let teams = [];

    try {
      teams = await getCreatableTeamsForUser(user);
    } catch (teamsError) {
      console.error('Erreur chargement equipes apres echec creation:', teamsError.message);
    }

    const values = normalizeFormValues(req.body);
    const html = renderEvenementPage({
      user,
      teams,
      values,
      error: 'Erreur interne lors de la creation de l\'evenement.',
      success: null
    });

    return res.status(500).send(html);
  }
};
