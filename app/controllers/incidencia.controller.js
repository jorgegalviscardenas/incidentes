/**
 * Encargado de recibir todas las peticiones relacionadas
 * con los incidentes
 * @author Sebastian Noreña Marquez <sebastian.norenam@autonoma.edu.co>
 * @author Brian Cardona Salazar <brian.cardonas@autonoma.edu.co>
 * @author Jorge Galvis Cárdenas <jorge.galvisc@autonoma.edu.co>
 * @version 20201115
 */
const { body, param, query, validationResult } = require('express-validator');
const Usuario = require('../models/usuario.model.js');
const Incidencia = require('../models/incidencia.model.js');
const fs = require('fs')
/**
 * Se encarga de crear una nueva incidencia para un usuario
 * @param req request con los datos para crear el usuario
 * @param res response mediante el cual se da respuesta
 */
exports.crear = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (req.files && req.files.imagen) {
        let imagen = req.files.imagen;
        if (imagen.mimetype.substring(0, 6) == 'image/') {
            let extension = imagen.name.split('.').pop();;
            let nombreImagen = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + "." + extension;
            imagen.mv('storage/archivos/' + nombreImagen, function (err) {
                if (!err) {
                    const incidencia = new Incidencia({
                        latitud: req.body.latitud,
                        longitud: req.body.longitud,
                        imagen: nombreImagen,
                        descripcion: req.body.descripcion,
                        tipo: req.body.tipo,
                        usuario_id: req.params.idusuario,
                        estado: "Pendiente"
                    });
                    incidencia.save().then((data) => {
                        res.status(201).send(data);
                    }).catch((error) => {
                        res.status(500).send({ mensaje: "Ocurrió un error creando la incidencia" });
                    });
                } else {
                    res.status(500).send({ mensaje: "Ocurrió un error creando la incidencia" });
                }
            });
        } else {
            return res.status(400).json({
                errors: [
                    {
                        "msg": "El archivo cargado debe ser de tipo imagen",
                        "param": "imagen",
                        "location": "body"
                    }]
            });
        }
    } else {
        return res.status(400).json({
            errors: [
                {
                    "msg": "La imagen es requerida",
                    "param": "imagen",
                    "location": "body"
                }]
        });
    }
}
/**
 * Se encarga de listar las incidencia por un usuario 
 * @param req request con los datos para crear el usuario
 * @param res response mediante el cual se da respuesta
 */
exports.listarPorUsuario = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let filtro = { usuario_id: req.params.idusuario };
    if (req.query.estado) {
        filtro.estado = req.query.estado;
    }
    if (req.query.tipo) {
        filtro.tipo = req.query.tipo;
    }
    Incidencia.find(filtro).then((incidencias) => {
        res.status(200).send(incidencias);
    }).catch((error) => {
        res.status(500).send({ mensaje: "Ocurrió un error buscando la incidencia" });
    });
}


/**
 * Se encarga de actualizar nueva incidencia por usuario
 * @param req request con los datos para actualizar la incidencia
 * @param res response mediante el cual se da respuesta
 */
exports.actualizarPorUsuario = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    actualizarRegistro(req, res, {});
}
/**
 * Se encarga de actualizar nueva incidencia como administrador
 * @param req request con los datos para actualizar la incidencia
 * @param res response mediante el cual se da respuesta
 */
exports.actualizar = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let obj = {};
    if (req.body.estado) {
        obj.estado = req.body.estado;
    }
    if (req.body.descripcion_solucion) {
        obj.descripcion_solucion = req.body.descripcion_solucion;
    }
    actualizarRegistro(req, res, obj);
}


/**
 * Se encarga buscar una incidencia
 * @param req request con los datos para crear el usuario
 * @param res response mediante el cual se da respuesta
 */
exports.buscar = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    Incidencia.findById(req.params.id).then((incidencia) => {
        res.status(200).send(incidencia);
    }).catch((error) => {
        res.status(500).send({ mensaje: "Ocurrió un error listando las incidencias" });
    });
}

