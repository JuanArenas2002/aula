const express = require('express');
const router = express.Router();
const { Institucion, Municipio, Departamento } = require('../models');
const authSupportController = require('../controller/authSupportController');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize'); 
const bcrypt = require('bcrypt');



// Ruta para crear un nuevo usuario de soportes
router.post('/', authSupportController.createSupport);

// Ruta de inicio de sesión para soporte
router.post('/login', authSupportController.login);



// Ruta para obtener todas las instituciones junto con el nombre del municipio
router.get('/institucion', async (req, res) => {
  try {
    const instituciones = await Institucion.findAll({
      include: {
        model: Municipio,
        attributes: [
          [Sequelize.fn('UPPER', Sequelize.col('municipio')), 'municipio'] // Municipios en mayúsculas
        ],
        as: 'municipio'
      },
      attributes: [
        'id_institucion',
        'nit',
        'nombre',
        'id_municipio',
        [Sequelize.fn('LOWER', Sequelize.col('correo')), 'correo'], // Correos en minúsculas
        'estado',
        'direccion',
      ],
    });
    res.json(instituciones);
  } catch (err) {
    console.error('Error al obtener instituciones:', err);
    res.status(500).json({ error: 'Error al obtener instituciones' });
  }
});

// Cambiar estado de la institución
router.put('/institucion/:id_institucion/toggleStatus', async (req, res) => {
  const { id_institucion } = req.params;

  try {
    const institucion = await Institucion.findByPk(id_institucion);
    if (!institucion) {
      return res.status(404).json({ message: 'Institución no encontrada' });
    }

    // Convertir el estado a 0 o 1
    institucion.estado = institucion.estado === 1 ? 0 : 1;
    await institucion.save();

    res.json({ id_institucion, estado: institucion.estado });
  } catch (error) {
    console.error('Error al cambiar el estado de la institución:', error);
    res.status(500).json({ message: 'Error al cambiar el estado de la institución' });
  }
});

// Ruta para crear una nueva institución
router.post('/institucion', async (req, res) => {
  const { nit, nombre, id_municipio, direccion, correo, clave } = req.body;

  if (!id_municipio) {
    return res.status(400).json({ error: 'El id_municipio es obligatorio y no puede estar vacío' });
  }

  try {
    const hashedPassword = await bcrypt.hash(clave, 10);
    const nuevaInstitucion = await Institucion.create({
      nit,
      nombre,
      id_municipio,
      direccion,
      correo,
      clave: hashedPassword,
    });

    res.status(201).json({ message: 'Institución creada exitosamente', id: nuevaInstitucion.id_institucion });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El correo ya está en uso. Por favor, elige otro correo.' });
    }
    console.error('Error al crear la institución:', error);
    res.status(500).json({ error: 'Error al crear la institución' });
  }
});

// Ruta para obtener municipios por término de búsqueda (con parámetro `q`)
router.get('/municipios', async (req, res) => {
  const searchQuery = req.query.q || '';
  try {
    console.log("Buscando municipios con término:", searchQuery);
    const municipios = await Municipio.findAll({
      where: {
        municipio: {
          [Op.like]: `%${searchQuery}%`,
        },
        estado: true,
      },
      attributes: ['id_municipio', 'municipio'],
      limit: 10,
    });
    console.log("Municipios encontrados:", municipios);
    res.json(municipios);
  } catch (error) {
    console.error('Error al obtener los municipios:', error);
    res.status(500).json({ error: 'Error al obtener los municipios' });
  }
});

// Ruta para obtener todos los departamentos
router.get('/departamentos', async (req, res) => {
  try {
    console.log("Intentando obtener departamentos...");
    const departamentos = await Departamento.findAll({
      attributes: ['id_departamento', 'departamento'],
    });
    console.log("Departamentos obtenidos:", departamentos);
    res.json(departamentos);
  } catch (error) {
    console.error('Error al obtener los departamentos:', error);
    res.status(500).json({ error: 'Error al obtener los departamentos' });
  }
});

// Ruta para obtener municipios según el departamento_id
router.get('/municipios/:departamento_id', async (req, res) => {
  const { departamento_id } = req.params;
  try {
    console.log("Buscando municipios para el departamento:", departamento_id);
    const municipios = await Municipio.findAll({
      where: {
        departamento_id,
        estado: true,
      },
      attributes: ['id_municipio', 'municipio'],
    });
    console.log("Municipios encontrados:", municipios);
    res.json(municipios);
  } catch (error) {
    console.error('Error al obtener municipios:', error);
    res.status(500).json({ error: 'Error al obtener municipios' });
  }
});

module.exports = router;
