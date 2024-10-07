const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importamos la conexión a la base de datos
const { verifyToken } = require('../middleware/auth'); // Importamos el middleware de autenticación

// Obtener todos los teléfonos de profesores (Protegido con JWT)
router.get('/', verifyToken, (req, res) => {
    db.query('SELECT * FROM TELEFONO_PROFESOR', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Obtener un teléfono de un profesor por su ID (Protegido con JWT)
router.get('/:id', verifyToken, (req, res) => {
    const id_telefono_profesor = req.params.id;
    db.query('SELECT * FROM TELEFONO_PROFESOR WHERE id_telefono_profesor = ?', [id_telefono_profesor], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'Teléfono no encontrado' });
            return;
        }
        res.json(result[0]);
    });
});

// Crear un nuevo teléfono para un profesor (Protegido con JWT)
router.post('/', verifyToken, (req, res) => {
    const { id_profesor, numero, fecha_inicio, fecha_fin } = req.body;
    db.query(
        'INSERT INTO TELEFONO_PROFESOR (id_profesor, numero, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)',
        [id_profesor, numero, fecha_inicio, fecha_fin],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ message: 'Teléfono creado exitosamente', id: result.insertId });
        }
    );
});

// Actualizar un teléfono por su ID (Protegido con JWT)
router.put('/:id', verifyToken, (req, res) => {
    const id_telefono_profesor = req.params.id;
    const { numero, fecha_inicio, fecha_fin } = req.body;
    db.query(
        'UPDATE TELEFONO_PROFESOR SET numero = ?, fecha_inicio = ?, fecha_fin = ? WHERE id_telefono_profesor = ?',
        [numero, fecha_inicio, fecha_fin, id_telefono_profesor],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Teléfono no encontrado' });
                return;
            }
            res.json({ message: 'Teléfono actualizado exitosamente' });
        }
    );
});

// Eliminar un teléfono por su ID (Protegido con JWT)
router.delete('/:id', verifyToken, (req, res) => {
    const id_telefono_profesor = req.params.id;
    db.query('DELETE FROM TELEFONO_PROFESOR WHERE id_telefono_profesor = ?', [id_telefono_profesor], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Teléfono no encontrado' });
            return;
        }
        res.json({ message: 'Teléfono eliminado exitosamente' });
    });
});

module.exports = router;
