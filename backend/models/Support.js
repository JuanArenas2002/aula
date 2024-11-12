const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Support = sequelize.define('Support', {
  Id_support: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_tipo_identificacion: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  identificacion: {
    type: DataTypes.STRING(50), // Actualizado a STRING
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  clave: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'support',
  timestamps: false,
});

module.exports = Support;
