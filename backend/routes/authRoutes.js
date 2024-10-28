// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Ruta de inicio de sesión para instituciones (con clave encriptada)
router.post('/institution-login', async (req, res) => {
  const { nit, clave } = req.body;

  try {
    // Verificar si la institución existe con el NIT proporcionado
    const [results] = await db.query('SELECT * FROM institucion WHERE nit = ?', [nit]);
    if (results.length === 0) return res.status(404).json({ error: 'Institución no encontrada' });

    const institucion = results[0];

    // Usar bcrypt.compare para verificar la clave encriptada
    const isMatch = await bcrypt.compare(clave, institucion.clave);
    if (!isMatch) {
      return res.status(400).json({ error: 'Clave incorrecta' });
    }

    // Generar token JWT con rol "institution"
    const token = jwt.sign({ id: institucion.id_institucion, role: 'institution' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: 'institution' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
});

// Ruta de inicio de sesión para soporte (sin clave encriptada)
router.post('/support-login', async (req, res) => {
  const { identificacion, clave } = req.body;

  try {
    // Verificar si el usuario de soporte existe con la identificación proporcionada
    const [results] = await db.query('SELECT * FROM support WHERE identificacion = ?', [identificacion]);
    if (results.length === 0) return res.status(404).json({ error: 'Usuario de soporte no encontrado' });

    const supportUser = results[0];

    // Comparación directa de la clave en texto plano
    if (clave !== supportUser.clave) {
      return res.status(400).json({ error: 'Clave incorrecta' });
    }

    // Generar token JWT con rol "support"
    const token = jwt.sign({ id: supportUser.Id_support, role: 'support' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: 'support' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
});

module.exports = router;
