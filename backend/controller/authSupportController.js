// authSupportController.js
const Support = require('../models/Support');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        console.log('Consultando con identificacion:', req.body.identificacion);

        const usuario = await Support.findOne({ where: { identificacion: req.body.identificacion } });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (req.body.clave !== usuario.clave) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const token = jwt.sign(
            { id: usuario.Id_support, role: 'support' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ error: 'Error en el servidor', details: error.message });
    }
};

exports.createSupport = async (req, res) => {
  // lógica del controlador para crear un soporte...
};