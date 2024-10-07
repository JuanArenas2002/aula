const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Cambia según tu configuración
  database: 'aula_estudiantil'
});

// Verificar conexión
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

// Crear una nueva materia
router.post('/', (req, res) => {
  const { nombre, descripcion } = req.body;
  const query = 'INSERT INTO materias (nombre, descripcion) VALUES (?, ?)';
  connection.query(query, [nombre, descripcion], (err, result) => {
    if (err) {
      console.error('Error al crear materia:', err);
      return res.status(500).send('Error en el servidor');
    }
    res.json({ message: 'Materia creada exitosamente' });
  });
});

// Obtener todas las materias
router.get('/', (req, res) => {
  const query = 'SELECT * FROM materias';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener las materias:', err);
      return res.status(500).send('Error en el servidor');
    }
    res.json(results); // Enviar la lista de materias
  });
});

// Obtener una materia por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM materias WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al obtener la materia:', err);
      return res.status(500).send('Error en el servidor');
    }
    res.json(result);
  });
});

// Editar una materia
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  const query = 'UPDATE materias SET nombre = ?, descripcion = ? WHERE id = ?';
  connection.query(query, [nombre, descripcion, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar materia:', err);
      return res.status(500).send('Error en el servidor');
    }
    res.json({ message: 'Materia actualizada exitosamente' });
  });
});

// Eliminar una materia
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM materias WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar materia:', err);
      return res.status(500).send('Error en el servidor');
    }
    res.json({ message: 'Materia eliminada exitosamente' });
  });
});

module.exports = router;
