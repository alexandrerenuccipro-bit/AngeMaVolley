const express = require('express');
const authController = require('../controllers/auth.controller');
const {
  requireAuth,
  redirectIfAuthenticated
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/connexion', redirectIfAuthenticated, authController.showLogin);
router.post('/connexion', redirectIfAuthenticated, authController.login);
router.get('/inscription', redirectIfAuthenticated, authController.showRegister);
router.post('/inscription', redirectIfAuthenticated, authController.register);
router.get('/dashboard', requireAuth, authController.dashboard);
router.post('/dashboard/demande-licence', requireAuth, authController.requestLicence);
router.post('/dashboard/licence/:numLicence/renouveler', requireAuth, authController.renewLicence);
router.post('/dashboard/licence/:numLicence/resilier', requireAuth, authController.resignLicence);
router.post('/deconnexion', requireAuth, authController.logout);

module.exports = router;