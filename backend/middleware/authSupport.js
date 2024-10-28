// backend/middleware/authSupport.js
const jwt = require('jsonwebtoken');

const verifySupportToken = (req, res, next) => {
  // Obtener el token del encabezado de autorización
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    // Verificar el token JWT usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    req.supportId = decoded.id; // Agregar ID de soporte a la solicitud para referencia futura
    req.supportNombre = decoded.userName;
    next(); // Continuar con la siguiente función en la cadena de middleware
  } catch (err) {
    return res.status(401).json({ message: 'Token no válido' });
  }
};

module.exports = { verifySupportToken };
