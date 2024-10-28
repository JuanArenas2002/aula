// routes/institucionRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// Ruta para obtener instituciones (acceso solo a soporte)
router.get('/support/instituciones', verifyToken('support'), async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM institucion');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener instituciones' });
  }
});

// Ruta para obtener el perfil de la institución (acceso solo a instituciones)
router.get('/institucion/profile', verifyToken('institution'), async (req, res) => {
  const id_institucion = req.userId;

  try {
    const [result] = await db.query('SELECT * FROM institucion WHERE id_institucion = ?', [id_institucion]);
    if (result.length === 0) return res.status(404).json({ message: 'Institución no encontrada' });
    
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
