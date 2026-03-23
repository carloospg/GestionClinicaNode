import { DataTypes, Model } from 'sequelize';
import db from '../config/database.js';

class Paciente extends Model {}

Paciente.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre no puede estar vacio' },
      },
    },
    apellidos: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Los apellidos no pueden estar vacios' },
      },
    },
    dni: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'El DNI no puede estar vacio' },
      },
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: 'pacientes',
    modelName: 'Paciente',
    timestamps: false,
  }
);

export default Paciente;
