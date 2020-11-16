/**
 * Encargado de manejar todas las rutas y acciones que se pueden hacer sobre
 * una incidencia
 * @author Sebastian Noreña Marquez <sebastian.norenam@autonoma.edu.co>
 * @author Brian Cardona Salazar <brian.cardonas@autonoma.edu.co>
 * @author Jorge Galvis Cárdenas <jorge.galvisc@autonoma.edu.co>
 * @version 20201115
 */
module.exports = (app) => {
    const usuarios = require('../controllers/usuario.controller.js');
    // Crea un nuevo usuario
    app.post('/usuarios', usuarios.validarCreacion(), usuarios.crear);
    //Login
    app.post('/login', usuarios.validarLogin(), usuarios.login);
}