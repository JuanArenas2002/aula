const jwt = require('jsonwebtoken');

const verifyInstitutionToken = (req, res, next) => {
  // Obtener el token del encabezado de autorización
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    // Verificar el token JWT usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');

    // Verificar que el rol sea "institution"
    if (decoded.role !== 'institution') {
      return res.status(403).json({ message: 'No tienes permiso para acceder a este recurso.' });
    }

    // Agregar ID de institución y otros datos relevantes a `req` para referencia futura
    req.institutionId = decoded.id;
    req.institutionName = decoded.institutionName;
    next(); // Continuar con la siguiente función en la cadena de middleware
  } catch (err) {
    return res.status(401).json({ message: 'Token no válido' });
  }
};

module.exports = { verifyInstitutionToken };
