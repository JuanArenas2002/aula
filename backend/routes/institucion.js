const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Asegúrate de que config/db.js está configurado para usar las variables de entorno
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Para generar el token JWT
const { verifyToken } = require('../middleware/auth');

// Ruta protegida que obtiene el perfil de la institución
router.get('/perfil', verifyToken, (req, res) => {
    const id_institucion = req.institucionId;

    db.query('SELECT nombre, direccion, correo FROM INSTITUCION WHERE id_institucion = ?', [id_institucion], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Institución no encontrada' });
        }
        res.json(result[0]);
    });
});

// Obtener todas las instituciones (Protegida con JWT)
router.get('/', verifyToken, (req, res) => {
    db.query('SELECT * FROM INSTITUCION', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Crear una nueva institución
router.post('/', async (req, res) => {
    const { nit, nombre, id_municipio, direccion, correo, clave, estado } = req.body;

    try {
        // Verifica si NIT y clave son proporcionados
        if (!nit || !clave) {
            return res.status(400).json({ error: 'NIT y clave son obligatorios' });
        }

        // Generar un hash para la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(clave, salt);

        // Insertar la institución en la base de datos
        db.query(
            'INSERT INTO INSTITUCION (nit, nombre, id_municipio, direccion, correo, clave, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nit, nombre || null, id_municipio || null, direccion || null, correo || null, hashedPassword, estado || null],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ message: 'Institución creada exitosamente', id: result.insertId });
            }
        );
    } catch (err) {
        res.status(500).json({ error: 'Error al crear la institución', details: err.message });
    }
});

// Ruta de inicio de sesión
router.post('/login', (req, res) => {
    const { nit, clave } = req.body;

    // Verificar si el NIT y la clave están presentes
    if (!nit || !clave) {
        return res.status(400).json({ error: 'NIT y clave son requeridos' });
    }

    // Buscar la institución por NIT
    db.query('SELECT * FROM INSTITUCION WHERE nit = ?', [nit], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Institución no encontrada' });
        }

        const institucion = results[0];

        // Comparar la clave proporcionada con la clave encriptada en la base de datos
        const isMatch = await bcrypt.compare(clave, institucion.clave);

        if (!isMatch) {
            return res.status(400).json({ error: 'Clave incorrecta' });
        }

        // Generar un token JWT con el id y el nombre de la institución
        const token = jwt.sign(
            { id: institucion.id_institucion, institucionNombre: institucion.nombre },
            process.env.JWT_SECRET || 'mi_secreto_super_seguro',
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        // Responder con el token y el nombre de la institución
        res.json({ token, institucionNombre: institucion.nombre });
    });
});

// Obtener detalles de una institución por su ID (Protegida con JWT)
router.get('/:id', verifyToken, (req, res) => {
    const id_institucion = req.params.id;

    db.query('SELECT * FROM INSTITUCION WHERE id_institucion = ?', [id_institucion], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Institución no encontrada' });
        }
        res.json(result[0]);
    });
});

// Actualizar una institución por su ID (Protegida con JWT)
router.put('/:id', verifyToken, (req, res) => {
    const id_institucion = req.params.id;
    const { direccion, correo, clave } = req.body;

    // Si se proporciona una nueva contraseña, hay que encriptarla antes de actualizar
    if (clave) {
        bcrypt.hash(clave, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ error: 'Error al encriptar la nueva clave' });
            }
            // Actualizar la institución en la base de datos con la nueva clave encriptada
            db.query(
                'UPDATE INSTITUCION SET direccion = ?, correo = ?, clave = ? WHERE id_institucion = ?',
                [direccion, correo, hashedPassword, id_institucion],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error en la base de datos' });
                    }
                    if (result.affectedRows === 0) {
                        return res.status(404).json({ message: 'Institución no encontrada' });
                    }
                    res.json({ message: 'Institución actualizada exitosamente' });
                }
            );
        });
    } else {
        // Actualizar la institución en la base de datos sin cambiar la clave
        db.query(
            'UPDATE INSTITUCION SET direccion = ?, correo = ? WHERE id_institucion = ?',
            [direccion, correo, id_institucion],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error en la base de datos' });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Institución no encontrada' });
                }
                res.json({ message: 'Institución actualizada exitosamente' });
            }
        );
    }
});

// Eliminar una institución por su ID (Protegida con JWT)
router.delete('/:id', verifyToken, (req, res) => {
    const id_institucion = req.params.id;
    db.query('DELETE FROM INSTITUCION WHERE id_institucion = ?', [id_institucion], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Institución no encontrada' });
        }
        res.json({ message: 'Institución eliminada exitosamente' });
    });
});

// Ruta protegida de ejemplo
router.get('/ruta-protegida', verifyToken, (req, res) => {
  res.json({
    message: `Acceso permitido a la institución con ID: ${req.institucionId}`,
    institucion: req.institucionNombre
  });
});

module.exports = router;