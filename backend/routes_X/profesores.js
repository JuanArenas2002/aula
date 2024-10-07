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

// Verificar conexión
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});

// Crear un nuevo profesor
router.post('/', (req, res) => {
    const { nombre_completo, identificacion, correo, telefono, id_instituto } = req.body;
    const query = 'INSERT INTO Profesores (Nombre_Completo, Identificación, Correo, Teléfono, Id_instituto) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [nombre_completo, identificacion, correo, telefono, id_instituto], (err, result) => {
        if (err) {
            console.error('Error al crear profesor:', err);
            return res.status(500).send('Error en el servidor');
        }
        res.json({ message: 'Profesor creado exitosamente' });
    });
});

// Obtener profesores por instituto
router.get('/', (req, res) => {
    const { id_instituto } = req.query; // Obtener id_instituto desde la query
    const query = 'SELECT * FROM Profesores WHERE Id_instituto = ?';
    connection.query(query, [id_instituto], (err, results) => {
      if (err) {
        console.error('Error al obtener los profesores:', err);
        return res.status(500).send('Error en el servidor');
      }
      res.json(results); // Enviar los profesores filtrados
    });
  });
  

// Editar un profesor
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre_completo, identificacion, correo, telefono, id_instituto } = req.body;
    const query = 'UPDATE Profesores SET Nombre_Completo = ?, Identificación = ?, Correo = ?, Teléfono = ?, Id_instituto = ? WHERE id = ?';
    connection.query(query, [nombre_completo, identificacion, correo, telefono, id_instituto, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar profesor:', err);
            return res.status(500).send('Error en el servidor');
        }
        res.json({ message: 'Profesor actualizado exitosamente' });
    });
});

// Eliminar un profesor
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Profesores WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar profesor:', err);
            return res.status(500).send('Error en el servidor');
        }
        res.json({ message: 'Profesor eliminado exitosamente' });
    });
});

module.exports = router;
