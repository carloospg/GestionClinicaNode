import Cita from "../models/Cita.js";
import HistorialService from "./historialService.js";

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
      order: [["id", "ASC"]],
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
      where: { id_medico },
      order: [["id", "ASC"]],
    });
    return citas;
  }

  async cambiarEstadoCita(id, estado, id_medico, observaciones, diagnostico, tratamiento) {
    const cita = await Cita.findByPk(id);
    if (!cita) {
      throw new Error("Cita no encontrada");
    }

    if (cita.id_medico !== id_medico) {
      throw new Error ('No tienes permiso para modificar esta cita');
    }

    const estadosValidos = ['en_curso', 'finalizada'];
    if (!estadosValidos.includes(estado)) {
      throw new Error ('Estado no valido');
    }

    await cita.update({
      estado,
      updated_at: new Date()
    });

    //Esto hace que cuando termina una cita se añade al historial
    if(estado === 'finalizada') {
      const historialService = new HistorialService();
      await historialService.addEntrada(
        cita.id_paciente,
        id_medico,
        observaciones,
        diagnostico,
        tratamiento,
      )
    }

    return cita;
  }
}

export default CitaService;
