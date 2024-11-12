// backend/routes/tipo_identificacion.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Ruta para obtener todos los tipos de identificación
router.get('/', async (req, res) => {
    try {
      const [tiposIdentificacion] = await db.query('SELECT * FROM tipo_identificacion');
      
      res.json(tiposIdentificacion);
    } catch (error) {
      console.error('Error al obtener tipos de identificación:', error);
      res.status(500).json({ error: 'Error al obtener tipos de identificación' });
    }
  });


  module.exports = router;
  