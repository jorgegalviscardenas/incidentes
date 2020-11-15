/**
 * Encargado de iniciar la aplicación
 * @author Sebastian Noreña Marquez <sebastian.norenam@autonoma.edu.co>
 * @author Brian Cardona Salazar <brian.cardonas@autonoma.edu.co>
 * @author Jorge Galvis Cárdenas <jorge.galvisc@autonoma.edu.co>
 * @version 20201115
 */
var http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('Hello world');
    res.end();
});