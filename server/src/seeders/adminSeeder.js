import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker/locale/es";
import Paciente from "../models/Paciente.js";
import Cita from "../models/Cita.js";

const adminSeeder = async () => {
  try {
    // Creo el usuario admin para poder probar
    const existeAdmin = await Usuario.findOne({ where: { email: "admin@admin.com" } });
    if (!existeAdmin) {
      const hash = await bcrypt.hash("admin", 10);
      await Usuario.create({
        nombre: "admin",
        email: "admin@admin.com",
        password: hash,
        rol: "admin",
      });
      console.log("Usuario admin creado correctamente");
    } else {
      console.log("Usuario admin ya existente");
    }

    // Creo un usuario medico para poder probar
    const medicoFijo = await Usuario.findOne({ where: { email: "usuario1@medico.com" } });
    if (!medicoFijo) {
      const hash = await bcrypt.hash("1234", 10);
      await Usuario.create({
        nombre: "Medico Prueba",
        email: "usuario1@medico.com",
        password: hash,
        rol: "medico",
      });
      console.log("Medico de prueba creado correctamente");
    }

    // Creo un usuario recepcionista para poder probar
    const recepcionistaFija = await Usuario.findOne({ where: { email: "usuario2@recepcionista.com" } });
    if (!recepcionistaFija) {
      const hash = await bcrypt.hash("1234", 10);
      await Usuario.create({
        nombre: "Recepcionista Prueba",
        email: "usuario2@recepcionista.com",
        password: hash,
        rol: "recepcionista",
      });
      console.log("Recepcionista de prueba creado correctamente");
    }

    // Creo 5 medicos con datos fake
    const totalMedicos = await Usuario.count({ where: { rol: "medico" } });
    if (totalMedicos < 6) {
      const hash = await bcrypt.hash("medico", 10);
      for (let i = 0; i < 5; i++) {
        await Usuario.create({
          nombre: faker.person.fullName(),
          email: faker.internet.email(),
          password: hash,
          rol: "medico",
        });
      }
      console.log("5 medicos aleatorios creados correctamente");
    } else {
      console.log("Ya existen medicos");
    }

    // Creo 5 rececpionistas con datos fake
    const totalRecepcionistas = await Usuario.count({ where: { rol: "recepcionista" } });
    if (totalRecepcionistas < 6) {
      const hash = await bcrypt.hash("admin", 10);
      for (let i = 0; i < 5; i++) {
        await Usuario.create({
          nombre: faker.person.fullName(),
          email: faker.internet.email(),
          password: hash,
          rol: "recepcionista",
        });
      }
      console.log("5 recepcionistas aleatorias creadas correctamente");
    } else {
      console.log("Ya existen recepcionistas");
    }

    // Creo 5 pacientes con datos fake
    const pacientes = await Paciente.findAll();
    if (pacientes.length === 0) {
      for (let i = 0; i < 5; i++) {
        await Paciente.create({
          nombre: faker.person.firstName(),
          apellidos: faker.person.lastName() + " " + faker.person.lastName(),
          dni: faker.string.alphanumeric(9).toUpperCase(),
          telefono: faker.phone.number(),
          fecha_nacimiento: faker.date.birthdate({ min: 18, max: 80, mode: "age" }),
        });
      }
      console.log("5 pacientes creados correctamente");
    } else {
      console.log("Ya existen pacientes");
    }

    // Creo 5 citas con datos fake
    const citas = await Cita.findAll();
    const todasCanceladas = citas.length > 0 && citas.every((c) => c.estado === "cancelada");

    if (citas.length === 0 || todasCanceladas) {
      const medicos = await Usuario.findAll({ where: { rol: "medico" } });
      const pacientesActuales = await Paciente.findAll();

      for (let i = 0; i < 5; i++) {
        const medicoAleatorio = medicos[Math.floor(Math.random() * medicos.length)];
        const pacienteAleatorio = pacientesActuales[Math.floor(Math.random() * pacientesActuales.length)];

        await Cita.create({
          id_paciente: pacienteAleatorio.id,
          id_medico: medicoAleatorio.id,
          fecha_hora: faker.date.soon({ days: 30 }),
          motivo: faker.lorem.sentence(),
          estado: "pendiente",
        });
      }
      console.log("Citas creadas correctamente");
    } else {
      console.log("Ya existen citas");
    }

  } catch (err) {
    console.error("Error en el seeder: ", err);
  }
};

export default adminSeeder;