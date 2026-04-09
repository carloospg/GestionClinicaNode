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
  listar: async (req = request, res = response) => {
    try {
      const service = new PacienteService();
      const pacientes = await service.listarPacientes();

      res.status(200).json({
        ok: true,
        pacientes,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        msg: err.message,
      });
    }
  },
  eliminar: async (req = request, res = response) => {
    try {
      const { id } = req.params;
      const service = new PacienteService();
      const paciente = await service.eliminarPaciente(id);

      res.status(200).json({
        ok: true,
        msg: "Paciente eliminado correctamente",
        paciente,
      });
    } catch (err) {
      res.status(400).json({
        ok: false,
        msg: err.message,
      });
    }
  },
  generar: async (req = request, res = response) => {
    try {
      const cantidad = parseInt(req.params.cantidad);

      if (isNaN(cantidad) || cantidad <= 0) {
        return res.status(400).json({
          ok: false,
          msg: 'La cantidad debe ser un numero positivo',
        });
      }

      const service = new PacienteService();
      const pacientes = await service.generarPacientes(cantidad);

      res.status(201).json({
        ok: true,
        msg: `${cantidad} pacientes generados`,
        pacientes,
      });
    } catch (err) {
      res.status(400).json({
        ok: false,
        msg: err.message
      })
    }
  }
};

export default controlador;
