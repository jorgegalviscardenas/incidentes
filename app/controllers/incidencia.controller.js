/**
 * Encargado de recibir todas las peticiones relacionadas
 * con los incidentes
 * @author Sebastian Noreña Marquez <sebastian.norenam@autonoma.edu.co>
 * @author Brian Cardona Salazar <brian.cardonas@autonoma.edu.co>
 * @author Jorge Galvis Cárdenas <jorge.galvisc@autonoma.edu.co>
 * @version 20201115
 */
const { body, param, validationResult } = require('express-validator');
const Usuario = require('../models/usuario.model.js');
const Incidencia = require('../models/incidencia.model.js');
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
                        usuario_id: req.params.idusuario
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
    Incidencia.find({ usuario_id: req.params.idusuario }).then((incidencias) => {
        res.status(200).send(incidencias);
    }).catch((error) => {
        res.status(500).send({ mensaje: "Ocurrió un error buscando la incidencia" });
    });
}


/**
 * Se encarga de actualizar una nueva incidencia para un usuario
 * @param req request con los datos para actualizar la incidencia
 * @param res response mediante el cual se da respuesta
 */
exports.actualizar = (req, res) => {
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
                        usuario_id: req.params.idusuario
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
 * Se encarga buscar una incidencia de un usuario 
 * @param req request con los datos para crear el usuario
 * @param res response mediante el cual se da respuesta
 */
exports.buscarIncidenciaDeUsuario = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    Incidencia.findOne({ usuario_id: req.params.idusuario , "_id" : ObjectId(req.params.idincidencia) }).then((incidencia) => {
        res.status(200).send(incidencia);
    }).catch((error) => {
        res.status(500).send({ mensaje: "Ocurrió un error listando las incidencias" });
    });
}
/**
 * Lista todas las incidencias
 * @param req request con los datos para crear el usuario
 * @param res response mediante el cual se da respuesta
 */
exports.listar = (req, res) => {
    Incidencia.find().then((incidencias) => {
        res.status(200).send(incidencias);
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