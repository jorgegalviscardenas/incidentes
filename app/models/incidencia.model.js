/**
 * Modelo encargado de manipular los datos referentes a las incidencias
 * @author Sebastian Noreña Marquez <sebastian.norenam@autonoma.edu.co>
 * @author Brian Cardona Salazar <brian.cardonas@autonoma.edu.co>
 * @author Jorge Galvis Cárdenas <jorge.galvisc@autonoma.edu.co>
 * @version 20201115
 */
const mongoose = require('mongoose');
var IncidenciaSchema = mongoose.Schema({
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
/**
 * Dada una latitud, una longitud y un radio se verifica si la latitud y la longitud
 * de la incidencia se encuentra en esa circunferencia
 * @param float latitud la latitud del punto
 * @param float longitud la longitud del punto
 * @param float radio el radio desde el punto
 * @return boolean
 */
IncidenciaSchema.methods.seEncuentraEnRadio = function (latitud, longitud, radio) {
    var latitud1 = this.latitud * Math.PI / 180;
    var longitud1 = this.longitud * Math.PI / 180;
    var latitud2 = latitud * Math.PI / 180;
    var longitud2 = longitud * Math.PI / 180;
    var deltaLatitud = latitud2 - latitud1;
    var deltaLongitud = longitud2 - longitud1;
    var a = Math.pow(Math.sin(deltaLatitud / 2), 2) + Math.cos(latitud1) * Math.cos(latitud2) * Math.pow(Math.sin(deltaLongitud / 2), 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = c * 6371000;
    return d <= radio;
}
module.exports = mongoose.model('Incidencia', IncidenciaSchema);