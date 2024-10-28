const express = require('express');
const router = express.Router();
const db = require('../config/db'); // El pool de conexiones configurado para usar promesas
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Para generar el token JWT
const { verifyToken } = require('../middleware/auth');





// Ruta protegida que obtiene el perfil de la institución
router.get('/perfil', verifyToken, async (req, res) => {
    const id_institucion = req.institucionId;

    try {
        const [result] = await db.query('SELECT id_institucion, nombre, direccion, correo FROM INSTITUCION WHERE id_institucion = ?', [id_institucion]);
        if (result.length === 0) {
            return res.status(404).json({ message: 'Institución no encontrada' });
        }
        res.json(result[0]);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Obtener la cantidad de instituciones activas (estado = 1)
router.get('/activas', verifyToken, async (req, res) => {
    try {
        const [result] = await db.query('SELECT COUNT(*) AS count FROM INSTITUCION WHERE estado = 1');
        res.json({ count: result[0].count });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Obtener todas las instituciones (Protegida con JWT)


// Crear una nueva institución
router.post('/', async (req, res) => {
    const { nit, nombre, id_municipio, direccion, correo, clave, estado } = req.body;

    try {
        // Verificar si ya existe una institución con el mismo NIT
        const [existingInstitution] = await db.query('SELECT * FROM INSTITUCION WHERE nit = ?', [nit]);
        if (existingInstitution.length > 0) {
            return res.status(400).json({ error: 'Ya existe una institución con ese NIT' });
        }

        if (!nit || !clave) {
            return res.status(400).json({ error: 'NIT y clave son obligatorios' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(clave, salt);

        const [result] = await db.query(
            'INSERT INTO INSTITUCION (nit, nombre, id_municipio, direccion, correo, clave, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nit, nombre || null, id_municipio || null, direccion || null, correo || null, hashedPassword, estado || null]
        );
        res.status(201).json({ message: 'Institución creada exitosamente', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear la institución', details: err.message });
    }
});

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
    const { nit, clave } = req.body;

    if (!nit || !clave) {
        return res.status(400).json({ error: 'NIT y clave son requeridos' });
    }

    try {
        const [results] = await db.query('SELECT * FROM INSTITUCION WHERE nit = ?', [nit]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Institución no encontrada' });
        }

        const institucion = results[0];

        const isMatch = await bcrypt.compare(clave, institucion.clave);
        if (!isMatch) {
            return res.status(400).json({ error: 'Clave incorrecta' });
        }

        const token = jwt.sign(
            { id: institucion.id_institucion, institucionNombre: institucion.nombre },
            process.env.JWT_SECRET || 'mi_secreto_super_seguro',
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.json({ token, institucionNombre: institucion.nombre });
    } catch (err) {
        return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
    }
});

// Obtener detalles de una institución por su ID (Protegida con JWT)
router.get('/:id', verifyToken, async (req, res) => {
    const id_institucion = req.params.id;

    try {
        const [result] = await db.query('SELECT * FROM INSTITUCION WHERE id_institucion = ?', [id_institucion]);
        if (result.length === 0) {
            return res.status(404).json({ message: 'Institución no encontrada' });
        }
        res.json(result[0]);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Actualizar una institución por su ID (Protegida con JWT)
router.put('/:id', verifyToken, async (req, res) => {
    const id_institucion = req.params.id;
    const { direccion, correo, clave } = req.body;

    try {
        if (clave) {
            const hashedPassword = await bcrypt.hash(clave, 10);
            const [result] = await db.query(
                'UPDATE INSTITUCION SET direccion = ?, correo = ?, clave = ? WHERE id_institucion = ?',
                [direccion, correo, hashedPassword, id_institucion]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Institución no encontrada' });
            }
            res.json({ message: 'Institución actualizada exitosamente' });
        } else {
            const [result] = await db.query(
                'UPDATE INSTITUCION SET direccion = ?, correo = ? WHERE id_institucion = ?',
                [direccion, correo, id_institucion]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Institución no encontrada' });
            }
            res.json({ message: 'Institución actualizada exitosamente' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
    }
});

// Eliminar una institución por su ID (Protegida con JWT)
router.delete('/:id', verifyToken, async (req, res) => {
    const id_institucion = req.params.id;

    try {
        const [result] = await db.query('DELETE FROM INSTITUCION WHERE id_institucion = ?', [id_institucion]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Institución no encontrada' });
        }
        res.json({ message: 'Institución eliminada exitosamente' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Cambiar estado de la institución
router.put('/institucion/:id_institucion/toggleStatus', async (req, res) => {
    const { id_institucion } = req.params;
    
    try {
      const [rows] = await db.query(
        'SELECT estado FROM institucion WHERE id_institucion = ?',
        [id_institucion]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Institución no encontrada' });
      }
  
      const estadoActual = parseInt(rows[0].estado, 10);
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
  
      const [updateResult] = await db.query(
        'UPDATE institucion SET estado = ? WHERE id_institucion = ?',
        [nuevoEstado, id_institucion]
      );
  
      if (updateResult.affectedRows === 1) {
        res.json({ id_institucion, estado: nuevoEstado });
      } else {
        res.status(500).json({ message: 'No se pudo actualizar el estado de la institución' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al cambiar el estado de la institución' });
    }
  });



module.exports = router;
