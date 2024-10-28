const express = require('express');
const router = express.Router();
const db = require('../config/db');  // El pool de conexiones
const jwt = require('jsonwebtoken');

// Ruta para crear un nuevo usuario de soporte
router.post('/', async (req, res) => {
  const { id_tipo_identificacion, identificacion, nombre, apellido, telefono, correo, clave } = req.body;

  // Validar que todos los campos estén presentes
  if (!id_tipo_identificacion || !identificacion || !nombre || !apellido || !telefono || !correo || !clave) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    // Verificar si la identificación ya existe
    const [existingSupport] = await db.query('SELECT * FROM support WHERE identificacion = ?', [identificacion]);
    if (existingSupport.length > 0) {
      return res.status(400).json({ error: 'La identificación ya está registrada' });
    }

    // Insertar el nuevo usuario en la base de datos sin encriptar la clave
    const [result] = await db.query(
      'INSERT INTO support (id_tipo_identificacion, identificacion, nombre, apellido, telefono, correo, clave) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id_tipo_identificacion, identificacion, nombre, apellido, telefono, correo, clave]
    );

    res.status(201).json({ message: 'Usuario de soporte creado exitosamente', id: result.insertId });
  } catch (err) {
    console.error('Error al crear el usuario de soporte:', err);
    return res.status(500).json({ error: 'Error en el servidor', details: err.message });
  }
});

// Ruta de inicio de sesión para soporte
router.post('/login', async (req, res) => {
  const { identificacion, clave } = req.body;

  console.log('Solicitud de inicio de sesión recibida:', req.body); // Log para ver la solicitud

  if (!identificacion || !clave) {
    console.log('Faltan campos de identificación o clave'); // Log si faltan campos
    return res.status(400).json({ error: 'Identificación y clave son requeridos' });
  }

  try {
    console.log('Consultando base de datos para identificación:', identificacion);
    const [results] = await db.query('SELECT * FROM support WHERE identificacion = ?', [identificacion]);

    if (results.length === 0) {
      console.log('Soporte no encontrado'); // Log para indicar que no se encontró el soporte
      return res.status(404).json({ error: 'Soporte no encontrado' });
    }

    const support = results[0];

    // Comparación directa de contraseñas sin encriptar
    if (clave !== support.clave) {
      console.log('Clave incorrecta'); // Log para indicar clave incorrecta
      return res.status(400).json({ error: 'Clave incorrecta' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: support.id_support, userName: support.nombre, userType: 'support' },
      process.env.JWT_SECRET || 'default_secret', // Usa una clave por defecto si no está definida
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    console.log('Token generado:', token); // Log del token generado
    res.json({ token, supportNombre: support.nombre });
  } catch (err) {
    console.error('Error en el servidor:', err); // Log de error del servidor
    return res.status(500).json({ error: 'Error en el servidor', details: err.message });
  }
});

// Ruta para obtener todos los usuarios de soporte
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM support');
    res.status(200).json(results);
  } catch (err) {
    console.error('Error al obtener los usuarios de soporte:', err);
    return res.status(500).json({ error: 'Error en el servidor', details: err.message });
  }
});

// Ruta para actualizar un usuario de soporte
router.put('/', async (req, res) => {
  const { id_support, id_tipo_identificacion, identificacion, nombre, apellido, telefono, correo, clave } = req.body;

  try {
    if (clave) {
      // Actualizar el usuario de soporte en la base de datos con la nueva clave en texto plano
      const [result] = await db.query(
        'UPDATE support SET id_tipo_identificacion = ?, identificacion = ?, nombre = ?, apellido = ?, telefono = ?, correo = ?, clave = ? WHERE id_support = ?',
        [id_tipo_identificacion, identificacion, nombre, apellido, telefono, correo, clave, id_support]
      );

      res.status(200).json({ message: 'Usuario de soporte actualizado exitosamente' });
    } else {
      // Actualizar el usuario de soporte sin cambiar la contraseña
      const [result] = await db.query(
        'UPDATE support SET id_tipo_identificacion = ?, identificacion = ?, nombre = ?, apellido = ?, telefono = ?, correo = ? WHERE id_support = ?',
        [id_tipo_identificacion, identificacion, nombre, apellido, telefono, correo, id_support]
      );

      res.status(200).json({ message: 'Usuario de soporte actualizado exitosamente' });
    }
  } catch (err) {
    console.error('Error al actualizar el usuario de soporte:', err);
    return res.status(500).json({ error: 'Error en el servidor', details: err.message });
  }
});

// Ruta para eliminar un usuario de soporte
router.delete('/:id_support', async (req, res) => {
  const { id_support } = req.params;

  try {
    const [result] = await db.query('DELETE FROM support WHERE id_support = ?', [id_support]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario de soporte no encontrado' });
    }

    res.status(200).json({ message: 'Usuario de soporte eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar el usuario de soporte:', err);
    return res.status(500).json({ error: 'Error en el servidor', details: err.message });
  }
});

module.exports = router;
