import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import db from './config/database.js';
import connectMongo from './config/mongodb.js';
import './models/associations.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        //Conectar a las bases de datos
        this.conectarPostgres();
        this.conectarMongo();

        this.middlewares();
        
        this.routes();
    }

    async conectarPostgres() {
        await db.sync({
            alter: false
        })
    }

    conectarMongo(){
        connectMongo();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes() {
        // Las pondre mas adelante
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor escuchando en el puerto ${this.port }`);
        });
    }
}

export default Server;