import Cita from "../models/Cita.js";

class CitaService {
  async crearCita(id_paciente, id_medico, fecha_hora, motivo) {
    const cita = await Cita.create({
      id_paciente,
      id_medico,
      fecha_hora,
      motivo,
      estado: "pendiente",
    });

    return cita;
  }

  async listarCitas() {
    const citas = await Cita.findAll({
      order: [["fecha_hora", "ASC"]],
    });
    return citas;
  }
}

export default CitaService;
