import Paciente from "../models/Paciente.js";

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
}

export default PacienteService;