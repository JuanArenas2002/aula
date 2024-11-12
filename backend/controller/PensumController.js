// controllers/PensumController.js
const db = require('../config/db');

// Crear un nuevo pensum
exports.createPensum = async (req, res) => {
  const { id_institucion, nombre_pensum, descripcion, fecha_inicio, fecha_fin, estado } = req.body;

  try {
    const query = 'INSERT INTO pensum (id_institucion, nombre_pensum, descripcion, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [id_institucion, nombre_pensum, descripcion, fecha_inicio, fecha_fin, estado]);
    res.status(201).json({ id_pensum: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el pensum' });
  }
};

// Obtener todos los pensums
exports.getAllPensum = async (req, res) => {
  try {
    const query = 'SELECT * FROM pensum';
    const [pensums] = await db.execute(query);
    res.status(200).json(pensums);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pensums' });
  }
};

// Agregar asignatura a un pensum
exports.addAsignaturaToPensum = async (req, res) => {
  const { id_pensum, id_curso, id_asignatura_institucion, horas_semanales } = req.body;

  try {
    // Verificar si la asignatura ya está en el curso del pensum
    const checkQuery = 'SELECT * FROM pensum_asignaturas WHERE id_pensum = ? AND id_curso = ? AND id_asignatura_institucion = ?';
    const [exists] = await db.execute(checkQuery, [id_pensum, id_curso, id_asignatura_institucion]);

    if (exists.length > 0) {
      return res.status(400).json({ error: 'La asignatura ya está asignada a este curso en el pensum' });
    }

    const insertQuery = 'INSERT INTO pensum_asignaturas (id_pensum, id_curso, id_asignatura_institucion, horas_semanales) VALUES (?, ?, ?, ?)';
    await db.execute(insertQuery, [id_pensum, id_curso, id_asignatura_institucion, horas_semanales]);
    res.status(201).json({ message: 'Asignatura agregada al pensum' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar la asignatura al pensum' });
  }
};

// Obtener asignaturas de un curso en un pensum
exports.getAsignaturasByCurso = async (req, res) => {
  const { id_pensum, id_curso } = req.params;

  try {
    const query = `
      SELECT pa.*, a.nombre_asignatura 
      FROM pensum_asignaturas pa 
      JOIN asignaturas a ON pa.id_asignatura_institucion = a.id_asignatura_institucion
      WHERE pa.id_pensum = ? AND pa.id_curso = ?
    `;
    const [asignaturas] = await db.execute(query, [id_pensum, id_curso]);
    res.status(200).json(asignaturas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las asignaturas del curso en el pensum' });
  }
};

// Eliminar asignatura del pensum
exports.deleteAsignaturaFromPensum = async (req, res) => {
  const { id_pensum, id_asignatura_institucion, id_curso } = req.params;

  try {
    const deleteQuery = 'DELETE FROM pensum_asignaturas WHERE id_pensum = ? AND id_curso = ? AND id_asignatura_institucion = ?';
    await db.execute(deleteQuery, [id_pensum, id_curso, id_asignatura_institucion]);
    res.status(200).json({ message: 'Asignatura eliminada del pensum' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la asignatura del pensum' });
  }
};

exports.getAsignaturas = async (req, res) => {
  try {
    const query = 'SELECT id_asignatura_institucion, nombre_asignatura FROM asignaturas';
    const [asignaturas] = await db.execute(query);
    res.status(200).json(asignaturas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener asignaturas' });
  }
};
// Obtener asignaturas específicas de una institución
exports.getAsignaturasByInstitution = async (req, res) => {
  const id_institucion = req.user.id_institucion; // Asegúrate de que el middleware agrega esta información

  try {
    const query = `
      SELECT id_asignatura_institucion, nombre_asignatura, descripcion 
      FROM asignaturas_institucion 
      WHERE id_institucion = ?
    `;
    const [asignaturas] = await db.execute(query, [id_institucion]);
    res.status(200).json(asignaturas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener asignaturas para la institución' });
  }
};