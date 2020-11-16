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
const { response } = require('express');
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
exports.actualizarPorUsuario = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if(!req.body.hasOwnProperty('latitud') &&
       !req.body.hasOwnProperty('longitud') &&
       !req.body.hasOwnProperty('descripcion') &&
       !req.body.hasOwnProperty('tipo') &&
       !req.files ||( req.files && !req.files.imagen))
        return res.status(400).json({
            errors: [
                {
                    "msg": "debe enviar por lo menos un parametro valido",
                    "param": "latitud,longitud,descripcion,tipo,imagen",
                    "location": "body"
                }]
        });
    

       
    if (req.files && req.files.imagen) {
        let imagen = req.files.imagen;
        if (imagen.mimetype.substring(0, 6) == 'image/') {
            let extension = imagen.name.split('.').pop();;
            let nombreImagen = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + "." + extension;
            imagen.mv('storage/archivos/' + nombreImagen, function (err) {
                if (!err) {
                    obj = {}
                    obj.imagen =nombreImagen; 
                    actualizarRegistro(req,res, obj);
                } else {
                    res.status(500).send({ mensaje: "Ocurrió un error actualizando la incidencia" });
                }
            });
        }
        
        else {

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
        actualizarRegistro(req,res,{});
    }
}


/**
 * Se encarga buscar una incidencia de un usuario 
 * @param req request con los datos para crear el usuario
 * @param res response mediante el cual se da respuesta
 */
exports.buscarPorUsuario = (req, res) => {
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
 * Se encarga eliminar una incidencia de un usuario 
 * @param req request con los datos para crear el usuario
 * @param res response mediante el cual se da respuesta
 */
exports.eliminarPorUsuario = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    Incidencia.findOneAndDelete({ usuario_id: req.params.idusuario , "_id" : req.params.idincidencia }).then((incidencia) => {
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
        console.log(error);
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
       /* body('latitud').optional()
            .isFloat({ min: -90, max: 90 }).withMessage("La latitud puede ser minimo de -90 y máximo de 90"),
        body('longitud').optional()
            .isFloat({ min: -90, max: 90 }).withMessage("La longitud puede ser minimo de -180 y máximo de 180"),
        body('descripcion').optional()
            .isLength({ min: 5 }).withMessage("La longitud minima de la descripción es 5"),
        body('tipo').optional()
            .isIn(['Alcantarillado', 'Aseo', 'Electrico', 'Transito']).withMessage("No se atienden este tipo de incidencias")
    */ ]
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

const actualizarRegistro = (req ,res,obj ) =>
{
    if(req.body.hasOwnProperty('latitud'))
        obj['latitud'] =req.body.latitud;
    if(req.body.hasOwnProperty('latitud'))
        obj['longitud'] =req.body.longitud; 
    if(req.body.hasOwnProperty('descripcion'))
       obj['descripcion'] =req.body.descripcion; 
    if(req.body.hasOwnProperty('tipo'))
       obj['tipo'] =req.body.tipo; 

    Incidencia.findOneAndUpdate({usuario_id: req.params.idusuario , "_id" : req.params.idincidencia }, obj,{new: true}).then((incidencia) => {
           res.status(200).send(incidencia);
        }).catch((error) => {
            res.status(500).send({ mensaje: "Ocurrió un error  actualizando incidencia" });
        });
}