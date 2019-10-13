// Requires (Importación de librerias necesarias)
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');



// Inicializar Variables
var app = express();



// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// Importar ruta
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');


//Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    // Si la base de datos no funciona, se para todo
    if (err) throw err;

    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');

});


// Rutas
// app.get('/', (req, res, next) => {

//     res.status(200).json({
//         ok: true,
//         message: 'Peticion realizada correctamente'
//     });

// });
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});