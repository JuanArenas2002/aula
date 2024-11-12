const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Support = require('../models/Support'); // Importa tu modelo de Sequelize para soporte

// Ruta de inicio de sesión para soporte (sin clave encriptada)
router.post('/support-login', async (req, res) => {
  const { identificacion, clave } = req.body;

  try {
    console.log('Datos recibidos:', req.body); // Log para verificar los datos recibidos

    // Verificar si el usuario de soporte existe con la identificación proporcionada
    const supportUser = await Support.findOne({ where: { identificacion } });

    if (!supportUser) {
      return res.status(404).json({ error: 'Usuario de soporte no encontrado' });
    }

    // Comparación directa de la clave en texto plano
    if (clave !== supportUser.clave) {
      return res.status(400).json({ error: 'Clave incorrecta' });
    }

    // Generar token JWT con rol "support"
    const token = jwt.sign(
      { id: supportUser.Id_support, role: 'support' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: 'support' });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
});

module.exports = router;
