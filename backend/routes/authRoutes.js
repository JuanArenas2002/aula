const express = require('express');
const router = express.Router();
const { login } = require('../controller/authController'); // Asegúrate de que la ruta y el nombre son correctos

// Ruta para el login
router.post('/login', login);

module.exports = router;
