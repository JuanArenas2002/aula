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

// Verificar la conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

// Obtener los salones por instituto (GET)
router.get('/', (req, res) => {
  const { id_instituto } = req.query;

  if (!id_instituto) {
    return res.status(400).json({ message: 'El ID del instituto es requerido.' });
  }

  const query = `
    SELECT salones.id, salones.nombre_salon
    FROM salones
    JOIN cursos ON salones.Id_curso = cursos.id
    WHERE cursos.Id_Instituto = ?
  `;

  connection.query(query, [id_instituto], (err, results) => {
    if (err) {
      console.error('Error al obtener los salones:', err);
      return res.status(500).json({ message: 'Error en el servidor al obtener los salones.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron salones para este instituto.' });
    }

    res.json(results);
  });
});

// Crear un nuevo salón (POST)
router.post('/', (req, res) => {
  const { nombre_salon, id_curso } = req.body;

  if (!nombre_salon || !id_curso) {
    return res.status(400).json({ message: 'Nombre del salón y curso son requeridos.' });
  }

  const query = 'INSERT INTO salones (nombre_salon, Id_curso) VALUES (?, ?)';
  connection.query(query, [nombre_salon, id_curso], (err, result) => {
    if (err) {
      console.error('Error al crear salón:', err);
      return res.status(500).json({ message: 'Error en el servidor al crear el salón.' });
    }
    res.status(201).json({ message: 'Salón creado exitosamente' });
  });
});

// Eliminar un salón (DELETE)
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM salones WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el salón:', err);
      return res.status(500).json({ message: 'Error en el servidor al eliminar el salón.' });
    }
    res.json({ message: 'Salón eliminado exitosamente' });
  });
});

// Editar un salón (PUT)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre_salon, id_curso } = req.body;

  if (!nombre_salon || !id_curso) {
    return res.status(400).json({ message: 'Nombre del salón y curso son requeridos para actualizar.' });
  }

  const query = 'UPDATE salones SET nombre_salon = ?, Id_curso = ? WHERE id = ?';
  connection.query(query, [nombre_salon, id_curso, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar el salón:', err);
      return res.status(500).json({ message: 'Error en el servidor al actualizar el salón.' });
    }
    res.json({ message: 'Salón actualizado exitosamente' });
  });
});




module.exports = router;
