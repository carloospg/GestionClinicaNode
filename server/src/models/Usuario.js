import { DataTypes, Model } from "sequelize";
import db from "../config/database.js";

class Usuario extends Model {}

Usuario.init(
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
        notEmpty: { msg: "El nombre no puede estar vacío" },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "El email no tiene un formato válido" },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM("admin", "medico", "recepcionista"),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "usuarios",
    modelName: "Usuario",
    timestamps: false,
  },
);

export default Usuario;
