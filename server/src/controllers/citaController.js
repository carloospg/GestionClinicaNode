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

  listar: async (req = request, res = response) => {
    try {
      const service = new CitaService();
      const citas = await service.listarCitas();

      res.status(200).json({
        ok: true,
        citas,
      });
    } catch (Err) {
      res.status(500).json({
        ok: false,
        msg: err.message,
      });
    }
  },

  cancelar: async (req = request, res = response) => {
    try {
      const { id } = req.params;

      const service = new CitaService();
      const cita = await service.cancelarCita(id);

      res.status(200).json({
        ok: true,
        msg: "Cita cancelada correctamente",
        cita,
      });
    } catch (err) {
      res.status(400).json({
        ok: false,
        msg: err.message,
      });
    }
  },

  misCitas: async (req = request, res = response) => {
    try {
      const id_medico = req.usuario.id;
      const service = new CitaService();
      const citas = await service.listarCitasMedico(id_medico);

      res.status(200).json({
        ok: true,
        citas,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        msg: err.message,
      });
    }
  },

  cambiarEstado: async (req = request, res = response) => {
    try {
      const {id} = req.params;
      const {estado} = req.body;

      const id_medico = req.usuario.id;

      const service = new CitaService();
      const cita = await service.cambiarEstadoCita(id, estado, id_medico);

      res.status(200).json({
        ok: true, 
        msg: 'Estado de la cita actualizado correctamente',
        cita,
      });
    } catch (err) {
      res.status(400).json({
        ok: false,
        msg: err.message,
      })
    }
  }
};

export default controlador;
