const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Ruta de inicio de sesión para soporte
router.post('/login', async (req, res) => {
    const { identificacion, clave } = req.body;

    if (!identificacion || !clave) {
        return res.status(400).json({ error: 'Identificación y clave son requeridos' });
    }

    try {
        const [results] = await db.query('SELECT * FROM support WHERE identificacion = ?', [identificacion]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Soporte no encontrado' });
        }

        const support = results[0];
        const isMatch = await bcrypt.compare(clave, support.clave);

        if (!isMatch) {
            return res.status(400).json({ error: 'Clave incorrecta' });
        }

        const token = jwt.sign(
            { id: support.id_support, userName: support.nombre, userType: 'support' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ token, supportNombre: support.nombre });
    } catch (err) {
        return res.status(500).json({ error: 'Error en el servidor', details: err.message });
    }
});

module.exports = router;