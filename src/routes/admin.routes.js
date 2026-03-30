const express = require('express');
const adminController = require('../controllers/admin.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/admin.middleware');

const router = express.Router();

// Tous les routes admin nécessitent d'être connecté ET admin
router.use(requireAuth, requireAdmin);

router.get('/',               adminController.dashboard);
router.get('/licences',       adminController.licences);
router.post('/licences/:numLicence/valider',    adminController.validerLicence);
router.post('/licences/:numLicence/invalider',  adminController.invaliderLicence);
router.get('/joueurs',        adminController.joueurs);
router.get('/coachs',         adminController.coachs);
router.get('/events',         adminController.events);

module.exports = router;
