// backend/routes/CRUDsoporte.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Crear usuario de soporte
router.post('/', (req, res) => {
  const { id_tipo_identificacion, identificacion, nombre, apellido, telefono, correo, clave } = req.body;

  // Hashear la contraseña
  bcrypt.hash(clave, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Error al hashear la contraseña' });
    }

    // Insertar el nuevo usuario de soporte en la base de datos
    db.query('INSERT INTO SUPPORT (id_tipo_identificacion, identificacion, nombre, apellido, telefono, correo, clave) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [id_tipo_identificacion, identificacion, nombre, apellido, telefono, correo, hashedPassword], 
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error al crear el usuario de soporte' });
        }

        res.status(201).json({ message: 'Usuario de soporte creado exitosamente' });
      }
    );
  });
});

// Obtener todos los usuarios de soporte
router.get('/', (req, res) => {
  db.query('SELECT * FROM SUPPORT', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los usuarios de soporte' });
    }

    res.status(200).json(results);
  });
});

// Actualizar usuario de soporte
router.put('/', (req, res) => {
  const { id_support, id_tipo_identificacion, identificacion, nombre, apellido, telefono, correo, clave } = req.body;

  // Hashear la nueva contraseña si se proporciona
  if (clave) {
    bcrypt.hash(clave, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: 'Error al hashear la contraseña' });
      }

      // Actualizar el usuario de soporte en la base de datos
      db.query('UPDATE SUPPORT SET id_tipo_identificacion = ?, identificacion = ?, nombre = ?, apellido = ?, telefono = ?, correo = ?, clave = ? WHERE id_support = ?', 
        [id_tipo_identificacion, identificacion, nombre, apellido, telefono, correo, hashedPassword, id_support], 
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Error al actualizar el usuario de soporte' });
          }

          res.status(200).json({ message: 'Usuario de soporte actualizado exitosamente' });
        }
      );
    });
  } else {
    // Actualizar el usuario de soporte sin cambiar la contraseña
    db.query('UPDATE SUPPORT SET id_tipo_identificacion = ?, identificacion = ?, nombre = ?, apellido = ?, telefono = ?, correo = ? WHERE id_support = ?', 
      [id_tipo_identificacion, identificacion, nombre, apellido, telefono, correo, id_support], 
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error al actualizar el usuario de soporte' });
        }

        res.status(200).json({ message: 'Usuario de soporte actualizado exitosamente' });
      }
    );
  }
});

// Eliminar usuario de soporte
router.delete('/:id_support', (req, res) => {
  const { id_support } = req.params;

  db.query('DELETE FROM SUPPORT WHERE id_support = ?', [id_support], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar el usuario de soporte' });
    }

    res.status(200).json({ message: 'Usuario de soporte eliminado exitosamente' });
  });
});

module.exports = router;