/**
 * Se encarga eliminar una incidencia
 * @param req request con los datos para crear el usuario
 * @param res response mediante el cual se da respuesta
 */
exports.eliminar = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    Incidencia.findByIdAndDelete(req.params.id).then((incidencia) => {
        res.status(200).send(incidencia);
    }).catch((error) => {
        res.status(500).send({ mensaje: "Ocurrió un error eliminando la incidencias" });
    });
}


/**
 * Lista todas las incidencias
 * @param req request con los datos para crear el usuario
 * @param res response mediante el cual se da respuesta
 */
exports.listar = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let filtro = {};
    if (req.query.estado) {
        filtro.estado = req.query.estado;
    }
    if (req.query.tipo) {
        filtro.tipo = req.query.tipo;
    }
    Incidencia.find(filtro).then((incidencias) => {
        if (req.query.latitud && req.query.longitud && req.query.radio) {
            let nuevasIncidencias = incidencias.filter(function (incidencia) {
                return (incidencia.seEncuentraEnRadio(req.query.latitud, req.query.longitud, req.query.radio));
            });
            res.status(200).send(nuevasIncidencias);
        } else {
            res.status(200).send(incidencias);
        }
    }).catch((error) => {
        res.status(500).send({ mensaje: "Ocurrió un error listando las incidencias" });
    });
}
/**
 * Obtener la imagen de una incidencia
 * @param req request con los datos para crear el usuario
 * @param res response mediante el cual se da respuesta
 */
exports.obtenerImagen = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    Incidencia.findById(req.params.id).then((incidencia) => {
        if (fs.existsSync('storage/archivos/' + incidencia.imagen)) {
            res.sendFile(process.cwd() + '/storage/archivos/' + incidencia.imagen);
        } else {
            res.status(404).send({ mensaje: "No se encontró imagen para la incidencia" });
        }
    }).catch((error) => {
        res.status(500).send({ mensaje: "Ocurrió un error listando las incidencias" });
    });
}
/**
 * Reglas de validación para creación de una incidencia
 * @return Array reglas de validación
 */
exports.validarCreacion = () => {
    return [
        body('latitud').exists().withMessage("La latitud es requerida")
            .isFloat({ min: -90, max: 90 }).withMessage("La latitud puede ser minimo de -90 y máximo de 90"),
        body('longitud').exists().withMessage("La longitud es requerida")
            .isFloat({ min: -90, max: 90 }).withMessage("La longitud puede ser minimo de -180 y máximo de 180"),
        body('descripcion').exists().withMessage("La descripción es requerida")
            .isLength({ min: 5 }).withMessage("La longitud minima de la descripción es 5"),
        body('tipo').exists().withMessage("El tipo es requerido")
            .isIn(['Alcantarillado', 'Aseo', 'Electrico', 'Transito']).withMessage("No se atienden este tipo de incidencias")
    ]
}

/**
 * Reglas de validación para actulización de una incidencia
 * @return Array reglas de validación
 */
exports.validarActualizacion = () => {
    return [
        body('latitud').optional()
            .isFloat({ min: -90, max: 90 }).withMessage("La latitud puede ser minimo de -90 y máximo de 90"),
        body('longitud').optional()
            .isFloat({ min: -90, max: 90 }).withMessage("La longitud puede ser minimo de -180 y máximo de 180"),
        body('descripcion').optional()
            .isLength({ min: 5 }).withMessage("La longitud minima de la descripción es 5"),
        body('tipo').optional()
            .isIn(['Alcantarillado', 'Aseo', 'Electrico', 'Transito']).withMessage("No se atienden este tipo de incidencias")
    ]
}
/**
 * Reglas de validación para actualización de una incidencia como admin
 * @return Array reglas de validación
 */
exports.validarActualizacionAdmin = () => {
    return [
        body('estado').optional()
            .isIn(['Pendiente', 'Resuelta', 'Rechazada']).withMessage("No se tiene este estado para las incidencias"),
        body('descripcion_solucion').optional()
            .isLength({ min: 5 }).withMessage("La longitud minima de la descripción de la solución es 5")
    ]
}
/**
 * Reglas de validación para la existencia de un usuario
 * @return Array reglas de validación
 */
