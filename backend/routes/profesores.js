const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importamos la conexión a la base de datos
const { verifyToken } = require('../middleware/auth'); // Importamos el middleware de autenticación

// Obtener todos los profesores (Protegido con JWT)
router.get('/', verifyToken, (req, res) => {
    db.query('SELECT * FROM PROFESORES', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Obtener un profesor por su ID (Protegido con JWT)
router.get('/:id', verifyToken, (req, res) => {
    const id_profesor = req.params.id;
    db.query('SELECT * FROM PROFESORES WHERE id_profesor = ?', [id_profesor], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'Profesor no encontrado' });
            return;
        }
        res.json(result[0]);
    });
});

// Crear un nuevo profesor (Protegido con JWT)
router.post('/', verifyToken, (req, res) => {
    const { id_tipo_identificacion, identificacion, nombres, apellidos, correo, clave, coordinador } = req.body;
    db.query(
        'INSERT INTO PROFESORES (id_tipo_identificacion, identificacion, nombres, apellidos, correo, clave, coordinador) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id_tipo_identificacion, identificacion, nombres, apellidos, correo, clave, coordinador],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ message: 'Profesor creado exitosamente', id: result.insertId });
        }
    );
});

// Actualizar un profesor por su ID (Protegido con JWT)
router.put('/:id', verifyToken, (req, res) => {
    const id_profesor = req.params.id;
    const { id_tipo_identificacion, identificacion, nombres, apellidos, correo, clave, coordinador } = req.body;
    db.query(
        'UPDATE PROFESORES SET id_tipo_identificacion = ?, identificacion = ?, nombres = ?, apellidos = ?, correo = ?, clave = ?, coordinador = ? WHERE id_profesor = ?',
        [id_tipo_identificacion, identificacion, nombres, apellidos, correo, clave, coordinador, id_profesor],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Profesor no encontrado' });
                return;
            }
            res.json({ message: 'Profesor actualizado exitosamente' });
        }
    );
});

// Eliminar un profesor por su ID (Protegido con JWT)
router.delete('/:id', verifyToken, (req, res) => {
    const id_profesor = req.params.id;
    db.query('DELETE FROM PROFESORES WHERE id_profesor = ?', [id_profesor], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Profesor no encontrado' });
            return;
        }
        res.json({ message: 'Profesor eliminado exitosamente' });
    });
});

module.exports = router;
