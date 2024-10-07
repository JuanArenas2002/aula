const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Asegúrate de tener una conexión válida
const { verifyToken } = require('../middleware/auth'); // Importamos el middleware de autenticación

// Ruta para obtener todos los tipos de identificación (Protegido con JWT)
router.get('/', verifyToken, (req, res) => {
    db.query('SELECT id_tipo_identificacion, nombre_identificacion FROM TIPO_IDENTIFICACION', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results); // Asegúrate de devolver los resultados correctamente
    });
});

module.exports = router;
