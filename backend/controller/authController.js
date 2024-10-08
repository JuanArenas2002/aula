const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.login = (req, res) => {
  const { correo, contraseña } = req.body;

  // Busca el usuario por correo
  db.query('SELECT * FROM INSTITUCION WHERE correo = ?', [correo], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Institución no encontrada' });
    }

    const institucion = results[0];
    const hashedPassword = institucion.clave;

    // Compara la contraseña
    bcrypt.compare(contraseña, hashedPassword, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Error al comparar contraseñas' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      // Si la contraseña coincide, generar un token JWT
      const token = jwt.sign({ id: institucion.id_institucion, institucionNombre: institucion.nombre }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({ message: 'Inicio de sesión exitoso', token, institucion });
    });
  });
};