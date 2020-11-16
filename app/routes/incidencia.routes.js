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
        incidencias.validarExistenciaUsuario().concat(incidencias.validarListar()), incidencias.listarPorUsuario);
    //Consulta una incidencia la incidencia indicada del usuario indicado 
    app.get('/usuarios/:idusuario/incidencias/:id', middleware.tokenValido, middleware.estaAutorizado,
        incidencias.validarExistenciaUsuario().concat(incidencias.validarExistenciaIncidencia()),
        incidencias.buscar);
    //Obtiene la imagen de una incidencia
    app.get('/usuarios/:idusuario/incidencias/:id/imagen', middleware.tokenValido, middleware.estaAutorizado,
        incidencias.validarExistenciaUsuario().concat(incidencias.validarExistenciaIncidencia()),
        incidencias.obtenerImagen);
    //Actualiza la incidencia para un usuario
    app.put('/usuarios/:idusuario/incidencias/:id', middleware.tokenValido, middleware.estaAutorizado,
        incidencias.validarActualizacion().concat(incidencias.validarExistenciaUsuario()).concat(incidencias.validarExistenciaIncidencia())
        , incidencias.actualizarPorUsuario);
    //Elimina la incidencia para un usuario
    app.delete('/usuarios/:idusuario/incidencias/:id', middleware.tokenValido, middleware.estaAutorizado,
        incidencias.validarExistenciaUsuario().concat(incidencias.validarExistenciaIncidencia()), incidencias.eliminar);
    // Lista todas las incidencias para un usuario con rol administrador
    app.get('/incidencias', middleware.tokenValido, middleware.esAdmin, incidencias.validarListar(), incidencias.listar);
    //Ve una incidencia como usuario administrador
    app.get('/incidencias/:id', middleware.tokenValido, middleware.esAdmin,incidencias.validarExistenciaIncidencia(), incidencias.buscar);
    //Obtiene la imagen de una incidencia
    app.get('/incidencias/:id/imagen', middleware.tokenValido,middleware.esAdmin, incidencias.validarExistenciaIncidencia(), incidencias.obtenerImagen);
    //Actualiza una incidencia como usuario administrador
    app.put('/incidencias/:id', middleware.tokenValido, middleware.esAdmin,
        incidencias.validarExistenciaIncidencia().concat(incidencias.validarActualizacion()).concat(incidencias.validarActualizacionAdmin()),
        incidencias.actualizar);
    //Elimina una incidencia como usuario administrador
    app.delete('/incidencias/:id', middleware.tokenValido, middleware.esAdmin, incidencias.validarExistenciaIncidencia(), incidencias.eliminar);
}