/**
 * Encargado de validar que se tiene un token valido en la petición
 * @author Sebastian Noreña Marquez <sebastian.norenam@autonoma.edu.co>
 * @author Brian Cardona Salazar <brian.cardonas@autonoma.edu.co>
 * @author Jorge Galvis Cárdenas <jorge.galvisc@autonoma.edu.co>
 * @version 20201115
 */
const configToken = require('../../config/token.config');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model.js');
/**
 * Se encarga validar qu el token es invalido
 * @param req request donde vienen los datos
 * @param res response por el mediante se da respuesta
 * @param next mediante el cual se especifica que ejecute la
 * siguiente operación en la ruta
 */
exports.tokenValido = (req, res, next) => {
    var token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({
            error: "Es necesario el token de autorización"
        })
    }
    token = token.replace('Bearer ', '');
    jwt.verify(token, configToken.secret, (err, user)=> {
        if (err) {
            res.status(401).send({
                error: 'Token inválido'
            });
        } else {
            Usuario.findById(user.id).then((usuario) => {
                if (usuario) {
                    next();
                } else {
                    res.status(401).send({
                        error: 'Token inválido'
                    });
                }
            }).catch((error) => {
                res.status(500).send({ mensaje: "Ocurrió un error" });
            });

        }
    });
}
/**
 * Valida que el usuario tiene rol administrador
 * @param req request donde vienen los datos
 * @param res response por el mediante se da respuesta
 * @param next mediante el cual se especifica que ejecute la
 * siguiente operación en la ruta
 */
exports.esAdmin = (req, res, next) => {
    var token = req.headers['authorization'];
    token = token.replace('Bearer ', '');
    jwt.decode(token, (err, user)=> {
        Usuario.findById(user.id).then((usuario) => {
            if (usuario.roles.indexOf("admin") != -1) {
                next();
            } else {
                res.status(403).send({ mensaje: "Usted no se encuentra autorizado a realizar esta acción" });
            }
        }).catch((error) => {
            res.status(500).send({ mensaje: "Ocurrió un error" });
        });
    });
}
/**
 * Valida que el usuario este autorizado a realizar esta acción
 * @param req request donde vienen los datos
 * @param res response por el mediante se da respuesta
 * @param next mediante el cual se especifica que ejecute la
 * siguiente operación en la ruta
 */
exports.estaAutorizado = (req, res, next) => {
    var token = req.headers['authorization'];
    token = token.replace('Bearer ', '');
    jwt.decode(token,(err, user)=> {
        Usuario.findById(user.id).then((usuario) => {
            if (usuario.roles.indexOf("admin") != -1) {
                next();
            } else {
                if (req.params.idusuario) {
                    if (req.params.idusuario == usuario._id) {
                        next();
                    } else {
                        res.status(403).send({ mensaje: "Usted no se encuentra autorizado a realizar esta acción" });
                    }
                } else {
                    next();
                }
            }
        }).catch((error) => {
            res.status(500).send({ mensaje: "Ocurrió un error" });
        });
    });
}