import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import db from "./config/database.js";
import connectMongo from "./config/mongodb.js";
import "./models/associations.js";
import adminSeeder from "./seeders/adminSeeder.js";
import { router as authRoutes } from "./routes/authRoutes.js";
import { router as pacienteRoutes } from "./routes/pacienteRoutes.js";
import { router as citaRoutes } from "./routes/citaRoutes.js";
import { router as historialRoutes } from "./routes/historialRoutes.js";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchema } from "graphql";
import { typeDefs } from "./graphql/typeDefs.js";
import resolvers from "./resolvers/resolvers.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.graphQLPath = "/graphql";

    this.conectarPostgres();
    this.conectarMongo();

    this.middlewares();

    this.routes();
    this.graphql();
  }

  async conectarPostgres() {
    await db.sync({
      alter: false,
    });
    console.log("Modelos SQL sincronizados con Postgres");
    await adminSeeder();
  }

  conectarMongo() {
    connectMongo();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/pacientes", pacienteRoutes);
    this.app.use("/api/citas", citaRoutes);
    this.app.use("/api/historial", historialRoutes);
  }

  graphql() {
    const schema = buildSchema(typeDefs);
    this.app.use(
      this.graphQLPath,
      createHandler({
        schema,
        rootValue: resolvers.Query,
      }),
    );

    console.log(`GraphQL disponible en puerto ${this.port}${this.graphQLPath}`);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor escuchando en el puerto ${this.port}`);
    });
  }
}

export default Server;
