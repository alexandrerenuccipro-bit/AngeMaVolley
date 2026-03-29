const express = require('express');
const evenementController = require('../controllers/evenement.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', requireAuth, evenementController.showForm);
router.post('/', requireAuth, evenementController.create);

module.exports = router;
