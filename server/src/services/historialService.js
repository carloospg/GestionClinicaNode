import HistorialClinico from "../models/HistorialClinico.js";

class HistorialService {
  async addEntrada(
    id_paciente,
    id_medico,
    observaciones,
    diagnostico,
    tratamiento,
  ) {
    let historial = await HistorialClinico.findOne({ id_paciente });

    if (!historial) {
      historial = await HistorialClinico.create({
        id_paciente,
        entradas: [],
      });
    }

    historial.entradas.push({
      fecha: new Date(),
      id_medico,
      observaciones,
      diagnostico,
      tratamiento,
    });

    await historial.save();
    return historial;
  }

  async obtenerHistorial(id_paciente) {
    const historial = await HistorialClinico.findOne({ id_paciente });

    if (!historial) {
      throw new Error("No existe historial para este paciente");
    }

    
    return historial;
  }
}

export default HistorialService;
