import mongoose from 'mongoose';
const EntradaSchema = new mongoose.Schema(
    {
        fecha: {
            type: Date,
            default: Date.now,
        },
        id_medico: {
            type: Number,
            required: true,
        },
        observaciones: {
            type: String,
            required: true,
        },
        diagnostico: {
            type: String,
            required: true,
        },
        tratamiento: {
            type: String,
            required: true,
        },
    },
    {_id: false}
);

const HistorialClinicoSchema = new mongoose.Schema(
    {
        id_paciente: {
            type: Number,
            required: true,
            unique: true
        },
        entradas: [EntradaSchema],
    },
    {
        collection: 'historiales',
        versionKey: false
    }
);

const HistorialClinico = mongoose.model('HistorialClinico', HistorialClinicoSchema);

export default HistorialClinico;