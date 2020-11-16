/**
 * Encargado de manejar todas las rutas y acciones que se pueden hacer sobre
 * una incidencia
 * @author Sebastian Noreña Marquez <sebastian.norenam@autonoma.edu.co>
 * @author Brian Cardona Salazar <brian.cardonas@autonoma.edu.co>
 * @author Jorge Galvis Cárdenas <jorge.galvisc@autonoma.edu.co>
 * @version 20201115
 */
module.exports = (app) => {
    const incidencias = require('../controllers/incidencia.controller.js');
    const middleware = require('../middlewares/token.middleware.js');
    // Crea una nueva incidencia a un usuario
    app.post('/usuarios/:idusuario/incidencias', middleware.tokenValido, middleware.estaAutorizado,
        incidencias.validarCreacion().concat(incidencias.validarExistenciaUsuario()), incidencias.crear);
    //Lista las incidencias reportadas por un usuario
    app.get('/usuarios/:idusuario/incidencias', middleware.tokenValido, middleware.estaAutorizado,
        incidencias.validarExistenciaUsuario(), incidencias.listarPorUsuario);
    //trae una incidencia la incidencia indicada del usuario indicado 
    app.get('/usuarios/:idusuario/incidencias/:idincidencia', middleware.tokenValido, middleware.estaAutorizado,
        incidencias.validarExistenciaUsuario(), incidencias.buscarPorUsuario);
    // Lista todas las incidencias para un usuario con rol administrador
    app.get('/incidencias', middleware.tokenValido, incidencias.validarListar(), incidencias.listar);
    
    app.put('/usuarios/:idusuario/incidencias/:idincidencia', middleware.tokenValido, middleware.estaAutorizado,
    incidencias.validarActualizacion().concat(incidencias.validarExistenciaUsuario()), incidencias.actualizarPorUsuario);
    
    app.delete('/usuarios/:idusuario/incidencias/:idincidencia', middleware.tokenValido, middleware.estaAutorizado,
        incidencias.validarExistenciaUsuario(), incidencias.eliminarPorUsuario);
    /**app.get('/products', products.findAll);
    // Get a single Product by id
    app.get('/products/:id', products.findOne);
    // Update a Product by id
    app.put('/products/:id', products.update);
    // Delete a Product by id
    app.delete('/products/:id', products.delete);*/
}