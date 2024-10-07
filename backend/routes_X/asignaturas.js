const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'aula_estudiantil',
});

// Obtener asignaturas con los datos asociados
router.get('/', (req, res) => {
  const { id_instituto } = req.query;

  if (!id_instituto) {
    return res.status(400).json({ message: 'El ID del instituto es requerido.' });
  }

  const query = `
    SELECT asignatura.id, materias.nombre AS nombre_materia, cursos.Nombre AS nombre_curso, salones.nombre_salon, profesores.Nombre_Completo AS nombre_profesor
    FROM asignatura
    JOIN materias ON asignatura.Id_materia = materias.id
    JOIN salones ON asignatura.Id_Salon = salones.id
    JOIN cursos ON salones.Id_curso = cursos.id
    JOIN profesores ON asignatura.Id_profesor = profesores.id
    WHERE cursos.Id_Instituto = ?
  `;

  connection.query(query, [id_instituto], (err, results) => {
    if (err) {
      console.error('Error al obtener asignaturas:', err);
      return res.status(500).send('Error en el servidor');
    }
    res.json(results); // Enviar los resultados de las asignaturas obtenidas
  });
});

// Editar una asignatura existente
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { id_materia, id_salon, id_profesor } = req.body;

  if (!id_materia || !id_salon || !id_profesor) {
    return res.status(400).json({ message: 'Faltan campos requeridos para actualizar la asignatura.' });
  }

  const query = 'UPDATE asignatura SET Id_materia = ?, Id_salon = ?, Id_profesor = ? WHERE id = ?';
  connection.query(query, [id_materia, id_salon, id_profesor, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar la asignatura:', err);
      return res.status(500).json({ message: 'Error en el servidor al actualizar la asignatura.' });
    }
    res.json({ message: 'Asignatura actualizada exitosamente' });
  });
});

// Eliminar una asignatura
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM asignatura WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar la asignatura:', err);
      return res.status(500).json({ message: 'Error en el servidor al eliminar la asignatura.' });
    }
    res.json({ message: 'Asignatura eliminada exitosamente' });
  });
});

// Crear una nueva asignatura
router.post('/', (req, res) => {
  const { id_materia, id_profesor, id_salon } = req.body;

  // Primero, verificar si ya existe una asignatura con la misma materia y salón
  const checkQuery = `
    SELECT * FROM asignatura 
    WHERE Id_materia = ? AND Id_Salon = ?
  `;
  connection.query(checkQuery, [id_materia, id_salon], (err, results) => {
    if (err) {
      console.error('Error al verificar la asignatura:', err);
      return res.status(500).send('Error en el servidor');
    }

    if (results.length > 0) {
      // Si ya existe, devolvemos un error
      return res.status(400).json({ message: 'Ya existe una asignatura con la misma materia en el salón seleccionado.' });
    }

    // Si no existe, procedemos a crear la asignatura
    const insertQuery = `
      INSERT INTO asignatura (Id_materia, Id_profesor, Id_Salon) 
      VALUES (?, ?, ?)
    `;
    connection.query(insertQuery, [id_materia, id_profesor, id_salon], (err, result) => {
      if (err) {
        console.error('Error al crear asignatura:', err);
        return res.status(500).send('Error en el servidor');
      }
      res.json({ message: 'Asignatura creada exitosamente' });
    });
  });
});

module.exports = router;
