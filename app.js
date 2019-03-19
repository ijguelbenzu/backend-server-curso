// Requires (Importación de librerias necxesarias)
var express = require('express');
var mongoose = require('mongoose')




// Inicializar Variables
var app = express();


//Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    // Si la base de datos no funciona, se para todo
    if (err) throw err;

    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');

})


// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});



// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});