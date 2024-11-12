const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Importa `pool` desde `config.js`
const { verifyInstitutionToken } = require('../middleware/AuthInstitution'); // Importa el middleware para instituciones




// Ruta para obtener todos los profesores de la institución autenticada
router.get('/', verifyInstitutionToken, async (req, res) => {
  const id_institucion = req.institutionId; // Extrae el ID de la institución del token decodificado

  try {
    const [profesores] = await pool.query(
      `SELECT p.* 
       FROM profesores p
       INNER JOIN institucion_profesor ip ON p.id_profesor = ip.id_profesor
       WHERE ip.id_institucion = ?`,
      [id_institucion]
    );

    res.json(profesores);
  } catch (error) {
    console.error('Error al obtener profesores:', error);
    res.status(500).json({ message: 'Error al obtener profesores' });
  }
});


// Ruta para obtener los detalles completos de un profesor por ID
router.get('/:id', verifyInstitutionToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener los datos del profesor
    const [profesor] = await pool.query('SELECT * FROM profesores WHERE id_profesor = ?', [id]);

    if (profesor.length === 0) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    // Obtener todas las direcciones asociadas al profesor
    const [direccion] = await pool.query('SELECT * FROM direccion_profesor WHERE id_profesor = ?', [id]);

    // Obtener todos los teléfonos asociados al profesor
    const [telefono] = await pool.query('SELECT * FROM telefono_profesor WHERE id_profesor = ?', [id]);

    // Obtener todas las inscripciones asociadas al profesor en diferentes instituciones
    const [inscripcion] = await pool.query('SELECT * FROM institucion_profesor WHERE id_profesor = ?', [id]);

    // Enviar todos los datos sin formatear
    res.json({
      profesor: profesor,       // Datos del profesor (array de un único elemento)
      direccion: direccion,     // Todas las direcciones asociadas al profesor
      telefono: telefono,       // Todos los teléfonos asociados al profesor
      inscripcion: inscripcion, // Todas las inscripciones asociadas al profesor
    });
  } catch (error) {
    console.error('Error al obtener los detalles del profesor:', error);
    res.status(500).json({ message: 'Error al obtener los detalles del profesor' });
  }
});

// Ruta para registrar un profesor (solo accesible para instituciones)
router.post('/registro', verifyInstitutionToken, async (req, res) => {
  const id_institucion = req.institutionId; // Extrae el ID de la institución desde el token decodificado
  const { 
    id_tipo_identificacion, 
    identificacion, 
    nombres, 
    apellidos, 
    correo, 
    clave, 
    coordinador, 
    direccion, 
    telefono, 
    inscripcion 
  } = req.body;

  try {
    // Inserta el profesor en la tabla de profesores
    const [profesorResult] = await pool.query(
      `INSERT INTO profesores (id_tipo_identificacion, identificacion, nombres, apellidos, correo, clave, coordinador) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_tipo_identificacion, identificacion, nombres, apellidos, correo, clave, coordinador]
    );

    if (!profesorResult || !profesorResult.insertId) {
      throw new Error("No se pudo obtener el ID del profesor insertado");
    }

    const id_profesor = profesorResult.insertId;

    // Inserta la relación en institucion_profesor
    await pool.query(
      `INSERT INTO institucion_profesor (id_institucion, id_profesor, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?)`,
      [id_institucion, id_profesor, inscripcion.fecha_inicio, inscripcion.fecha_fin, inscripcion.estado]
    );

    // Inserta la dirección del profesor
    await pool.query(
      `INSERT INTO direccion_profesor (id_profesor, direccion, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)`,
      [id_profesor, direccion.direccion, direccion.fecha_inicio, direccion.fecha_fin]
    );

    // Inserta el teléfono del profesor
    await pool.query(
      `INSERT INTO telefono_profesor (id_profesor, numero, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)`,
      [id_profesor, telefono.numero, telefono.fecha_inicio, telefono.fecha_fin]
    );

    res.status(201).json({ message: 'Profesor registrado exitosamente.' });
  } catch (error) {
    console.error('Error registrando el profesor:', error);
    res.status(500).json({ message: 'Error registrando el profesor.' });
  }
});



// Ruta para actualizar un profesor existente
router.put('/:id', verifyInstitutionToken, async (req, res) => {
  const { id } = req.params;
  const { 
    id_tipo_identificacion, 
    identificacion, 
    nombres, 
    apellidos, 
    correo, 
    clave, 
    coordinador, 
    direccion, 
    telefono, 
    inscripcion 
  } = req.body;

  try {
    // Actualizar la tabla profesores
    await pool.query(
      `UPDATE profesores SET id_tipo_identificacion = ?, identificacion = ?, nombres = ?, apellidos = ?, correo = ?, clave = ?, coordinador = ? WHERE id_profesor = ?`,
      [id_tipo_identificacion, identificacion, nombres, apellidos, correo, clave, coordinador, id]
    );

    // Actualizar la tabla direccion_profesor
    await pool.query(
      `UPDATE direccion_profesor SET direccion = ?, fecha_inicio = ?, fecha_fin = ? WHERE id_profesor = ?`,
      [direccion.direccion, direccion.fecha_inicio, direccion.fecha_fin, id]
    );

    // Actualizar la tabla telefono_profesor
    await pool.query(
      `UPDATE telefono_profesor SET numero = ?, fecha_inicio = ?, fecha_fin = ? WHERE id_profesor = ?`,
      [telefono.numero, telefono.fecha_inicio, telefono.fecha_fin, id]
    );

    // Actualizar la tabla institucion_profesor
    await pool.query(
      `UPDATE institucion_profesor SET fecha_inicio = ?, fecha_fin = ?, estado = ? WHERE id_profesor = ? AND id_institucion = ?`,
      [inscripcion.fecha_inicio, inscripcion.fecha_fin, inscripcion.estado, id, req.institutionId]
    );

    res.status(200).json({ message: 'Profesor actualizado exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar el profesor:', error);
    res.status(500).json({ message: 'Error al actualizar el profesor.' });
  }
});



module.exports = router;
