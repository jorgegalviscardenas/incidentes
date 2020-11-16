/**
 * Modelo encargado de manipular los datos referentes a las incidencias
 * @author Sebastian Noreña Marquez <sebastian.norenam@autonoma.edu.co>
 * @author Brian Cardona Salazar <brian.cardonas@autonoma.edu.co>
 * @author Jorge Galvis Cárdenas <jorge.galvisc@autonoma.edu.co>
 * @version 20201115
 */
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
    estado: String,
    observacion_resolucion: String,
    usuario_id: String
}, {
    timestamps: true
});
module.exports = mongoose.model('Incidencia', IncidenciaSchema);