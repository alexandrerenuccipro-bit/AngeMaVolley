const express = require('express');
const calendrierController = require('../controllers/calendrier.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', requireAuth, calendrierController.showCalendrier);

module.exports = router;
