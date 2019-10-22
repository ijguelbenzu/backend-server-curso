var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Hospital = require('../models/hospital');


// ========================================
// Leer los hospitales
// ========================================
app.get('/', (req, res) => {

    desde=req.query.desde || 0;
    desde=Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitales',
                        errors: err
                    });
                }

                Hospital.count({}, (err, conteo)=>{

                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });

                });

            });
});


// ========================================
// Crear un nuevo hospital
// ========================================
app.post('/', mdAutenticacion.verifivaToken, (req, res) => {

    var body = req.body;
    var usuario = req.usuario._id;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: usuario
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            body: body,
            usuario: req.usuario,
            hospital: hospitalGuardado,
            // usuarioToken: req.usuario
        });
    });
});


// ========================================
// Actualizar hospital
// ========================================
app.put('/:id', mdAutenticacion.verifivaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe hospital con ese id' }
            });

        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                //            body: body
                hospital: hospitalGuardado
            });
        });
    });
});



// ========================================
// Borrar hospital por el id
// ========================================
app.delete('/:id', mdAutenticacion.verifivaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }
        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe hospital con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            //            body: body
            hospital: hospitalBorrado
        });


    })

});

module.exports = app;