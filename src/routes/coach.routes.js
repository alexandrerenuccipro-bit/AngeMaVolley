const express = require('express');
const coachController = require('../controllers/coach.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(requireAuth, coachController.requireCoach);

router.get('/equipe',   coachController.equipe);
router.get('/joueurs',  coachController.joueurs);
router.get('/licences', coachController.licences);
router.get('/events',   coachController.events);

module.exports = router;
