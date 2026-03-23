import { DataTypes, Model } from 'sequelize';
import db from '../config/database.js';

class Cita extends Model {}

Cita.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_paciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_medico: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'en_curso', 'finalizada', 'cancelada'),
      allowNull: false,
      defaultValue: 'pendiente',
    },
    motivo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: 'citas',
    modelName: 'Cita',
    timestamps: false,
  }
);

export default Cita;