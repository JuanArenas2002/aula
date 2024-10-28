const express = require('express');
const router = express.Router();
const db = require('../config/db');  // Asegúrate de que db esté configurado para promesas

// Endpoint para obtener la cantidad de instituciones activas (estado = 1)
router.get('/activas', async (req, res) => {
    try {
        // Realizar la consulta a la base de datos usando promesas
        const [result] = await db.query('SELECT COUNT(*) AS count FROM INSTITUCION WHERE estado = 1');

        // Responder con la cantidad de instituciones activas
        res.json({ count: result[0].count });
    } catch (err) {
        // Capturar y manejar cualquier error en el proceso
        return res.status(500).json({ error: 'Error al obtener el número de instituciones activas', details: err.message });
    }
});

module.exports = router;
