var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Sólo estos tipos serán válidos
    var tipoValidos = ['usuarios', 'hospitales', 'medicos'];

    if (tipoValidos.indexOf(tipo) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'La colección no es válida',
            error: { message: 'Las colecciones válidas son ' + tipoValidos.join(', ') }
        });
    }

    if (!req.files) {
        res.status(400).json({
            ok: false,
            mensaje: 'No ha seleccionado nada',
            error: { message: 'Debe seleccionar una imagen' }

        });
    }

    //Obtener nombre de archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo estas extensiones serán válidas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'La extensión no es válida',
            error: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre del archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo a una direccion particular
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                error: err

            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido'
        // });

    })
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if (!usuario){
                res.status(400).json({
                    ok: false,
                    mensaje: 'No existe el usuario',
                    error: { message: 'No existe el usuario' }
                });
        
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ';)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Registro Actualizado',
                    usuario: usuarioActualizado
                });

            });
        });
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if (!medico){
                res.status(400).json({
                    ok: false,
                    mensaje: 'No existe el medico',
                    error: { message: 'No existe el medico' }
                });
        
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Registro Actualizado',
                    medico: medicoActualizado
                });

            });
        });

    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            
            if (!hospital){
                res.status(400).json({
                    ok: false,
                    mensaje: 'No existe el hospital',
                    error: { message: 'No existe el hospital' }
                });
        
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Registro Actualizado',
                    hospital: hospitalActualizado
                });

            });
        });

    }
}


module.exports = app;