// models/Institucion.js
module.exports = (sequelize, DataTypes) => {
    const Institucion = sequelize.define('Institucion', {
      id_institucion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      id_municipio: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      direccion: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      correo: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          isEmail: true
        }
      },
      clave: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      estado: {
        type: DataTypes.TINYINT, // Mapeo de tinyint(1)
        allowNull: true,
        defaultValue: 0, // Asume que por defecto es "inactivo"
        validate: {
          isIn: [[0, 1]] // Solo permite 0 o 1 como valores válidos
        }
      }
    }, {
      tableName: 'institucion',
      timestamps: false
    });
  
    // Asociación con Municipio
    Institucion.associate = (models) => {
      Institucion.belongsTo(models.Municipio, {
        foreignKey: 'id_municipio',
        as: 'municipio'
      });
    };
  
    return Institucion;
  };
  