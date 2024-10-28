// middleware/auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (allowedRole) => (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mi_secreto_super_seguro');

    // Verificar que el rol del usuario coincida con el rol permitido
    if (decoded.role !== allowedRole) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    // Almacenar información en req para usar en las rutas
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token no válido o ha expirado' });
  }
};

module.exports = { verifyToken };
