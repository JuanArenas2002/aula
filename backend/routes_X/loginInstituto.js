const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Cambia esto si tienes una contraseña
    database: 'aula_estudiantil'
});

// Verificar la conexión
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});

// Ruta para el login del instituto
router.post('/login', (req, res) => {
    const { correo, contraseña } = req.body;

    const query = 'SELECT * FROM Instituto WHERE Correo = ? AND Contraseña = ?';
    connection.query(query, [correo, contraseña], (err, result) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        if (result.length > 0) {
            const instituto = result[0];
            res.status(200).json({ instituto });
        } else {
            res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }
    });
});


module.exports = router;
