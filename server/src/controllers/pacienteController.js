import { response, request } from "express";
import PacienteService from "../services/pacienteService.js";

const controlador = {
  crear: async (req = request, res = response) => {
    try {
      const { nombre, apellidos, dni, telefono, fecha_nacimiento } = req.body;

      const service = new PacienteService();
      const paciente = await service.crearPaciente(
        nombre,
        apellidos,
        dni,
        telefono,
        fecha_nacimiento,
      );

      res.status(201).json({
        ok: true,
        msg: "Paciente creado correctamente",
        paciente,
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
