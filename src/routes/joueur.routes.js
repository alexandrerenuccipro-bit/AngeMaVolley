const express = require('express');
const joueurController = require('../controllers/joueur.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(requireAuth, joueurController.requireLicencie);

router.get('/equipe',   joueurController.equipe);
router.get('/licences', joueurController.licences);
router.get('/events',   joueurController.events);

module.exports = router;
