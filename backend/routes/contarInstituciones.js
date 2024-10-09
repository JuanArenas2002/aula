const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Endpoint para obtener la cantidad de instituciones activas (estado = 1)
router.get('/activas', (req, res) => {
    db.query('SELECT COUNT(*) AS count FROM INSTITUCION WHERE estado = 1', (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el número de instituciones activas' });
        }
        res.json({ count: result[0].count });
    });
});

module.exports = router;