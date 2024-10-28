// backend/controller/authSupportController.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.createSupport = async (req, res) => {
  const { id_tipo_identificacion, identificacion, nombre, apellido, telefono, correo, clave } = req.body;

  if (!id_tipo_identificacion || !identificacion || !nombre || !apellido || !telefono || !correo || !clave) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    // Verificar si la identificación ya existe
    const [existingSupport] = await db.query('SELECT * FROM support WHERE identificacion = ?', [identificacion]);
    if (existingSupport.length > 0) {
      return res.status(400).json({ error: 'La identificación ya está registrada' });
    }

    // Insertar el nuevo usuario sin encriptar la contraseña
    const [result] = await db.query(
      'INSERT INTO support (id_tipo_identificacion, identificacion, nombre, apellido, telefono, correo, clave) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id_tipo_identificacion, identificacion, nombre, apellido, telefono, correo, clave]
    );

    res.status(201).json({ message: 'Usuario de soporte creado exitosamente', id: result.insertId });
  } catch (err) {
    console.error('Error al crear el usuario de soporte:', err);
    return res.status(500).json({ error: 'Error en el servidor', details: err.message });
  }
};

exports.login = async (req, res) => {
  const { identificacion, clave } = req.body;

  if (!identificacion || !clave) {
    return res.status(400).json({ error: 'Identificación y clave son requeridos' });
  }

  try {
    const [results] = await db.query('SELECT * FROM support WHERE identificacion = ?', [identificacion]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario de soporte no encontrado' });
    }

    const support = results[0];

    // Comparación directa de contraseñas
    if (clave !== support.clave) {
      return res.status(400).json({ error: 'Clave incorrecta' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: support.id_support, userName: support.nombre, userType: 'support' },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.status(200).json({ message: 'Inicio de sesión exitoso', token, supportNombre: support.nombre });
  } catch (err) {
    console.error('Error en el servidor:', err);
    return res.status(500).json({ error: 'Error en el servidor', details: err.message });
  }
};
