import Cita from "../models/Cita.js";
import HistorialClinico from "../models/HistorialClinico.js";
import { Op } from "sequelize"; //Es el objeto de operadores de sequelize, se usa para hacer condiciones mas complejas en las consultas

const resolvers = {
  Query: {
    citasFinalizadasPorMedico: async () => {
      const citas = await Cita.findAll({
        where: {
          estado: "finalizada",
        },
      });

      const agrupadas = {};
      citas.forEach((c) => {
        if (!agrupadas[c.id_medico]) {
          agrupadas[c.id_medico] = 0;
        }
        agrupadas[c.id_medico]++;
      });

      return Object.entries(agrupadas).map(([id_medico, total]) => ({
        id_medico: parseInt(id_medico),
        total,
      }));
    },

    citasPendientesHoy: async () => {
      const hoy = new Date();
      const inicioDia = new Date(
        hoy.getFullYear(),
        hoy.getMonth(),
        hoy.getDate(),
        0,
        0,
        0,
      );
      const finDia = new Date(
        hoy.getFullYear(),
        hoy.getMonth(),
        hoy.getDate(),
        23,
        59,
        59,
      );

      const citas = await Cita.findAll({
        where: {
          estado: "pendiente",
          fecha_hora: {
            [Op.between]: [inicioDia, finDia], // Busca citas entre el inicio y el fin del dia para saber cuantas hay por dia
          },
        },
        order: [["fecha_hora", "ASC"]],
      });
      return citas;
    },

    duracionPromedioPorMedico: async () => {
      const citas = await Cita.findAll({
        where: {
          estado: "finalizada",
          fecha_inicio: { [Op.not]: null }, // Hace que no sea null
          updated_at: { [Op.not]: null },
        },
      });

      const agrupadas = {};
      citas.forEach((c) => {
        if (!c.fecha_inicio || !c.updated_at) {
          return;
        }

        const duracionMs = new Date(c.updated_at) - new Date(c.fecha_inicio);
        const duracionMin = duracionMs / 60000;

        if (!agrupadas[c.id_medico]) {
          agrupadas[c.id_medico] = {
            total: 0,
            count: 0,
          };
        }

        agrupadas[c.id_medico].total += duracionMin;
        agrupadas[c.id_medico].count++;
      });

      return Object.entries(agrupadas).map(([id_medico, datos]) => ({
        id_medico: parseInt(id_medico),
        duracion_promedio_minutos: datos.total / datos.count,
      }));
    },

    historialPaciente: async ({ id_paciente }) => {
      const historial = await HistorialClinico.findOne({ id_paciente });
      if (!historial) {
        throw new Error("No existe historial para este paciente");
      }

      return {
        id_paciente: historial.id_paciente,
        entradas: historial.entradas.map((e) => ({
          fecha: e.fecha.toISOString(), // Convierte la fecha a un string en el formato estandar internacional para fechas, lo he tenido que buscar po
          id_medico: e.id_medico,
          observaciones: e.observaciones,
          diagnostico: e.diagnostico,
          tratamiento: e.tratamiento,
        })),
      };
    },
  },
};

export default resolvers;
