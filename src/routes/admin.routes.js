const express = require('express');
const adminController = require('../controllers/admin.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/admin.middleware');

const router = express.Router();

// Tous les routes admin nécessitent d'être connecté ET admin
router.use(requireAuth, requireAdmin);

router.get('/',               adminController.dashboard);
router.get('/licences',       adminController.licences);
router.post('/licences/:typeDemande/:numDemande/valider',    adminController.validerLicence);
router.post('/licences/:typeDemande/:numDemande/invalider',  adminController.invaliderLicence);
router.get('/joueurs',        adminController.joueurs);
router.get('/coachs',         adminController.coachs);
router.get('/evenements',     adminController.evenements);

module.exports = router;
