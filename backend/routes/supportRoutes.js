// backend/routes/supportRoutes.js
const express = require('express');
const router = express.Router();
const authSupportController = require('../controller/authSupportController');
const bcrypt = require('bcryptjs');
const db = require('../config/db'); // Importa la configuración de la base de datos

// Ruta para crear un nuevo usuario de soporte
router.post('/', authSupportController.createSupport);

// Ruta de inicio de sesión para soporte
router.post('/login', authSupportController.login);

// Nueva ruta para obtener todas las instituciones junto con el nombre del municipio
router.get('/institucion', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        i.id_institucion, 
        i.nit,
        i.nombre, 
        i.id_municipio,
        i.direccion,
        i.correo,
        i.estado, 
        m.municipio AS municipio
      FROM 
        institucion i
      LEFT JOIN 
        municipios m ON i.id_municipio = m.id_municipio;
    `);
    res.json(results); // Devuelve los resultados como JSON
  } catch (err) {
    console.error('Error al obtener instituciones:', err);
    res.status(500).json({ error: 'Error al obtener instituciones' });
  }
});


// Cambiar estado de la institución
router.put('/institucion/:id_institucion/toggleStatus', async (req, res) => {
  const { id_institucion } = req.params;
  
  try {
    const [rows] = await db.query('SELECT estado FROM institucion WHERE id_institucion = ?', [id_institucion]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Institución no encontrada' });
    }

    const estadoActual = parseInt(rows[0].estado, 10);
    const nuevoEstado = estadoActual === 1 ? 0 : 1;

    const [updateResult] = await db.query('UPDATE institucion SET estado = ? WHERE id_institucion = ?', [nuevoEstado, id_institucion]);

    if (updateResult.affectedRows === 1) {
      res.json({ id_institucion, estado: nuevoEstado });
    } else {
      res.status(500).json({ message: 'No se pudo actualizar el estado de la institución' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar el estado de la institución' });
  }
});


// Ruta para crear una nueva institución
router.post('/institucion', async (req, res) => {
  const { nit, nombre, id_municipio, direccion, correo, clave } = req.body;

  if (!id_municipio) {
    return res.status(400).json({ error: 'El id_municipio es obligatorio y no puede estar vacío' });
  }

  try {
    const hashedPassword = await bcrypt.hash(clave, 10); // Hashea la clave antes de guardarla
    const [result] = await db.query(
      'INSERT INTO institucion (nit, nombre, id_municipio, direccion, correo, clave) VALUES (?, ?, ?, ?, ?, ?)',
      [nit, nombre, id_municipio, direccion, correo, hashedPassword]
    );
    res.status(201).json({ message: 'Institución creada exitosamente', id: result.insertId });
  } catch (error) {
    console.error('Error al crear la institución:', error);
    res.status(500).json({ error: 'Error al crear la institución' });
  }
});


// Ruta para obtener municipios por término de búsqueda (con parámetro `q`)
router.get('/municipios', async (req, res) => {
  const searchQuery = req.query.q || '';
  try {
      const [results] = await db.query(
          `SELECT id_municipio, municipio 
           FROM municipios 
           WHERE municipio LIKE ? AND estado = 1 
           LIMIT 10`,
          [`%${searchQuery}%`]
      );
      res.json(results);
  } catch (error) {
      console.error('Error al obtener los municipios:', error);
      res.status(500).json({ error: 'Error al obtener los municipios' });
  }
});


// Ruta para obtener todos los departamentos
router.get('/departamentos', async (req, res) => {
  try {
      const [departamentos] = await db.query('SELECT id_departamento, departamento FROM departamentos');
      res.json(departamentos);
  } catch (error) {
      console.error('Error al obtener los departamentos:', error);
      res.status(500).json({ error: 'Error al obtener los departamentos' });
  }
});

// Ruta para obtener municipios según el departamento_id
router.get('/municipios/:departamento_id', async (req, res) => {
  const { departamento_id } = req.params;
  try {
    const [municipios] = await db.query(
      'SELECT id_municipio, municipio FROM municipios WHERE id_departamento = ? AND estado = 1',
      [departamento_id]
    );
    res.json(municipios);
  } catch (error) {
    console.error('Error al obtener municipios:', error);
    res.status(500).json({ error: 'Error al obtener municipios' });
  }
});


module.exports = router;
