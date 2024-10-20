// backend/routes/supportRoutes.js
const express = require('express');
const router = express.Router();
const authSupportController = require('../controller/authSupportController');

// Ruta para el login de soporte
router.post('/login', authSupportController.login);

module.exports = router;