/**
 * Encargado de recibir todas las peticiones relacionadas
 * con los usuarios
 * @author Sebastian Noreña Marquez <sebastian.norenam@autonoma.edu.co>
 * @author Brian Cardona Salazar <brian.cardonas@autonoma.edu.co>
 * @author Jorge Galvis Cárdenas <jorge.galvisc@autonoma.edu.co>
 * @version 20201115
 */
/**
 * Librerias para reglas de validación
 */
const { body, validationResult } = require('express-validator')
const Usuario = require('../models/usuario.model.js');
const bcrypt = require('bcrypt');
const configToken = require('../../config/token.config');
const jwt = require('jsonwebtoken');
/**
 * Se encarga de crear un nuevo usuario
 * @param req request con los datos para crear el usuario
 * @param res response mediante el cual se da respuesta
 */
exports.crear = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.contrasenia, salt, (err, hash) => {
            const usuario = new Usuario({
                nombres: req.body.nombres,
                apellidos: req.body.apellidos,
                email: req.body.email,
                contrasenia: hash,
                roles: ['usuario']
            });
            usuario.save()
                .then(data => {
                    res.status(201).send(generarDatosUsuario(data));
                }).catch(err => {
                    res.status(500).send({ menssaje: "Ocurrión un error creando el usuario" });
                });
        });
    });

}
/**
 * Reglas de valiacion para los parametros de ingreso del login
 * @param req request con los datos para crear el usuario
 * @param res response mediante el cual se da respuesta
 */
exports.login = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    Usuario.findOne({ email: req.body.email }).then(data => {
        if (data) {
            bcrypt.compare(req.body.contrasenia, data.contrasenia, (err, esCorrecta)=> {
                if (esCorrecta) {
                    res.status(200).send(generarDatosUsuario(data));
                } else {
                    res.status(400).json({ menssaje: "La contraseña es incorrecta" });
                }
            });
        } else {
            res.status(404).json({ menssaje: "El usuario no se encuentra registrado" });
        }
    });
}
/**
 * Se encarga de generar los datos del usuario que seran enviados
 * como respuesta a la petición
 * @param Usuario usuario 
 */
const generarDatosUsuario = (usuario) => {
    var data = {
        id: usuario.id, nombres: usuario.nombres, apellidos: usuario.apellidos,
        email: usuario.email, createdAt: usuario.createdAt, updatedAt: usuario.updatedAt,
    }
    var token = jwt.sign(data, configToken.secret, { expiresIn: 604800 });
    data.token = token;
    return data;
}
/**
 * Reglas de validación para creación de un usuario
 * @return Array reglas de validación
 */
exports.validarCreacion = () => {
    return [
        body('nombres').exists().withMessage("Los nombres son requeridos")
            .isLength({ min: 3, max: 60 }).withMessage("La longitud minima de los nombres es de 3 y máxima de 60"),
        body('apellidos').exists().withMessage("Los apellidos son requeridos")
            .isLength({ min: 3, max: 60 }).withMessage("La longitud minima de los apellidos es de 3 y máxima de 60"),
        body('email').exists().withMessage("El email es requerido")
            .isEmail().withMessage("Email debe tener formato de email")
            .isLength({ min: 10, max: 200 }).withMessage("La longitud minima para el email es de 10 y maximo de 200"),
        body('contrasenia').exists().withMessage("La contraseña es requerida")
            .isLength({ min: 5, max: 20 }).withMessage("La contraseña debe tener una longitud minima de 5 y maximo de 20"),
        body('email').custom(value => {
            return Usuario.findOne({ email: value }).then(usuario => {
                if (usuario) {
                    return Promise.reject('Ya se encuentra un usuario registrado con ese email');
                }
            });
        })
    ]
}
/**
 * Reglas de validación para el login
 * @return Array reglas de validación
 */
exports.validarLogin = () => {
    return [
        body('email').exists().withMessage("El email es requerido")
            .isEmail().withMessage("Email debe tener formato de email")
            .isLength({ min: 10, max: 200 }).withMessage("La longitud minima para el email es de 10 y maximo de 200"),
        body('contrasenia').exists().withMessage("El email es requerido")
            .isLength({ min: 5, max: 20 }).withMessage("La contraseña debe tener una longitud minima de 5 y maximo de 20")
    ]
}