// He usado graphql-http en vez de el Apollo que he visto que tienes en los apuntes,
// me daba error al instalarlo porque mi version de express es la 5 y funcionaba con express 4

export const typeDefs = `
    type CitasPorMedico {
        id_medico: Int
        total: Int
    }

    type CitaPendiente {
        id: Int
        id_paciente: Int
        id_medico: Int
        fecha_hora: String
        motivo: String
        estado: String
    }

    type DuracionPorMedico {
        id_medico: Int
        duracion_promedio_minutos: Float
    }

    type EntradaHistorial {
        fecha: String
        id_medico: Int
        observaciones: String
        diagnostico: String
        tratamiento: String
    }

    type Historial {
        id_paciente: Int
        entradas: [EntradaHistorial]
    }

    type Query {
        citasFinalizadasPorMedico: [CitasPorMedico]
        citasPendientesHoy: [CitaPendiente]
        duracionPromedioPorMedico: [DuracionPorMedico]
        historialPaciente(id_paciente: Int!): Historial
    }
`