import { response, request } from "express";
import HistorialService from "../services/historialService.js";

const controlador = {
  addEntrada: async (req = request, res = response) => {
    try {
      const { id_paciente } = req.params;
      const { observaciones, diagnostico, tratamiento } = req.body;

      const id_medico = req.usuario.id;

      const service = new HistorialService();
      const historial = await service.addEntrada(
        parseInt(id_paciente),
        id_medico,
        observaciones,
        diagnostico,
        tratamiento,
      );

      res.status(201).json({
        ok: true,
        msg: "Entrada añadida al historial correctamente",
        historial,
      });
    } catch (err) {
      res.status(400).json({
        ok: false,
        msg: err.message,
      });
    }
  },

  obtenerHistorial: async (req = request, res = response) => {
    try {
      const { id_paciente } = req.params;

      const service = new HistorialService();
      const historial = await service.obtenerHistorial(parseInt(id_paciente));

      res.status(200).json({
        ok: true,
        historial,
      });
    } catch (err) {
      res.status(404).json({
        ok: false,
        msg: err.message,
      });
    }
  },
};

export default controlador;