// middleware/auth.js
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'mi_secreto_super_seguro';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], jwtSecret);
    req.institucionId = decoded.id;
    req.institucionNombre = decoded.institucionNombre;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token no válido' });
  }
};

module.exports = { verifyToken };