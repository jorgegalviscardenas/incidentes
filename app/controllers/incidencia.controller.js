/**
 * Encargado de recibir todas las peticiones relacionadas
 * con los incidentes
 * @author Sebastian Noreña Marquez <sebastian.norenam@autonoma.edu.co>
 * @author Brian Cardona Salazar <brian.cardonas@autonoma.edu.co>
 * @author Jorge Galvis Cárdenas <jorge.galvisc@autonoma.edu.co>
 * @version 20201115
 */
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
/**
 * Se encarga de crear una nueva incidencia
 * 
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
                    const incidencia = new incidencia({
                        latitud: req.body.latitud,
                        longitud: req.body.longitud,
                        imagen: nombreImagen,
                        descripcion: req.body.descripcion,
                        tipo: req.body.tipo
                    });
                    incidencia.save().then((data) => {
                        
                    }).catch((error) => {
                        return res.status(500).send({ mensaje: "Ocurrió un error creando la incidencia" });
                    });
                } else {
                    return res.status(500).send({ mensaje: "Ocurrió un error creando la incidencia" });
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

exports.validarCreacion = () => {
    return [
        body('email', 'Invalid email').exists().isEmail().withMessage(""),
        /**body('phone').optional().isInt(),
         body('status').optional().isIn(['enabled', 'disabled'])*/
    ]
}