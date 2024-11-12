// backend/routes/professorRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../config/db'); // configuración de la base de datos
const { verifyToken } = require('../middleware/auth'); // Importamos el middleware de autenticación

// Crear un nuevo profesor
router.post('/profesores', verifyToken, async (req, res) => {
  const { id_tipo_identificacion, identificacion, nombres, apellidos, correo, clave, coordinador } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO profesores (id_tipo_identificacion, identificacion, nombres, apellidos, correo, clave, coordinador) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id_tipo_identificacion, identificacion, nombres, apellidos, correo, clave, coordinador]
    );
    res.status(201).json({ id_profesor: result.insertId, nombres, apellidos });
  } catch (error) {
    console.error('Error al crear profesor:', error);
    res.status(500).json({ error: 'Error al crear profesor' });
  }
});

// Registrar dirección de un profesor
router.post('/profesores/:id_profesor/direccion', verifyToken, async (req, res) => {
  const { id_profesor } = req.params;
  const { direccion, fecha_inicio, fecha_fin } = req.body;

  try {
    await db.query(
      'INSERT INTO direccion_profesor (id_profesor, direccion, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)',
      [id_profesor, direccion, fecha_inicio, fecha_fin]
    );
    res.status(201).json({ message: 'Dirección registrada con éxito' });
  } catch (error) {
    console.error('Error al registrar dirección:', error);
    res.status(500).json({ error: 'Error al registrar dirección' });
  }
});

// Registrar teléfono de un profesor
router.post('/profesores/:id_profesor/telefono', verifyToken, async (req, res) => {
  const { id_profesor } = req.params;
  const { numero, fecha_inicio, fecha_fin } = req.body;

  try {
    await db.query(
      'INSERT INTO telefono_profesor (id_profesor, numero, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)',
      [id_profesor, numero, fecha_inicio, fecha_fin]
    );
    res.status(201).json({ message: 'Teléfono registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar teléfono:', error);
    res.status(500).json({ error: 'Error al registrar teléfono' });
  }
});

// Inscribir profesor en una institución
router.post('/institucion/:id_institucion/profesores/:id_profesor', verifyToken, async (req, res) => {
  const { id_institucion, id_profesor } = req.params;
  const { fecha_inicio, fecha_fin, estado } = req.body;

  try {
    await db.query(
      'INSERT INTO institucion_profesor (id_institucion, id_profesor, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?)',
      [id_institucion, id_profesor, fecha_inicio, fecha_fin, estado]
    );
    res.status(201).json({ message: 'Profesor inscrito en la institución' });
  } catch (error) {
    console.error('Error al inscribir profesor en la institución:', error);
    res.status(500).json({ error: 'Error al inscribir profesor en la institución' });
  }
});

// Obtener información completa de un profesor
router.get('/profesores/:id_profesor', verifyToken, async (req, res) => {
  const { id_profesor } = req.params;

  try {
    // Información general del profesor
    const [profesor] = await db.query(
      'SELECT * FROM profesores WHERE id_profesor = ?',
      [id_profesor]
    );

    if (profesor.length === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }

    // Direcciones del profesor
    const [direcciones] = await db.query(
      'SELECT * FROM direccion_profesor WHERE id_profesor = ?',
      [id_profesor]
    );

    // Teléfonos del profesor
    const [telefonos] = await db.query(
      'SELECT * FROM telefono_profesor WHERE id_profesor = ?',
      [id_profesor]
    );

    // Instituciones en las que está inscrito el profesor
    const [inscripciones] = await db.query(
      'SELECT * FROM institucion_profesor WHERE id_profesor = ?',
      [id_profesor]
    );

    res.json({
      profesor: profesor[0],
      direcciones,
      telefonos,
      inscripciones,
    });
  } catch (error) {
    console.error('Error al obtener información del profesor:', error);
    res.status(500).json({ error: 'Error al obtener información del profesor' });
  }
});

module.exports = router;
