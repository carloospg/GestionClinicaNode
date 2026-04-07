import { request, response } from "express";
import CitaService from "../services/citaService.js";

const controlador = {
  crear: async (req = request, res = response) => {
    try {
      const { id_paciente, id_medico, fecha_hora, motivo } = req.body;
      const service = new CitaService();
      const cita = await service.crearCita(
        id_paciente,
        id_medico,
        fecha_hora,
        motivo,
      );

      res.status(201).json({
        ok: true,
        msg: "Cita creada correctamente",
        cita,
      });
    } catch (err) {
      res.status(400).json({
        ok: false,
        msg: err.message,
      });
    }
  },
};

export default controlador;
