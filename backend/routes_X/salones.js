const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'aula_estudiantil'
});

router.get('/', (req, res) => {
  const { id_curso } = req.query; // Asegúrate de que este parámetro se esté enviando correctamente
  const query = `
    SELECT id, nombre_salon 
    FROM Salones 
    WHERE Id_curso = ?
  `;

  connection.query(query, [id_curso], (err, results) => {
    if (err) {
      console.error('Error al obtener los salones:', err);
      return res.status(500).send('Error en el servidor');
    }
    console.log('Resultados obtenidos de la base de datos:', results); // Agregar log para ver la respuesta de la base de datos
    res.json(results);
  });
});


// Crear un nuevo salón
router.post('/', (req, res) => {
  const { nombre_salon, id_curso } = req.body;
  const query = 'INSERT INTO Salones (nombre_salon, Id_curso) VALUES (?, ?)';
  connection.query(query, [nombre_salon, id_curso], (err, result) => {
    if (err) {
      console.error('Error al crear salón:', err);
      return res.status(500).send('Error en el servidor');
    }
    res.json({ message: 'Salón creado exitosamente' });
  });
});

// Eliminar un salón
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Salones WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el salón:', err);
      return res.status(500).send('Error al eliminar el salón');
    }
    res.json({ message: 'Salón eliminado exitosamente' });
  });
});


// En tu archivo salones.js
router.get('/salonesPorCurso', (req, res) => {
  const { id_instituto } = req.query;

  if (!id_instituto) {
    return res.status(400).json({ message: 'El ID del instituto es requerido.' });
  }

  const query = `
    SELECT cursos.Nombre AS nombre_curso, COUNT(salones.id) AS cantidad
    FROM cursos
    LEFT JOIN salones ON cursos.id = salones.Id_curso
    WHERE cursos.Id_Instituto = ?
    GROUP BY cursos.Nombre
  `;

  connection.query(query, [id_instituto], (err, results) => {
    if (err) {
      console.error('Error al obtener la cantidad de salones por curso:', err);
      return res.status(500).json({ message: 'Error en el servidor.' });
    }

    res.json(results);
  });
});
module.exports = router;
