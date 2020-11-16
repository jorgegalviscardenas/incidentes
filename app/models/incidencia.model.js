const mongoose = require('mongoose');
const IncidenciaSchema = mongoose.Schema({
    latitud: {
        type: Number,
        required: true,
        min: -90,
        max: 90
    },
    longitud: {
        type: Number,
        required: true,
        min: -180,
        max: 180
    },
    imagen: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true,
        minlength: 5,
    },
    tipo: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});
module.exports = mongoose.model('Incidencia', IncidenciaSchema);