exports.validarExistenciaUsuario = () => {
    return [
        param('idusuario').exists().withMessage("El usuario es requerido"),
        param('idusuario').custom(value => {
            return Usuario.findById(value).then(usuario => {
                if (!usuario) {
                    return Promise.reject('No se encontró el usuario');
                }
            });
        })
    ]
}
/**
 * Reglas de validación para la existencia de una incidencia
 * @return Array reglas de validación
 */
exports.validarExistenciaIncidencia = () => {
    return [
        param('id').exists().withMessage("El identificador de la incidencia es requerida"),
        param('id').custom(value => {
            return Incidencia.findById(value).then(usuario => {
                if (!usuario) {
                    return Promise.reject('No se encontró la incidencia');
                }
            });
        })
    ]
}
/**
 * Reglas de validación cuando se lista las incidencias
 * @return Array reglas de validación
 */
exports.validarListar = () => {
    return [
        query('latitud').optional()
            .isFloat({ min: -90, max: 90 }).withMessage("La latitud puede ser minimo de -90 y máximo de 90"),
        query('longitud').optional()
            .isFloat({ min: -90, max: 90 }).withMessage("La longitud puede ser minimo de -180 y máximo de 180"),
        query('radio').optional()
            .isFloat({ min: 1 }).withMessage("El radio mínimo es de un 1 metro"),
        query('tipo').optional()
            .isIn(['Alcantarillado', 'Aseo', 'Electrico', 'Transito']).withMessage("No se atienden este tipo de incidencias"),
        query('estado').optional()
            .isIn(['Pendiente', 'Resuelta', 'Rechazada']).withMessage("No se tiene este estado para las incidencias")
    ]
}
/**
 * Se encarga de actualizar un registro especifico
 * @param req request donde vienen los datos
 * @param res response donde vienen los datos
 * @param obj objeto con los datos a actualizar
 */
const actualizarRegistro = (req, res, obj) => {
    if (req.body.latitud) {
        obj.latitud = req.body.latitud;
    }
    if (req.body.longitud) {
        obj.longitud = req.body.longitud;
    }
    if (req.body.descripcion) {
        obj.descripcion = req.body.descripcion;
    }
    if (req.body.tipo) {
        obj.tipo = req.body.tipo;
    }
    Incidencia.findById(req.params.id).then((incidencia) => {
        if (req.files && req.files.imagen) {
            let imagen = req.files.imagen;
            if (imagen.mimetype.substring(0, 6) == 'image/') {
                if (fs.existsSync('storage/archivos/' + incidencia.imagen)) {
                    fs.unlinkSync('storage/archivos/' + incidencia.imagen)
                }
                let extension = imagen.name.split('.').pop();;
                let nombreImagen = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + "." + extension;
                imagen.mv('storage/archivos/' + nombreImagen, function (err) {
                    if (!err) {
                        obj.imagen = nombreImagen;
                        Incidencia.findByIdAndUpdate(req.params.id, obj, { new: true }).then((incidencia) => {
                            res.status(200).send(incidencia);
                        }).catch((error) => {
                            res.status(500).send({ mensaje: "Ocurrió un error  actualizando incidencia" });
                        });
                    } else {
                        res.status(500).send({ mensaje: "Ocurrió un error actualizando la incidencia" });
                    }
                });
            } else {
                return res.status(400).json({
                    errors: [
                        {
                            "msg": "El archivo cargado debe ser de tipo imagen",
                            "param": "imagen",
                            "location": "body"
                        }]
                });
            }
        } else {
            Incidencia.findByIdAndUpdate(req.params.id, obj, { new: true }).then((incidencia) => {
                res.status(200).send(incidencia);
            }).catch((error) => {
                res.status(500).send({ mensaje: "Ocurrió un error  actualizando incidencia" });
            });
        }

    }).catch((error) => {

    });



}