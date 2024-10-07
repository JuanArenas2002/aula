const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Verificar si el token está presente en los encabezados
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'No se proporcionó el token de autenticación' });
  }

  // Extraer el token (remover "Bearer ")
  const token = authHeader.split(" ")[1];

  // Verificar el token JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Si el token es válido, extraemos el id de la institución y cualquier otra información que necesites
    req.institucionId = decoded.id;  // id_institucion almacenado en el token
    req.institucionNombre = decoded.institucionNombre; // Nombre de la institución

    // Continuar con la siguiente función
    next();
  });
};
