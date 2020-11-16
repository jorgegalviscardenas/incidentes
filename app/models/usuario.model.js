/**
 * Modelo encarga de acceder a los datos del usuario
 * @author Sebastian Noreña Marquez <sebastian.norenam@autonoma.edu.co>
 * @author Brian Cardona Salazar <brian.cardonas@autonoma.edu.co>
 * @author Jorge Galvis Cárdenas <jorge.galvisc@autonoma.edu.co>
 * @version 20201115
 */
const mongoose = require('mongoose');
const UsuarioSchema = mongoose.Schema({
    nombres: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 60
    },
    apellidos: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 60
    },
    email: {
        type: String,
        index: true,
        unique: true,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 200
    },
    email: {
        type: String,
        index: true,
        unique: true,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 200
    },
    contrasenia: {
        type: String,
        required: true,
    },
    roles: Array
}, {
    timestamps: true
});
module.exports = mongoose.model('Usuario', UsuarioSchema);