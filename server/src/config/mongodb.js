import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.set('strictQuery', false);

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'Error de conexion a MongoDB:'));

    db.once('open', () => {
      console.log('Conexion con MongoDB establecida con exito');
    });

  } catch (err) {
    console.error('Error al conectar con MongoDB: ', err);
    process.exit(1);
  }
};

export default connectMongo;