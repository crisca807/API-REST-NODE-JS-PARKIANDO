
const logic = require('../logic/calificacion_logic');
const express = require('express');
const router = express.Router();

// Endpoint de tipo GET para listar todas las calificaciones
router.get('/', (req, res) => {
    logic.listarCalificaciones()
        .then(calificaciones => {
            res.json(calificaciones);
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

// Endpoint de tipo POST para crear una nueva calificación
router.post('/', (req, res) => {
    const body = req.body;

    const { error, value } = logic.Schema.validate(body);

    if (!error) {
        logic.crearCalificacion(body)
            .then(calificacion => {
                res.json({ calificacion });
            })
            .catch(err => {
                res.status(400).json({ error: err.message });
            });
    } else {
        res.status(400).json({ error });
    }
});

// Endpoint de tipo PUT para actualizar los datos de una calificación
router.put('/:id', (req, res) => {
    const { error, value } = logic.Schema.validate(req.body);

    if (!error) {
        logic.actualizarCalificacion(req.params.id, req.body)
            .then(calificacionActualizada => {
                res.json({ calificacionActualizada });
            })
            .catch(err => {
                res.status(400).json({ error: err.message });
            });
    } else {
        res.status(400).json({ error });
    }
});
  
// Endpoint de tipo DELETE para eliminar una calificación
router.delete('/:id', (req, res) => {
    logic.eliminarCalificacion(req.params.id)
        .then(() => {
            res.json({ mensaje: "Calificación eliminada correctamente" });
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

module.exports = router;
