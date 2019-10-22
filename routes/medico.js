

var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion'); 
var app = express();

var Medico = require('../models/medico');

// ========================================
// Leer los medicos
// ========================================
app.get('/', (req, res, next) => {

    desde=req.query.desde || 0;
    desde=Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo)=>{
                    res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo
                });
            });
        });
});


// ========================================
// Crear un nuevo medico
// ========================================
app.post('/', mdAutenticacion.verifivaToken, (req, res) => {

    var body = req.body;
    var usuario = req.usuario._id;

    var medico = new Medico ({
        nombre: body.nombre,
        img: body.img,
        usuario: usuario,
        hospital: body.hospital
    });


    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            //            body: body
            medico: medicoGuardado,
            medicoToken: req.medico
        });

    });



});


// ========================================
// Actualizar medico
// ========================================
app.put('/:id', mdAutenticacion.verifivaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe medico con ese id' }
            });

        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            medicoGuardado.password = ';)';

            res.status(200).json({
                ok: true,
                //            body: body
                medico: medicoGuardado
            });


        })



    })

    // res.status(200).json({
    //     ok: true,
    //     id: id
    // });


});



// ========================================
// Borrar medico por el id
// ========================================
app.delete('/:id', mdAutenticacion.verifivaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }
        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe medico con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            //            body: body
            medico: medicoBorrado
        });


    })

});




module.exports = app;