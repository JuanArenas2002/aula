const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importamos la conexión al pool de base de datos
const { verifyToken } = require('../middleware/auth'); // Importamos el middleware de autenticación

// Obtener todas las direcciones de profesores (Protegida con JWT)
router.get('/', verifyToken, async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM DIRECCION_PROFESOR');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener una dirección de un profesor por su ID (Protegida con JWT)
router.get('/:id', verifyToken, async (req, res) => {
    const id_direccion_profesor = req.params.id;

    try {
        const [result] = await db.query('SELECT * FROM DIRECCION_PROFESOR WHERE id_direccion_profesor = ?', [id_direccion_profesor]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Dirección no encontrada' });
        }

        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear una nueva dirección para un profesor (Protegida con JWT)
router.post('/', verifyToken, async (req, res) => {
    const { id_profesor, direccion, fecha_inicio, fecha_fin } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO DIRECCION_PROFESOR (id_profesor, direccion, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)',
            [id_profesor, direccion, fecha_inicio, fecha_fin]
        );

        res.status(201).json({ message: 'Dirección creada exitosamente', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar una dirección por su ID (Protegida con JWT)
router.put('/:id', verifyToken, async (req, res) => {
    const id_direccion_profesor = req.params.id;
    const { direccion, fecha_inicio, fecha_fin } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE DIRECCION_PROFESOR SET direccion = ?, fecha_inicio = ?, fecha_fin = ? WHERE id_direccion_profesor = ?',
            [direccion, fecha_inicio, fecha_fin, id_direccion_profesor]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Dirección no encontrada' });
        }

        res.json({ message: 'Dirección actualizada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar una dirección por su ID (Protegida con JWT)
router.delete('/:id', verifyToken, async (req, res) => {
    const id_direccion_profesor = req.params.id;

    try {
        const [result] = await db.query('DELETE FROM DIRECCION_PROFESOR WHERE id_direccion_profesor = ?', [id_direccion_profesor]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Dirección no encontrada' });
        }

        res.json({ message: 'Dirección eliminada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
