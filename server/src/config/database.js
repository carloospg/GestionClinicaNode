import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        logging: false,
    }
);

// Compruebo la conexion al arrancar la aplicacion
(async () => {
  try {
    await db.authenticate();
    console.log('Conexión establecida con éxito');
  } catch (err) {
    console.error('Error en la conexión: ', err);
  }
})();

const cerrarConexion = async () => {
  try {
    console.log('Cerrando conexiones con la BD...');
    await db.close();
    console.log('Conexiones cerradas correctamente.');
    process.exit(0);
  } catch (err) {
    console.error('Error al cerrar la BD:', err);
    process.exit(1);
  }
};

process.on('SIGINT', cerrarConexion);   // Ctrl+C
process.on('SIGTERM', cerrarConexion);  // Terminar proceso
process.on('SIGQUIT', cerrarConexion);  // Salida de shell

export default db;