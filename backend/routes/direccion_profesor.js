const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importamos la conexión a la base de datos
const { verifyToken } = require('../middleware/auth'); // Importamos el middleware de autenticación

// Obtener todas las direcciones de profesores (Protegida con JWT)
router.get('/', verifyToken, (req, res) => {
    db.query('SELECT * FROM DIRECCION_PROFESOR', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Obtener una dirección de un profesor por su ID (Protegida con JWT)
router.get('/:id', verifyToken, (req, res) => {
    const id_direccion_profesor = req.params.id;
    db.query('SELECT * FROM DIRECCION_PROFESOR WHERE id_direccion_profesor = ?', [id_direccion_profesor], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'Dirección no encontrada' });
            return;
        }
        res.json(result[0]);
    });
});

// Crear una nueva dirección para un profesor (Protegida con JWT)
router.post('/', verifyToken, (req, res) => {
    const { id_profesor, direccion, fecha_inicio, fecha_fin } = req.body;
    db.query(
        'INSERT INTO DIRECCION_PROFESOR (id_profesor, direccion, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)',
        [id_profesor, direccion, fecha_inicio, fecha_fin],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ message: 'Dirección creada exitosamente', id: result.insertId });
        }
    );
});

// Actualizar una dirección por su ID (Protegida con JWT)
router.put('/:id', verifyToken, (req, res) => {
    const id_direccion_profesor = req.params.id;
    const { direccion, fecha_inicio, fecha_fin } = req.body;
    db.query(
        'UPDATE DIRECCION_PROFESOR SET direccion = ?, fecha_inicio = ?, fecha_fin = ? WHERE id_direccion_profesor = ?',
        [direccion, fecha_inicio, fecha_fin, id_direccion_profesor],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Dirección no encontrada' });
                return;
            }
            res.json({ message: 'Dirección actualizada exitosamente' });
        }
    );
});

// Eliminar una dirección por su ID (Protegida con JWT)
router.delete('/:id', verifyToken, (req, res) => {
    const id_direccion_profesor = req.params.id;
    db.query('DELETE FROM DIRECCION_PROFESOR WHERE id_direccion_profesor = ?', [id_direccion_profesor], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Dirección no encontrada' });
            return;
        }
        res.json({ message: 'Dirección eliminada exitosamente' });
    });
});

module.exports = router;
