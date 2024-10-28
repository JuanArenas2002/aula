const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importamos la conexión al pool de base de datos
const { verifyToken } = require('../middleware/auth'); // Importamos el middleware de autenticación

// Obtener todos los profesores (Protegido con JWT)
router.get('/', verifyToken, async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM PROFESORES');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener un profesor por su ID (Protegido con JWT)
router.get('/:id', verifyToken, async (req, res) => {
    const id_profesor = req.params.id;

    try {
        const [result] = await db.query('SELECT * FROM PROFESORES WHERE id_profesor = ?', [id_profesor]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }
        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear un nuevo profesor (Protegido con JWT)
router.post('/', verifyToken, async (req, res) => {
    const { id_tipo_identificacion, identificacion, nombres, apellidos, correo, clave, coordinador } = req.body;

    try {
        // Verificar si ya existe un profesor con la misma identificación
        const [existingProfessor] = await db.query('SELECT * FROM PROFESORES WHERE identificacion = ?', [identificacion]);

        if (existingProfessor.length > 0) {
            return res.status(400).json({ error: 'Ya existe un profesor con esa identificación' });
        }

        const [result] = await db.query(
            'INSERT INTO PROFESORES (id_tipo_identificacion, identificacion, nombres, apellidos, correo, clave, coordinador) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id_tipo_identificacion, identificacion, nombres, apellidos, correo, clave, coordinador]
        );
        res.status(201).json({ message: 'Profesor creado exitosamente', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar un profesor por su ID (Protegido con JWT)
router.put('/:id', verifyToken, async (req, res) => {
    const id_profesor = req.params.id;
    const { id_tipo_identificacion, identificacion, nombres, apellidos, correo, clave, coordinador } = req.body;

    try {
        // Verificar si la identificación nueva ya existe en otro profesor
        const [existingProfessor] = await db.query('SELECT * FROM PROFESORES WHERE identificacion = ? AND id_profesor != ?', [identificacion, id_profesor]);

        if (existingProfessor.length > 0) {
            return res.status(400).json({ error: 'Ya existe un profesor con esa identificación' });
        }

        const [result] = await db.query(
            'UPDATE PROFESORES SET id_tipo_identificacion = ?, identificacion = ?, nombres = ?, apellidos = ?, correo = ?, clave = ?, coordinador = ? WHERE id_profesor = ?',
            [id_tipo_identificacion, identificacion, nombres, apellidos, correo, clave, coordinador, id_profesor]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }
        res.json({ message: 'Profesor actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar un profesor por su ID (Protegido con JWT)
router.delete('/:id', verifyToken, async (req, res) => {
    const id_profesor = req.params.id;

    try {
        const [result] = await db.query('DELETE FROM PROFESORES WHERE id_profesor = ?', [id_profesor]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }
        res.json({ message: 'Profesor eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
