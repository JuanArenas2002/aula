const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importamos la conexión al pool de base de datos
const { verifyToken } = require('../middleware/auth'); // Importamos el middleware de autenticación

// Obtener todos los teléfonos de profesores (Protegido con JWT)
router.get('/', verifyToken, async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM TELEFONO_PROFESOR');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener un teléfono de un profesor por su ID (Protegido con JWT)
router.get('/:id', verifyToken, async (req, res) => {
    const id_telefono_profesor = req.params.id;

    try {
        const [result] = await db.query('SELECT * FROM TELEFONO_PROFESOR WHERE id_telefono_profesor = ?', [id_telefono_profesor]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Teléfono no encontrado' });
        }
        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear un nuevo teléfono para un profesor (Protegido con JWT)
router.post('/', verifyToken, async (req, res) => {
    const { id_profesor, numero, fecha_inicio, fecha_fin } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO TELEFONO_PROFESOR (id_profesor, numero, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)',
            [id_profesor, numero, fecha_inicio, fecha_fin]
        );

        res.status(201).json({ message: 'Teléfono creado exitosamente', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar un teléfono por su ID (Protegido con JWT)
router.put('/:id', verifyToken, async (req, res) => {
    const id_telefono_profesor = req.params.id;
    const { numero, fecha_inicio, fecha_fin } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE TELEFONO_PROFESOR SET numero = ?, fecha_inicio = ?, fecha_fin = ? WHERE id_telefono_profesor = ?',
            [numero, fecha_inicio, fecha_fin, id_telefono_profesor]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Teléfono no encontrado' });
        }

        res.json({ message: 'Teléfono actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar un teléfono por su ID (Protegido con JWT)
router.delete('/:id', verifyToken, async (req, res) => {
    const id_telefono_profesor = req.params.id;

    try {
        const [result] = await db.query('DELETE FROM TELEFONO_PROFESOR WHERE id_telefono_profesor = ?', [id_telefono_profesor]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Teléfono no encontrado' });
        }

        res.json({ message: 'Teléfono eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
