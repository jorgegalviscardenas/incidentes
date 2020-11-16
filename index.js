/**
 * Encargado de iniciar la aplicación
 * @author Sebastian Noreña Marquez <sebastian.norenam@autonoma.edu.co>
 * @author Brian Cardona Salazar <brian.cardonas@autonoma.edu.co>
 * @author Jorge Galvis Cárdenas <jorge.galvisc@autonoma.edu.co>
 * @version 20201115
 */
//Librerias de la aplicación
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// Configuració de base de datos
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
mongoose.Promise = global.Promise;

// Conexión a la base de datos
mongoose.connect(dbConfig.url, dbConfig.options)
    .then(() => {
        console.log("Connect to database: success!");
    }).catch(err => {
        console.log('Connect to database: failure!');
        process.exit();
    });

// Se crea la aplicación de express
const app = express();

// Conversión de request de content-type - "application/x-www-form-urlencoded"
app.use(bodyParser.urlencoded({ extended: true }));
// Conversión de request de  content-type - "application/json"
app.use(bodyParser.json());
//Conversión de request para cargar archivos a través de "multipart/form-data"
app.use(fileUpload());
// Se activan CORS para todas las rutas
app.use(cors());


// Definición de rutas
app.get('/', (req, res) => {
    res.json({
        "message": "This is a JSON response to a HTTP GET request."
    });
});
require('./app/routes/usuario.routes.js')(app);
require('./app/routes/incidencia.routes.js')(app);
// Puero por el que escucha la aplicación
var port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log("Server is listening on port " + port);
});