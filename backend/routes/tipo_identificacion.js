const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Asegúrate de tener una conexión válida al pool con promesas
const { verifyToken } = require('../middleware/auth'); // Importamos el middleware de autenticación

// Ruta para obtener todos los tipos de identificación (Protegido con JWT)
router.get('/', verifyToken, async (req, res) => {
    try {
        const [results] = await db.query('SELECT id_tipo_identificacion, nombre_identificacion FROM TIPO_IDENTIFICACION');
        res.json(results); // Devuelve los resultados correctamente
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
