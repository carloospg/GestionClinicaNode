import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker/locale/es";
import Paciente from "../models/Paciente.js";

const adminSeeder = async () => {
  try {
    const existeAdmin = await Usuario.findOne({
      where: {
        email: "admin@admin.com",
      },
    });

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

    const medicos = await Usuario.findAll({
      where: {
        rol: "medico",
      },
    });

    if (medicos.length === 0) {
      const hash = await bcrypt.hash("medico", 10);
      for (let i = 0; i < 5; i++) {
        await Usuario.create({
          nombre: faker.person.fullName(),
          email: faker.internet.email(),
          password: hash,
          rol: "medico",
        });
      }
      console.log("5 medicos creados correctamente");
    } else {
      console.log("Ya existen medicos");
    }

    const recepcionistas = await Usuario.findAll({
      where: {
        rol: "recepcionista",
      },
    });

    if (recepcionistas.length === 0) {
      const hash = await bcrypt.hash("admin", 10);
      for (let i = 0; i < 5; i++) {
        await Usuario.create({
          nombre: faker.person.fullName(),
          email: faker.internet.email(),
          password: hash,
          rol: "recepcionista",
        });
      }
      console.log("5 recepcionistas creados correctamente");
    } else {
      console.log("Ya existen recepcionistas");
    }

    const pacientes = await Paciente.findAll();

    if (pacientes.length === 0) {
      for (let i = 0; i < 5; i++) {
        await Paciente.create({
          nombre: faker.person.firstName(),
          apellidos: faker.person.lastName() + ' ' + faker.person.lastName(),
          dni: faker.string.alphanumeric(9).toUpperCase(),
          telefono: faker.phone.number(),
          fecha_nacimiento: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
        });
      }
      console.log('5 pacientes creados correctamente')
    } else {
      console.log('Ya existen pacientes')
    }
  } catch (err) {
    console.error("Error en el seeder: ", err);
  }
};

export default adminSeeder;
