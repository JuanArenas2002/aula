// backend/middleware/authSupport.js
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'mi_secreto_super_seguro';

const verifySupportToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], jwtSecret);
    req.supportId = decoded.id;
    req.supportNombre = decoded.supportNombre;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token no válido' });
  }
};

module.exports = { verifySupportToken };