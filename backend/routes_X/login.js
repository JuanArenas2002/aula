const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Cambia esto si tu base de datos tiene contraseña
    database: 'aula_estudiantil' // Cambia esto por el nombre de tu base de datos
});

connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});

// Ruta para el inicio de sesión
router.post('/', (req, res) => {
    const { username, password } = req.body;

    // Consulta SQL para verificar las credenciales
    const query = 'SELECT * FROM support WHERE Documento = ? AND Contraseña = ?';

    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        // Si las credenciales son correctas
        if (results.length > 0) {
            res.status(200).json({ message: 'Inicio de sesión exitoso' });
        } else {
            // Si las credenciales no coinciden
            res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
    });
});

module.exports = router;
