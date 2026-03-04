const express = require('express');
const authController = require('../controllers/auth.controller');
const {
  requireAuth,
  redirectIfAuthenticated
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/connexion', redirectIfAuthenticated, authController.showLogin);
router.post('/connexion', redirectIfAuthenticated, authController.login);
router.get('/dashboard', requireAuth, authController.dashboard);
router.post('/deconnexion', requireAuth, authController.logout);

module.exports = router;