import Paciente from "../models/Paciente.js";
import {faker} from "@faker-js/faker/locale/es";

class PacienteService {
  async crearPaciente(nombre, apellidos, dni, telefono, fecha_nacimiento) {
    const existe = await Paciente.findOne({
      where: { dni },
    });

    if (existe) {
      throw new Error("Ya existe un paciente con ese DNI");
    }

    const paciente = await Paciente.create({
      nombre,
      apellidos,
      dni,
      telefono,
      fecha_nacimiento,
    });

    return paciente;
  }

  async listarPacientes() {
    const pacientes = await Paciente.findAll({
      order: [["id", "ASC"]],
    });
    return pacientes;
  }

  async eliminarPaciente(id) {
    const paciente = await Paciente.findByPk(id);
    if (!paciente) {
      throw new Error("El paciente no existe");
    }
    await paciente.destroy();
    return paciente;
  }

  async generarPacientes(cantidad) {
    const pacientes = [];

    for (let i = 0; i < cantidad; i++) {
      const paciente = await Paciente.create({
        nombre: faker.person.firstName(),
        apellidos: faker.person.lastName() + " " + faker.person.lastName(),
        dni: faker.string.alphanumeric(8).toUpperCase(),
        telefono: faker.phone.number(),
        fecha_nacimiento: faker.date.birthdate({
          min: 18,
          max: 80,
          mode: "age",
        }),
      });
      pacientes.push(paciente);
    }
    return pacientes;
  }
}

export default PacienteService;
