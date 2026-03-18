const express = require('express');
const equipeController = require('../controllers/equipe.controller');

const router = express.Router();

router.get('/', equipeController.listEquipes);
router.get('/:numEquipe', equipeController.detailEquipe);

module.exports = router;
