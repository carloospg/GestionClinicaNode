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

  async cancelarCita(id) {
    const cita = await Cita.findByPk(id);

    if (!cita) {
      throw new Error("Cita no encontrada");
    }

    if (cita.estado !== "pendiente") {
      throw new Error("Solo se pueden cancelar citas pendientes");
    }

    await cita.update({
      estado: "cancelada",
      updated_at: new Date(),
    });

    return cita;
  }

  async listarCitasMedico(id_medico) {
    const citas = await Cita.findAll({
      where: {id_medico},
      order: [['fecha_hora', 'ASC']],
    });
    return citas;
  }
}

export default CitaService;
