// backend/controller/authSupportController.js
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Pool de conexiones a la base de datos

// Controlador para crear un nuevo usuario de soporte
exports.createSupport = async (req, res) => {
  const { id_tipo_identificacion, identificacion, nombre, apellido, telefono, correo, clave } = req.body;

  // Validar campos requeridos
  if (!id_tipo_identificacion || !identificacion || !nombre || !apellido || !telefono || !correo || !clave) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    // Verificar si la identificación ya está registrada
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
};

// Controlador para el inicio de sesión de soporte
exports.login = async (req, res) => {
  const { identificacion, clave } = req.body;

  // Validar campos de entrada
  if (!identificacion || !clave) {
    return res.status(400).json({ error: 'Identificación y clave son requeridos' });
  }

  try {
    // Buscar el usuario de soporte en la base de datos
    const [results] = await db.query('SELECT * FROM support WHERE identificacion = ?', [identificacion]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario de soporte no encontrado' });
    }

    const support = results[0];

    // Comparación directa de contraseñas en texto plano
    if (clave !== support.clave) {
      return res.status(400).json({ error: 'Clave incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: support.id_support, userName: support.nombre, userType: 'support' },
      process.env.JWT_SECRET || 'default_secret', // Usa JWT_SECRET o un valor predeterminado
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.status(200).json({ message: 'Inicio de sesión exitoso', token, supportNombre: support.nombre });
  } catch (err) {
    console.error('Error en el servidor:', err);
    return res.status(500).json({ error: 'Error en el servidor', details: err.message });
  }
};
