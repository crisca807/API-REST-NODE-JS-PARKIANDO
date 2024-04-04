const express = require('express');
const router = express.Router();
const establecimientoLogic = require('../logic/establecimiento_logic');

// Endpoint de tipo GET para buscar un establecimiento por su nombre
router.get('/buscar/:nombre', (req, res) => {
    const nombreEstablecimiento = req.params.nombre;

    establecimientoLogic.buscarPorNombre(nombreEstablecimiento)
        .then(establecimiento => {
            if (establecimiento) {
                res.json(establecimiento);
            } else {
                res.status(404).json({ error: "Establecimiento no encontrado" });
            }
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});



// Endpoint de tipo GET para listar todos los establecimientos
router.get('/', (req, res) => {
    establecimientoLogic.listarEstablecimientos()
        .then(establecimientos => {
            res.json(establecimientos);
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

// Endpoint de tipo POST para crear un nuevo establecimiento
router.post('/', (req, res) => {
    const body = req.body;

    const { error, value } = establecimientoLogic.Schema.validate(body);

    if (!error) {
        establecimientoLogic.crearEstablecimiento(body)
            .then(establecimiento => {
                res.json({ valor: establecimiento });
            })
            .catch(err => {
                res.status(400).json({ error: err.message });
            });
    } else {
        res.status(400).json({ error });
    }
});

// Endpoint de tipo PUT para actualizar los datos de un establecimiento
router.put('/:id', (req, res) => {
    const idEstablecimiento = req.params.id;
    const { error, value } = establecimientoLogic.Schema.validate(req.body);

    if (!error) {
        establecimientoLogic.actualizarEstablecimiento(idEstablecimiento, req.body)
            .then(establecimientoActualizado => {
                res.json({ valor: establecimientoActualizado });
            })
            .catch(err => {
                res.status(400).json({ error: err.message });
            });
    } else {
        res.status(400).json({ error });
    }
});

// Endpoint de tipo DELETE para desactivar un establecimiento
router.delete('/:id', (req, res) => {
    const idEstablecimiento = req.params.id;

    establecimientoLogic.desactivarEstablecimiento(idEstablecimiento)
        .then(establecimientoDesactivado => {
            res.json({ establecimiento: establecimientoDesactivado });
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

module.exports = router;
